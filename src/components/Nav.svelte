<script>
  import {
    description,
    title,
    changesSaved,
  } from "../components/TheTimeline.js";
  import TheTimeline from "../components/TheTimeline.js";

  function startNewTimeline() {
    TheTimeline.clearTimeline();
    // #RENDUICI: popup: choose name, dates, etc...
  }
  function toggleImporter() {
    document.getElementById("drop_zone").classList.toggle("show");
  }

  function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    try {
      if (ev.dataTransfer.items) {
        const reader = new FileReader();
        reader.onloadend = function () {
          let data;
          try {
            data = JSON.parse(this.result);
          } catch (err) {
            return alert("This file appears to be invalid. :|");
          }
          TheTimeline.loadTimeline(data);
          toggleImporter();
        };

        reader.readAsText(ev.dataTransfer.files[0]);
      }
    } catch (err) {
      alert("This file appears to be invalid. :|");
    }
  }

  function dragOverHandler(ev) {
    // console.log('File(s) in drop zone');
    ev.preventDefault();
  }
</script>

<style>

</style>

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

  <button on:click={TheTimeline.showDemoTimeline}>Show demo timeline</button>
  <button on:click={startNewTimeline}>New timeline</button>
  <button on:click={toggleImporter}>Import timeline</button>
  <div
    id="drop_zone"
    on:drop={(e)=>dropHandler(e)}
    on:dragover={(e) => dragOverHandler(e)}>
    <button on:click={toggleImporter}>x</button>
    <p>
      Drag and drop a .timeline file here
      <br />
      (This will replace the current timeline)
    </p>
    <!-- <input type="file"> -->
  </div>
  <button on:click={TheTimeline.exportTimelineToClient}>Export timeline</button>
  <a id="exportTimelineToClient" style="display: none;">Export timeline</a>

</nav>
