//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image:{ type: Schema.Types.ObjectId, ref: 'image'},
  description:String,
  price:{
    type: Number,
    required: true
  },
  'number-in-stock' :{
    type: Number,
    required: true
  },
  category:{ type: Schema.Types.ObjectId, ref: 'category',required:true }

});
module.exports=mongoose.model('item',ItemSchema)
