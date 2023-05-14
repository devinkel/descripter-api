import DescripterService from "../service/descripter.js"
const descripterService = new DescripterService

class DescripterController {

    index(res) {
        descripterService.index(res)
    }
}

export default DescripterController