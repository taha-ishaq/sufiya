const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String], // This could be a URL to the image or a path to where the image is stored
    required: true,
  },
  tags: {
    type: [String],
    enum: ['new', 'trending', 'stitched', 'unstitched', 'bridal'], // Allowed tags
    required: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
