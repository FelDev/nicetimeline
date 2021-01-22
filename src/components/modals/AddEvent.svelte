<script>
  import TheTimeline from '../TheTimeline.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let errorMessage = "";
  let title = "";
  let startDate;
  let endDate;
  let desc;
  let color;
  
  function addEvent() {
    // #TODO: figure out why binding doesn't work on datepickers
    startDate = document.getElementById("datePickerStart").value;
    endDate = document.getElementById("datePickerEnd").value;
    
    try {
      console.log("desc", desc)
      console.log("title", title)
      console.log("startDate", startDate)
      console.log("endDate", endDate)
      console.log("color", color)
      
      TheTimeline.addEvent(title, startDate, endDate, desc, color);
      
      dispatch('closeThisModal')
    } catch (error) {
        errorMessage = error 
    }

  }

</script>

<div id="modalAddEvent" title="Add an event" class="modal">
    <header>
      <h6>Add an event</h6>
      <button title="close" on:click={() => dispatch('closeThisModal')}>X</button>
    </header>
    
    <form onsubmit="return false">

      <p>
        <label for="newEventTitle">Title: </label>
        <input type="text" id="newEventTitle" bind:value={title}>
      </p>
      <p>
        <label for="newEventDesc"> Description: </label>
        <textarea id="newEventDesc" placeholder="(optional)" bind:value={desc}></textarea>
      </p>
      <p>
        <label for="newEventColor"> Color: </label>
        <select id="newEventColor" bind:value={color}>
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
        <input type="text" id="datePickerStart" autocomplete="off" bind:value={startDate}>
      </p>
      <p>
        <label for="datePickerEnd">End Date: </label>
        <input type="text" id="datePickerEnd" autocomplete="off" bind:value={endDate}>
      </p>

      <p class="alert">{errorMessage}</p>
      <br>
      <div class="buttons">
        <button on:click={addEvent}>Add</button>
        <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
      </div>
    </form>
  </div>