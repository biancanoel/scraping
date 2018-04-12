var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models/index.js");
var weather = require('weather-js');


module.exports = function (app) {


    //home page. should route to news.handlebar
    app.get('/', function (req, res) {
        weather.find({ search: 'Santa Barbara, CA', degreeType: 'F' }, function (err, result) {
            if (err) console.log(err);
            // results from weather: console.log(JSON.stringify(result, null, 2));
            db.Article.find({})
            .then(function (dbArticle) {
                var newsObj = {
                    news: dbArticle,
                    temperature: result[0].current.temperature,
                    date: result[0].current.date,
                    feelslike: result[0].current.feelslike,
                    sky: result[0].current.skytext
                };
                res.render("news", newsObj);
                //console.log(newsObj);
            });
        });
    });

    //View Saved Articles. routes to saved.handlebars
    app.get('/saved', function (req, res) {
        weather.find({ search: 'Santa Barbara, CA', degreeType: 'F' }, function (err, result) {
            if (err) console.log(err);
            // results from weather: console.log(JSON.stringify(result, null, 2));
            db.Article.find({saved:true})
            .populate('note')
            .then(function (dbArticle) {
                var newsObj = {
                    news: dbArticle,
                    temperature: result[0].current.temperature,
                    date: result[0].current.date,
                    feelslike: result[0].current.feelslike,
                    sky: result[0].current.skytext
                };
                res.render("saved", newsObj);
                console.log(newsObj);
            });
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
                //need to add https://www.independent.com before each link
                //console.log(result.link);


                //Add new object into MondoDb using Article model
                db.Article.create(result)
                    .then(function (dbArticle) {
                        //console.log(dbArticle);

                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send('scrape complete');
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
                
                //res.json(dbArticle);
                res.send("comment added");
                
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
    app.delete("/delete/:id/:articleid", function (req, res) {
        console.log(`req.params.NOTE id for delete is ${req.params.id}`)
        console.log(`req.params.articleid for delete is ${req.params.articleid}`)
        db.Note.remove({ _id: req.params.id }, function (err) {
            if (!err) {
                console.log("note was deleted. xo - the backend");
                console.log(req.params.articleid);
                return db.Article.update({_id: req.params.articleid}, {$unset: {note: ""}})

                //this query works in mongo to delete the note from the article collection
                //db.getCollection('articles').update({"_id": ObjectId('5aceac175857b21289cbafed')}, {$unset: {note: ""}});
                
            } else {
                console.log("something went wrong deleting note, xo - the backend")
            };
            res.send("deleted");
        });
    });


};