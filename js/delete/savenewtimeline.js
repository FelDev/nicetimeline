$(document).ready(function() {

    // Attribution des datepicker...
    $( "#newTimelineDatePickerStart, #newTimelineDatePickerEnd" ).datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+10"
      });


    $("#modalNewTimeline").dialog({
        autoOpen: false,
        buttons: {
            "Créer la timeline!": function() {
                
                let name = $("#newTimelineName").val();
                let description = $("#newTimelineDescription").val();
                let startDate = $("#newTimelineDatePickerStart").val();
                let endDate = $("#newTimelineDatePickerEnd").val();

                // Vérification des dates...
                if(endDate < startDate) {
                    $("#modalNewTimeline p:last-of-type").html("La date de fin doit être après la date de début!");
                }
                // Vérification du titre...
                else if(name == ""){
                    $("#modalNewTimeline p:last-of-type").html("La timeline doit avoir un titre!");
                }    
                // On crée une Timeline dans la BD via AJAX avant de rediriger vers la page d'édition qui contiendra la nouvelle timeline
                else {
                    saveNewTimeline(name, startDate, endDate, description);
                    $(this).dialog( "close" );              
                }
                    
            },
            "Annuler": function() {
                $(this).dialog( "close" );
            }
        },
        minHeight: 200,  
        minWidth: 800  
    });
})


function saveNewTimeline(name, startDate, endDate, description) {
    
    $.ajax({
        url: "accountajax.php",
        type: "POST",
        data: {
            "actionWanted" : "save-new-timeline",
            "name" : name,
            "startDate" : startDate,
            "endDate" : endDate,
            "description" : description
        }
    })
    .done(function (data) {

        let info = JSON.parse(data);
                    
        if(info == "complete") {
            window.location.href = "editmode.php";
        }
        else{
            alert("C'est très bizarre... \n La sauvegarde dans notre base de données n'a pas fonctionné." +
            "Contactez nous si le problème persiste.")
        }

    }) 
    .fail(function (data) {
        console.log(data);
    })    
}