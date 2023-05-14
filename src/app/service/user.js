import { User } from "../models/users.js";
import AuthService from "./auth.js";

export default class userService {

    async createUser(req, res) {
        try {
            const user = new User(req.body)
            const newUser = await user.save()
            res.status(201).send(newUser)
        } catch (error) {
            res.status(400).send({
                error: true,
                message: error?.message ?? error
            })
        }
    }

    async authenticateUser(req, res) {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).send({
                code: 404,
                message: 'User not found'
            })
        }

        if (!(await AuthService.comparePassword(password, user.password))) {
            return res.status(401).send({
                code: 401,
                message: "Passwords doens't match"
            })
        }

        const token = AuthService.generateToken(user.toJSON())
        return res.status(200).send({ token: token });
    }

    async loginUser(req, res) {
        const email = req.decoded ? req?.decoded?.email : undefined
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).send({
                code: 404,
                message: 'User not found'
            })
        }

        return res.send({ user })
    }

    async deleteUsers(__, res) {
        try {
            const { deletedCount } = await User.deleteMany()
            if (deletedCount <= 0) {
                res.status(404).send({
                    error: true,
                    message: `Não há registros para excluir`
                })
            } else {
                res.status(200).send({
                    error: false,
                    message: `Excluídos ${deletedCount} registros com sucesso.`
                });
            }
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error?.message
            });
        }
    }
}