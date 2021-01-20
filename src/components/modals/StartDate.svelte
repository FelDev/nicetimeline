<script>
  import TheTimeline from '../TheTimeline.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let errorMessage = "";

function changeStartDate() {
    let startDate = document.getElementById("datePickerTimelineStart").value;
    console.log('@startDate: ', startDate);
    
    try {
      TheTimeline.changeStartDate(startDate);
      dispatch('closeThisModal');
    } catch (error) {
      errorMessage = error
    }
}

</script>

<div id="modalChangeStartDate" title="Choose Start Date" class="modal">
  <header>
    <h6>Choose Start Date</h6>
    <button title="close" on:click={() => dispatch('closeThisModal')}>X</button>
  </header>
  
  <form onsubmit="return false">
    <p>
      <label for="datePickerTimelineStart">Start Date: </label>
      <input type="text" id="datePickerTimelineStart" autocomplete="off">
    </p>
    <p class="alert">{errorMessage}</p>
    <br>
    <div class="buttons">
      <button on:click={changeStartDate}>Update</button>
      <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
    </div>
  </form>

</div>