$(document).ready(function(){    

    option = {
        editable: {
            add: false,
            updateTime: true,
            updateGroup: true,
            remove: true,     
            overrideItems: false
        },
        groupEditable: true,
        groupOrder: function (a, b) {
            return a.order - b.order;
        },
        groupOrderSwap: function (a, b, groups) {
            let v = a.order;
            a.order = b.order;
            b.order = v;
        },
        groupTemplate: function(group){
            let container = document.createElement('div');
            let label = document.createElement('span');
            label.innerHTML = group.content + ' ';
            container.insertAdjacentElement('afterBegin',label);
            // Cacher une ligne se fait via btnHide
            let btnHide = document.createElement('button');
            btnHide.innerHTML = '-';
            btnHide.title = "Cacher cette ligne.";
            btnHide.style.fontSize = 'small';
            btnHide.addEventListener('click', function () {
                hideGroup(group.id);
            });
            container.insertAdjacentElement('beforeEnd', btnHide);

            return container;
        },
        max : "2091-07-27",
        min : "1991-07-27",
        snap : null,
        template: function (item) {
            return '<p>'+ item.name + '</p>';
        },
        zoomMax: 31556952000000, //1000 ans
        zoomMin: 86400000         // 24 heures
    };
    
    // Se trouve dans timelinebasic.js
    finishSetup();

    // Affichage de l'aide
    $('#btnHelp').on('click', function(){
        $( "#modalHelp" ).dialog( "open" );     
    });
    
    $( "#modalHelp" ).dialog({
        autoOpen: false,
        buttons: {
        "Ok!": function() {
            $("#modalHelp").dialog( "close" );
            }
        },
        minHeight: 200,
        minWidth: 400
    });

})