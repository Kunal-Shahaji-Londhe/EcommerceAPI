const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

//fetch category list from database
router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

//fetch category by id from database
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)

    if(!category){
        res.status(500).json({message : "The category not found!"})
    }
    res.status(200).send(category)
})  

//add category to database from user
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })

    category = await category.save()

    if(!category)
    return res.status(404).send('category cannot be created!')

    res.send(category);
})

//update category

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {
            new: true
        })

        if(!category)
        return res.status(404).send('category cannot be updated!')
    
        res.send(category);

})


//delete category
router.delete('/:id', async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deletedCategory = await Category.findByIdAndRemove(categoryId);
      res.json(deletedCategory);
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports =router;