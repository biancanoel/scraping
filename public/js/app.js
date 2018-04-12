$("#get-news").on("click", function (event) {
    console.log('clicked get news button')
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data){
        location.reload();
    })
});

//Go to saved articles page
$(".view-saved").on("click", function (){
    console.log("saved has been clicked");
    $.ajax({
        method:"GET", 
        url:"/saved"
    });
});

//Go to home page
$(".home").on("click", function (){
    console.log("homed has been clicked");
    $.ajax({
        method:"GET", 
        url:"/"
    });
});

//When Comment button is clicked, generate note and allow user to leave/update note
$(".leave-comment").on("click", function(){
    //gets id of article
    var id = $(this).attr("data-id");
    $(".submit-comment").attr("data-id", id);


    $.ajax({
        method: "GET",
        url: "/articles/"+id
    })
    .then(function(data){
        console.log("this is what we get back "+JSON.stringify(data));
        event.preventDefault()
        $('#myModal').modal()
        $(".article-title").text(data.headline);
        $(".save-comment").attr("data-id", data._id); 
      
        if(data.note) {
            $("#comment-title").val(data.note.title);
            $("#comment-body").val(data.note.body);
            $(".delete-comment").attr("data-id", data.note._id);
            $(".delete-comment").attr("article-id", id);

        }  else {
            $("#comment-title").empty();
            $("#comment-body").empty();
        }
    })

});

//Click to save an article to Saved Articles
$(".save-article").on("click", function (){
    var id = $(this).attr("data-id");
    var isSaved = $(this).attr("data-saved");

    if (isSaved) {
        isSaved = false
    };
    $.ajax({
        method: "POST",
        url: "/update/"+id,
        data: {
            saved: true
        }
        
    }).then(function(data){
        event.preventDefault();
        $('#myModal2').modal();
        $(".save-article[data-id="+id+"]").html("Article Already Saved").attr("class", "btn btn-dark");

        
        
    })
})

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
        $('#myModal').modal('hide');
        $(".leave-comment[data-id="+id+"]").html("Comment");
        console.log(data);


        
    });
});

//Delete note 
$(document).on("click", ".delete-comment", function(){
    event.preventDefault()
    var id = $(this).attr("data-id");
    var articleid= $(".delete-comment").attr("article-id");
    console.log("id of note to be deleted is "+id);
    console.log("id of article to be deleted is "+articleid);

    $.ajax({
        method: "DELETE", 
        url: "/delete/"+id+"/"+articleid,
        data: articleid,
    })
    .then(function(data){
        console.log(data);

        $(".article-title").text("");
        $("#comment-title").text("");
        $("#comment-body").text("");

        //$(".leave-comment[data-id="+id+"]").html("Comment");
    });

  
});

$(document).on("click", ".close-modal", function (){
    $('#myModal').modal('hide');
})

