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
  <Nav/>
  <main>
    <div 
      tabindex="0" 
      role="button"
      class="dateIndicator" 
      title="Change the timeline's Start Date"
      on:click={() => showModal("modalChangeStartDate")}
    >
      01-01-2000
    </div>
    <Description />
    <div 
      tabindex="0" 
      role="button" 
      class="dateIndicator" 
      title="Change the timeline's End Date"
      modalChangeEndDate
      on:click={() => showModal("modalChangeEndDate")}
    >
      31-12-2099
    </div>


    <div id="btnContainer">
      <div>
        <button id="btnAddLine" on:click={() => showModal('modalAddLine')}>Add a line</button>
        <button id="btnMoveToFirstItem" on:click={TheTimeline.moveToFirstItem}>Go to first event</button>
        <button id="btnShowAllLine" on:click={TheTimeline.showAllLine}>Show all lines</button>
        <!-- <button id="btnAutoScroll">Auto scroll</button> -->
        <!-- <button id="btnSave">Sauvegarder la timeline</button> -->
      </div>
      <button id="btnHelp" on:click={()=> showModal('modalHelp')}>?</button>
    </div>

    <!-- Le plus important des div!!! -->
    <div id="timeline" oncontextmenu="return false;"></div>

  </main>

  <ModalStartDate on:closeThisModal={() => closeModal('modalChangeStartDate')}/>
  <ModalEndDate on:closeThisModal={() => closeModal('modalChangeEndDate')}/>
  <ModalHelp on:closeThisModal={() => closeModal('modalHelp')}/>
  <ModalAddEvent on:closeThisModal={() => closeModal('modalAddEvent')}/>
  <ModalAddLine on:closeThisModal={() => closeModal('modalAddLine')}/>
  <ModalEditEvent on:closeThisModal={() => closeModal('modalEditEvent')}/>
  <ModalRemoveLine on:closeThisModal={() => closeModal('modalRemoveLine')}/>
  <ModalInfoItem on:closeThisModal={() => closeModal('modalInfoItem')}/>
  <ModalEditLine on:closeThisModal={() => closeModal('modalEditLine')}
    on:showModal={(event) => showModal(event.detail.modalId)}/>

  <Footer/>


</PageTransition>

<script>
  import PageTransition from "../components/PageTransition.svelte";
  import { onMount } from "svelte";
  import jquery from "jquery";
  import { Timeline } from "vis-timeline/standalone";
  // import moment from "moment";
  import dateformatchecker from "../components/DateFormatChecker.svelte"
  import Footer from "../components/Footer.svelte";
  import Title from "../components/Title.svelte";
  import Description from "../components/Description.svelte";
  import ModalEndDate from "../components/modals/EndDate.svelte";
  import ModalStartDate from "../components/modals/StartDate.svelte";
  import ModalEditEvent from "../components/modals/EditEvent.svelte";
  import ModalHelp from "../components/modals/Help.svelte";
  import ModalAddEvent from "../components/modals/AddEvent.svelte";
  import ModalEditLine from "../components/modals/EditLine.svelte";
  import ModalRemoveLine from "../components/modals/RemoveLine.svelte";
  import ModalAddLine from "../components/modals/AddLine.svelte";
  import ModalInfoItem from "../components/modals/InfoItem.svelte";
  import Nav from "../components/Nav.svelte";
  import {description, title, changesSaved} from '../components/TheTimeline.js';
  import TheTimeline from "../components/TheTimeline.js"

  let Pikaday;
  
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

  onMount(async () => {
    const module = await import('pikaday');
    Pikaday = module.default;
    console.log('@Pikaday: ', Pikaday);
    
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * timelinebasic.js
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    TheTimeline.setupTimeline();
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * timelinebasic.js
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * editmodesetup.js
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Se trouve dans timelinebasic.js
    TheTimeline.finishSetup();
      
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

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * editmodesetup.js
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // * editmode.js
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Bouton de sauvegarde
    // jquery('#btnSave').on('click', saveTimeline);
    TheTimeline.showDemoTimeline();

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