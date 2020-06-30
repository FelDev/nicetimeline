
function saveTimeline() {

  let allLine = [];
  let line = {
    content: null,
    order: null,
    id: null,
    item: []
  };
  let item = {
    name: null,
    description: null,
    color: null,
    start: null,
    end: null,
    group: null
  };
  let timelineGeneral = {
    id: idTimeline,
    description: $("#description").html(),
    name: $("h2").html(),
    public: !($("#checkBoxPrivate").is(":checked")),
    start_date: $(".dateIndicator:nth-of-type(1)").html(),
    end_date: $(".dateIndicator:nth-of-type(2)").html()
  };

  // Créer un tableau qui contient toutes les lignes
  for (let key in timeline.groupsData._data._data) {
    let obj = timeline.groupsData._data._data[key];
    line = {
      content: obj.content,
      order: obj.order,
      id: obj.id,
      item: []
    }
    allLine.push(line);
  }

  // Puis ajouter tous les items (période) dans le tableau d'items de leur ligne respective
  timeline.itemsData.forEach(element => {
    item = {
      name: element.name,
      description: element.description,
      color: element.className,
      start: element.start,
      end: element.end,
      group: element.group
    };
    allLine.forEach(element => {
      if (element.id == item.group) {
        element.item.push(item);
      }
    });
  });

  // Finalement, Stringify chaque ligne avant de l'envoyer au serveur pour que PHP puisse decode le JSON
  for (let i = 0; i < allLine.length; i++) {
    allLine[i] = JSON.stringify(allLine[i]);
  }
  timelineGeneral = JSON.stringify(timelineGeneral);

  $.ajax({
      url: "editmodeajax.php",
      type: "POST",
      data: {
        "actionWanted": "save-timeline",
        "timeline": timelineGeneral,
        "allLine": allLine
      }
    })
    .done(function (data) {

      let info = JSON.parse(data);

      if (info.code == "complete") {
        $("#modalQuickAlert p").html("Enregistré avec succès!");
        $("#modalQuickAlert").dialog("open");
        setTimeout(function () {
          $("#modalQuickAlert").dialog("close");
        }, 2000);
        changesSaved = true;
      } else {
        $("#modalQuickAlert p").html("L'enregistrement n'a pas fonctionné...");
        $("#modalQuickAlert").dialog("open");
      }

    })
    .fail(function (data) {
      alert("On a un probleme... Dites au dev que \n " + data);
      console.log(data);
    })
}