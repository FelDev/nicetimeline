<style>
  #magicDiv {
    border: 1px solid black;
    padding: 1em;
  }
</style>


<svelte:head>
	<title>Logged In</title>
</svelte:head>
<PageTransition>

	{#if isLoggedIn}
    <h1>You should be logged in, mon chum.</h1>
    <h1>Current user: {userEmail}</h1>
    <button onclick="handleLogout()">Logout</button>
  {:else} 
    <h1>Please sign up or login</h1>
    <form on:submit|preventDefault={handleLogin}>
      <input type="email" name="email" required="required" placeholder="Enter your email" />
      <button type="submit">Send</button>
    </form>
  {/if}
  <div id="magicDiv">Loading...</div>

</PageTransition>


<script>
  import PageTransition from '../components/PageTransition.svelte'
  import { onMount } from "svelte";
  let isLoggedIn = false;
  let userEmail;
  
  // 1️⃣ Install Magic SDK
  import { Magic } from 'magic-sdk';
  // 2️⃣ Initialize Magic Instance
  const magic = new Magic("pk_test_0BB7C67F19D5D09A");
  
  const handleLogin = async e => {
    e.preventDefault();
    console.log('@e: ', e);
    
    const email = new FormData(e.target).get("email");
    if (email) {
      /* One-liner login 🤯 */
      await magic.auth.loginWithMagicLink({ email });
      render();
    }
  };
  const handleLogout = async () => {
    await magic.user.logout();
    render();
  };
  
  // 3️⃣ Implement Render Function
  const render = async () => {
    console.log('@rendering...');
    
    isLoggedIn = await magic.user.isLoggedIn();
    console.log('@isLoggedIn: ', isLoggedIn);
    
    /* Show login form if user is not logged in */
    if (isLoggedIn) {
      /* Get user metadata including email */
      const userMetadata = await magic.user.getMetadata();
      userEmail = userMetadata.email
    }
  };

  onMount(() => {
    render();
  })
</script>