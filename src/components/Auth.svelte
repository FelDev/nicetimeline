<script>
  import { onMount } from "svelte";

  let loggedIn = false;
  const login = () => netlifyIdentity.open('login');
  const logout = () => netlifyIdentity.logout();
  const signup = () => netlifyIdentity.open('signup');
  const manageSub = () => console.log('@todo manageSub');
  
  const updateUserInfo = (user) => {
    if (user) {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
    console.log('@loggedIn: ', loggedIn);
    
  };

  const handleUserStateChange = (user) => {
    console.log('@user: ', user);
    updateUserInfo(user);
  };
  onMount(async () => {
    netlifyIdentity.on('init', handleUserStateChange);
    netlifyIdentity.on('login', handleUserStateChange);
    netlifyIdentity.on('logout', handleUserStateChange);
  })
</script>

{#if loggedIn}
  <button id="logout" on:click={logout}>Log out</button>
  <button id="mangageSub" on:click={signup}>Signup</button>
{:else}
  <button id="login"  on:click={login}>Log in</button>
  <button id="signup" on:click={signup}>Signup</button>
{/if}