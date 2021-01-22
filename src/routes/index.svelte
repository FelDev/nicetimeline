<style>
  h1 {
    font-size: 4.5rem;
    margin-left: 5vw;
  }

  h2 {
    color: #fafafa;
    font-size: 4.2rem;
    text-align: center;
  }
  .one {
    background: linear-gradient(0deg, #0000dd7d, #e7ffff);
    background: linear-gradient(0deg, #333, #2b3340);
  }
  .two {
    background: linear-gradient(0deg, red, #0000dd7d);
    background: linear-gradient(0deg, #111, #333);
    background: linear-gradient(0deg, #2b3340, #323442);
  }
  .three {
    background: linear-gradient(0deg, #0000dd7d, #ff0000);
    background: linear-gradient(0deg, #323442, #111);
  }
  section {
    margin: 0 auto;
    padding: 10rem 0.5rem;
    text-align: center;
    max-width: 75rem;
    color: #fafafa;
  }
  
  section a {
    color: #fafafa;
  }

  section a.btn-link {
    background-color: rgba(60, 209, 15, .75);
    border-radius: 5px;
    font-family: fallingSky;
    font-size: 2.5rem;
    padding: 1rem 2rem;
    text-decoration: none;
    margin: 2rem;
    display: inline-block;
  }

  details {
    color: #fafafa;
    text-align: center;
    font-size: 2.2rem;
    cursor: pointer;
  }
  summary:not(:focus-visible) {
    outline:none;
  }
  #timeline {
    margin: 0 2.5rem;
  }

  ul {
    text-align: left;
    font-size: 2.2rem;
  }
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

<!-- #TODO: page transitions, state of the app is hard to work with when doing the fancy transition. -->
<!-- <PageTransition> -->
  
  <header>
    <h1>Simple Timeline</h1>
  </header>
  <main>
    <div class="one">
      <section>
        <h2>A Place to Remember Your Life's Important Periods and Events.</h2>
        <p>As years become decades, we think of our past and realize we forgot dates, places, even people.</p>
        <p>Simple Timeline is a place to keep track of the big picture.</p>
        <p>A tool for reflection.</p>
        <a href="/app" class="btn-link">Try Now - no sign up needed</a>
        <p>or</p>
        <a href="/app?login" class="btn-link">Login</a>
      </section>
    </div>
    <div class="two">
    <h2>Demo Timeline 👇 </h2>
    <details>
      <summary>Tips</summary>
      <p><strong>Zoom</strong> by pinching or by holding down ctrl and scrolling.</p>
      <p><strong>See an event's details</strong> by double clicking it.</p>
      <p><strong>Edit an event</strong> by right clicking it, or drag them around.</p>
    </details>
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
    </div>
    <div class="three">
      <section>
        <h2>Features</h2>
        <ul>
          <li><strong>Free</strong> -
            No catch; this is a hobby project. <a target="_blank" rel="noopener" href="https://ko-fi.com/feldev">Donations </a> are welcome but not mandatory.
          </li>
          <li><strong>Private</strong> - 
            Your data is never sold or consulted. You can even use Simple Timeline without creating an account and save your data locally.
          </li>
          <li><strong>Open source</strong> - 
            This project is based on other open source projects, it only makes sense for it to be open as well.
          </li>
        </ul>
      </section>
    </div>
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
  <ModalEditLine on:closeThisModal={() => closeModal('modalEditLine')}
    on:showModal={(event) => showModal(event.detail.modalId)}/>

  <Footer/>

<!-- </PageTransition> -->

<script>
  // import PageTransition from "../components/PageTransition.svelte";
  import { onMount } from "svelte";
  import Footer from "../components/Footer.svelte";
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