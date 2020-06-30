$(document).ready(function () {

    loadTimeline(getQueryVariable('id'));

    $('#btnLogin').on('click', function () {
        window.location = "login.php";
    });

    $('#btnMyAccount').on('click', function(){
        window.location = "account.php";
    }) 

    $('#btnSignUp').on('click', function () {
        window.location = "signup.php";
    });

});

function loadTimeline(id) {

    $.ajax({
        url: "viewmodeajax.php",
        type: "POST",
        data: {
            "actionWanted": "load-timeline",
            "id": id
        }
    })
    .done(function (data) {
        let info = JSON.parse(data);

        if (info.code == "complete") {

            // On garde le id de la timeline en rérérence pour la sauvegarder plus tard
            idTimeline = info.id;
            // On commence par mettre la timeline a jour avec les infos de base
            $("header h2").html(info.name);
            $("#description").html(info.description);
            option.min = info.start_date;
            option.max = info.end_date;
            $('.dateIndicator:nth-of-type(1)').html(info.start_date);
            $('.dateIndicator:nth-of-type(2)').html(info.end_date);

            // Faire le tour de toutes les lignes
            info.line.forEach(function (line, lineIndex) {
                group.add({ id: lineIDCount, content: line.name, order: line.order });
                // Faire le tour de toutes les périodes, pour chaque ligne
                line.allPeriod.forEach(function (period) {
                    if (period.end_date == null) {
                        item.add({
                            id: itemIDCount, name: period.name, start: period.start_date, group: lineIDCount,
                            description: period.description, "className": period.color, type: "point"
                        });
                    }
                    else {
                        item.add({
                            id: itemIDCount, name: period.name, start: period.start_date, end: period.end_date,
                            group: lineIDCount, description: period.description, "className": period.color
                        });
                    }
                    itemIDCount++;
                });
                lineIDCount++;
            });

            timeline.setOptions(option);
            timeline.redraw();
            timeline.fit();
        }
        else {
            alert("On a un problème... Dites au dev que \n " + data);
        }

    })
    .fail(function (data) {
        console.log(data);
    })
}


function getQueryVariable(variable) // Pas mal un copy/paste de ceci: https://css-tricks.com/snippets/javascript/get-url-variables/
{
    let query = window.location.search.substring(1);
    let lets = query.split("&");
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}