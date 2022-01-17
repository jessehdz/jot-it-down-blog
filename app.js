//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This looks like a good place to start!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts = [];


app.get("/", (req, res) => {

  res.render("home", {
    homeStart: homeStartingContent, 
    posts: posts });

  //display posts from 'compose' page


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
  const today = new Date();

  let options = {
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  }

  let day = today.toLocaleDateString('en-US', options);

  const title = req.body.entryTitle;
  const entry = req.body.entryBody;

  const postAddress = _.kebabCase(title);

  const post = {
    date: day,
    title: title,
    body: entry
  }

  posts.push(post);



  res.redirect("/");
  // console.log("Title: " + title)
  // console.log(postAddress)
})

//express routing
app.get('/posts/:postName', function(req, res) {
  
  const requestedTitle = _.lowerCase(req.params.postName);
  // let postName = posts[0].title;

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    // console.log(lowerStored, requestedTitle);
    if( requestedTitle === storedTitle){
      console.log("Match of title and route");

      res.render("post", {
        title: post.title,
        content: post.body,
        date: post.date
      });

    } else {
      console.log("Not a match")
    }
  });

  // console.log(postName);
  
  
})

app.listen(3000, function() {
  console.log("BLOG: Server started on port 3000");
});
