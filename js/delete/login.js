$(document).ready(function() {
    
    // On vérifie d'abord que le browser supporte localStorage
    if (typeof(Storage) !== "undefined") {
        // Puis, on rempli le champ username avec ce qui est "localstoré"
        $("#email").val(localStorage.getItem("email"));
    }

    // Assignation de listeners aux boutons
    $('#btnLogin').on('click', login); 

    $('#btnSignUp').on('click', function(){
        window.location = "signup.php";
    }) 
   

    $("#password").keydown(function (e) {
        if (e.keyCode == 13) {
            login();
        }
    });
    
    $('h1').on('click', function(){
        window.location="index.php";
     });
});
function checkData() {
    
    let valid = true;
    
    if($("#password").val() == "" || $("#email").val() == "") {
        $("#msgForUser").html("Les deux champs doivent êtres remplis.");
        valid = false;
    }
    
    return valid;
}

function  login() {
    $("#msgForUser").html("");

    // Si les données entrées par l'usager sont valides, alors on fait le call AJAX
    if(checkData()) {
        $.ajax({
            url: "loginajax.php",
            type: "POST",
            data: {
                "actionWanted" : "login",
                "email" : $("#email").val(),
                "password" : $("#password").val()
            }
        })
        .done(function (data) {

            if(data == "success") {
                // On garde le courriel de l'usager dans son localStorage pour faciliter la prochaine connexion
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("email", $("#email").val());
                }
                // Puis, on envoie vers la page account
                window.location="account.php";
            }
            else if(data == "invalid-email") {
                $("#msgForUser").html("Adresse courriel non valide.");
            }
            else if(data == "no-match") {
                $("#msgForUser").html("Votre adresse courriel ne concorde pas avec votre mot de passe.");
            }
            else {
                // Peut-être un probleme de BD si on ne reconnait pas le message...
                $("#msgForUser").html("Votre adresse courriel ne concorde pas avec votre mot de passe. Contactez-nous pour du support.");
            }
            
        }) 
        .fail(function (data) {
            console.log("FAIL.");
        })  
    }
}


    