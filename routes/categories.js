const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })


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
router.post('/'  , uploadOptions.single('icon'), async (req, res) => {
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let category = new Category({
        name: req.body.name,
        icon: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232",
        color: req.body.color
    })

    category = await category.save()

    if(!category)
    return res.status(404).send('category cannot be created!')

    res.send(category);
})

//update category

router.put('/:id',uploadOptions.single('icon'), async (req, res) => {
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232",
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
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      res.json(deletedCategory);
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports =router;