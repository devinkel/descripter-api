import { createReadStream, createWriteStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'
import csvtojson from 'csvtojson'
import { createObjectCsvWriter } from 'csv-writer'
import openAI from '../client/openAi.js'


// **Lembrar que stream é usado linha a linha, já usa e tira da memória

export default class DescripterService {
    constructor() {
        try {
            this.openAi = new openAI(process.env.OPENAI_API_KEY);
        } catch (error) {
            console.log('Error while creating OpenAI object: ', error);
        }
    }
    index(res) {
        let items = 0;

        // cria um arquivo de escrita no formato CSV
        const wsCsv = createWriteStream('output.csv');
        const csvWriter = createObjectCsvWriter({
            path: 'output.csv',
            // define os cabeçalhos do arquivo CSV de saída
            header: [
                { id: 'ID', title: 'ID' },
                { id: 'Produto', title: 'Produto' },
                { id: 'SKU', title: 'SKU' },
                { id: 'Preço', title: 'Preço' },
                { id: 'Descrição', title: 'Descrição' },
            ],
        });

        // adiciona um listener para fechar a conexão
        res.once('close', _ => console.log(`connection was closed!`, items));

        try {
            // lê o arquivo CSV de entrada e transforma em uma stream
            Readable.toWeb(createReadStream('src/app/service/produtos.csv', { encoding: 'utf-8' }))
                // transforma o CSV em JSON
                .pipeThrough(Transform.toWeb(csvtojson()))
                .pipeThrough(new TransformStream({
                    // transforma o JSON em um objeto JavaScript
                    transform: async (chunk, controller) => {
                        const data = JSON.parse(Buffer.from(chunk));
                        // verifica se o registro existe
                        if (data.field1 === 'Nenhum registro encontrado...') {
                            // descarta o objeto e retorna
                            return;
                        }
                        // mapeia os campos para os cabeçalhos do arquivo CSV de saída
                        const mapedData = {
                            "ID": data.ID,
                            "Produto": data.Produto,
                            "SKU": data.SKU,
                            "Preço": data.Preço,
                            "Descrição": data.Descrição,
                        };
                        try {
                            // gera um texto usando a API OpenAI
                            const generateText = await this.openAi.generateText(this.#promptBuilder(mapedData));

                            // formata o texto gerado para não ter quebras de linha
                            mapedData['Descrição'] = generateText.replace(/\n\s*/g, ' ');

                            // escreve os registros no arquivo CSV de saída
                            await csvWriter.writeRecords([mapedData]);

                        } catch (error) {
                            console.error('Error:', error);
                        }

                    },
                }))
                .pipeTo(new WritableStream({
                    async write(chunk) {
                        items++;
                        // envia o chunk para o cliente
                        res.write(chunk);
                    },
                    close() {
                        // fecha o arquivo CSV de saída
                        wsCsv.end();
                        // envia o arquivo CSV de saída para o cliente
                        res.download('output.csv');
                    },
                }))
        } catch (error) {
            console.log('Error while reading CSV file: ', error);
        }
    }


    #promptBuilder(product) {
        let prompt = `
            Crie descrição curta para o produto inspirado nas melhores tecnicas de copywriting e com o minimo de 250 caracteres
            ###
            A semântica utilizada no texto: persuasivo
            ###
            Esse é o nome do produto ${product['Produto']} use o apenas 1 vez, leia a sua resposta antes de me retornar
            ###
            Use virgulas e acentuações da lingua portuguesa-Brasil, leia a sua resposta antes de me retornar e a corrija caso tenha erros de lingua portuguesa - Brasil
            ###
            Não escreva coisas como 'Experimentar agora mesmo, prove agora mesmo', somos um e-commerce e não há possibilidade de o cliente provar o produto imediatamente e leia a sua resposta antes de me retornar
            ###
            Somos uma loja de ecommerce e gostariamos de ranquear bem no google.
        `
        return prompt;
    }
}