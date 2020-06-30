<script>
  // <!-- 1️⃣ Install Magic SDK -->
  import { Magic } from 'magic-sdk';

  /* 2️⃣ Initialize Magic Instance */
  const magic = new Magic("pk_test_0BB7C67F19D5D09A");
  console.log('@magic: ', magic);
  
  /* 3️⃣ Implement Render Function */
  const render = async () => {
    console.log('@rendering...');
    
    const isLoggedIn = await magic.user.isLoggedIn();
    /* Show login form if user is not logged in */
    let html = `
      <h1>Please sign up or login</h1>
      <form onsubmit="handleLogin(event)">
        <input type="email" name="email" required="required" placeholder="Enter your email" />
        <button type="submit">Send</button>
      </form>
    `;
    if (isLoggedIn) {
      /* Get user metadata including email */
      const userMetadata = await magic.user.getMetadata();
      html = `
        <h1>Current user: ${userMetadata.email}</h1>
        <button onclick="handleLogout()">Logout</button>
      `;
    }
    document.getElementById("magicDiv").innerHTML = html;
  };
  /* 4️⃣ Implement Login Handler */
  const handleLogin = async e => {
    console.log('@e: ', e);
    
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    if (email) {
      /* One-liner login 🤯 */
      await magic.auth.loginWithMagicLink({ email });
      render();
    }
  };
  /* 5️⃣ Implement Logout Handler */
  const handleLogout = async () => {
    await magic.user.logout();
    render();
  };
</script>

<div id="magicDiv">Loading...</div>