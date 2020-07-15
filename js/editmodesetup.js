let idTimeline;
let lineCount = 0; //lineCount utilisé pour la propriété order des timelines

$(document).ready(function () {

    let editedItemID = null;

    option = {
        horizontalScroll: true,
        zoomKey: "ctrlKey",
        zoomFriction: 33,
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
        groupTemplate: function (group) {
            let container = document.createElement('div');
            let label = document.createElement('span');
            label.innerHTML = group.content + ' ';
            container.insertAdjacentElement('afterBegin', label);
            // Cacher une ligne se fait via btnHide
            let btnHide = document.createElement('button');
            btnHide.innerHTML = 'Hide';
            btnHide.title = "Hide this line";
            btnHide.style.fontSize = 'small';
            btnHide.addEventListener('click', function () {
                hideGroup(group.id);
            });
            container.insertAdjacentElement('beforeEnd', btnHide);
            // Suppression d'une ligne se fait via btnEdit
            let btnEdit = document.createElement('button');
            btnEdit.innerHTML = 'Edit';
            btnEdit.title = "Modify or delete this line";
            btnEdit.style.fontSize = 'small';
            btnEdit.addEventListener('click', function () {
                $("#modalEditLine").data('groupID', group.id)
                    .data('order', group.order)
                    .dialog("open");
            });
            container.insertAdjacentElement('beforeEnd', btnEdit);
            // Ajout d'événements se fait via btnAddEvent
            let btnAddEvent = document.createElement('button');
            btnAddEvent.innerHTML = '+';
            btnAddEvent.title = "Add an event";
            btnAddEvent.style.fontSize = 'small';
            btnAddEvent.addEventListener('click', function () {
                $('#newEventTitle').val("");
                $('#datePickerStart').val("");
                $('#datePickerEnd').val("");
                $('#newEventDesc').val("");
                $("#modalAddEvent").data('groupID', group.id).dialog("open");
            });
            container.insertAdjacentElement('beforeEnd', btnAddEvent);
            return container;
        },
        max: "3000-01-01",
        min: "1000-01-01",
        snap: null,
        template: function (item) {
            return '<p>'+ item.name + '</p>';
        },
        zoomMax: 31556952000000, //1000 ans
        zoomMin: 86400000         // 24 heures
    };

    // Se trouve dans timelinebasic.js
    finishSetup();

    // Gestion des clics sur les périodes/événements
    // Permet de modifier les infos de ceux-ci
    timeline.on('contextmenu', function (properties) {
        editedItemID = properties.item;
        if (editedItemID == null) {
            // On crée un nouvel événement à partir d'ici
            $('#newEventTitle').val("");
            $('#datePickerStart').val(makeValid(properties.snappedTime));
            $('#datePickerEnd').val("");
            $('#newEventDesc').val("");
            $("#modalAddEvent").data('groupID', properties.group).dialog("open");
        }
        else {
            let itemEdited = item.get(editedItemID);

            if (isValidDate(itemEdited.start)) {
                $("#editedEventDatePickerStart").val(itemEdited.start);
                $("#editedEventDatePickerEnd").val(itemEdited.end);
            }
            else {
                let start = makeValid(new Date(itemEdited.start));
                let end = makeValid(new Date(itemEdited.end));
                $("#editedEventDatePickerStart").val(start);
                $("#editedEventDatePickerEnd").val(end);
            }
            $("#editedEventTitle").val(itemEdited.name);
            $("#editedEventDescription").val(itemEdited.description);
            $("#editedEventColor").val(itemEdited.className);
            $("#modalEditEvent").dialog("open");
        }
    });


    // #RENDU ICI comment détecter les changements sur la timeline?
    timeline.on('groupDragged', function () {
        console.log("groupDragged");
    })

    let datePickersIDs = [
        'datePickerStart',
        'datePickerEnd',
        "editedEventDatePickerStart", 
        "editedEventDatePickerEnd",
        "datePickerTimelineStart", 
        "datePickerTimelineEnd"
    ]

    datePickersIDs.forEach(dpID => {
        new Pikaday({ 
            field: document.getElementById(dpID),
            format: "YYYY-MM-DD",
            yearRange: 100, // #TODO: should be set to [timeline's start date, timeline's end date]
            theme: "dark-theme"

        });
    })

    // Gestion de l'ajout de nouvelles périodes et événements
    // (appelé par btnAddEvent, présent sur chaque ligne, ou context-click sur la timeline)
    $("#modalAddEvent").dialog({
        autoOpen: false,
        buttons: {
            "Yes": function () {
                let title = $("#newEventTitle").val();
                let groupID = $("#modalAddEvent").data("groupID");
                let startDate = $("#datePickerStart").val();
                let endDate = $("#datePickerEnd").val();
                let desc = $("#newEventDesc").val();
                let color = $("#newEventColor").val();
                // console.log("color: "+color)
                if (isValidDate(startDate)) {
                    if (endDate == "") {
                        item.add({ id: itemIDCount, name: title, start: startDate, end: null, group: groupID, type: "point", description: desc, 'className': color });
                        itemIDCount++;
                        changesSaved = false;
                        $(this).dialog("close");
                    }
                    else if (isValidDate(endDate)) {
                        if ($("#datePickerStart").val() > $("#datePickerEnd").val()) {
                            $("#modalAddEvent p:last-of-type").html("Start date cannot be before end date!");
                        }
                        else {
                            item.add({ id: itemIDCount, name: title, start: startDate, end: endDate, group: groupID, description: desc, 'className': color });
                            itemIDCount++;
                            changesSaved = false;
                            $(this).dialog("close");
                        }
                    }
                    else {
                        $("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
                    }
                }
                else {
                    $("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
                }

            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            $("#modalAddEvent p:last-of-type").html("");
        },
        minHeight: 200,
        minWidth: 600
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

    // Gestion de l'ajout de nouvelles ligne via le bouton #btnAddLine    
    $('#btnAddLine').on('click', function () {
        $('#lineName').val("");
        $("#modalAddLine p:last-of-type").html("");
        $("#modalAddLine").dialog("open");
    });
    $("#modalAddLine").dialog({
        autoOpen: false,
        buttons: {
            "Add a line": function () {
                let lineName = $('#lineName').val();
                // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
                if (lineName == "") {
                    $("#modalAddLine p:last-of-type").html("Your new line must have a name!");
                }
                else if (lineName.length > 20) {
                    $("#modalAddLine p:last-of-type").html("The line's name must be 20 characters or less.");
                }
                else {
                    try {
                        group.add({ id: lineName, content: lineName, order: lineCount });
                        lineCount++;
                        changesSaved = false;
                        $("#modalAddLine").dialog("close");
                    }
                    catch (err) {
                        // Si la nouvelle ligne a le même nom qu'une ligne déjà existante, on avertit l'usager
                        $("#modalAddLine p:last-of-type").html("Impossible! There already is a line with name"
                            + "\"" + lineName + "\"");
                    }
                }
            },
            "Cancel": function () {
                $("#modalAddLine").dialog("close");
            }
        },
        minHeight: 200,
        minWidth: 400
    });

    // Changement de la date de fin de la timeline    
    $('.dateIndicator:nth-of-type(2)')
    .on('click', function () {
        $("#modalChangeEndDate").dialog("open");
    })
    .on('keypress', function(e) {
        if(e.keyCode == 13) {
            $("#modalChangeEndDate").dialog("open");
        }
    });
    $("#modalChangeEndDate").dialog({
        autoOpen: false,
        buttons: {
            "Update": function () {
                let newEndDate = $("#datePickerTimelineEnd").val();
                // Vérification des dates...                        
                if ($(".dateIndicator:nth-of-type(1)").html() > newEndDate) {
                    $("#modalChangeEndDate p:last-of-type").html("Start date cannot be before end date!");
                }
                else {
                    $('.dateIndicator:nth-of-type(2)').html(newEndDate);
                    // Mise à jour des options de la timeline, puis on la redessine
                    option.max = newEndDate;
                    timeline.setOptions(option);
                    timeline.setWindow(timeline.startDate, newEndDate, { animation: { duration: 500, easingFunction: 'linear' } });
                    changesSaved = false;
                    $("#modalChangeEndDate").dialog("close");
                }

            },
            "Cancel": function () {
                $("#modalChangeEndDate").dialog("close");
            }
        },
        close: function () {
            $("#modalChangeEndDate p:last-of-type").html("");
        },
        minHeight: 200,
        minWidth: 200,
        position: { my: "center", at: "center", of: ".dateIndicator:nth-of-type(2)" }
    });

    // Changement de la date de début de la timeline    
    $('.dateIndicator:nth-of-type(1)').on('click', function () {
        $("#modalChangeStartDate").dialog("open");
    })
    .on('keypress', function(e) {
        if(e.keyCode == 13) {
            $("#modalChangeStartDate").dialog("open");
        }
    });
    $("#modalChangeStartDate").dialog({
        autoOpen: false,
        buttons: {
            "Update": function () {
                let newStartDate = $("#datePickerTimelineStart").val();
                // Vérification des dates...
                if (newStartDate > $(".dateIndicator:nth-of-type(2)").html()) {
                    $("#modalChangeStartDate p:last-of-type").html("Start date cannot be before end date!");
                }
                else {
                    $(".dateIndicator:nth-of-type(1)").html(newStartDate);
                    // Mise à jour des options de la timeline, puis on la redessine
                    option.min = newStartDate;
                    timeline.setOptions(option);
                    timeline.setWindow(newStartDate, timeline.endDate, { animation: { duration: 500, easingFunction: 'linear' } });
                    changesSaved = false;
                    $("#modalChangeStartDate").dialog("close");
                }

            },
            "Cancel": function () {
                $("#modalChangeStartDate").dialog("close");
            }
        },
        close: function () {
            $("#modalChangeStartDate p:last-of-type").html("");
        },
        minHeight: 200,
        minWidth: 200,
        position: { my: "center", at: "center", of: ".dateIndicator:nth-of-type(1)" }
    });

    $("#modalEditEvent").dialog({
        autoOpen: false,
        buttons: {
            "Update": function () {
                let title = $("#editedEventTitle").val();
                let startDate = $("#editedEventDatePickerStart").val();
                let endDate = $("#editedEventDatePickerEnd").val();
                let color = $("#editedEventColor").val();

                if (isValidDate(startDate)) {
                    if (endDate == "") {
                        // Mise à jour de l'item concerné (accès à celui-ci via son ID)
                        item.update({
                            id: editedItemID,
                            type: "point",
                            name: title,
                            description: $("#editedEventDescription").val(),
                            "className": color,
                            start: startDate,
                            end: null
                        });

                        editedItemID = null;
                        changesSaved = false;
                        $(this).dialog("close");
                    }
                    else if (isValidDate(endDate)) {
                        if (startDate > endDate) {
                            $("#modalEditEvent p:last-of-type").html("Start date cannot be before end date!");
                        }
                        else {
                            item.update({
                                id: editedItemID,
                                type: "range",
                                name: title,
                                description: $("#editedEventDescription").val(),
                                "className": color,
                                start: startDate,
                                end: endDate
                            });

                            editedItemID = null;
                            changesSaved = false;
                            $(this).dialog("close");
                        }
                    }
                    else {
                        $("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
                    }
                }
                else {
                    $("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
                }
                timeline.redraw();

            },
            "Cancel": function () {
                $("#modalEditEvent").dialog("close");
            }
        },
        close: function () {
            $("#modalEditEvent p:last-of-type").html("");
        },
        minHeight: 200,
        minWidth: 400
    });

    $("#modalEditLine").dialog({
        autoOpen: false,
        buttons: {
            "Update": function () {
                // Vérification des dates...
                let oldLineName = $("#modalEditLine").data("groupID");
                let newLineName = $('#newLineName').val();

                // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
                if (newLineName == "") {
                    $("#modalEditLine p:last-of-type").html("Your new line must have a name!");
                }
                else if (newLineName.length > 20) {
                    $("#modalEditLine p:last-of-type").html("The line's name must be 20 characters or less.");
                }
                else {
                    group.forEach(element => {
                        if (element.id == oldLineName) {

                            group.update({ id: element.id, content: newLineName });
                            element.id = newLineName;
                            element.content = newLineName;
                        }
                    });
                    changesSaved = false;
                    $(this).dialog("close");
                }
            },
            "Delete this line": function () {
                $("#modalEditLine").dialog("close");
                $("#modalRemoveLine").data('groupID', $("#modalEditLine").data("groupID"))
                    .data('order', $("#modalEditLine").data("order"))
                    .dialog("open");
            },
            "Cancel": function () {
                $("#modalEditLine").dialog("close");
            }
        },
        close: function () {
            $("#modalEditLine p:last-of-type").html("");
        },
        minHeight: 200,
        minWidth: 400
    });

    // Affichage de l'aide
    $('#btnHelp').on('click', function () {
        $("#modalHelp").dialog("open");
    });
    var winH = $(window).height();

    $("#modalHelp").dialog({
        autoOpen: false,
        buttons: {
            "Ok!": function () {
                $("#modalHelp").dialog("close");
            }
        },
        minHeight: 200,
        minWidth: 666,
        width: '90vw',
        height: winH,
        open: function () {
            $(this).scrollTop(0);
        }
    });

    $("#modalInfoItem").dialog({
        autoOpen: false,
        buttons: {
            "Close": function () {
                $(this).dialog("close");
            }
        },
        open: function (event, ui) {
            $('.ui-widget-overlay').bind('click', function (event, ui) {
                $("#modalInfoItem").dialog('close');
            });
        },
        minHeight: 200,
        minWidth: 400
    });

    // Sert à afficher des messages de confirmation à l'usager (ex: "Timeline bien sauvegardé")
    $("#modalQuickAlert").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 500
        },
        hide: {
            effect: "blind",
            duration: 500
        }
    });

    // Gestion de la suppression d'une ligne 
    // (appelé par #modalEditLine, lui meme appelé par btnEdit, présent sur chaque ligne)
    $("#modalRemoveLine").dialog({
        autoOpen: false,
        buttons: {
            "Yes": function () {
                group.remove({ id: $("#modalRemoveLine").data("groupID") });
                // Il faut updater l'ordre des lignes qui sont après celle qu'on supprime
                group.forEach(element => {
                    if (element.order >= $("#modalRemoveLine").data("order")) {
                        group.update({ id: element.id, order: element.order - 1 });
                    }
                });
                lineCount--;
                changesSaved = false;
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        minHeight: 200,
        minWidth: 400
    });
})
