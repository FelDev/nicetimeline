$(document).ready(function() {

    loadTimeline(""); 
    loadUserInfo();

    // Assignation de listeners aux boutons
    $('#subHeader div:first-of-type').on('click', function(){
        // Information sur le compte
        $("#allTimeline").css("display", "none");
        $("#accountInfo").css("display", "grid");
        $("#subHeader div:first-of-type").css("border-bottom", "none");
        $("#subHeader div:nth-of-type(2)").css("border-bottom", "2px solid black");
        $("main").css("background-color", 'rgb(254, 255, 234)');
        
     }) 
     $('#subHeader div:nth-of-type(2)').on('click', function(){
        // Toutes vos timelines
        $("#accountInfo").css("display", "none");
        $("#allTimeline").css("display", "grid");
        $("#subHeader div:first-of-type").css("border-bottom", "2px solid black");
        $("#subHeader div:nth-of-type(2)").css("border-bottom", "none");
        $("main").css("background-color", "rgb(209, 255, 255)");
     }) 
    
     $('#btnNewTimeline').on('click', function(){
        $('#newEventTitle').val("");
        $('#datePickerStart').val("");
        $('#datePickerEnd').val("");
        $( "#modalNewTimeline" ).dialog( "open" );
    });

    $('h1').on('click', function(){
        window.location="index.php";
     });
    

     $("#modalDeleteTimeline").dialog({
        autoOpen: false,
        buttons: {
            "Supprimer définitivement ma timeline": function() {
                deleteTimeline2($(this).data('id')); 
                $(this).dialog( "close" );
            },
            "Annuler": function() {
                
                $(this).dialog( "close" );
            }
        },
        minHeight: 200,  
        minWidth: 500  
    });

    $("#timelineSearch").keyup(function(e){        
        if($(this).val())
        {
            loadTimeline($(this).val());
        }
        else {
            loadTimeline(""); 
        }
    });
    
});

function deleteTimeline1(idTimeline) {
    $("#modalDeleteTimeline p").html("Votre timeline \"" + $("#btnTimeline" 
                                    + idTimeline).contents().not($("#btnTimeline" + idTimeline).children()).text()
                                    + "\" sera supprimer de façon définitive. <br><br> Continuer?");
    $( "#modalDeleteTimeline" ).data('id', idTimeline)
                                .dialog( "open" );  
}

function deleteTimeline2(idTimeline) {
    
    $.ajax({
        url: "accountajax.php",
        type: "POST",
        data: {
            "actionWanted" : "delete-timeline",
            "idTimeline" : idTimeline 
        }
    })
    .done(function (data) {
        console.log(data);
        $("#btnTimeline" + idTimeline).remove();
        $("#btnDel" + idTimeline).remove();
    }) 
    .fail(function (data) {
        console.log("FAIL.");
        console.log(data);
    })    
}


function goToEditMode(idTimeline) {
    // J'aime pas trop la facon que tout ceci fonctionne, un AJAX call pour rediriger tsé... #DEVTEMP, metons
    $.ajax({
        url: "accountajax.php",
        type: "POST",
        data: {
            "actionWanted" : "go-to-edit-mode",
            "idTimeline" : idTimeline 
        }
    })
    .done(function (data) {
        window.location.href = 'editmode.php'

    }) 
    .fail(function (data) {
        console.log("FAIL.");
        console.log(data);
    })    
}


function loadTimeline(query) {
    
    $.ajax({
        url: "accountajax.php",
        type: "POST",
        data: {
            "actionWanted" : "get-user-timeline",
            "query" : query
        }
    })
    .done(function (data) {
        
        let info = JSON.parse(data);

        $("#allTimeline button, #allTimeline p").detach();  
        if(info.code == "complete") {
            // Pour chaque timeline on crée un bouton qui nous permet d'aller éditer cette Timeline
            info.timeline.forEach(element => {
                if(element.description == null) {
                    $("#allTimeline").append("<button class='timeline' id='btnTimeline" + element.id + "'onclick='goToEditMode(" + element.id + ")'>" 
                                            + element.name + " <br><span></span></button>");
                }
                else {
                    $("#allTimeline").append("<button class='timeline' id='btnTimeline" + element.id + "'onclick='goToEditMode(" + element.id + ")'>" 
                                            + element.name + " <br><span> "+ element.description + "</span></button>");
                }
                $("#allTimeline").append("<button class='timelineDeleteButton' id='btnDel" + element.id + "' onclick='deleteTimeline1(" + element.id 
                                        + ")'> Supprimer </button>");
            });
        }
        else if(info.code == "nothing-found") {
            if(query == "") {
                $("#allTimeline").append("<p>↑ Créez une timeline! ↑</p>");
            }
            else {
                $("#allTimeline").append("<p>Aucun Résultat</p>");
            }
        }

    }) 
    .fail(function (data) {
        console.log(data);
    })    
}


function loadUserInfo() {

    $.ajax({
        url: "accountajax.php",
        type: "POST",
        data: {
            "actionWanted" : "get-user-info"
        }
    })
    .done(function (data) {

        let info = JSON.parse(data);

        if(info.code == "complete") {
            $("header h2").html("Votre compte, " + info.username);
            $("#pLastName").html(info.lastname);
            $("#pFirstName").html(info.firstname);
            $("#pEmail").html(info.email);
            $("#pPublicName").html(info.username);
        }
        else{
            alert("On a un probleme... Dites au dev que \n " + data);
        }

    }) 
    .fail(function (data) {
        console.log(data);
    })    
}