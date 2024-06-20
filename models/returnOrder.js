const mongoose = require('mongoose');

const returnOrderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the original order
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who initiated the return
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'canceled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ReturnOrder = mongoose.model('ReturnOrder', returnOrderSchema);

module.exports = ReturnOrder;
