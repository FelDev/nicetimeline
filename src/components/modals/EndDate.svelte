<script>
  import TheTimeline from '../TheTimeline.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let errorMessage = "";

function changeEndDate() {
    let endDate = document.getElementById("datePickerTimelineEnd").value;

    try {
      TheTimeline.changeEndDate(endDate);
      dispatch('closeThisModal');
    } catch (error) {
      errorMessage = error
    }
}

</script>

<div id="modalChangeEndDate" title="Choose End Date" class="modal">
  <header>
    <h6>Choose End Date</h6>
    <button title="close" on:click={() => dispatch('closeThisModal')}>X</button>
  </header>
  
  <form onsubmit="return false">
    <p>
      <label for="datePickerTimelineEnd">End Date: </label>
      <input type="text" id="datePickerTimelineEnd" autocomplete="off">
    </p>
    <p class="alert">{errorMessage}</p>
    <br>
    <div class="buttons">
      <button on:click={changeEndDate}>Update</button>
      <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
    </div>
  </form>

</div>