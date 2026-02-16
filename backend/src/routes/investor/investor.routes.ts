import express from "express";
import * as investorController from "../../controllers/investor/investor.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
const investorRoute = express.Router();

investorRoute
  .route("/")
  .get(protect, restrictTo("INVESTOR"), investorController.getAllInvestor)
  .post(protect, restrictTo("INVESTOR"), investorController.newInvestor);

investorRoute.get(
  "/me",
  protect,
  restrictTo("INVESTOR"),
  investorController.getMeInvestor,
);
investorRoute.get("/user/:userId", investorController.getByUserId);

investorRoute
  .route("/:id")
  .get(investorController.getInvestor)
  .put(protect, restrictTo("INVESTOR"), investorController.updateInvestor)
  .delete(protect, restrictTo("INVESTOR"), investorController.deleteInvestor);

export default investorRoute;
