import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import logger from '../utils/logger.js'
import router from './routes/index.js'
import * as database from './database/index.js'

export default class SetupServer {
    constructor(port = 3000, app = express()) {
        this.port = port
        this.app = app
    }

    async init() {
        this.#setupExpress()
        await this.setupDatabase()
    }

    #setupExpress() {
        this.app.use(bodyParser.json())
        this.app.use(
            cors({
                origin: '*'
            })
        )
        this.app.use('/', router)
        this.app.use((req, res) => {
            res.status(404).send({
                status: 404,
                error: 'Route not found'
            })
        })
    }

    start() {
        this.app.listen(this.port, () => {
            logger.info(`Server listening on port: ${this.port}`)
        })
    }

    async setupDatabase() {
        await database.connect()
    }

    async close() {
        await database.close()
    }

    getApp() {
        return this.app
    }
}
