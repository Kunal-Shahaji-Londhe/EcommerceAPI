const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const { Product } = require('../models/product');
const { Category } = require('../models/category');

// Total Number of Users
router.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Total Number of Orders
router.get('/total-orders', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({ totalOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Total Sales Revenue
router.get('/total-sales-revenue', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ]);
        res.json({ totalSales: totalSales[0]?.totalSales || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Total Number of Categories
router.get('/total-categories', async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments();
        res.json({ totalCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Number of Products per Category
router.get('/products-per-category', async (req, res) => {
    try {
        const categories = await Category.find();
        const productsPerCategory = await Promise.all(categories.map(async (category) => {
            const productCount = await Product.countDocuments({ category: category._id });
            return { category: category.name, productCount };
        }));
        res.json(productsPerCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Total Revenue per Category
router.get('/revenue-per-category', async (req, res) => {
    try {
        const categories = await Category.find();
        const revenuePerCategory = await Promise.all(categories.map(async (category) => {
            const products = await Product.find({ category: category._id });
            const totalRevenue = products.reduce((acc, product) => acc + product.price, 0);
            return { category: category.name, totalRevenue };
        }));
        res.json(revenuePerCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Popularity of Categories based on Sales
router.get('/category-popularity', async (req, res) => {
    try {
        const categories = await Category.find();
        const categoryPopularity = await Promise.all(categories.map(async (category) => {
            const products = await Product.find({ category: category._id });
            const orderItems = await OrderItem.find({ product: { $in: products.map(product => product._id) } });
            const orderCount = orderItems.length;
            return { category: category.name, orderCount };
        }));
        res.json(categoryPopularity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sales Overview Report
router.get('/sales-overview', async (req, res) => {
    try {
        // Calculate total revenue
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        // Calculate number of orders
        const numberOfOrders = await Order.countDocuments();

        // Calculate average order value
        const averageOrderValue = await Order.aggregate([
            { $group: { _id: null, averageOrderValue: { $avg: '$totalPrice' } } }
        ]);

        res.json({
            totalRevenue: totalRevenue[0]?.totalRevenue || 0,
            numberOfOrders,
            averageOrderValue: averageOrderValue[0]?.averageOrderValue || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product Sales Report
router.get('/product-sales-report', async (req, res) => {
    try {
       
        
        // Fetch all order items
        const orderItems = await OrderItem.find();

        const productSalesData = await Promise.all(orderItems.map(async (orderItem) => {
            const product = await Product.findById(orderItem.product);
            return {
                productId: product._id,
                productName: product.name,
                quantitySold: orderItem.quantity,
                revenueGenerated: orderItem.quantity * product.price,
                categoryId: product.category 
            };
        }));

        res.json(productSalesData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sales by Category Report
router.get('/sales-by-category', async (req, res) => {
    try {
        const categories = await Category.find();

        // Aggregate sales data for each category
        const salesByCategory = await Promise.all(categories.map(async (category) => {
            // Fetch all products in the category
            const products = await Product.find({ category: category._id });
            const productCount = products.length;

            const orderItems = await OrderItem.find({ product: { $in: products.map(product => product._id) } });

            // Calculate total revenue for the category
            const totalRevenue = orderItems.reduce((acc, orderItem) => {
                const product = products.find(product => product._id.equals(orderItem.product));
                return acc + (orderItem.quantity * product.price);
            }, 0);

            const numberOfOrders = orderItems.length;

            return {
                categoryId: category._id,
                categoryName: category.name,
                totalRevenue,
                numberOfOrders,
                productCount
            };
        }));

        res.json(salesByCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inventory Performance Report
router.get('/inventory-performance', async (req, res) => {
    try {
        const products = await Product.find();

        // Calculate current stock level and turnover rate for each product
        const inventoryPerformance = await Promise.all(products.map(async product => {
            const orderItems = await OrderItem.find({ product: product._id });
            const quantitySold = orderItems.reduce((total, orderItem) => total + orderItem.quantity, 0);
            const turnoverRate = quantitySold / product.countInStock;
            return {
                productName: product.name,
                productId: product._id,
                currentStockLevel: product.countInStock,
                turnoverRate,
                productPopularity: quantitySold
            };
        }));

        res.json(inventoryPerformance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
