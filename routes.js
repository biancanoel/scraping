var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models/index.js");

module.exports = function (app) {
    //home page. should route to news.handlebars with no info
    app.get('/', function (req, res){

        db.Article.find({})
        .then(function(dbArticle){
            var newsObj = {
                news: dbArticle
            };
            console.log(newsObj);
        
            res.render("news", newsObj);
        });
        

  
    })


    //Scrape articles
    app.get('/scrape', function (req, res) {
        axios.get("https://www.independent.com/").then(function(response) {
            
            var $ = cheerio.load(response.data);

            $(".latest_news_story").each(function(i,element){
               
                //Create object with title and link
                var result = {};
                result.headline = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                //Add new object into MondoDb using Article model
                db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                    
                })
                .catch(function(err){
                    console.log(err)
                });
            });
           
            res.send("scrape complete");
        });
    });
};