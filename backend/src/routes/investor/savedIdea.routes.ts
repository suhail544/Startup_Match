import express from "express";
import * as savedIdeaController from "../../controllers/investor/savedIdea.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
const savedIdeaRoute = express.Router();

savedIdeaRoute.post('/', protect, restrictTo("INVESTOR"),savedIdeaController.saveIdea)
savedIdeaRoute.get('/', protect, restrictTo("INVESTOR"),savedIdeaController.getIdea)
savedIdeaRoute.delete('/:id',protect, restrictTo("INVESTOR"), savedIdeaController.unsaveIdea)


export default savedIdeaRoute