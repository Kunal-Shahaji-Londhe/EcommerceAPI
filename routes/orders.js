const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();


//get all the orders from database
router.get(`/`, async (req, res) =>{
    const orderList = await Order.find()
    .populate('user')
    .populate({
        path: 'orderItems',
        populate: {
            path: 'product',
            model: 'Product'
        }
    })
    .sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

//get order by id

router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

//add order in the database

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity : orderItem.quantity,
            product: orderItem.product
        })
         
        newOrderItem = await newOrderItem.save()
        
        return newOrderItem._id;
    })
) 
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
        product: req.body.product,
    })

    order = await order.save()

    if(!order)
    return res.status(404).send('category cannot be created!')

    res.send(order);
})

//update any order by id
router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})


//delete order by id
router.delete('/:id', (req, res)=>{
    Order.findByIdAndDelete(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


//to show totalsales
router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})


//get count of total orders
router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

//cancel order
router.put('/cancel/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});



//get userorders by user id 
router.get(`/get/userorders/:userid`, async (req, res) =>{
    try {
        const userOrderList = await Order.find({user: req.params.userid})
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product'
                }
            })
            .sort({'dateOrdered': -1});

        if(!userOrderList) {
            return res.status(404).json({success: false, message: 'No orders found for the user.'});
        } 

        res.status(200).json({success: true, userOrderList});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});


router.get(`/`, async (req, res) =>{
    try {
        let query = {};

        // Parse startDate and endDate from query parameters
        const { startDate, endDate } = req.query;

        // If startDate and endDate are provided, add date range filtering to the query
        if (startDate && endDate) {
            query.dateOrdered = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        console.log(startDate,endDate)
        const orderList = await Order.find(query)
            .populate('user')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            })
            .sort({'dateOrdered': -1});

        if (!orderList) {
            return res.status(500).json({success: false});
        }

        res.send(orderList);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});



module.exports =router;