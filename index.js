const express = require('express');
const app = new express();
const path = require('path');
const expressEdge = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');

mongoose.connect('mongodb://localhost/Blog',{useNewUrlParser:true})
 .then(()=>'You are now connected to database')
 .catch(err=>console.err('Something went wrong with the connection to database',err))

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
 
app.get('/post.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
});

app.post('/posts/store',function(req,res){
	Post.create(req.body,function(err,post){
		res.redirect('/');
	})
	
});

app.listen(4000,function(){
	console.log('Statrted on port 4000')
});