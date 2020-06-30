let oldDesc;
let oldTitle;
let changesSaved = true;

$(document).ready(function () {

  // Bouton de sauvegarde
  // $('#btnSave').on('click', saveTimeline);

  $('h2').on('click', changeTitle1);

  $('#description').on('click', changeDesc1);

  //  Création d'une nouvelle timeline
  $("nav a:nth-of-type(2)").on('click', function () {
    $("#modalNewTimelineSaveFirst").dialog("open");
  })

  $("#modalNewTimelineSaveFirst").dialog({
    autoOpen: false,
    buttons: {
      "Oui": function () {
        // saveTimeline();
        $("#modalNewTimelineSaveFirst").dialog("close");
        $("#modalNewTimeline").dialog("open");
        $("#modalNewTimeline p:last-of-type").html("La timeline précédente a été enregistré.");
      },
      "non": function () {
        $("#modalNewTimelineSaveFirst").dialog("close");
        $("#modalNewTimeline").dialog("open");
      },
      "annuler": function () {
        $("#modalNewTimelineSaveFirst").dialog("close");
      }
    },
    minHeight: 200,
    minWidth: 400
  });

});

function cancelChangeDesc() {
  if (oldDesc == undefined) {
    $("#newDescTemp").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()'>Ajouter une description</button></div>");
  } else {
    $("#newDescTemp").replaceWith("<p id='description'>" + oldDesc + "</p>");
  }
  $('#description').on('click', changeDesc1);
}

function cancelChangeTitle() {
  $("#newTitleTemp").replaceWith("<h2>" + oldTitle + "</h2>");
  $('h2').on('click', changeTitle1);
}

function changeDesc1() {
  oldDesc = $("#description").html();
  $("#description, #btnAddDesc").replaceWith("<div id='newDescTemp'><textarea name='newDesc' cols='40' rows='5'></textarea><button onclick='changeDesc2()'>Ok!</button>" +
    "<button onclick='cancelChangeDesc()'>Annuler</button></div>");
  $("textarea").val(oldDesc);
}

function changeDesc2() {
  let newDesc = $("#newDescTemp textarea").val();

  if ($.trim(newDesc).length > 0) {
    $("#newDescTemp").replaceWith("<p id='description' title='Changer la description'>" + newDesc + "</p>");
  } else {
    $("#newDescTemp").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()' title='Changer le titre'>Ajouter une description</button></div>");
  }
  $('#description').on('click', changeDesc1);
  changesSaved = false;
}

function changeTitle1() {
  oldTitle = $("h2").html();

  $("h2").replaceWith("<div id='newTitleTemp'><input id='inputTitle'></input><button onclick='changeTitle2()'>Ok!</button>" +
    "<button onclick='cancelChangeTitle()'>Annuler</button></div>");
  $("#inputTitle").val(oldTitle);
}

function changeTitle2() {
  let newTitle = $("#newTitleTemp #inputTitle").val();

  $("#newTitleTemp").replaceWith("<h2 title='Changer le titre'>" + newTitle + "</h2>");
  $('h2').on('click', changeTitle1);
  changesSaved = false;
}

function toggleImporter() {
  document.getElementById("drop_zone").classList.toggle("show")
}

function dropHandler(ev) {
  console.log('@ev: ', ev);

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  try {
    if (ev.dataTransfer.items) {
      const reader = new FileReader();
      reader.onloadend = function () {
        let data = JSON.parse(this.result);
        console.log('@data: ', data);
        loadTimeline(data);
        toggleImporter();
      };
  
      reader.readAsText(ev.dataTransfer.files[0]);
    }
    
  } catch (err) {
    alert("This file appears to be invalid. :|")
  }
}

function dragOverHandler(ev) {
  // console.log('File(s) in drop zone');
  ev.preventDefault();
}

function clearTimeline() {
  for (let key in timeline.groupsData._data._data) {
    let obj = timeline.groupsData._data._data[key];
    group.remove({ id: obj.id });
    lineCount--;
  }
}

function loadTimeline(info) {
  
  clearTimeline()

  // On garde le id de la timeline en rérérence pour la sauvegarder plus tard
  idTimeline = info.id;
  // On commence par mettre la timeline a jour avec les infos de base
  $("header h2").html(info.name);
  $("#description").html(info.description);
  option.min = info.start_date;
  option.max = info.end_date;
  $('.dateIndicator:nth-of-type(1)').html(info.start_date);
  $('.dateIndicator:nth-of-type(2)').html(info.end_date);
  if (info.public == 0) {
    $("#checkBoxPrivate").prop('checked', true);
  } else {
    $("#checkBoxPrivate").prop('checked', false);
  }

  // Faire le tour de toutes les lignes
  info.line.forEach(function (line, lineIndex) {
    group.add({
      id: lineIDCount,
      content: line.name,
      order: line.order,
      visible: true
    });
    // Faire le tour de toutes les périodes, pour chaque ligne
      line.allPeriod.forEach(function (period) {
      if (!period.start_date) {
        console.log('@period: ', period);
        
      }
      if (period.end_date == null) {
        item.add({
          id: itemIDCount,
          name: period.name,
          start: period.start_date,
          group: lineIDCount,
          description: period.description,
          "className": period.color,
          type: "point"
        });
      } else {
        item.add({
          id: itemIDCount,
          name: period.name,
          start: period.start_date,
          end: period.end_date,
          group: lineIDCount,
          description: period.description,
          "className": period.color
        });
      }
      itemIDCount++;
    });
    lineCount++;
    lineIDCount++;
  });

  timeline.setOptions(option);
  timeline.redraw();
  timeline.fit();

  if ($("#description").is(':empty')) {
    $("#description").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()'>Ajouter une description</button></div>");
  }

}

function exportTimeline() {
  console.log('@export...');

  let allLine = [];
  let line = {
    content: null,
    order: null,
    id: null,
    allPeriod: []
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
    version: 1.0,
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
      name: obj.content,
      order: obj.order,
      id: obj.id,
      allPeriod: []
    }
    allLine.push(line);
  }

  // Puis ajouter tous les items (période) dans le tableau d'items de leur ligne respective
  timeline.itemsData.forEach(element => {
    item = {
      name: element.name,
      description: element.description,
      color: element.className,
      start_date: element.start,
      end_date: element.end,
      group: element.group
    };
    allLine.forEach(element => {
      if (element.id == item.group) {
        element.allPeriod.push(item);
      }
    });
  });
  
  console.log('@allLine: ', allLine);
  timelineGeneral.line = allLine;

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timelineGeneral));
  let dlAnchorElem = document.getElementById('exportTimeline');
  dlAnchorElem.setAttribute("href", dataStr);
  const fileName = "timeline_" + makeValid(new Date()) + ".json"

  dlAnchorElem.setAttribute("download", fileName);
  dlAnchorElem.click();

}

function startNewTimeline() {
  clearTimeline()
}

window.onbeforeunload = function () {
  if (changesSaved) {
    ;
  } else {
    return "Vos dernières modifications n'ont pas été enregistré.";
  }
};