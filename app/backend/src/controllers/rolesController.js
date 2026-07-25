const { ROLES } = require('../middleware/rbac');
exports.list = async (req,res)=>{
  const roles = Object.values(ROLES).map(id=>({id, name:id}));
  res.json({success:true,data:roles});
};
