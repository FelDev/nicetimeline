<style>

</style>

<svelte:head>
  <script type="text/javascript">
    if (top != self) top.location.replace(self.location.href); 
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="description" content="Free timeline creation tool to visualize the passing of time.">
  <title>Simple Timeline</title>
  <link rel="shortcut icon" href="image/favicon.ico">
  <!-- <link href="css/librairies/vis-timeline-graph2d.min.css" rel="stylesheet" type="text/css" /> -->
  <link rel="stylesheet" type="text/css" href="css/editmode.css" />
  <!-- <script src="js/librairies/vis-timeline-graph2d.min.js"></script> -->
  <!-- <script src="js/dateformatchecker.js"></script> -->
</svelte:head>

<PageTransition>

  
  <header>
    <h1 title="A tool to visualize the passing of time">Simple Timeline</h1>
    <Title/>
    <div>
      <!-- <label for="checkboxPrivate">Privée</label><input type="checkbox" id="checkBoxPrivate" />
      <button id="btnShare">Partager</button>
      <form action="account.php" method="GET">
        <button name="action">Déconnexion</button>
      </form> -->
    </div>
  </header>
  <nav>
    <!-- Les liens du nav appel la fonction changeMenu pour enlever ledit menu une fois qu'on se fait rediriger (sur mobile)-->
    <!-- <a href="account.php">
      Toutes mes timelines
    </a>
    <a href="#">
      Créer une nouvelle timeline
    </a>
    <a href="account.php">
      Gestion du compte
    </a> -->

    <button onclick="showDemoTimeline()">Show demo timeline</button>
    <button onclick="startNewTimeline()">New timeline</button>
    <button onclick="toggleImporter()">Import timeline</button>
    <div id="drop_zone" ondrop="dropHandler(event);" ondragover="dragOverHandler(event);">
      <button onclick="toggleImporter()">x</button>
      <p>
        Drag and drop a .timeline file here <br>
        (This will replace the current timeline)
      </p>
      <!-- <input type="file"> -->
    </div>
    <button onclick="exportTimeline()">Export timeline</button>
    <a id="exportTimeline" style="display: none;">Export timeline</a>

  </nav>
  <main>
    <div tabindex="0" role="button" class="dateIndicator" title="Change the timeline's Start Date">01-01-2000</div>
    <Description />
    <div tabindex="0" role="button" class="dateIndicator" title="Change the timeline's End Date">31-12-2099</div>


    <div id="btnContainer">
      <div>
        <button id="btnAddLine" on:click={() => showModal('modalAddLine')}>Add a line</button>
        <button id="btnMoveToFirstItem" on:click={moveToFirstItem}>Go to first event</button>
        <button id="btnShowAllLine" on:click={showAllLine}>Show all lines</button>
        <!-- <button id="btnAutoScroll">Auto scroll</button> -->
        <!-- <button id="btnSave">Sauvegarder la timeline</button> -->
      </div>
      <button id="btnHelp" on:click={()=> showModal('modalHelp')}>?</button>
    </div>

    <!-- Le plus important des div!!! -->
    <div id="timeline" oncontextmenu="return false;"></div>

  </main>

  <div id="modalAddLine" title="Add a line" class="modal">
    <header>
      <h6>Add a line</h6>
      <button title="close" on:click={() => closeModal(('modalAddLine'))}>X</button>
    </header>
    
    <form onsubmit="return false">
     
      <p>
        <label for="lineName">Line name: </label>
        <input type="text" id="lineName">
      </p>
      <!-- Positionnement de la nouvelle ligne: <input type="text" id="newLineOrder"> -->

      <p class="alert"></p>
      <br>
      <div class="buttons">
        <button on:click={addLine}>Add line</button>
        <button on:click={() => closeModal(('modalAddLine'))}>Cancel</button>
      </div>
    </form>
    
  </div>

  <div id="modalChangeEndDate" title="Choose End Date" class="modal">
    <header>
      <h6>Choose End Date</h6>
      <button title="close" on:click={() => closeModal(('modalChangeEndDate'))}>X</button>
    </header>
    
    <form onsubmit="return false">
      <p>
        <label for="datePickerTimelineEnd">End Date: </label>
        <input type="text" id="datePickerTimelineEnd" autocomplete="off">
      </p>

      <p class="alert"></p>
      <br>
      <div class="buttons">
        <button onclick="changeEndDate()">Update</button>
        <button on:click={() => closeModal(('modalChangeEndDate'))}>Cancel</button>
      </div>
    </form>

  </div>
  
  <div id="modalChangeStartDate" title="Choose Start Date" class="modal">
    <header>
      <h6>Choose Start Date</h6>
      <button title="close" on:click={() => closeModal(('modalChangeStartDate'))}>X</button>
    </header>
    
    <form onsubmit="return false">
      <p>
        <label for="datePickerTimelineStart">Start Date: </label>
        <input type="text" id="datePickerTimelineStart" autocomplete="off">
      </p>
      <p class="alert"></p>
      <br>
      <div class="buttons">
        <button onclick="changeStartDate()">Update</button>
        <button on:click={() => closeModal(('modalChangeStartDate'))}>Cancel</button>
      </div>
    </form>

  </div>
  
  <div id="modalHelp" title="?" class="modal">
    <header>
      <h6>?</h6>
      <button title="close" on:click={() => closeModal(('modalHelp'))}>X</button>
    </header>
    <h2>What's Simple Timeline?</h2>
    <p>
      The goal of this webapp is to help you visualize the passing of time.
      I use it to visualize my life, but you could make a timeline about anything.
    </p>
    <p>
      Your data stays yours 100%.
      In fact, you'll have to download and store the data yourself if you want to save a timeline.
      There's no database behind this.
    </p>
    <details>
      <summary>Why have users exporting and importing files? </summary>
      <p>
        I chose that way of saving timelines rather than a classic account creation flow for <span class="bold">maximal privacy</span>.
      </p>
      <p>
        The first version of this webapp had users creating accounts and saving their data to a database, but
        virtually 100% of people had the same concern: "Won't you be able to see my timeline?". Indeed, I can hack my
        own websites quite easily.
      </p>
      <p>
        At first I thought about adding client-side encryption, but, for users, that's about as complex and
        inconvenient as keeping files. Also, to be really sure that I actually implement that encryption, users would
        have to look through the code.
      </p>
      <p>
        With export/import of a simple .json file, you can turn your internet connection off and disable all cookies
        while using the app. It still works and nobody, not even me, <span class="bold">can</span> peek at your data.
      </p>
      <p>
        On top of it, no user management and no database makes this webapp much simpler to develop and much cheaper to
        host. (So cheap, this is free to use. (But you can <a target="_blank" rel="noopener"
          href="https://ko-fi.com/feldev">make a donation</a> if you want, much appreciated!
        <!-- (And you might be on the shoutout page, if you choose to.) -->))
      </p>
      <p>
        If you would enjoy the ability to create an account and save your data on the cloud, do <a target="_blank"
          rel="noopener" href="https://www.felixparadis.com/contact/">send a feature request</a>!
      </p>
    </details>
    <h2>Tips and tricks:</h2>
    <p>
      <span class="push-left">- To zoom in and out: <br> </span>
      Hold the <kbd>ctrl</kbd> key and scroll. Or pinch.
    </p>
    <p>
      <span class="push-left">- For a perfect zoom out: <br> </span>
      Double click on the timeline (not on an event).
    </p>
    <p>
      <span class="push-left">- To add events: <br> </span>
      Use the green "+" button or right click on the timeline
    </p>
    <p>
      <span class="push-left">- To edit events: <br> </span>
      Right click on them. You can also drag them around.
    </p>
    <p>
      <span class="push-left">- To move lines up and down: <br> </span>
      Click on a line's name and drag it up or down.
    </p>
    <p>
      <span class="push-left">- To change a timeline's name, description or start/end date: <br> </span>
      Click on what you want to change.
    </p>
    <p>
      <span class="push-left">- To save your timeline: <br> </span>
      Click "Export timeline" and keep the file somewhere safe.
    </p>
    <p>
      <span class="push-left">- To load a saved timeline: <br> </span>
      Click "Import timeline" and drag and drop the file you previously exported.
    </p>
    <!-- <p>
      <span class="push-left">- : <br> </span>
      
    </p> -->
    <hr>
    <p>
      For questions, comments, feature requests and insults,
      <a target="_blank" rel="noopener" href="https://www.felixparadis.com/contact/">Reach out to me.</a>
    </p>
    <!-- <p>VOUS DEVEZ SAUVEGARDER VOTRE TIMELINE SI VOUS VOULEZ CONSERVER VOS CHANGEMENTS.</p>
    <p>Vous pouvez dragger les événement et changer leurs durée.</p>
    <p>Double cliquez sur la timeline pour un "zoom out parfait".</p>
    <p>Double cliquez sur un événement pour afficher sa description.</p>
    <p>Faites un clic droit sur la timeline pour ajouter un événement.</p>
    <p>Faites un clic droit sur un événement pour le modifier.</p>
    <p>Changez l'ordre des lignes en les draggant une à la fois.</p>
    <p>Amenez votre curseur en dehors de la timeline pour faire défiler la page.</p>
    <p>Les dates de début et de fin de votre timeline sont affichées en haut et sont modifiables.</p>
    <p>Cliquez sur le titre pour le modifier.</p>
    <p>Cliquez sur la description pour la modifier.</p> -->
  </div>


  <div id="modalAddEvent" title="Add an event" class="modal">
    <header>
      <h6>Add an event</h6>
      <button title="close" on:click={() => closeModal(('modalAddEvent'))}>X</button>
    </header>
    
    <form onsubmit="return false">

      <p>
        <label for="newEventTitle">Title: </label>
        <input type="text" id="newEventTitle">
      </p>
      <p>
        <label for="newEventDesc"> Description: </label>
        <textarea type="text" id="newEventDesc" placeholder="(optional)"></textarea>
      </p>
      <p>
        <label for="newEventColor"> Color: </label>
        <select id="newEventColor">
          <option value="default">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
          <option value="magenta">Magenta</option>
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </p>
      <p>
        <label for="datePickerStart">Start Date: </label>
        <input type="text" id="datePickerStart" autocomplete="off">
      </p>
      <p>
        <label for="datePickerEnd">End Date: </label>
        <input type="text" id="datePickerEnd" autocomplete="off">
      </p>

      <p class="alert"></p>
      <br>
      <div class="buttons">
        <button onclick="addEvent()">Add</button>
        <button on:click={() => closeModal(('modalAddEvent'))}>Cancel</button>
      </div>
    </form>
  </div>

  <div id="modalEditEvent" title="Modify an event" class="modal">  
    <header>
      <h6>Modify an event</h6>
      <button title="close" on:click={() => closeModal(('modalEditEvent'))}>X</button>
    </header>
    
    <form onsubmit="return false">
      <p>
        <label for="editedEventTitle">Title:</label>
        <input type="text" id="editedEventTitle">
      </p>
      <p>
        <label for="editedEventDescription">Description:</label>
        <textarea type="text" id="editedEventDescription"></textarea>
      </p>
      <p>
        <label for="editedEventColor">Color:</label>
        <select id="editedEventColor">
          <option value="default">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
          <option value="magenta">Magenta</option>
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </p>
      <p>
        <label for="editedEventDatePickerStart">Start date:</label>
        <input type="text" id="editedEventDatePickerStart" autocomplete="off">
      </p>
      <p>
        <label for="editedEventDatePickerEnd">End date:</label>
        <input type="text" id="editedEventDatePickerEnd" autocomplete="off">
      </p>

      <p class="alert"></p>
      <br>
      <div class="buttons">
        <button onclick="editEvent()">Apply</button>
        <button on:click={() => closeModal(('modalEditEvent'))}>Cancel</button>
      </div>
    </form>
    
  </div>

  <div id="modalEditLine" title="Rename or delete this line" class="modal" draggable="true">
    <header>
      <h6>Rename or delete this line</h6>
      <button title="close" on:click={() => closeModal(('modalEditLine'))}>X</button>
    </header>
    <form onsubmit="return false">
      <label for="newLineName">New name for this line: </label>
      <input type="text" id="newLineName">
      <br>
      <div class="buttons">
        <button onclick="updateLine()">update</button>
        <button onclick="preDeleteLine()">Delete this line</button>
        <button on:click={() => closeModal(('modalEditLine'))}>Cancel</button>
      </div>
    </form>
    <p class="alert"></p>
  </div>

  <div id="modalRemoveLine" title="Do you want to delete this line?" class="modal">
    <header>
      <h6>Do you want to delete this line?</h6>
      <button title="close" on:click={() => closeModal(('modalEditLine'))}>X</button>
    </header>
    <p>This line and all its events will be deleted.</p>
    <p>Go ahead?</p>
    <form onsubmit="return false">
      <div class="buttons">
        <button onclick="deleteLine()">Yes</button>
        <button on:click={() => closeModal(('modalRemoveLine'))}>Cancel</button>
      </div>
    </form>
  </div>

  <div id="modalInfoItem" title="" class="modal">
    <header>
      <h6> </h6>
      <button title="close" on:click={() => closeModal(('modalInfoItem'))}>X</button>
    </header>
    <p></p>
    <!-- Éventuellement il faudrait un img tag ici, quand on aura des images... -->
  </div>


  <Footer/>

</PageTransition>

<script>
  import PageTransition from "../components/PageTransition.svelte";
  import { onMount } from "svelte";
  import jquery from "jquery";
  import { Timeline } from "vis-timeline/standalone";
  import moment from "moment";
  import dateformatchecker from "../components/DateFormatChecker.svelte"
  import Footer from "../components/Footer.svelte";
  import Title from "../components/Title.svelte";
  import Description from "../components/Description.svelte";
  import {description, title} from '../components/stores.js';
  // let description = ""; // in Description.svelte
  
  
  // import Pikaday from "pikaday";
  let Pikaday
  
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


// Gestion de l'ajout de nouvelles ligne via le bouton #btnAddLine    
function addLine() {
    let lineName = jquery('#lineName').val();
    // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
    if (lineName == "") {
        jquery("#modalAddLine p:last-of-type").html("Your new line must have a name!");
    } else if (lineName.length > 20) {
        jquery("#modalAddLine p:last-of-type").html("The line's name must be 20 characters or less.");
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
            jquery("#modalAddLine p:last-of-type").html("Impossible! There already is a line with name" +
                "\"" + lineName + "\"");
        }
    }
}



onMount(async () => {
  const module = await import('pikaday');
  // import Pikaday from "pikaday";
  Pikaday = module.default;

  console.log('@Pikaday: ', Pikaday);
  

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * timelinebasic.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


    // La timeline sera attachée à cet élément du DOM
    container = document.getElementById('timeline');
    console.log('@container: ', container);

    item = new vis.DataSet();
    group = new vis.DataSet();

    
    // jquery('#btnAutoScroll').on('click', function () {
    //     // À peaufiner (beaucoup) pour que la vitesse soit adéquate à tout niveau de zoom
    //     // S'il y a au moins 1 item
    //     if (item.length > 0) {
    //         let maxDate = item.max("end");
    //         let duration = (timeline.components[0].end - timeline.components[0].start) / 5000000;
    //         timeline.focus([maxDate.id], { animation: { duration: duration, easingFunction: 'linear' } }); // ms
    //     }
    // });



function finishSetup() {
    // Création de la timeline + attribution des lignes (group)
    container = document.getElementById('timeline');

    console.log('@container: ', container);
    console.log('@item: ', item);
    console.log('@option: ', option);
    
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
            let description = itemToShow.description == "" ? "(no description)" : itemToShow.description;
            document.querySelector("#modalInfoItem p:nth-of-type(1)").innerHTML = description;
            document.querySelector("#modalInfoItem header h6").innerHTML = itemToShow.name;
            
            showModal("modalInfoItem")
        }
    });
}

function hideGroup(groupID) {
    group.update({ id: groupID, visible: false });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * timelinebasic.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * editmodesetup.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
let idTimeline;
let lineCount = 0; //lineCount utilisé pour la propriété order des timelines
let lineBeingEdited = {};


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
                jquery('#newEventTitle').val("");
                jquery('#datePickerStart').val("");
                jquery('#datePickerEnd').val("");
                jquery('#newEventDesc').val("");
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
            jquery('#newEventTitle').val("");
            jquery('#datePickerStart').val(makeValid(properties.snappedTime));
            jquery('#datePickerEnd').val("");
            jquery('#newEventDesc').val("");
            lineBeingEdited.id = properties.group;
            showModal("modalAddEvent");
        } else {
            let itemEdited = item.get(editedItemID);

            if (isValidDate(itemEdited.start)) {
                jquery("#editedEventDatePickerStart").val(itemEdited.start);
                jquery("#editedEventDatePickerEnd").val(itemEdited.end);
            } else {
                let start = makeValid(new Date(itemEdited.start));
                let end = makeValid(new Date(itemEdited.end));
                jquery("#editedEventDatePickerStart").val(start);
                jquery("#editedEventDatePickerEnd").val(end);
            }
            jquery("#editedEventTitle").val(itemEdited.name);
            jquery("#editedEventDescription").val(itemEdited.description);
            jquery("#editedEventColor").val(itemEdited.className);
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
    jquery('.dateIndicator:nth-of-type(2)')
        .on('click', function () {
            showModal("modalChangeEndDate")
        })
        .on('keypress', function (e) {
            if (e.keyCode == 13) {
                showModal("modalChangeEndDate")
            }
        });
        
        
        // Changement de la date de début de la timeline    
    jquery('.dateIndicator:nth-of-type(1)').on('click', function () {
            showModal("modalChangeStartDate")
        })
        .on('keypress', function (e) {
            if (e.keyCode == 13) {
                showModal("modalChangeStartDate")
            }
        });
    

    // jquery("#modalEditLine").dialog({
    //     autoOpen: false,
    //     buttons: {
    //         "Delete this line": function () {
    //             jquery("#modalEditLine").dialog("close");
    //             jquery("#modalRemoveLine").data('groupID', jquery("#modalEditLine").data("groupID"))
    //                 .data('order', jquery("#modalEditLine").data("order"))
    //                 .dialog("open");
    //         },
    //         "Cancel": function () {
    //             jquery("#modalEditLine").dialog("close");
    //         }
    //     },
    //     close: function () {
    //         jquery("#modalEditLine p:last-of-type").html("");
    //     },
    //     minHeight: 200,
    //     minWidth: 400
    // });

    // Sert à afficher des messages de confirmation à l'usager (ex: "Timeline bien sauvegardé")
    // Only used by now defunct saveTimeline() function
    // jquery("#modalQuickAlert").dialog({
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



function changeEndDate() {
    let newEndDate = jquery("#datePickerTimelineEnd").val();
    // Vérification des dates...                        
    if (jquery(".dateIndicator:nth-of-type(1)").html() > newEndDate) {
        jquery("#modalChangeEndDate p:last-of-type").html("Start date cannot be before end date!");
    } else {
        jquery('.dateIndicator:nth-of-type(2)').html(newEndDate);
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
    let newStartDate = jquery("#datePickerTimelineStart").val();
    // Vérification des dates...
    if (newStartDate > jquery(".dateIndicator:nth-of-type(2)").html()) {
        jquery("#modalChangeStartDate p:last-of-type").html("Start date cannot be before end date!");
    } else {
        jquery(".dateIndicator:nth-of-type(1)").html(newStartDate);
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

function addEvent() {
    let title = jquery("#newEventTitle").val();
    let groupID = lineBeingEdited.id;
    let startDate = jquery("#datePickerStart").val();
    let endDate = jquery("#datePickerEnd").val();
    let desc = jquery("#newEventDesc").val();
    let color = jquery("#newEventColor").val();
    
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
            if (jquery("#datePickerStart").val() > jquery("#datePickerEnd").val()) {
                jquery("#modalAddEvent p:last-of-type").html("Start date cannot be before end date!");
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
            jquery("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
        }
    } else {
        jquery("#modalAddEvent p:last-of-type").html("YYYY-MM-DD");
    }

}

function editEvent() {
    let title = jquery("#editedEventTitle").val();
    let startDate = jquery("#editedEventDatePickerStart").val();
    let endDate = jquery("#editedEventDatePickerEnd").val();
    let color = jquery("#editedEventColor").val();

    if (isValidDate(startDate)) {
        if (endDate == "") {
            // Mise à jour de l'item concerné (accès à celui-ci via son ID)
            item.update({
                id: editedItemID,
                type: "point",
                name: title,
                description: jquery("#editedEventDescription").val(),
                "className": color,
                start: startDate,
                end: null
            });

            editedItemID = null;
            changesSaved = false;
            closeModal("modalEditEvent")
        } else if (isValidDate(endDate)) {
            if (startDate > endDate) {
                jquery("#modalEditEvent p:last-of-type").html("Start date cannot be before end date!");
            } else {
                item.update({
                    id: editedItemID,
                    type: "range",
                    name: title,
                    description: jquery("#editedEventDescription").val(),
                    "className": color,
                    start: startDate,
                    end: endDate
                });

                editedItemID = null;
                changesSaved = false;
                closeModal("modalEditEvent")
            }
        } else {
            jquery("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
        }
    } else {
        jquery("#modalEditEvent p:last-of-type").html("YYYY-MM-DD");
    }
    timeline.redraw();

}


function updateLine() {
    // Vérification des dates...
    let newLineName = jquery('#newLineName').val();

    // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
    if (newLineName == "") {
        jquery("#modalEditLine p:last-of-type").html("Your new line must have a name!");
    } else if (newLineName.length > 20) {
        jquery("#modalEditLine p:last-of-type").html("The line's name must be 20 characters or less.");
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
    // jquery("#modalRemoveLine").data('groupID', jquery("#modalEditLine").data("groupID"))
        // .data('order', jquery("#modalEditLine").data("order"))
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
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * editmodesetup.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * editmode.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
let oldDesc;
let oldTitle;
let changesSaved = true;


  // Bouton de sauvegarde
  // jquery('#btnSave').on('click', saveTimeline);

  showDemoTimeline();

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
  $title = info.name;
  $description = info.description;
  option.min = info.start_date;
  option.max = info.end_date;
  jquery('.dateIndicator:nth-of-type(1)').html(info.start_date);
  jquery('.dateIndicator:nth-of-type(2)').html(info.end_date);
  if (info.public == 0) {
    jquery("#checkBoxPrivate").prop('checked', true);
  } else {
    jquery("#checkBoxPrivate").prop('checked', false);
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
    description: $description,
    name: $title,
    public: !(jquery("#checkBoxPrivate").is(":checked")),
    start_date: jquery(".dateIndicator:nth-of-type(1)").html(),
    end_date: jquery(".dateIndicator:nth-of-type(2)").html()
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
  let beginningOfFileName = $title == "" ? "your_timeline" : $title;
  const fileName = `${beginningOfFileName}_${makeValid(new Date())}.timeline`

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
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * editmode.js
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

})


</script>