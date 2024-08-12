const express = require('express');
const router = express.Router();
const Product = require('../models/products'); // Adjust the path if necessary
const {uploadPhoto,upload} = require('../server')

// Create a new product


// router.post('/', upload.fields([{ name: "image" }]), async (req, res) => {
//   const { name, price, image, tags } = req.body;

//   try {
//     const newProduct = new Product({ name, price, image, tags });
   
//     const data = req.body;
//     // adds images and coverPic arrays to data
//     data.titleImg = [];
//     if (req.files.titleImg) {
//       req.files.titleImg.map((entry) => {
//         entry.originalname = `${Date.now()}-${entry.originalname}`;
//         uploadPhoto(entry);
//         data.titleImg.push(entry.originalname);
//       });
//     }
//   }
//   catch (error) {
//     res.status(400).json({ message: 'Error creating product', error });
//   }
// });

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving products', error });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving product', error });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;
