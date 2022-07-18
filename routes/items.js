var express = require('express');
var router = express.Router();
const Item = require('../models/ItemShema')
const imageModel=require('../models/ImageShema')
const Category=require('../models/CategoryShema')
const fs = require("fs");
const path = require("path");

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
router.all('/', async function(req, res, next) {
  var searchOptions={}
  console.log(req.body.keyword)
  if(req.body.keyword)
  {
    searchOptions.name=new RegExp(req.body.keyword, 'i')
  }
  const items = await Item.find(searchOptions).populate('image category')
  res.render('ItemIndex', { products: items });
});
//search by category
router.get('/category/:id', async function(req, res, next) {
  const items = await Item.find({category:req.params.id}).populate('image category')
  res.render('ItemIndex', { products: items });
});
router.get('/create',  async function(req, res, next) {
  //category for select options
  const categories = await Category.find({})
  res.render('ItemForm',{action:'add',categories:categories,title:'add'});
});
router.post('/create',upload.any(), async function(req, res, next) {
  var newItem= {
    name:req.body.name,
    description:req.body.description,
    'number-in-stock':req.body.Stock,
    price:req.body.price,
    category:req.body.categoryId
  }
  //deal with image
  if(req.files[0] != null){
  const myimage = await dealWithImage(req)
  newItem.image = myimage
  }
  if(req.body.pass==process.env.PASSWORD)
  {
    const item=  await Item.create(newItem)
    res.redirect('/products')
  }
  else
  {
    const categories = await Category.find({})
    res.render('ItemForm',{product:req.body,action:'update',title:'add',error:'Incorrect Admin Password',categories:categories});
  
  }
 
});
router.get('/:id/confirmdel', async function(req, res) {
  res.render('Confirmation',{id:req.params.id,type:'products'});
})
router.all('/:id/delete', async function(req, res) {
  if(req.body.pass==process.env.PASSWORD)
  {
  await Item.findByIdAndDelete(req.params.id)
  res.redirect('/products')
  }
  else
  {
    res.render('Confirmation',{error:'Incorrect Password',pass:req.body.pass,id:req.params.id,type:'products'});

  }
});
router.get('/:id/update',async function(req, res) {
    //category for select options
    const categories = await Category.find({})
    //look for the product wanted
  const product=await Item.findById(req.params.id).populate('category')
  res.render('ItemForm',{product:product,action:'update',categories:categories});
}).post('/:id/update',upload.any(), async function(req ,res) {
  const item = await Item.findById(req.params.id)
  item.name=req.body.name
  item.description=req.body.description
  item.price=req.body.price
  item.category=req.body.categoryId
  item['number-in-stock']=req.body.Stock
  if(req.files[0] != null){
    const myimage = await dealWithImage(req)
    item.image = myimage
  }
  await item.save()
  res.redirect('/products')
});
module.exports = router;
