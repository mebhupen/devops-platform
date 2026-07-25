exports.list = async (req,res,next)=>{
  try{
    const knex = require('../config/database').knex;
    const pipelines = await knex('pipelines').select('*').orderBy('created_at','desc').limit(50);
    res.json({success:true,data:pipelines});
  }catch(e){
    if((e.message||'').includes('does not exist')) return res.json({success:true,data:[]});
    next(e);
  }
};
exports.create = async (req,res,next)=>{
  try{
    const knex = require('../config/database').knex;
    const [row] = await knex('pipelines').insert({name:req.body.name||'new-pipeline', project_id:req.body.project_id, config:req.body.config||{}}).returning('*');
    res.status(201).json({success:true,data:row});
  }catch(e){ next(e); }
};
