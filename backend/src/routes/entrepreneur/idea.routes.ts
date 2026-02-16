import express from "express";
import * as ideaController from "../../controllers/entrepreneur/idea.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
const ideaRoute = express.Router();

ideaRoute.post("/", protect,  restrictTo("ENTREPRENEUR"), ideaController.createIdea);
ideaRoute.get("/", ideaController.getAllIdeas);
ideaRoute.get("/:id", ideaController.getIdea);
ideaRoute.patch("/:id",protect, restrictTo("ENTREPRENEUR"), ideaController.updateIdea);
ideaRoute.delete("/:id",protect, restrictTo("ENTREPRENEUR"), ideaController.deleteIdea);

export default ideaRoute;
