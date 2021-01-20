<script>
  import { availableTimelines } from '../TheTimeline.js';
  import { createEventDispatcher } from 'svelte';
  import { loadTimeline } from "../DB.svelte";

  const dispatch = createEventDispatcher();
  let errorMessage = "";

</script>

<div id="modalLoadTimeline" title="Load one of your timelines" class="modal">
  <header>
    <h6>Load timeline</h6>
    <button title="close" on:click={() => dispatch('closeThisModal')}>X</button>
  </header>
  <ul>
    {#each $availableTimelines as timeline }
      <li>
        <button on:click={() => loadTimeline(timeline._id)}>{ timeline.name }</button>
      </li>
    {/each}
  </ul>

  <button on:click={() => dispatch('closeThisModal')}>Cancel</button>
</div>

<style>
  ul { 
    margin: 3rem;
  }

  li { 
    margin: 2rem;
  }
</style>