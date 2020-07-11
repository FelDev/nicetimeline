let oldDesc;
let oldTitle;
let changesSaved = true;

$(document).ready(function () {

  // Bouton de sauvegarde
  // $('#btnSave').on('click', saveTimeline);

  $('#timelineTitle')
  .on('click', changeTitle1)
  .on('keypress', function(e) {
    if(e.keyCode == 13) {
      changeTitle1();
    }
  });

  $('#description')
  .on('click', changeDesc1)
  .on('keypress', function(e) {
    if(e.keyCode == 13) {
      changeDesc1();
    }
  });

  //  Création d'une nouvelle timeline
  $("nav a:nth-of-type(2)").on('click', function () {
    $("#modalNewTimelineSaveFirst").dialog("open");
  })

  $("#modalNewTimelineSaveFirst").dialog({
    autoOpen: false,
    buttons: {
      "Yes": function () {
        // saveTimeline();
        $("#modalNewTimelineSaveFirst").dialog("close");
        $("#modalNewTimeline").dialog("open");
        $("#modalNewTimeline p:last-of-type").html("La timeline précédente a été enregistré.");
      },
      "No": function () {
        $("#modalNewTimelineSaveFirst").dialog("close");
        $("#modalNewTimeline").dialog("open");
      },
      "Cancel": function () {
        $("#modalNewTimelineSaveFirst").dialog("close");
      }
    },
    minHeight: 200,
    minWidth: 400
  });
  showDemoTimeline();
});

function cancelChangeDesc() {
  if (oldDesc == undefined) {
    $("#newDescTemp").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()'>Add a description</button></div>");
  } else {
    $("#newDescTemp").replaceWith("<p id='description'>" + oldDesc + "</p>");
  }
  $('#description').on('click', changeDesc1);
}

function cancelChangeTitle() {
  $("#newTitleTemp").replaceWith(`
    <h2 id="timelineTitle" tabindex="0" aria-role="button" title="Change the Title">${oldTitle}</h2>`);
  $('#timelineTitle')
  .on('click', changeTitle1)
  .on('keypress', function(e) {
    if(e.keyCode == 13) {
      changeTitle1();
    }
  });
}

function changeDesc1() {
  oldDesc = $("#description").html();
  $("#description, #btnAddDesc").replaceWith("<div id='newDescTemp'><textarea name='newDesc' cols='40' rows='5'></textarea><button onclick='changeDesc2()'>Ok!</button>" +
    "<button onclick='cancelChangeDesc()'>Cancel</button></div>");
  $("textarea").val(oldDesc);
}

function changeDesc2() {
  let newDesc = $("#newDescTemp textarea").val();

  if ($.trim(newDesc).length > 0) {
    $("#newDescTemp").replaceWith("<p id='description' title='Change the description'>" + newDesc + "</p>");
  } else {
    $("#newDescTemp").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()' title='Change the description'>Change the description</button></div>");
  }
  $('#description').on('click', changeDesc1);
  changesSaved = false;
}

function changeTitle1() {
  oldTitle = $("#timelineTitle").html();

  $("#timelineTitle").replaceWith(`
    <div id='newTitleTemp'>
      <input id='inputTitle'></input>
      <button onclick='changeTitle2()'>Ok!</button>
      <button onclick='cancelChangeTitle()'>Cancel</button>
    </div>`);
  $("#inputTitle").val(oldTitle);
}

function changeTitle2() {
  let newTitle = $("#newTitleTemp #inputTitle").val();

  $("#newTitleTemp").replaceWith(`
    <h2 id="timelineTitle" tabindex="0" aria-role="button" title="Change the Title">${newTitle}</h2>`);
    
  $('#timelineTitle')
  .on('click', changeTitle1)
  .on('keypress', function(e) {
    if(e.keyCode == 13) {
      changeTitle1();
    }
  });
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
        let data
        try {
          data = JSON.parse(this.result);
        } catch (err) {
          return alert("This file appears to be invalid. :|")
        }
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
  timeline.groupsData._data._data.forEach( g => {
    group.remove({
      id: g.id
    });
    lineCount--;
  })
  item.clear()
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
    $("#description").replaceWith("<div id='btnAddDesc'><button onclick='changeDesc1()'>Add a description</button></div>");
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
    name: $("#timelineTitle").html(),
    public: !($("#checkBoxPrivate").is(":checked")),
    start_date: $(".dateIndicator:nth-of-type(1)").html(),
    end_date: $(".dateIndicator:nth-of-type(2)").html()
  };

  // Créer un tableau qui contient toutes les lignes
  timeline.groupsData._data._data.forEach( g => {
    line = {
      name: g.content,
      order: g.order,
      id: g.id,
      allPeriod: []
    }
    allLine.push(line);
    
  })

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
  const fileName = `${$("#timelineTitle").html()}_${makeValid(new Date())}.timeline`

  dlAnchorElem.setAttribute("download", fileName);
  dlAnchorElem.click();

}

function startNewTimeline() {
  clearTimeline()
  // #RENDUICI: popup: choose name, dates, etc...
}

function showDemoTimeline() {

  loadTimeline(
    {"id":"42","version":1,"description":"I use this timeline to reflect on how I've spent my time and how I will spend what's left.","name":"John Doe's life","public":true,"start_date":"2000-01-01","end_date":"2030-07-02","line":[{"name":"Adress","order":"0","id":4,"allPeriod":[{"name":"123 Fake street","description":"","color":"green","start_date":"2000-01-01","end_date":"2008-08-22","group":4},{"name":"456 famous avenue","description":"With my good friends Snoop Dogg and Mr. Quaker.","color":"default","start_date":"2008-08-23T00:00:00.000Z","end_date":"2010-07-27T23:58:18.814Z","group":4},{"name":"789 college boulevard","description":"That was nice","color":"default","start_date":"2016-02-05T13:14:32.459Z","end_date":"2018-10-10T20:03:33.622Z","group":4},{"name":"666 elm Street","description":"That was a little spooky","color":"default","start_date":"2010-08-06T00:18:26.309Z","end_date":"2014-04-26T04:55:00.939Z","group":4}]},{"name":"school","order":"2","id":5,"allPeriod":[{"name":"High School","description":"","color":"default","start_date":"2009-06-26T09:13:05.864Z","end_date":"2014-04-25T09:13:05.864Z","group":5},{"name":"Primary School","description":"","color":"default","start_date":"2003-11-24T04:52:38.928Z","end_date":"2009-03-07T04:52:38.928Z","group":5},{"name":"College","description":"ATM Prod","color":"default","start_date":"2016-02-15T19:29:56.639Z","end_date":"2018-10-21T19:29:56.639Z","group":5}]},{"name":"Work","order":"3","id":6,"allPeriod":[{"name":"Joe's Garage","description":"BusBoy","color":"default","start_date":"2006-04-16T10:25:24.916Z","end_date":"2008-07-13T01:23:36.837Z","group":6},{"name":"Evil Corp","description":"Assistant-Cuisinier","color":"default","start_date":"2018-06-06T13:42:59.089Z","end_date":"2020-10-03T19:41:54.737Z","group":6}]},{"name":"Traveling","order":4,"id":7,"allPeriod":[{"name":"Gap Year in Canada","description":"Full BackPack, full solo.","color":"default","start_date":"2014-05-25T11:49:01.753Z","end_date":"2016-02-27T18:20:44.441Z","group":7},{"name":"¡Cuba!","description":"First time I took an airplane!","color":"default","start_date":"2010-02-12","end_date":"2010-02-28","group":7}]},{"name":"Misc","order":"4","id":8,"allPeriod":[{"name":"COVID-19","description":"The WHO declared coronavirus was a global pandemic.","color":"default","start_date":"2020-03-11","group":8},{"name":"September 11th 2001","description":"The twin towers fall after Al Quaïda slams 2 planes into them. ","color":"default","start_date":"2001-09-11","group":8}]}]}
  )
}
window.onbeforeunload = function () {
  // if (changesSaved) {
  //   ;
  // } else {
  //   return "Vos dernières modifications n'ont pas été enregistré.";
  // }
};