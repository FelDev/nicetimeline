// $(document).ready(function() {

//     // Assignation de listeners aux boutons
//     $('#btnCreateAccount').on('click', function(){
//         saveUser();
//     }) 

//     $('#btnLogin').on('click', function(){
//         window.location = "login.php";
//     }) 

//     $("#passwordConf").keydown(function (e) {
//         if (e.keyCode == 13) {
//             saveUser();
//         }
//     });

//     $('h1').on('click', function(){
//         window.location = "index.php";
//      });

// });

// function checkData() {

//     let valid = true;
    
//     if ($("#email").val().replace(/^\s+|\s+$/g, "").length == 0 ||
//     $("#lastName").val().replace(/^\s+|\s+$/g, "").length == 0 ||
//     $("#firstName").val().replace(/^\s+|\s+$/g, "").length == 0 ||
//     $("#publicName").val().replace(/^\s+|\s+$/g, "").length == 0 ||
//     $("#password").val().replace(/^\s+|\s+$/g, "").length == 0 ||
//     $("#passwordConf").val().replace(/^\s+|\s+$/g, "").length == 0 ){
//         $("#msgForUser").html("Vous devez remplir tout les champs.");
//         valid = false;            
//     }        
//     else if($("#password").val() != $("#passwordConf").val()) {
//         $("#msgForUser").html("Vos mots de passes ne concordent pas.");
//         valid = false;
//     }

//     return valid;
// }

// function  saveUser() {
    
//     $("#msgForUser").html("");

//     let email = $("#email").val();

//     // Si les données entrées par l'usager sont valides, alors on fait le call AJAX
//     if(checkData()) {
//         $.ajax({
//             url: "signupajax.php",
//             type: "POST",
//             data: {
//                 "actionWanted" : "save-user",
//                 "email" : email,
//                 "firstName" : $("#firstName").val(),
//                 "lastName" : $("#lastName").val(),
//                 "publicName" : $("#publicName").val(),
//                 "password" : $("#password").val()
//             }
//         })
//         .done(function (data) {
//             if(data == "complete") {
//                 // Succès! On envoie vers la page de login
//                 window.location="login.php";
//             }
//             else if(data == "invalid-email") {
//                 $("#msgForUser").html("Adresse courriel non valide.");
//             }
//             else if(data == "email-already-exists") {
//                 $("#msgForUser").html("Il y a deja un compte associé a cette adresse courriel.");
//             }
//             else if(data == "publicName-already-exists") {
//                 $("#msgForUser").html("Il y a deja un nom public qui porte ce nom.");
//             }
//             else if(data == "no-request") {
//                 console.log(data);
//             }
//         }) 
//         .fail(function (data) {
//             console.log(data);
//         })  
//     }
// }

    
