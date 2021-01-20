<script>
  import {title, changesSaved} from './TheTimeline.js';
  let changingTitle = false;
  let newTitle = "";

  function preChangeTitle() {
    changingTitle = true;
    newTitle = $title;
  }

  function changeTitle() {
    $title = newTitle;
    $changesSaved = false;
    changingTitle = false;
  }
</script>

<style>
  input {
    padding: 0.25rem;
  }
</style>

{#if changingTitle}
  <div id="newTitleTemp">
    <input name="newTitle" bind:value={newTitle}/>
    <button on:click={changeTitle}>Ok!</button>
    <button on:click={() => changingTitle = false}>Cancel</button>
  </div>
{:else if $title == ''}
  <div id="btnAddTitle">
    <button on:click={preChangeTitle}>Add a title</button>
  </div>
{:else}
  <h2
    tabindex="0"
    role="button"
    id="timelineTitle"
    title="Change the Title"
    on:click={preChangeTitle}>
    {$title}
  </h2>
{/if}
