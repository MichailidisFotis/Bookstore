import bodyParser from "body-parser";
import express from "express";

import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"

import ordersControler from "./orders.controler.js";

const router = express.Router()


router.get("/:order_id" , requireLogin , requireAdmin , ordersControler.get_order)


router.patch("/change-order-stare/:order_id" , requireLogin , requireAdmin , ordersControler.change_order_state)

router.delete("/delete-order/:order_id" , requireAdmin , requireLogin , ordersControler.delete_order)





export default router