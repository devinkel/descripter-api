import AuthService from "../service/auth.js";

export function authMiddleware(req, res, next) {
    const token = req.headers?.['x-access-token']
    try {
        const decoded = AuthService.decodeToken(token)
        req.decoded = decoded
        next()
    } catch (error) {
        res.status(401).send({
            code: 401,
            error: error?.message
        })
    }
}