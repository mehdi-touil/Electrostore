//Require Mongoose
var mongoose = require('mongoose');
const imageModel=require('../models/ImageShema')
//Define a schema
var Schema = mongoose.Schema;

var CategoryShema = new Schema({
  name: String,
  image:{ type: Schema.Types.ObjectId, ref: 'image'},
  description:String
});
module.exports=mongoose.model('category',CategoryShema)
