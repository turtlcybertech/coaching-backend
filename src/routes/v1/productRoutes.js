const express = require('express');
const router = express.Router();

const { 
    addProduct, 
    getProduct, 
    updateProduct, 
    deleteProduct, 
    getAllProducts 
} = require('../../controllers/productController');

// ADD PRODUCT
router.post("/api/v1/addProduct/:key", addProduct);

// GET PRODUCT BY ID
router.get("/api/v1/getProduct/:productId/:key", getProduct);

// GET ALL PRODUCTS
router.get("/api/v1/getAllProducts/:key", getAllProducts);

// UPDATE PRODUCT BY PRODUCT ID
router.put("/api/v1/updateProduct/:productId/:key", updateProduct);

// DELETE PRODUCT BY PRODUCT ID
router.delete("/api/v1/deleteProduct/:productId/:key", deleteProduct);


module.exports = router;