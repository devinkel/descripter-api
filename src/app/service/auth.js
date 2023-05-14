import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthService {
    static async hashPassword(password, salt) {
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }

    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        }) 
    }

    static decodeToken(token) {
        return jwt.verify(token, process.env.JWT_KEY)
    }
}