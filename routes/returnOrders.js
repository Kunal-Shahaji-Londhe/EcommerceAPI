const express = require('express');
const router = express.Router();
const ReturnOrder = require('../models/returnOrder');

// Create a new return order
router.post('/return-orders', async (req, res) => {
    try {
        const { orderId, userId, reason } = req.body;
        const returnOrder = new ReturnOrder({ orderId, userId, reason });
        await returnOrder.save();
        res.status(201).json(returnOrder);
    } catch (error) {
        console.error('Error creating return order:', error);
        res.status(500).json({ error: 'Failed to create return order' });
    }
});

// Get all return orders
router.get('/return-orders', async (req, res) => {
    try {
        const returnOrders = await ReturnOrder.find();
        res.json(returnOrders);
    } catch (error) {
        console.error('Error fetching return orders:', error);
        res.status(500).json({ error: 'Failed to fetch return orders' });
    }
});

// Get return order by ID
router.get('/return-orders/:id', async (req, res) => {
    try {
        const returnOrder = await ReturnOrder.findById(req.params.id);
        if (!returnOrder) {
            return res.status(404).json({ error: 'Return order not found' });
        }
        res.json(returnOrder);
    } catch (error) {
        console.error('Error fetching return order by ID:', error);
        res.status(500).json({ error: 'Failed to fetch return order' });
    }
});

// Delete return order by ID
router.delete('/return-orders/:id', async (req, res) => {
    try {
        const returnOrder = await ReturnOrder.findByIdAndDelete(req.params.id);
        if (!returnOrder) {
            return res.status(404).json({ error: 'Return order not found' });
        }
        res.json({ message: 'Return order deleted successfully' });
    } catch (error) {
        console.error('Error deleting return order by ID:', error);
        res.status(500).json({ error: 'Failed to delete return order' });
    }
});

module.exports = router;
