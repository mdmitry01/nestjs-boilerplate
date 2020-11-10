(() => {
  window.addEventListener("load", async () => {
    const user = {
      email: window._SWAGGER_USER_EMAIL,
      password: window._SWAGGER_USER_PASSWORD
    };

    const response = await fetch("/account/sign-in", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user)
    });

    const { accessToken } = await response.json();
    ui.preauthorizeApiKey("bearer", accessToken);

    console.log("user", user);
    console.log("accessToken", accessToken);
  });
})();
