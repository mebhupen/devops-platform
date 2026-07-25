exports.list = async (req,res)=>{ res.json({success:true,data:[{name:'deployments'},{name:'builds'},{name:'notifications'}]}); };
