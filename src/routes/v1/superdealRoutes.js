const express = require('express');
const router = express.Router();

const { 
    addSuperDeal, 
    getSuperdealById, 
    getAllSuperdeals, 
    updateSuperdeal, 
    deleteSuperdeal 
} = require('../../controllers/superdealController');

// ADD SUPERDEAL
router.post("/api/v1/addSuperdeal", addSuperDeal);

// GET SUPERDEAL BY ID
router.get("/api/v1/getSuperdealById/:superdealId", getSuperdealById);

// GET ALL SUPERDEALS
router.get("/api/v1/getAllSuperdeals", getAllSuperdeals);

// UPDATE SUPERDEAL BY ID
router.put("/api/v1/updateSuperdeal/:superdealId", updateSuperdeal);

// DELETE SUPERDEAL BY ID
router.delete("/api/v1/deleteSuperdeal/:superdealId", deleteSuperdeal);


module.exports = router;