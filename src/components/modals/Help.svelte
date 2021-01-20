<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div id="modalHelp" title="?" class="modal">
  <header>
    <h6>?</h6>
    <button title="close" on:click={() => dispatch('closeThisModal')}>X</button>
  </header>
  <h2>What's Simple Timeline?</h2>
  <p>
    The goal of this webapp is to help you visualize the passing of time.
    I use it to visualize my life, but you could make a timeline about anything.
  </p>
  <h2>Where is my data going?</h2>
  <p>
    Your data stays yours 100%.
    You can even choose to download and store the data yourself without creating an account.
    To do so, use the "Export locally" and "Import local file" buttons.
  </p>
  <p>
    If you choose to manage your data yourself, you can even turn your internet connection off while using the app.
    Nobody, not even me, <span class="bold">can</span> peek at your data.
  </p>
  <p>
    Personally, I prefer to keep my data in the cloud because it's so easy to lose a file. 
  </p>
  
  <h2>Tips and tricks:</h2>
  <p>
    <span class="push-left">- To zoom in and out: <br> </span>
    Hold the <kbd>ctrl</kbd> key and scroll. Or pinch.
  </p>
  <p>
    <span class="push-left">- For a perfect zoom out: <br> </span>
    Double click on the timeline (not on an event).
  </p>
  <p>
    <span class="push-left">- To add events: <br> </span>
    Use the green "+" button or right click on the timeline
  </p>
  <p>
    <span class="push-left">- To edit events: <br> </span>
    Right click on them. You can also drag them around.
  </p>
  <p>
    <span class="push-left">- To move lines up and down: <br> </span>
    Click on a line's name and drag it up or down.
  </p>
  <p>
    <span class="push-left">- To change a timeline's name, description or start/end date: <br> </span>
    Click on what you want to change.
  </p>
  <p>
    <span class="push-left">- To save your timeline: <br> </span>
    Click "Export timeline" and keep the file somewhere safe. Or login and click "save".
  </p>
  <p>
    <span class="push-left">- To load a timeline: <br> </span>
    Click "Import local file" and drag and drop the file you previously exported. Or login and click "load"
  </p>
  <!-- <p>
    <span class="push-left">- : <br> </span>
    
  </p> -->
  <hr>
  <p>
    For questions, comments, feature requests and insults,
    <a target="_blank" rel="noopener" href="https://www.felixparadis.com/contact/">Reach out to me.</a>
  </p>
  <!-- <p>VOUS DEVEZ SAUVEGARDER VOTRE TIMELINE SI VOUS VOULEZ CONSERVER VOS CHANGEMENTS.</p>
  <p>Vous pouvez dragger les événement et changer leurs durée.</p>
  <p>Double cliquez sur la timeline pour un "zoom out parfait".</p>
  <p>Double cliquez sur un événement pour afficher sa description.</p>
  <p>Faites un clic droit sur la timeline pour ajouter un événement.</p>
  <p>Faites un clic droit sur un événement pour le modifier.</p>
  <p>Changez l'ordre des lignes en les draggant une à la fois.</p>
  <p>Amenez votre curseur en dehors de la timeline pour faire défiler la page.</p>
  <p>Les dates de début et de fin de votre timeline sont affichées en haut et sont modifiables.</p>
  <p>Cliquez sur le titre pour le modifier.</p>
  <p>Cliquez sur la description pour la modifier.</p> -->
</div>
