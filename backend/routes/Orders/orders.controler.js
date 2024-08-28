import mongoose from "mongoose";
import orderModel from "./models/orderModel.js"




const get_order = async(req , res)=>{

    var order_id  =  req.params.order_id;

    if(!mongoose.isValidObjectId(order_id))
        return res.status(400).send({message:"Invalid Order ID"})


    var find_order =  await orderModel.findById({
        _id:order_id
    })

    if (!find_order)
            return res.status(404).send({message:"Order Not Found"})

    return res.status(200).send(find_order)


}


const delete_order =  async(req , res)=>{

    var order_id  =  req.params.order_id;

    if (!mongoose.isValidObjectId(order_id))
            return res.status(400).send({message:"Invalid order ID"})

    var find_order =  await orderModel.findById({
        _id :order_id
    })

    if (!find_order)
        return res.status(404).send({message:"Order Not Found"})

    await orderModel.findByIdAndDelete({
        _id : order_id
    })


    return res.status(200).send({message:"Order Deleted"})

}

const change_order_state =  async(req , res)=>{

        var order_id  =  req.params.order_id
        
    if (!mongoose.isValidObjectId(order_id))
        return res.status(400).send({message:"Invalid order ID"})

    var find_order =  await orderModel.findById({
            _id :order_id
        })

    if (!find_order)
        return res.status(404).send({message:"Order Not Found"})

    if(!find_order.state ==="Created")
        return res.status(400).send({message:"You cannot change order state"})


    await orderModel.findOneAndUpdate({
        _id:order_id
    },
    {
        state:"Saved"
    })

    return res.status(200).send({message:"Order Stage updated!!!"})


}


const get_all_orders =  async(req , res)=>{

    var orders =  await orderModel.find({})

    return res.status(200).send(orders)  



}



export default {get_order , delete_order , change_order_state , get_all_orders}