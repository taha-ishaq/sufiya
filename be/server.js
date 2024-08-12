const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const productRoutes = require('./routes/products');
const multer = require('multer');
const router = express.Router();
const Product = require('./models/products');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect('mongodb+srv://sufiyakhanum:35xMBpSDDn2Eagt7@cluster0.3xnlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define a simple route
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_ZONE,
});

const storage = multer.memoryStorage();

  const upload = multer({
storage,
limits: { fileSize: 50000000 },
});
 const uploadPhoto = async (photo) => {
  try {
    
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: photo.originalname,
        Body: photo.buffer,
        ContentType: photo.mimetype,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
router.post('/', upload.fields([{ name: "image" }]), async (req, res) => {
  const { name, price, image, tags } = req.body;

  try {
    const newProduct = new Product({ name, price, image, tags });
   
    const data = req.body;
    // adds images and coverPic arrays to data
    data.image = [];
    if (req.files.image) {
      req.files.image.map((entry) => {
        entry.originalname = `${Date.now()}-${entry.originalname}`;
        uploadPhoto(entry);
        data.image.push(entry.originalname);
      });
    }
  }
  catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});
app.use('/api/products', productRoutes);


// Define the port to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = {uploadPhoto, upload}