$("#get-news").on("click", function (event) {
    console.log('clicked get news button')
    $.ajax({
        method: "GET",
        url: "/scrape"
    });
});