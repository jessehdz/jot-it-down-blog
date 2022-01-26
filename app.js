//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This looks like a good place to start!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose server connection
mongoose.connect("mongodb+srv://admin-jesse:Test123@cluster0.xcya1.mongodb.net/jidDB");

//post schema -----------------------------------------------
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is missing. Please add a title to continue."
  },
  body: String,
  date: String
}); 

const Post = mongoose.model("Post", postsSchema);

const post0 = new Post ({
  title: "Good Day",
  body: "Just waking up in the morning gotta thank God I don't know but today seems kinda odd No barking from the dogs, no smog And momma cooked a breakfast with no hog I got my grub on, but didn't pig out Finally got a call from a girl want to dig out Hooked it up on later as I hit the do' Thinking will i live another twenty fo' I gotta go cause I got me a drop top."
});

const firstPost = [post0];

// post0.save();

//home page -----------------------------------------------------------
//date configuration
const today = new Date();

let options = {
  weekday: 'long', 
  day: 'numeric',
  month: 'long'
}

let day = today.toLocaleDateString('en-US', options);

app.get("/", (req, res) => {


  Post.find({}, function(err, results){
    
    if(results.length === 0) {
      Post.insertMany(post0, function(err, post) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully added initial post to DB.")
        }
      });
      
    } else {
      res.render("home", {
        homeStart: homeStartingContent, 
        posts: results });
      
    }

  });

});

app.get("/about", (req, res) => {

  res.render("about", {aboutCont : aboutContent});
})

app.get("/contact", (req, res) => {

  res.render("contact", {contactCont: contactContent});
})

app.get("/compose", (req, res) => {
  
  res.render("compose");
})


app.post("/compose", (req, res) =>{
  

  //creates new document in DB
  const newPost = new Post ({
    date: day,
    title: req.body.entryTitle,
    body: req.body.entryBody
  });

  // const postAddress = _.kebabCase(newPost.title);

  newPost.save(function (err){
    if(!err){
      res.redirect("/");
    }
  });

})

//express routing
app.get('/posts/:postID', function(req, res) {
  //URL request ID -- "Read More..."
  const requestedID = req.params.postID;

  console.log("Requested ID: " + requestedID);

  Post.findById({_id: requestedID}, function(err, foundPost){
    if(!foundPost) {
      console.log(err);
    } else {
      res.render("post", {
        date: foundPost.date,
        title: foundPost.title,
        body: foundPost.body
      });

      // res.redirect("/" + _.kebabCase(requestedTitle))
      console.log("Posting: " + foundPost.title);
    }

  })
  
})

app.listen(3000, function() {
  console.log("BLOG: Server started on port 3000");
});
