$(document).ready(function() {

    // Assignation de listeners aux boutons
    $('#btnLogin').on('click', function(){
        window.location="login.php";
     }) 

     $('#btnSignup').on('click', function(){
        window.location="signup.php";
     }) 

     $('#btnMyAccount').on('click', function(){
        window.location="account.php";
     }) 
    
     $('h1').on('click', function(){
        window.location="index.php";
     });

     $("input").keyup(function(e){        
        if($(this).val())
        {
            loadTimeline($(this).val());
        }
        else {
            loadTimeline(""); 
        }
    });

     loadTimeline(""); 
});


function loadTimeline(query) {
    
    $.ajax({
        url: "indexajax.php",
        type: "POST",
        data: {
            "actionWanted" : "get-all-user-timeline",
            "query" : query
        }
    })
    .done(function (data) {

        let info = JSON.parse(data);

        // On enlève les anciens résultats
        $("#allTimeline button, #allTimeline p").detach();    
        if(info.code == "complete") {
            // Pour chaque timeline on crée un bouton qui nous permet d'aller éditer cette Timeline
            info.timeline.forEach(element => {
                if(element.description == null) {
                    $("#allTimeline").append("<button class='timeline' id='btnTimeline" + element.id + "'onclick='goToViewMode(" + element.id + ")'>" 
                                            + element.name + " <br><span></span></button>");
                }
                else {
                    $("#allTimeline").append("<button class='timeline' id='btnTimeline" + element.id + "'onclick='goToViewMode(" + element.id + ")'>" 
                                            + element.name + " <br><span> "+ element.description + "</span></button>");
                }
            });
        }
        else if(info.code == "nothing-found") {
            $("#allTimeline").append("<p>Aucun résultat</p>");            
        }

    }) 
    .fail(function (data) {
        console.log(data);
    })    
}

function goToViewMode(id) {
    let destination = "viewmode.php?id=" + id
    window.location.href = destination;
}