var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  // Load Home page
  app.get("/", (req, res)=>{
    // look for existing articles in database
    db.Headline.find({saved: false})
    .sort({timestamp: -1})
    .then((dbHeadline)=>{
        if (dbHeadline.length == 0) {
            // if no articles found, render index
            res.render("home");
        }
        else {
            // if there are existing articles, show articles
            res.redirect("/headlines");
        }
    })
    .catch((err)=>{
        res.json(err);
    });
});

  // saved headline page
  app.get("/saved", (req, res)=>{
    db.Headline.find({saved: true}).sort({timestamp: -1})
    .then((dbHeadline)=>{
        let headlineObj = {headline: dbHeadline};

        // render page with articles found
        res.render('saved', headlineObj);
    })
    .catch((err)=>{
        res.json(err);
    });
});

  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.reuters.com/news/archive/technologyNews").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // console.log(response.data);

      // Now, we grab every class within an article tag, and do the following:
      $(".story-content").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        var headlineRaw = $(this).children("a").text().trim();
        var url = "https://www.reuters.com/news/archive/technologyNews" + $(this).children("a").attr("href");
        var summaryRaw = $(this).children("p").text().trim();

        var headline = headlineRaw.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var summary = summaryRaw.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        result.headline = headline;
        result.url = url;
        result.summary = summary;

        // console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.Headline.create(result)
          .then(function (dbHeadline) {
            // View the added result in the console
            // console.log(dbHeadline);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.redirect("/headlines");
    });
  });

  // show articles after scraping
  app.get("/headlines", (req, res) => {
    db.Headline.find({saved: false})
      .sort({ timestamp: -1 })
      .then((dbHeadline) => {
        let headlineObj = { headline: dbHeadline };

        // render page with articles found
        res.render('home', headlineObj);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // save article
  app.put("/headline/:id", (req, res) => {
    let id = req.params.id;

    db.Headline.findByIdAndUpdate(id, {$set:{saved: true}})
      .then((dbHeadline) => {
        console.log("updated");
        // console.log(dbHeadline);
        res.json(dbHeadline);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  });

  // remove article from page 'saved'
  app.put("/headline/remove/:id", (req, res) => {
    let id = req.params.id;

    db.Headline.findByIdAndUpdate(id, { $set: { saved: false } })
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // get current comments
  app.get("/headline/:id", (req, res) => {
    let id = req.params.id;

    // cannot get notes associated with article, only the very first one
    db.Headline.findById(id)
      .populate("comment")
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // save new comment
  app.post("/comment/:id", (req, res) => {
    let id = req.params.id;

    db.Comment.create(req.body)
      .then((dbComment) => {
        return db.Headline.findOneAndUpdate({
          _id: id
        }, {
            $push: {
              comment: dbComment._id
            }
          }, {
            new: true, upsert: true
          });
      })
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // delete comment
  app.delete("/comment/:id", (req, res) => {
    let id = req.params.id;

    db.Comment.remove({ _id: id })
      .then((dbComment) => {
        res.json({ message: "comment removed!" });
      })
      .catch((err) => {
        res.json(err);
      });
  });

};