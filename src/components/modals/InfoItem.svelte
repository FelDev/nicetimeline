<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div id="modalInfoItem" title="" class="modal">
    <header>
        <h6 />
        <button title="close" on:click={() => dispatch('closeThisModal')}>
            X
        </button>
    </header>
    <p />
    <!-- Éventuellement il faudrait un img tag ici, quand on aura des images... -->
</div>
