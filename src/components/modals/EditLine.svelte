<script>
  import TheTimeline from "../TheTimeline.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let newLineName = "";
  let errorMessage = "";
  function updateLine() {
      // Si la nouvelle ligne n'a pas de nom, on avertit l'usager
      if (newLineName == "") {
          errorMessage = "Your new line must have a name!";
      } else if (newLineName.length > 20) {
          errorMessage = "The line's name must be 20 characters or less.";
      } else {
          try {
              TheTimeline.updateLineName(newLineName);
              dispatch("closeThisModal");
          } catch (error) {
              errorMessage = "The line's name must be 20 characters or less.";
          }
      }
  }

  function preDeleteLine() {
      dispatch("closeThisModal");
      dispatch("showModal", {
          modalId: "modalRemoveLine",
      });
  }
</script>

<div
  id="modalEditLine"
  title="Rename or delete this line"
  class="modal"
  draggable="true">
  <header>
    <h6>Rename or delete this line</h6>
    <button title="close" on:click={() => dispatch('closeThisModal')}>
        X
    </button>
  </header>
  <form onsubmit="return false">
    <label for="newLineName">New name for this line:</label>
    <input type="text" id="newLineName" bind:value={newLineName} />
    <br />
    <div class="buttons">
      <button on:click={updateLine}>update</button>
      <button on:click={preDeleteLine}>Delete this line</button>
      <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
    </div>
  </form>
  <p class="alert">{errorMessage}</p>
</div>
