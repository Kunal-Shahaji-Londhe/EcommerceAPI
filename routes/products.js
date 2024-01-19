const {Product} = require('../models/product');
const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

router.get(`/`, async (req, res) =>{
    //query parameters
    let filter = {}
    if(req.query.categories){
        const filter ={ category: req.query.categories.split(',')}
    }


    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})


router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category)
    if (!category) {
        return res.status(400).send('Invalid Category!')
    }
    
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    product = await product.save()

    if(!product)
        return res.status(500).send('product cannot be created!')
    
        res.send(product);
})

router.put(`/:id`, async (req, res) =>{
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id!')
    }

    const category = await Category.findById(req.body.category)
    if (!category) {
        return res.status(400).send('Invalid Category!')
    }

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {
            new : true
        })

    if(!product)
        return res.status(500).send('product cannot be updated!')
    
        res.send(product);
})

router.delete('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const deletedProduct = await Product.findByIdAndRemove(productId);
      res.json(deletedProduct);
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get(`/get/count`, async (req, res) =>{
    const productCount = await Product.countDocuments()

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount : productCount
    });
})

router.get(`/get/featured`, async (req, res) =>{
    const product = await Product.find({isFeatured: true})

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send({
        product : product
    });
})

module.exports =router;