let option; // option contient toutes les options de configuration de la timeline
let item; // Ce DataSet contient toutes les périodes/événements 
let group; // Et toutes les lignes de la timeline sont dans group
let lineIDCount = 0;
let itemIDCount = 0;
let timeline;
let container;
let itemTemplate;

function moveToFirstItem() {
    // S'il y a au moins un item
    if (item.length > 0) {
        // Trouver la date du premier élément...
        let first = new Date(item.get()[0].start);
        item.forEach(i => {
            let d = new Date(i.start)
            if (d < first) {
                first = d
            }
        })
        // let minDate = item.min("start"); // should work but doesn't 🤷‍♀️
        // Et y aller!
        timeline.moveTo(first);
    }
}

function showAllLine() {
    group.forEach(function (g) {
        group.update({ id: g.id, visible: true });
    })
};

$(document).ready(function () {

    // La timeline sera attachée à cet élément du DOM
    container = document.getElementById('timeline');

    item = new vis.DataSet();
    group = new vis.DataSet();

    
    // $('#btnAutoScroll').on('click', function () {
    //     // À peaufiner (beaucoup) pour que la vitesse soit adéquate à tout niveau de zoom
    //     // S'il y a au moins 1 item
    //     if (item.length > 0) {
    //         let maxDate = item.max("end");
    //         let duration = (timeline.components[0].end - timeline.components[0].start) / 5000000;
    //         timeline.focus([maxDate.id], { animation: { duration: duration, easingFunction: 'linear' } }); // ms
    //     }
    // });

})


function finishSetup() {
    // Création de la timeline + attribution des lignes (group)
    timeline = new vis.Timeline(container, item, option);
    timeline.setGroups(group);

    // Affichage des infos pour chaque items de la timeline + la faire fitter au complet sur double click
    timeline.on("doubleClick", function (properties) {
        let itemID = properties.item;
        let itemToShow = item.get(itemID)

        if (itemID == null) {
            timeline.fit();
        }
        else {
            document.querySelector("#modalInfoItem p:nth-of-type(1)").html(itemToShow.description);

            document.querySelector("#modalInfoItem").dialog({ title: itemToShow.name })
                .dialog("open");
        }
    });
}

function hideGroup(groupID) {
    group.update({ id: groupID, visible: false });
}