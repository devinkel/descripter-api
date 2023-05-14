import { Router } from "express";
import DescripterController from "../controllers/descripter.js";
import { authMiddleware } from "../middleware/auth.js"

const descripterRoutes = Router()
const descripterController = new DescripterController

descripterRoutes.get('/descripter', (req, res, next) => {
    descripterController.index(res)
})

export default descripterRoutes