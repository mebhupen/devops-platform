const userRepository = require('../repositories/userRepository');
exports.list = async (req,res,next)=>{
  try{
    const users = await userRepository.query().whereNull('deleted_at').select('id','email','name','role','is_email_verified','created_at').orderBy('created_at','desc');
    res.json({success:true,data:users});
  }catch(e){ next(e); }
};
exports.getById = async (req,res,next)=>{
  try{
    const user = await userRepository.findById(req.params.id);
    if(!user) return res.status(404).json({success:false,message:'Not found'});
    res.json({success:true,data:user});
  }catch(e){ next(e); }
};
