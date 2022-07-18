var mongoose = require('mongoose');


var imgSchema = mongoose.Schema({
    data:Buffer,
    contentType: String
});
module.exports= mongoose.model("image",imgSchema);