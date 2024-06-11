import bodyParser from "body-parser";
import express from "express";

import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"

import ordersControler from "./orders.controler.js";

const router = express.Router()


//*route to get order details 
router.get("/get-order/:order_id" , requireLogin , requireAdmin , ordersControler.get_order)

//*route to get all orders
router.get("/get-all-orders" , requireLogin, requireAdmin , ordersControler.get_all_orders)



//*route to change order state
router.patch("/change-order-state/:order_id" , requireLogin , requireAdmin , ordersControler.change_order_state)


//*route to delete order
router.delete("/delete-order/:order_id" , requireLogin , requireAdmin , ordersControler.delete_order)





export default router