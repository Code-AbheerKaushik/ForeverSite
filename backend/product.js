const product = require('./models/products');
const userModel = require('./models/user')
const jwt = require('jsonwebtoken')
const addProduct = async (req, res) => {
    try {
        const { id, name, description, price, image, category, subCategory, sizes, date, bestseller } = req.body;
        const existingproduct = await product.findOne({ id });
        if (existingproduct) {
            return res.status(400).json({
                message: "product already exists",
                status: false
            });
        }
        const newproduct = await product.create({
            id, name, description, price, image, category, subCategory, sizes, date, bestseller
        });

        return res.status(201).json({
            message: "product added successfully",
            productId: newproduct._id,
            status: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error during addProduct",
            error: error.message,
            status: false
        });
    }
}
const getAllProducts = async (req, res) => {
    try {
        const allProducts = await product.find().limit(40);

        return res.status(200).json({
            success: true,
            data: allProducts
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "bad request",
            error: err.message
        });
    }
};
const getLatest = async (req, res) => {
    try {
        const latestProducts = await product.find()
            .sort({ _id: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: latestProducts
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "bad request",
            error: err.message
        });
    }
};
const getItem = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await product.findOne({ _id: id })
        return res.status(200).json({
            success: true,
            data: item
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "bad request",
            error: err.message
        });
    }
};
const getFiltered = async (req, res) => {
    const { cat, sub, searchtxt } = req.body;
    let filter = {};
    if (cat.length > 0) {
        filter.category = {
            $in: cat
        };
    }

    if (sub.length > 0) {
        filter.subCategory = {
            $in: sub
        };
    }
    if (searchtxt.trim()) {
        filter.$or = [
            {
                name: {
                    $regex: searchtxt,
                    $options: "i"
                }
            },
            {
                category: searchtxt
            },
            {
                subCategory: searchtxt
            }
        ];
    }
    try {
        const products = await product.find(filter);
        res.status(201).json({
            success: true,
            data: products
        })
    }
    catch (err) {
        res.status(400).json({
            message: "Error in getting filtered data",
            success: false,
            error: err.message
        })
    }

};
const getbestseller = async (req, res) => {
    let filter = {};
    filter.bestseller = true;
    try {
        const products = await product.find(filter);
        res.status(201).json({
            success: true,
            data: products
        })
    }
    catch (err) {
        res.status(400).json({
            message: "Error in getting bestsellers",
            success: false,
            error: err.message
        })
    }
}
const addtocart = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).json({
            message: "Token not found"
        })
        return;
    }
    try {
        const decoded = jwt.verify(
            token,
            "your_secret_key_here"
        );
        const { item, size } = req.body;
        const pid = item._id.toString();
        const user = await userModel.findById(decoded.id);
        const existing = user.cart.find(
            items =>
                items.product.toString() === pid
                && items.size === size
        );
        if (existing) {
            existing.quantity++;
        } else {
            user.cart.push({
                product: pid,
                quantity: 1,
                size: size
            });
        }
        // console.log(user.cart)
        await user.save();
        res.status(201).json({
            message: "product saved successfully",
            success: true,
            cartitem: user.cart.length
        })
    }
    catch (err) {
        res.status(400).json({
            message: "error in saving item to cart",
            error: err
        })
    }
};
const getcart = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(
            token,
            "your_secret_key_here"
        );
        const user = await userModel.findById(decoded.id);
        const userarray = await user.populate("cart.product");
        res.status(200).json({
            message: " cart fetched successfully",
            data: userarray.cart
        });
    }
    catch (err) {
        res.status(400).json({
            message: "failed in getting cart"
        })
    }
}
const deleteproduct = async (req, res) => {

    try {
        const { id,size } = req.body
        const token = req.headers.authorization;
        const decoded = jwt.verify(
            token,
            "your_secret_key_here"
        );
        console.log(size)
        const user = await userModel.findById(decoded.id);
        user.cart = user.cart.filter((item) => item.product.toString() !==id || item.size!==size)
        await user.save();
        res.status(200).json({
            message: " deleted successfully",
            success: true
        });
        console.log("deleted :)")
    }
    catch (err) {
        res.status(400).json({
            message: "failed in deleting item"
        })
    }
}
const updatecart = async (req, res) => {
    try {
        const { productId, currentSize, newQuantity, newSize } = req.body;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, "your_secret_key_here");
        const user = await userModel.findById(decoded.id);

        // Find the item to update by productId + currentSize
        const targetIndex = user.cart.findIndex(
            item => item.product.toString() === productId && item.size === currentSize
        );
        if (targetIndex === -1) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (newSize && newSize !== currentSize) {
            // Check if an item with same product + newSize already exists
            const duplicateIndex = user.cart.findIndex(
                item => item.product.toString() === productId && item.size === newSize
            );
            if (duplicateIndex !== -1) {
                // Merge quantities into the existing item, remove the old one
                user.cart[duplicateIndex].quantity +=
                    newQuantity !== undefined ? Number(newQuantity) : user.cart[targetIndex].quantity;
                user.cart.splice(targetIndex, 1);
            } else {
                // Just update the size (and quantity if provided)
                user.cart[targetIndex].size = newSize;
                if (newQuantity !== undefined) {
                    user.cart[targetIndex].quantity = Number(newQuantity);
                }
            }
        } else if (newQuantity !== undefined) {
            user.cart[targetIndex].quantity = Number(newQuantity);
        }

        await user.save();
        const populated = await user.populate("cart.product");
        res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            data: populated.cart
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update cart item",
            error: err.message
        });
    }
}

const mergecart = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({
            message: "Token not found"
        });
    }
    try {
        const decoded = jwt.verify(
            token,
            "your_secret_key_here"
        );
        const { guestCart } = req.body;
        const user = await userModel.findById(decoded.id);
        
        if (guestCart && Array.isArray(guestCart)) {
            for (const guestItem of guestCart) {
                if (!guestItem.product || !guestItem.product._id) continue;
                const pid = guestItem.product._id.toString();
                const size = guestItem.size || "M";
                const quantity = guestItem.quantity || 1;

                const existing = user.cart.find(
                    item => item.product.toString() === pid && item.size === size
                );
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    user.cart.push({
                        product: pid,
                        quantity: quantity,
                        size: size
                    });
                }
            }
            await user.save();
        }

        res.status(200).json({
            message: "Cart merged successfully",
            success: true,
            cartNo: user.cart.length
        });
    } catch (err) {
        res.status(400).json({
            message: "failed in merging cart",
            error: err.message
        });
    }
}

module.exports = { addProduct, getAllProducts, getLatest, getItem, getFiltered, getbestseller, addtocart, getcart, deleteproduct,updatecart, mergecart };