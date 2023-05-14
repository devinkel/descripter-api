import { Configuration, OpenAIApi } from 'openai'

export default class openAI {
    constructor(apiKey) {
        this.configuration = new Configuration({
            organization: process.env.OPENAI_ORGANIZATION,
            apiKey: apiKey
        });
        this.openai = new OpenAIApi( this.configuration);
    }

    async generateText(prompt, model = 'text-davinci-003') {
        const completion = await this.openai.createCompletion({
            model: model,
            prompt: prompt,
            temperature: 1,
            max_tokens: 260
        });
        
        return completion.data.choices[0].text
    }
}