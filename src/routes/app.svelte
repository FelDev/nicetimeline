<style>
  h1 a {
    text-decoration: none;
    color: unset;
  }

  :global(.max-width-wrapper) {
    display: flex;
    justify-content: space-between;
    min-height: 7rem;
    max-width: 150rem;
    margin: auto;
    width: 100%;
    flex-wrap: wrap;
  }
  @media (max-width: 500px) {
    :global(.max-width-wrapper) {
      justify-content: center;
    }
  }
</style>

<!-- <PageTransition> -->
  
  <header>
    <div class="max-width-wrapper">
      <h1 title="A tool to visualize the passing of time">
        <a href="/">Simple Timeline</a>
      </h1>
      <Title/>
      <Auth/>
      <!-- <div> -->
        <!-- <label for="checkboxPrivate">Privée</label><input type="checkbox" id="checkBoxPrivate" />
          <button id="btnShare">Partager</button>
          <form action="account.php" method="GET">
            <button name="action">Déconnexion</button>
          </form> -->
          <!-- </div> -->
    </div>
  </header>
  <Nav/>
  <main>
    <div id="descAndDatePickers">
      <button 
        class="dateIndicator" 
        title="Change the timeline's Start Date"
        on:click={() => showModal("modalChangeStartDate")}
      >
        01-01-2000
      </button>
      <Description />
      <button 
        class="dateIndicator" 
        title="Change the timeline's End Date"
        on:click={() => showModal("modalChangeEndDate")}
      >
        31-12-2099
      </button>    
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

  <ModalLoadTimeline on:closeThisModal={() => closeModal('modalLoadTimeline')}/>
  <ModalStartDate on:closeThisModal={() => closeModal('modalChangeStartDate')}/>
  <ModalEndDate on:closeThisModal={() => closeModal('modalChangeEndDate')}/>
  <ModalHelp on:closeThisModal={() => closeModal('modalHelp')}/>
  <ModalAddEvent on:closeThisModal={() => closeModal('modalAddEvent')}/>
  <ModalAddLine on:closeThisModal={() => closeModal('modalAddLine')}/>
  <ModalEditEvent on:closeThisModal={() => closeModal('modalEditEvent')}/>
  <ModalRemoveLine on:closeThisModal={() => closeModal('modalRemoveLine')}/>
  <ModalInfoItem on:closeThisModal={() => closeModal('modalInfoItem')}/>
  <ModalEditLine on:closeThisModal={() => closeModal('modalEditLine')}/>  <!-- #DELETE: This used to be there: on:showModal={(event) => showModal(event.detail.modalId)} -->

  <Footer/>

<!-- </PageTransition> -->
<img src="https://app.piratepx.com/ship?p=e9814aae-7a7e-4d9f-85e5-a5a22c3ee4d5&i=%2fapp" alt="" style="display:none;"/> <!-- '%2f' == '/' -->
<script>
  // import PageTransition from "../components/PageTransition.svelte";
  import { onMount } from "svelte";
  // import moment from "moment";
  import Footer from "../components/Footer.svelte";
  import Auth from "../components/Auth.svelte";
  import Title from "../components/Title.svelte";
  import Description from "../components/Description.svelte";
  import ModalLoadTimeline from "../components/modals/LoadTimeline.svelte";
  import ModalStartDate from "../components/modals/StartDate.svelte";
  import ModalEndDate from "../components/modals/EndDate.svelte";
  import ModalEditEvent from "../components/modals/EditEvent.svelte";
  import ModalHelp from "../components/modals/Help.svelte";
  import ModalAddEvent from "../components/modals/AddEvent.svelte";
  import ModalEditLine from "../components/modals/EditLine.svelte";
  import ModalRemoveLine from "../components/modals/RemoveLine.svelte";
  import ModalAddLine from "../components/modals/AddLine.svelte";
  import ModalInfoItem from "../components/modals/InfoItem.svelte";
  import Nav from "../components/Nav.svelte";
  // import {description, title, changesSaved} from '../components/TheTimeline.js';
  import TheTimeline from "../components/TheTimeline.js"
  import {showModal, closeModal} from '../components/modals/ModalsCommon.svelte'


  onMount(async () => {
    const module = await import('pikaday');
    let Pikaday = module.default;
    
    TheTimeline.setupTimeline();
    TheTimeline.showDemoTimeline();
    
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
    });
    
    
    // #TODO: Warn user if about to quit with unsaved changes
    // window.onbeforeunload = function () {
      // if (changesSaved) {
      //   ;
      // } else {
      //   return "Vos dernières modifications n'ont pas été enregistré.";
      // }
    // };

  })

</script>