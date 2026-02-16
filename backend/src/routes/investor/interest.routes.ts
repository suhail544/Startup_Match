import express from "express";
import * as interestController from "../../controllers/investor/interest.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
const interestRoute = express.Router();

interestRoute.post(
  "/",
  protect,
  restrictTo("INVESTOR"),
  interestController.createInterest,
);
interestRoute.get(
  "/",
  protect,
  restrictTo("INVESTOR"),
  interestController.getByInvestor,
);
interestRoute.get(
  "/idea/:ideaId",
  protect,
  restrictTo("INVESTOR"),
  interestController.getIdeaInterests,
);
interestRoute.patch(
  "/:id",
  protect,
  restrictTo("INVESTOR"),
  interestController.updateInterestStatus,
);

export default interestRoute;
