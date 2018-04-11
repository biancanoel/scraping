var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models/index.js");


module.exports = function (app) {


    //home page. should route to news.handlebar
    app.get('/', function (req, res) {

        db.Article.find({})
            .then(function (dbArticle) {
                var newsObj = {
                    news: dbArticle
                };
                //console.log(newsObj);

                res.render("news", newsObj);
            });
    });

    //View Saved Articles. routes to saved.handlebars
    app.get('/saved', function (req, res) {

        db.Article.find({saved: true})
            .then(function (dbArticle) {
                var newsObj = {
                    news: dbArticle
                };
                console.log(newsObj);

                res.render("saved", newsObj);
            });
    });

    //Scrape articles
    app.get('/scrape', function (req, res) {
        axios.get("https://www.independent.com/").then(function (response) {

            var $ = cheerio.load(response.data);

            $(".latest_news_story").each(function (i, element) {

                //Create object with title and link
                var result = {};
                result.headline = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
                result.subtitle = $(this).next().text().trim();
                //console.log(result.subtitle);


                //Add new object into MondoDb using Article model
                db.Article.create(result)
                    .then(function (dbArticle) {
                        //console.log(dbArticle);

                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send("scrape complete");
        });
    });

    //Get 1 specific article
    app.get('/articles/:id', function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate('note')
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err)
            });
    });

    //Create a new comment
    app.post('/articles/:id', function (req, res) {
        console.log(req.body);
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log(dbNote);
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
            })
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                console.log(err)
            });
    });

    //Save article to Saved Articles
    app.post('/update/:id', function (req, res) {
        console.log(req.body);
        var asBoo = JSON.parse(req.body.saved)
        //console.log(typeof asBoo);


        db.Article.update(
            {
                _id: req.params.id
            },
            {
                $set: {
                    saved: asBoo
                }
            },
            function (error, edited) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(edited)
                }
            }
        );
    });


    //Delete a comment
    app.delete("/delete/:id", function (req, res) {
        db.Note.remove({ _id: req.params.id }, function (err) {
            if (!err) {
                console.log("note was deleted. xo - the backend")
            } else {
                console.log("something went wrong deleting note, xo - the backend")
            };
        });
    });


};