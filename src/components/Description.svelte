<script>
  import {description, changesSaved} from './TheTimeline.js';
  let changingDesc = false;
  let newDesc = "";

  function preChangeDesc() {
    changingDesc = true;
    newDesc = $description;
  }

  function changeDesc() {
    $description = newDesc;
    $changesSaved = false;
    changingDesc = false;
  }
</script>

{#if changingDesc}
  <div id="newDescTemp">
    <textarea name="newDesc" cols="40" rows="5" bind:value={newDesc}/>
    <button on:click={changeDesc}>Ok!</button>
    <button on:click={() => changingDesc = false}>Cancel</button>
  </div>
{:else if $description == ''}
  <div id="btnAddDesc">
    <button on:click={preChangeDesc}>Add a description</button>
  </div>
{:else}
  <p
    tabindex="0"
    role="button"
    id="description"
    title="Change the description"
    on:click={preChangeDesc}>
    {$description}
  </p>
{/if}
