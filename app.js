/**
 * Created by Fadjuha on 26.01.2018.
 */

const hostname = '127.0.0.1';
const port = 3000;

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
//APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()),
app.use(methodOverride("_method"));

//MONGOOSE/Mode config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
                type: Date,
                default: Date.now
             }
});

var Blog = mongoose.model("Blog", blogSchema);

//REST routes

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function(err, blogs){
        if (err){
            console.log("Error!");
        } else {
            res.render("index",{blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function (err, newBlog) {
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   });
});

//SHOW ROUTE
app.get("/blogs/:id", function (req,res) {
   Blog.findById(req.params.id, function (err, foundBlog) {
       if(err){
           res.redirect("index");
       }else {
           res.render("show", {blog: foundBlog});
       }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req,res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function (req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req,res) {
   //destroy blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
       if (err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    });
    //redirect somewhere
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});