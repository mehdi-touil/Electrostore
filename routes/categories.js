var express = require('express');
var router = express.Router();
const Category=require('../models/CategoryShema')
const imageModel=require('../models/ImageShema')
const fs = require("fs");
const path = require("path");
const Item = require('../models/ItemShema')

//upload image
const multer = require("multer");
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
async function dealWithImage(req)
{
  var img = fs.readFileSync(req.files[0].path);
  var encode_img = img.toString('base64');
  var final_img = {
      contentType:req.files[0].mimetype,
      data: fs.readFileSync(path.join(__dirname , '../public/images/' + req.files[0].filename)),  
      path:path.join(__dirname , '../public/images/' + req.files[0].filename)
      };
  const myimage = await imageModel.create(final_img)
  fs.unlinkSync(final_img.path)
  return myimage
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  const categories = await Category.find({}).populate('image')
  res.render('CategoryIndex', { categories: categories });
});
router.get('/create',  function(req, res, next) {
  res.render('CategoryForm',{action:'add',title:'add'});
});
router.post('/',upload.any(), async function(req, res, next) {

  var newCategory= {
    name:req.body.name,
    description:req.body.description,
  }
  //deal with image
  if(req.files[0] != null){
  const myimage = await dealWithImage(req)
  newCategory.image = myimage
  }

  if(req.body.pass==process.env.PASSWORD)
{
  const category=  await Category.create(newCategory)
  res.redirect('/category')
}
else
{
  res.render('CategoryForm',{category:req.body,action:'update',title:'add',error:'Incorrect Admin Password'});

}
});
router.get('/:id/confirmdel', async function(req, res) {
  res.render('Confirmation',{id:req.params.id,type:'category'});
})
router.all('/:id/delete', async function(req, res) {
  const product=await Item.findById(req.params.id).populate('category')
  console.log(product)
  if(product!== null)
  {
    res.render('Confirmation',{error:'Delete items of this category first',pass:req.body.pass,id:req.params.id,type:'category'});

  }
  else if(req.body.pass==process.env.PASSWORD)
  {
  await Category.findByIdAndDelete(req.params.id)
  res.redirect('/category')
  }
  else
  {
    res.render('Confirmation',{error:'Incorrect Password',pass:req.body.pass,id:req.params.id,type:'category'});
  }
});
router.get('/:id/update',async function(req, res) {
  const category=await Category.findById(req.params.id)
  res.render('CategoryForm',{category:category,action:'update',title:'update'});
}).post('/:id/update',upload.any(), async function(req ,res) {
  const category = await Category.findById(req.params.id)
  category.name=req.body.name
  category.description=req.body.description
  if(req.files[0] != null){
    const myimage = await dealWithImage(req)
    category.image = myimage
  }
  if(req.body.pass==process.env.PASSWORD)
{
  await category.save()
  res.redirect('/category')
}
else
{
  res.render('CategoryForm',{category:category,action:'update',title:'update',error:'Incorrect Admin Password'});

}
});
module.exports = router;
