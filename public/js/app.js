$("#get-news").on("click", function (event) {
    console.log('clicked get news button')
    $.ajax({
        method: "GET",
        url: "/scrape"
    });
});

//When Comment button is clicked, generate note and allow user to leave/update note
$(".leave-comment").on("click", function(){
    $(".article-title").empty();
    $("#comment-title").empty();
    $("#comment-body").empty();
  
    var id = $(this).attr("data-id");
    $(".submit-comment").attr("data-id", id);

    $.ajax({
        method: "GET",
        url: "/articles/"+id
    })
    .then(function(data){
        console.log("this is what we get back "+JSON.stringify(data));
        $(".article-title").text(data.headline);
        $(".save-comment").attr("data-id", data._id);
      
        if(data.note) {
            $("#comment-title").val(data.note.title);
            $("#comment-body").val(data.note.body);
            $(".delete-comment").attr("data-id", data.note._id)
        } 
    })

});

//After user enters note and clicks submit, add that note to db
$(document).on('click', ".save-comment", function (){
    var id = $(this).attr("data-id");
    // console.log(`the id for this article is ${id}`)
    // console.log($("#comment-title").val());
    // console.log($("#comment-body").val());

    $.ajax({
        method: "POST", 
        url: "/articles/"+id,
        data: {
            title: $("#comment-title").val(),
            body: $("#comment-body").val()
        }
    })
    .then(function(data){
        console.log(data);
    });
});

//Delete note 
$(document).on("click", ".delete-comment", function(){
    var id = $(this).attr("data-id");
    console.log("id of note to be deleted is "+id);

    $.ajax({
        method: "DELETE", 
        url: "/delete/"+id
    })
    .then(function(data){
        console.log('note has been deleted');
    });
});