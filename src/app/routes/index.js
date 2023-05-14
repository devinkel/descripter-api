import { Router } from "express"
import userRoutes from "./users.js"
import descripterRoutes from "./descripter.js"


const router = Router()

router.use(userRoutes)
router.use(descripterRoutes)


export default router