const joi = require("joi");
const addProductValidation=(req,res,next)=>{
    const schema = joi.object({
    id:joi.string().required(),
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  image: joi.array().items(joi.string()).required(),
  category: joi.string().required(),
  subCategory: joi.string().required(),
  sizes: joi.array().items(joi.string()).required(),
  date: joi.number().required(),
  bestseller: joi.boolean().required()
})
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: "bad request",
            error
        })
    }
    next();
}

module.exports = {addProductValidation}