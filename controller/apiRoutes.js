var express = require("express");
// Initialize Express
var router = express.Router();
var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");


// Routes
// A GET route for scraping the New York Times website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.theverge.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
   
    // Now, we grab every h2 within an article tag, and do the following:
    $(".c-entry-box--compact__title").each(function(i, element) {
      console.log(element);
      // Save an empty result object
      var result = {};
      //console.log(element)
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element)
      .children("a")
      .text().trim();
      result.link = $(element)
      .children("a")
      .attr("href");
      

      if (result.title && result.link){
        console.log(result.title);
      // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
 
                console.log(dbArticle);
                })
                .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
                });
        };        
    });
    res.redirect("/")


  });
  
});

router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const scrapedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



router.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (scrapedArticles) {
            // If we were able to successfully find Articles, send them back to the client
            let hbsObject;
            hbsObject = {
                articles: scrapedArticles
            };
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting all Articles from the db
// router.get("/articles", function (req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//         .then(function (dbArticle) {
//             // If we were able to successfully find Articles, send them back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/saved/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  //mongojs.ObjectId(req.params.id)
  db.Article.findOne({
    _id: req.params.id
  })
  // Specify that we want to populate the retrieved libraries with any associated books
  .populate("notes")
  .then(function(dbArticle) {
    // If any Libraries are found, send them to the client with any associated Books
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
router.post("/saved/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  //updating note with foreign key
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate(
      {_id: req.params.id}, 
      {note: dbNote._id})
  }).then(function(dbArticle)
 {
   res.json(dbArticle)
 })
 .catch(function(err){
   console.log(err);
 })
 });

 module.exports = router;