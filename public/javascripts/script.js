let searchicon=document.querySelector('.search');
let searchpage=document.querySelector('.searchpage')
let i =searchicon.children[0]
let body=document.querySelector('body');
searchicon.addEventListener('click',()=>{
    searchpage.classList.toggle('showhide')
    i.classList.toggle('fa-xmark');
    body.classList.toggle('stop')

})
let searchbtn=document.querySelector('.searchbtn');
let form=document.querySelector('.searchbar')
searchbtn.addEventListener('click',()=>{
    form.submit()
})
