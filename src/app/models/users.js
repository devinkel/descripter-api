import mongoose from "mongoose"
import  AuthService  from "../service/auth.js"

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        toJSON: {
            transform: (_, ret) => {
                ret.id = ret._id,
                delete ret._id,
                delete ret.__v
            }
        }
    }
)

userSchema.path('email').validate(
    async (email) => {
        const emailCount = await mongoose.models.User.countDocuments({ email })
        return !emailCount;
    },
    'already exists in the database'
)


userSchema.pre("save", async function() {
    if(!this.password || !this.isModified("password")) {
        return ;
    }
    try {
        const hashedPassword = await AuthService.hashPassword(this.password, 10)
        this.password = hashedPassword
    } catch (error) {
        console.error(`Error hashing the password for the user ${this.name}`)
    }
});


export const User = mongoose.model('User', userSchema);