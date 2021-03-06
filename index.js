const express = require('express');
const app = new express();
const path = require('path');
const expressEdge = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');
const fileUpload = require("express-fileupload");

mongoose.connect('mongodb://localhost/Blog',{useNewUrlParser:true})
 .then(()=>'You are now connected to database')
 .catch(err=>console.err('Something went wrong with the connection to database',err))

app.use(fileUpload());
app.use(express.static('public'));

app.use(expressEdge);
app.set('views',__dirname+'/views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:true
}));

app.get('/',async function(req,res){
	const posts = await Post.find({})
	res.render('index',{
		posts
	})
});
app.get('/posts',function(req,res){
	res.render('create')
});

app.get('/index.html',function(req,res){
	res.sendFile(path.resolve(__dirname,'pages/index.html'));
});
app.get('/about.html',function(req,res){
	res.sendFile(path.resolve(__dirname,'pages/about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});
 
app.get('/post/:id', async(req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post',{
    	post
    })
});

app.post("/posts/store", (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});


app.listen(4000,function(){
	console.log('Statrted on port 4000')
});