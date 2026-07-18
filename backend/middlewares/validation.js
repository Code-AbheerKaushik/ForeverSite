const joi = require("joi")
const signupvalidation=(req,res,next)=>{
    const schema = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required(),
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
const loginvalidation=(req,res,next)=>{
    console.log(req.body)
   const schema = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required(),
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
module.exports= {loginvalidation,signupvalidation}