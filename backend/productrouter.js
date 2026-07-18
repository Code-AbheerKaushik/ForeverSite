const productRoutes = require("express").Router();
const { addProductValidation } = require("./middlewares/productValidations");
const { requireAdmin } = require("./middlewares/requireAdmin");
const {addProduct,getAllProducts,getLatest,getItem,getFiltered,getbestseller,addtocart,getcart,deleteproduct,updatecart,mergecart} = require('./product')
productRoutes.post('/addProduct', requireAdmin, addProductValidation, addProduct);
productRoutes.get('/getallproducts',getAllProducts);
productRoutes.get('/getlatest',getLatest);
productRoutes.get('/getitem/:id',getItem);
productRoutes.post('/filtered',getFiltered);
productRoutes.get('/getbestseller',getbestseller);
productRoutes.post('/addtocart',addtocart);
productRoutes.get('/getcart',getcart);
productRoutes.delete('/',deleteproduct);
productRoutes.post('/updatecart',updatecart);
productRoutes.post('/mergecart',mergecart);
module.exports = productRoutes;