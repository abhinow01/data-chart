const Data = require('../models/Data');
exports.getData = async(req,res) =>{
    const {startDate , endDate  , gender , ageRange } = req.query ; 
    // let start = new Date(startDate) ,  end = new Date(endDate);
    const _query={};
    if(startDate && endDate ){
      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log(start , end)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
        _query.day = {$gte: start.setUTCHours(0,0,0,0) , $lt: end.setUTCHours(23,59,59,999) }
    }
    if(gender){
        _query.gender = gender;
    }
    if (ageRange) {
        _query.ageRange = ageRange;
      }
      try{
        console.log("==query==" , _query)
        const filteredData = await Data.find(_query);
        res.json(filteredData);
      }catch(error){
        res.status(500).json({message : error.message})
      }

}