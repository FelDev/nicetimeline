<script>
  import {title, changesSaved} from './TheTimeline.js';
  let changingTitle = false;
  let newTitle = "";

  function changeTitle() {
    $title = newTitle;
    $changesSaved = false;
    changingTitle = false;
  }
</script>

{#if changingTitle}
  <div id="newTitleTemp">
    <textarea name="newTitle" cols="40" rows="5" bind:value={newTitle}/>
    <button on:click={changeTitle}>Ok!</button>
    <button on:click={() => changingTitle = false}>Cancel</button>
  </div>
{:else if $title == ''}
  <div id="btnAddTitle">
    <button on:click={() => changingTitle = true}>Add a title</button>
  </div>
{:else}
  <h2
    tabindex="0"
    role="button"
    id="timelineTitle"
    title="Change the Title"
    on:click={() => changingTitle = true}>
    {$title}
  </h2>
{/if}
