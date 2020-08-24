<script>
  import TheTimeline from '../TheTimeline.js';
  import jquery from "jquery";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let errorMessage = "";

  function editEvent() {
    let title = jquery("#editedEventTitle").val();
    let startDate = jquery("#editedEventDatePickerStart").val();
    let endDate = jquery("#editedEventDatePickerEnd").val();
    let color = jquery("#editedEventColor").val();
    try {
        TheTimeline.editEvent(title, startDate, endDate, color);
        dispatch('closeThisModal')
    } catch (err) {
        errorMessage = err;
    }
  }
</script>

<div id="modalEditEvent" title="Modify an event" class="modal">
    <header>
        <h6>Modify an event</h6>
        <button title="close" on:click={() => dispatch('closeThisModal')}>
            X
        </button>
    </header>

    <form onsubmit="return false">
        <p>
            <label for="editedEventTitle">Title:</label>
            <input type="text" id="editedEventTitle" />
        </p>
        <p>
            <label for="editedEventDescription">Description:</label>
            <textarea type="text" id="editedEventDescription" />
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
            <input
                type="text"
                id="editedEventDatePickerStart"
                autocomplete="off" />
        </p>
        <p>
            <label for="editedEventDatePickerEnd">End date:</label>
            <input
                type="text"
                id="editedEventDatePickerEnd"
                autocomplete="off" />
        </p>

        <p class="alert">{errorMessage}</p>
        <br />
        <div class="buttons">
            <button on:click={editEvent}>Apply</button>
            <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
        </div>
    </form>

</div>
