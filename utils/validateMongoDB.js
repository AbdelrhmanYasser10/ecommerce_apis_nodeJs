const mongoose = require('mongoose');

const validateMongoDbId = (id)=>{
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if(!isVaild){
    throw new Error('This is Id is not valid');
  }
}

module.exports = validateMongoDbId;