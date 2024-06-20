const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Import the Mongoose Review model

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('user');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single review by ID
router.get('/:id', getReview, (req, res) => {
    res.json(res.review);
});

// GET reviews for a specific product
router.get('/:productId/reviews', async (req, res) => {
    const productId = req.params.productId;
    try {
      const reviews = await Review.find({ product: productId }).populate('user');
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// POST a new review
router.post('/', async (req, res) => {
    const review = new Review({
        user: req.body.userId,
        product: req.body.productId,
        rating: req.body.rating,
        comment: req.body.comment
    });

    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a review by ID
router.put('/:id', getReview, async (req, res) => {
    if (req.body.productId != null) {
        res.review.product = req.body.productId;
    }
    if (req.body.userId != null) {
        res.review.user = req.body.userId;
    }
    if (req.body.rating != null) {
        res.review.rating = req.body.rating;
    }
    if (req.body.comment != null) {
        res.review.comment = req.body.comment;
    }

    try {
        const updatedReview = await res.review.save();
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a review by ID
router.delete('/:id', getReview, async (req, res) => {
    try {
        await res.review.remove();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single review by ID
async function getReview(req, res, next) {
    try {
        const review = await Review.findById(req.params.id);
        if (review == null) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.review = review;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
