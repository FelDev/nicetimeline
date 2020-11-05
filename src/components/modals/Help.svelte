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
  <p>
    Your data stays yours 100%.
    In fact, you'll have to download and store the data yourself if you want to save a timeline.
    There's no database behind this.
  </p>
  <details>
    <summary>Why have users exporting and importing files? </summary>
    <p>
      I chose that way of saving timelines rather than a classic account creation flow for <span class="bold">maximal privacy</span>.
    </p>
    <p>
      The first version of this webapp had users creating accounts and saving their data to a database, but
      virtually 100% of people had the same concern: "Won't you be able to see my timeline?". Indeed, I can hack my
      own websites quite easily.
    </p>
    <p>
      At first I thought about adding client-side encryption, but, for users, that's about as complex and
      inconvenient as keeping files. Also, to be really sure that I actually implement that encryption, users would
      have to look through the code.
    </p>
    <p>
      With export/import of a simple .json file, you can turn your internet connection off and disable all cookies
      while using the app. It still works and nobody, not even me, <span class="bold">can</span> peek at your data.
    </p>
    <p>
      On top of it, no user management and no database makes this webapp much simpler to develop and much cheaper to
      host. (So cheap, this is free to use. (But you can <a target="_blank" rel="noopener"
        href="https://ko-fi.com/feldev">make a donation</a> if you want, much appreciated!
      <!-- (And you might be on the shoutout page, if you choose to.) -->))
    </p>
    <p>
      If you would enjoy the ability to create an account and save your data on the cloud, do <a target="_blank"
        rel="noopener" href="https://www.felixparadis.com/contact/">send a feature request</a>!
    </p>
  </details>
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
    Click "Export timeline" and keep the file somewhere safe.
  </p>
  <p>
    <span class="push-left">- To load a saved timeline: <br> </span>
    Click "Import timeline" and drag and drop the file you previously exported.
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
