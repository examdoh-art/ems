(function () {
  const publicPages = ["index.html", "login.html", ""];
  const page = location.pathname.split("/").pop();
  const user = JSON.parse(localStorage.getItem("paramedicReadyUser") || "null");

  if (!publicPages.includes(page) && !user) {
    location.href = "login.html";
    return;
  }

  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();
      const message = document.querySelector("#loginMessage");
      if (!email || password.length < 4) {
        message.textContent = "Enter a valid email and password.";
        return;
      }
      localStorage.setItem("paramedicReadyUser", JSON.stringify({ email, loginAt: new Date().toISOString() }));
      message.textContent = "Login successful. Opening dashboard...";
      setTimeout(() => {
        location.href = "dashboard.html";
      }, 450);
    });
  }

  document.querySelectorAll("#logoutBtn").forEach(button => {
    button.addEventListener("click", () => {
      localStorage.removeItem("paramedicReadyUser");
      location.href = "index.html";
    });
  });
})();
