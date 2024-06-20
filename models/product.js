const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription:{
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images:[{
        type: String
    }],
    brand:{
        type: String,
        default: ''
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0,
    },
    numReviews:{
        type: Number,
        default: 0,
    },
    isFeatured:{
        type: Boolean,
        default: false,
    },
    dateCreated:{
        type: Date,
        default: Date.now,
    }
})

// Add a new attribute to the schema
productSchema.add({
    quantity: { type: Number, default: 0 },
});

exports.Product = mongoose.model('Product', productSchema);
