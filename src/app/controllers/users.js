import userService from "../service/user.js";

const UserService = new userService

class userController {
    async index(__, res) {
        res.status(200).send({
            'status': 200,
            'error': false
        })
    }

    async store(req, res) {
        await UserService.createUser(req, res)
    }

    async authenticate(req, res) {
        await UserService.authenticateUser(req, res)
    }

    async me(req, res) { 
        await UserService.loginUser(req, res)
    }

    async delete(__, res) {
        await UserService.deleteUsers(__, res)
    }
}

export default userController