import express from "express";
import * as entrepreneurController from "../../controllers/entrepreneur/entrepreneur.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
const entrepreneurRoute = express.Router();

entrepreneurRoute
  .route("/")
  .get(entrepreneurController.getAllEntrepreneur)
  .post(
    protect,
    restrictTo("ENTREPRENEUR"),
    entrepreneurController.newEntrepreneur,
  );

entrepreneurRoute.get(
  "/me",
  protect,
  restrictTo("ENTREPRENEUR"),
  entrepreneurController.getMeEntrepreneur,
);
entrepreneurRoute.get("/user/:userId", entrepreneurController.getByUserId);

entrepreneurRoute
  .route("/:id")
  .get(entrepreneurController.getEntrepreneur)
  .put(
    protect,
    restrictTo("ENTREPRENEUR"),
    entrepreneurController.updateEntrepreneur,
  )
  .delete(
    protect,
    restrictTo("ENTREPRENEUR"),
    entrepreneurController.deleteEntrepreneur,
  );

export default entrepreneurRoute;
