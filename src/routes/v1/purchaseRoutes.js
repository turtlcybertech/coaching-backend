const express = require('express');
const router = express.Router();

const { purchaseCourse, getPurchasedCourse, getAllPurchasedCourses, updatePurchasedCourseDetails, deletePurchaseDetails } = require('../../controllers/coursePurchaseController');

// ADD COURSE PURCHASE DETAILS
router.post("/api/v1/addPurchaseDetails", purchaseCourse);

// GET COURSE PURCHASE DETAILS BY ID
router.get("/api/v1/getPurchasedDetails/:purchaseId", getPurchasedCourse);

// GET ALL COURSE PURCHASE DETAILS
router.get("/api/v1/getAllPurchasedDetails", getAllPurchasedCourses);

// UPDATE COURSE PURCHASE DETAILS BY PURCHASE ID
router.put("/api/v1/updatePurchasedDetails/:purchaseId", updatePurchasedCourseDetails);

// DELETE COURSE PURCHASE DETAILS BY PURCHASE ID
router.delete("/api/v1/deletePurchaseDetails/:purchaseId", deletePurchaseDetails);


module.exports = router;