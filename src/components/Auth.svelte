<script>
  import { onMount } from "svelte";
  import { saveTimeline, loadTimelines } from "./DB.svelte";
  import { availableTimelines } from './TheTimeline.js';
  import {showModal} from './modals/ModalsCommon.svelte'
  
  let loggedIn = false;
  const login = () => netlifyIdentity.open('login');
  const logout = () => netlifyIdentity.logout();
  const signup = () => netlifyIdentity.open('signup');
  const save = async () => {
    let token;
    try {
      token = await netlifyIdentity.currentUser().jwt(true);
    } catch (err) {
      token = false;
    }
    console.log('@token: ', token);
    saveTimeline(token)
  }

  const load = async () => {
    let token;
    try {
      token = await netlifyIdentity.currentUser().jwt(true);
    } catch (err) {
      token = false;
    }
    console.log('@token: ', token);
    $availableTimelines = await loadTimelines(token)
    showModal("modalLoadTimeline")
  }

  const handleUserStateChange = (user) => {
    console.log('@handleUserStateChange user: ', user);
    if (user) {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
  };

  onMount(async () => {
    netlifyIdentity.on('init', handleUserStateChange(netlifyIdentity.currentUser()));
    netlifyIdentity.on('login', handleUserStateChange);
    netlifyIdentity.on('logout', handleUserStateChange);
    
    netlifyIdentity.on('open', () => document.addEventListener("keyup", closeModalWithEsc));
    netlifyIdentity.on('close', () => document.removeEventListener("keyup", closeModalWithEsc));
    function closeModalWithEsc(e) {
			if (e.key == "Escape" || e.keyCode == 27) {
        netlifyIdentity.close();
			}
    }
  })
  
</script>
<!-- {loggedIn} -->
{#if loggedIn}
  <button id="logout" on:click={logout}>Log out</button>
  <button id="save" on:click={save}>Save</button>
  <button id="load" on:click={load}>Load Timeline</button>
{:else}
  <button id="login"  on:click={login}>Log in</button>
  <button id="signup" on:click={signup}>Signup</button>
{/if}