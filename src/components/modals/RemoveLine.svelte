 <script>
  import TheTimeline from '../TheTimeline.js';
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function deleteLine() {
    TheTimeline.deleteLine()
    dispatch('closeThisModal')
  }
  
</script>

<div id="modalRemoveLine" title="Do you want to delete this line?" class="modal">
  <header>
    <h6>Do you want to delete this line?</h6>
    <button title="close" on:click={dispatch('closeThisModal')}>X</button>
  </header>
  <p>This line and all its events will be deleted.</p>
  <p>Go ahead?</p>
  <form onsubmit="return false">
    <div class="buttons">
      <button on:click={deleteLine}>Yes</button>
      <button on:click={dispatch('closeThisModal')}>Cancel</button>
    </div>
  </form>
</div>