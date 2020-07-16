let idTimeline;
let lineCount = 0; //lineCount utilisé pour la propriété order des timelines
let lineBeingEdited = {};

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
                showModal("modalEditLine", "EditLine", {
                    groupID: group.id,
                    groupOrder: group.order
                })
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
                lineBeingEdited.id = group.id;
                showModal("modalAddEvent");
            });
            container.insertAdjacentElement('beforeEnd', btnAddEvent);
            return container;
        },
        max: "3000-01-01",
        min: "1000-01-01",
        snap: null,
        template: function (item) {
            return '<p>' + item.name + '</p>';
        },
        zoomMax: 31556952000000, //1000 ans
        zoomMin: 86400000 // 24 heures
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
            lineBeingEdited.id = properties.group;
            showModal("modalAddEvent");
        } else {
            let itemEdited = item.get(editedItemID);

            if (isValidDate(itemEdited.start)) {
                $("#editedEventDatePickerStart").val(itemEdited.start);
                $("#editedEventDatePickerEnd").val(itemEdited.end);
            } else {
                let start = makeValid(new Date(itemEdited.start));
                let end = makeValid(new Date(itemEdited.end));
                $("#editedEventDatePickerStart").val(start);
                $("#editedEventDatePickerEnd").val(end);
            }
            $("#editedEventTitle").val(itemEdited.name);
            $("#editedEventDescription").val(itemEdited.description);
            $("#editedEventColor").val(itemEdited.className);
            showModal("modalEditEvent")
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

    // Changement de la date de fin de la timeline    
    $('.dateIndicator:nth-of-type(2)')
        .on('click', function () {
            showModal("modalChangeEndDate")
        })
        .on('keypress', function (e) {
            if (e.keyCode == 13) {
                showModal("modalChangeEndDate")
            }
        });
        
        
        // Changement de la date de début de la timeline    
    $('.dateIndicator:nth-of-type(1)').on('click', function () {
            showModal("modalChangeStartDate")
        })
        .on('keypress', function (e) {
            if (e.keyCode == 13) {
                showModal("modalChangeStartDate")
            }
        });
    

    // $("#modalEditLine").dialog({
    //     autoOpen: false,
    //     buttons: {
    //         "Delete this line": function () {
    //             $("#modalEditLine").dialog("close");
    //             $("#modalRemoveLine").data('groupID', $("#modalEditLine").data("groupID"))
    //                 .data('order', $("#modalEditLine").data("order"))
    //                 .dialog("open");
    //         },
    //         "Cancel": function () {
    //             $("#modalEditLine").dialog("close");
    //         }
    //     },
    //     close: function () {
    //         $("#modalEditLine p:last-of-type").html("");
    //     },
    //     minHeight: 200,
    //     minWidth: 400
    // });

    // Sert à afficher des messages de confirmation à l'usager (ex: "Timeline bien sauvegardé")
    // Only used by now defunct saveTimeline() function
    // $("#modalQuickAlert").dialog({
    //     autoOpen: false,
    //     show: {
    //         effect: "blind",
    //         duration: 500
    //     },
    //     hide: {
    //         effect: "blind",
    //         duration: 500
    //     }
    // });
})

let escListener;

function showModal(modalID, type, data) {
    console.log('@modalID', modalID);
    if (type == "EditLine") {

    }
    document.getElementById(modalID).classList.add('show')
    document.addEventListener("keyup", e => closeModalWithEsc(e, modalID));
}

function closeModal(modalID) {
    document.getElementById(modalID).classList.remove('show')
    // #TODO: removeEventListener() ?
}

function closeModalWithEsc(e, modalID) {
    if (e.key == "Escape" || e.keyCode == 27) {
        closeModal(modalID)
    }
}

function changeEndDate() {
    let newEndDate = $("#datePickerTimelineEnd").val();
    // Vérification des dates...                        
    if ($(".dateIndicator:nth-of-type(1)").html() > newEndDate) {
        $("#modalChangeEndDate p:last-of-type").html("Start date cannot be before end date!");
    } else {
        $('.dateIndicator:nth-of-type(2)').html(newEndDate);
        // Mise à jour des options de la timeline, puis on la redessine
        option.max = newEndDate;
        timeline.setOptions(option);
        timeline.setWindow(timeline.startDate, newEndDate, {
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });
        changesSaved = false;
        closeModal("modalChangeEndDate");
    }

}

function changeStartDate() {
    let newStartDate = $("#datePickerTimelineStart").val();
    // Vérification des dates...
    if (newStartDate > $(".dateIndicator:nth-of-type(2)").html()) {
        $("#modalChangeStartDate p:last-of-type").html("Start date cannot be before end date!");
    } else {
        $(".dateIndicator:nth-of-type(1)").html(newStartDate);
        // Mise à jour des options de la timeline, puis on la redessine
        option.min = newStartDate;
        timeline.setOptions(option);
        timeline.setWindow(newStartDate, timeline.endDate, {
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });
        changesSaved = false;
        closeModal("modalChangeStartDate");
    }

}

// Gestion de l'ajout de nouvelles ligne via le bouton #btnAddLine    
function addLine() {
    let lineName = $('#lineName').val();
    // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
    if (lineName == "") {
        $("#modalAddLine p:last-of-type").html("Your new line must have a name!");
    } else if (lineName.length > 20) {
        $("#modalAddLine p:last-of-type").html("The line's name must be 20 characters or less.");
    } else {
        try {
            group.add({
                id: lineName,
                content: lineName,
                order: lineCount
            });
            lineCount++;
            changesSaved = false;
            closeModal('modalAddLine')
        } catch (err) {
            // Si la nouvelle ligne a le même nom qu'une ligne déjà existante, on avertit l'usager
            $("#modalAddLine p:last-of-type").html("Impossible! There already is a line with name" +
                "\"" + lineName + "\"");
        }
    }
}

function addEvent() {
    let title = $("#newEventTitle").val();
    let groupID = lineBeingEdited.id;
    let startDate = $("#datePickerStart").val();
    let endDate = $("#datePickerEnd").val();
    let desc = $("#newEventDesc").val();
    let color = $("#newEventColor").val();
    
    if (isValidDate(startDate)) {
        if (endDate == "") {
            item.add({
                id: itemIDCount,
                name: title,
                start: startDate,
                end: null,
                group: groupID,
                type: "point",
                description: desc,
                'className': color
            });
            itemIDCount++;
            changesSaved = false;
            closeModal("modalAddEvent")
        } else if (isValidDate(endDate)) {
            if ($("#datePickerStart").val() > $("#datePickerEnd").val()) {
                $("#modalAddEvent p:last-of-type").html("Start date cannot be before end date!");
            } else {
                item.add({
                    id: itemIDCount,
                    name: title,
                    start: startDate,
                    end: endDate,
                    group: groupID,
                    description: desc,
                    'className': color
                });
                itemIDCount++;
                changesSaved = false;
                closeModal("modalAddEvent")
            }
        } else {
            $("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
        }
    } else {
        $("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
    }

}

function editEvent() {
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
            closeModal("modalEditEvent")
        } else if (isValidDate(endDate)) {
            if (startDate > endDate) {
                $("#modalEditEvent p:last-of-type").html("Start date cannot be before end date!");
            } else {
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
                closeModal("modalEditEvent")
            }
        } else {
            $("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
        }
    } else {
        $("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
    }
    timeline.redraw();

}


function updateLine() {
    // Vérification des dates...
    let newLineName = $('#newLineName').val();

    // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
    if (newLineName == "") {
        $("#modalEditLine p:last-of-type").html("Your new line must have a name!");
    } else if (newLineName.length > 20) {
        $("#modalEditLine p:last-of-type").html("The line's name must be 20 characters or less.");
    } else {
        group.forEach(element => {
            if (element.id == lineBeingEdited.id) {
                group.update({
                    id: element.id,
                    content: newLineName
                });
                element.id = newLineName;
                element.content = newLineName;
            }
        });
        changesSaved = false;
        closeModal('modalEditLine')
    }
}

function preDeleteLine() {
    closeModal('modalEditLine')
    showModal('modalRemoveLine')
    // $("#modalRemoveLine").data('groupID', $("#modalEditLine").data("groupID"))
        // .data('order', $("#modalEditLine").data("order"))
        // .dialog("open");
}

function deleteLine() {
    group.remove({
        id: lineBeingEdited.id
    });
    // Il faut updater l'ordre des lignes qui sont après celle qu'on supprime
    group.forEach(element => {
        if (element.order >= lineBeingEdited.order) {
            group.update({
                id: element.id,
                order: element.order - 1
            });
        }
    });
    lineCount--;
    changesSaved = false;
    closeModal('modalRemoveLine')
}







// <!-- #TODO: new timeline modal (choose name, dates && description) -->
// $("#modalNewTimeline").dialog({
//     autoOpen: false,
//     buttons: {
//         "Créer la timeline!": function () {

//             let name = $("#newTimelineName").val();
//             let description = $("#newTimelineDescription").val();
//             let startDate = $("#newTimelineDatePickerStart").val();
//             let endDate = $("#newTimelineDatePickerEnd").val();

//             // Vérification des dates...
//             if (endDate < startDate) {
//                 $("#modalNewTimeline p:last-of-type").html("La date de fin doit être après la date de début!");
//             }
//             // Vérification du titre...
//             else if (name == "") {
//                 $("#modalNewTimeline p:last-of-type").html("La timeline doit avoir un titre!");
//             }
//             // On crée une Timeline dans la BD via AJAX avant de rediriger vers la page d'édition qui contiendra la nouvelle timeline
//             else {
//                 saveNewTimeline(name, startDate, endDate, description);
//                 $(this).dialog("close");
//             }

//         },
//         "Annuler": function () {
//             $(this).dialog("close");
//         }
//     },
//     minHeight: 200,
//     minWidth: 800
// });



//  Création d'une nouvelle timeline
//  Not implemented for now, but could be nice
//   $("nav a:nth-of-type(2)").on('click', function () {
//     $("#modalNewTimelineSaveFirst").dialog("open");
//   })

//   $("#modalNewTimelineSaveFirst").dialog({
//     autoOpen: false,
//     buttons: {
//       "Yes": function () {
//         // saveTimeline();
//         $("#modalNewTimelineSaveFirst").dialog("close");
//         $("#modalNewTimeline").dialog("open");
//         $("#modalNewTimeline p:last-of-type").html("La timeline précédente a été enregistré.");
//       },
//       "No": function () {
//         $("#modalNewTimelineSaveFirst").dialog("close");
//         $("#modalNewTimeline").dialog("open");
//       },
//       "Cancel": function () {
//         $("#modalNewTimelineSaveFirst").dialog("close");
//       }
//     },
//     minHeight: 200,
//     minWidth: 400
//   });