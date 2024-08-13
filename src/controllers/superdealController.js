const superdealModel = require('../models/superDealModel');

let { getCurrentIPAddress } = require('../uitls/utils');
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port } = require("../config/config");
const { isValidObjectId } = require('mongoose');


// ADD SUPERDEAL
const addSuperDeal = async (req, res) => {
    try {
        let { name, subTitle, description, category, price, stock_items, status, discount } = req.body;

        let { service_image } = req.files;

        if (!service_image) {
            return res.status(400).send({ status: false, message: "No superdeal image uploaded"});
        };

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/superdealImages/";
        let imgUniqName = uuid.v4() + "." + service_image.name.split(".").pop();
        let imgUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "superdealImages", imgUniqName);

        service_image.mv(imgSavingPath, (err) => {
            if (err) {
                throw err;
            }
        });

        let imgObj = {
            imageName: imgUniqName,
            imagePath: imgUrl
        };

        let dbObj = {
            name,
            subTitle,
            description,
            category,
            price,
            stock_items,
            status,
            service_image: imgObj,
            discount
        };

        let newDeal = await superdealModel.create(dbObj);

        return res.status(200).send({
            status: true,
            message: "Success",
            data: newDeal
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET SUPERDEAL BY ID
const getSuperdealById = async (req, res) => {
    try {
        let { superdealId } = req.params;
        if (!superdealId) {
            return res.status(400).send({ status: false, message: "Super Admin Id is required" });
        };

        let superdeal = await superdealModel.findById(superdealId);

        if (!superdeal) {
            return res.status(404).send({ status: false, message: "Not Found"});
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: superdeal,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET ALL SUPERDEALS
const getAllSuperdeals = async (req, res) => {
    try {
        let allSuperdeals = await superdealModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allSuperdeals,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// UPDATE SUPERDEAL BY ID
const updateSuperdeal = async (req, res) => {
    try {
        let { superdealId } = req.params;
        if (!superdealId) {
            return res.status(400).send({ status: false, message: "Superdeal Id is required"});
        };

        if (!isValidObjectId(superdealId)) {
            return res.status(400).send({ status: false, message: "Invalid Superdeal Id"});
        };

        let superdeal = await superdealModel.findById(superdealId);

        if (!superdeal) {
            return res.status(404).send({ status: false, message: "No Superdeal found with this Id" })
        };

        let reqBody = req.body;

        if ("name" in reqBody) {
            superdeal.name = reqBody.name;
        };

        if ("subTitle" in reqBody) {
            superdeal.subTitle = reqBody.subTitle;
        };

        if ("description" in reqBody) {
            superdeal.description = reqBody.description;
        };

        if ("price" in reqBody) {
            superdeal.price = reqBody.price;
        };

        if ("stock_items" in reqBody) {
            superdeal.stock_items = reqBody.price;
        };

        if ("status" in reqBody) {
            superdeal.status = reqBody.status;
        };

        if ("discount" in reqBody) {
            superdeal.discount = reqBody.discount;
        };

        if ("service_image" in reqBody || (req.files && req.files.service_image )) {
            let service_image = req.files.service_image;

            if (!service_image) {
                return res.status(400).send({ status: false, message: "No service image uploaded"});
            };

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/superdealImages/";
            let imgUniqName = uuid.v4() + "." + service_image.name.split(".").pop();
            let imgUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "superdealImages", imgUniqName);

            let oldImgName = superdeal.service_image.imageName;
            let oldImgPath = path.join(__dirname, "..", "..", "superdealImages", oldImgName);
            fs.unlinkSync(oldImgPath);

            service_image.mv(imgSavingPath, (err) => {
                if (err) {
                    throw err;
                };
            });

            let imgObj = {
                imageName: imgUniqName,
                imagePath: imgUrl
            };

            superdeal.service_image = imgObj;
        };

        await superdeal.save();

        return res.status(200).send({
            status: true,
            message: "Superdeal updated successfully",
            data: superdeal,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE SUPERDEAL BY ID
const deleteSuperdeal = async (req, res) => {
    try {
        let { superdealId } = req.params;
        if (!superdealId) {
            return res.status(400).send({ status: false, message: "Superdeal Id is required"});
        };

        let superdeal = await superdealModel.findById(superdealId);

        if (!superdeal) {
            return res.status(404).send({ status: false, message: "Not Found"});
        };

        let superdealImgName = superdeal.service_image.imageName;
        let superdealImgPath = path.join(__dirname, "..", "..", "superdealImages", superdealImgName);
        fs.unlinkSync(superdealImgPath);

        await superdealModel.deleteOne({ _id: superdealId });

        return res.status(200).send({
            status: true,
            message: "Success",
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = {
    addSuperDeal,
    getSuperdealById,
    getAllSuperdeals,
    updateSuperdeal,
    deleteSuperdeal,
};