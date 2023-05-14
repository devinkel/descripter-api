import logger from '../utils/logger.js';
import process from 'node:process';
import SetupServer from './server.js';

const ExitStatus = {
    Error: 1,
    Success: 0
}

process.on('unhandledRejection', (reason, promisse) => {
    logger.error(
        `App exiting due to an enhandled primise: ${promisse} and reason: ${reason}`
    )
})

process.on('uncaughtException', (err, origin) => {
    logger.error(`App exiting due to an uncaught exception: ${err, origin}`)
    process.exit(ExitStatus.Error)
});


(async () => {
    try {
        const server = new SetupServer()
        await server.init();
        server.start()

        const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
        for (const signal of exitSignals) {
            process.on(signal, async () => {
                try {
                    logger.info(`App exited with success`)
                    process.exit(ExitStatus.Success)
                } catch (error) {
                    logger.error(`App exited with error: ${error}`)
                    process.exit(ExitStatus.Error)
                }
            })
        }
    } catch (error) {
        logger.error(`App exited with error: ${error}`)
        process.exit(ExitStatus.Error) // desligando a app caso algum erro aconteça na inicialização
    }
})()