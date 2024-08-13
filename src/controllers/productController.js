const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const superdealModel = require("../models/superDealModel");

let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");

// ADD PRODUCT
const addProduct = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "key is required" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let { name, subTitle, description, category, price, stock_item, status, discount } = req.body;

        let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

        let decodedData = Buffer.from(File_data, "base64");

        let currentIpAddress = getCurrentIPAddress();

        let imgRelativePath;
        if (category || req.body.category) {
            imgRelativePath = "/productImages/";
        } else {
            imgRelativePath = "/superdealImages/";
        }

        let imgUniqName = uuid.v4() + File_Extension;
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;

        let imgSavingPath
        if (category || req.body.category) {
            imgSavingPath = path.join(__dirname, "..", "..", "productImages", imgUniqName);
        } else {
            imgSavingPath = path.join(__dirname, "..", "..", "superdealImages", imgUniqName);
        };
        
        fs.writeFileSync(imgSavingPath, decodedData);

        let imgObj = {
            imageName: imgUniqName,
            imagePath: imgFullUrl,
        };

        let productObj = {
            name,
            subTitle,
            description,
            price,
            stock_item,
            service_image: imgObj,
            status,
            discount,
        };

        let newProduct;
        if (category || req.body.category) {
            productObj.category = category;
            newProduct = await productModel.create(productObj);
        } else {
            newProduct = await superdealModel.create(productObj);
        }

        return res.status(200).send({
            status: true,
            message: "Product Added Successfully",
            data: newProduct,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET PRODUCT BY PRODUCT ID
const getProduct = async (req, res) => {
    try {
        let { productId, key } = req.params;
        if (!productId || !key) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({ status: false, message: "Product Not Found" });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: product,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "Key is required" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let products = await productModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: products,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// UPDATE PRODUCT BY ID
const updateProduct = async (req, res) => {
    try {
        let { productId, key } = req.params;

        if (!productId || !key) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid Object Id" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let product = await productModel.findById(productId);
        let superdeal = await superdealModel.findById(productId);

        if (!product && !superdeal) {
            return res.status(404).send({ status: false, message: "Item not found" });
        }

        let reqBody = req.body;

        if (product) {
            if ("name" in reqBody) {
                product.name = reqBody.name;
            }

            if ("subTitle" in reqBody) {
                product.subTitle = reqBody.subTitle;
            }

            if ("description" in reqBody) {
                product.description = reqBody.description;
            }

            if ("price" in reqBody) {
                product.price = reqBody.price;
            }

            if ("stock_items" in reqBody) {
                product.stock_items = reqBody.stock_items;
            }

            if ("status" in reqBody) {
                product.status = reqBody.status;
            }

            if ("discount" in reqBody) {
                product.discount = reqBody.discount;
            }

            if ("FileUpload" in reqBody) {
                let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

                let decodedData = Buffer.from(File_data, "base64");

                let currentIpAddress = getCurrentIPAddress();
                let imgRelativePath = "/productImages/";
                let imgUniqName = uuid.v4() + File_Extension;
                let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
                let imgSavingPath = path.join(__dirname, "..", "..", "productImages", imgUniqName);

                let productOldImage = product.service_image.imageName;
                let oldImgPath = path.join(__dirname, "..", "..", "productImages", productOldImage);

                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                };

                fs.writeFileSync(imgSavingPath, decodedData);

                let newImgObj = {
                    imageName: imgUniqName,
                    imagePath: imgFullUrl,
                };

                product.service_image = newImgObj;
            }

            await product.save();

            return res.status(200).send({
                status: true,
                message: "Product Updated Successfully",
                data: product,
            });
        } else {
            if ("name" in reqBody) {
                superdeal.name = reqBody.name;
            }

            if ("subTitle" in reqBody) {
                superdeal.subTitle = reqBody.subTitle;
            }

            if ("description" in reqBody) {
                superdeal.description = reqBody.description;
            }

            if ("price" in reqBody) {
                superdeal.price = reqBody.price;
            }

            if ("stock_items" in reqBody) {
                superdeal.stock_items = reqBody.stock_items;
            }

            if ("status" in reqBody) {
                superdeal.status = reqBody.status;
            }

            if ("discount" in reqBody) {
                superdeal.discount = reqBody.discount;
            };

            if ("FileUpload" in reqBody) {
                let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

                let decodedData = Buffer.from(File_data, "base64");

                let currentIpAddress = getCurrentIPAddress();
                let imgRelativePath = "/superdealImages/";
                let imgUniqName = uuid.v4() + File_Extension;
                let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
                let imgSavingPath = path.join(__dirname, "..", "..", "superdealImages", imgUniqName);

                let superdealOldImage = superdeal.service_image.imageName;
                let oldImgPath = path.join(__dirname, "..", "..", "superdealImages", superdealOldImage);

                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }

                fs.writeFileSync(imgSavingPath, decodedData);

                let newImgObj = {
                    imageName: imgUniqName,
                    imagePath: imgFullUrl,
                };

                superdeal.service_image = newImgObj;
            }

            await superdeal.save();

            return res.status(200).send({
                status: true,
                message: "Superdeal Updated Successfully",
                data: superdeal,
            });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// DELETE PRODUCT BY PRODUCT ID
const deleteProduct = async (req, res) => {
    try {
        let { productId, key } = req.params;

        if (!productId || !key) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid objectId" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let product = await productModel.findById(productId);
        let superdeal = await superdealModel.findById(productId);

        if (!product && !superdeal) {
            return res.status(404).send({ status: false, message: "Item not found" });
        }

        if (product) {
            let productImgName = product.service_image.imageName;
            let imagePath = path.join(__dirname, "..", "..", "productImages", productImgName);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            };

            await productModel.deleteOne({ _id: productId });
        } else {

            let superdealImgName = superdeal.service_image.imageName;
            let imagePath = path.join(__dirname, "..", "..", "superdealImages", superdealImgName);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            };

            await superdealModel.deleteOne({ _id: productId });
        }

        return res.status(200).send({
            status: true,
            message: "Item deleted successfully",
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    addProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
