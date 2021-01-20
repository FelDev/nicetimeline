<script>
  import TheTimeline from '../TheTimeline.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  let lineName = "";
  let errorMessage = "";

  function addLine() {
    if (lineName == "") {
        errorMessage = "Your new line must have a name!";
    } else if (lineName.length > 20) {
        errorMessage = "The line's name must be 20 characters or less.";
    } else {
        try {
            TheTimeline.addLine(lineName)
            dispatch('closeThisModal')
        } catch (err) {
            console.log(err)
            // Si la nouvelle ligne a le même nom qu'une ligne déjà existante, on avertit l'usager
            errorMessage = 'Impossible! There already is a line with name "' + lineName + '"';
        }
    }
  }
</script>

<div id="modalAddLine" title="Add a line" class="modal">
    <header>
        <h6>Add a line</h6>
        <button title="close" on:click={() => dispatch('closeThisModal')}>
            X
        </button>
    </header>

    <form onsubmit="return false">

        <p>
            <label for="lineName" >Line name:</label>
            <input type="text" id="lineName" bind:value={lineName}/>
        </p>
        <!-- Positionnement de la nouvelle ligne: <input type="text" id="newLineOrder"> -->

        <p class="alert"/>{errorMessage} <p/>
        <br />
        <div class="buttons">
            <button on:click={addLine}>Add line</button>
            <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
        </div>
    </form>

</div>
