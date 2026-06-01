const user = JSON.parse(localStorage.getItem("paramedicReadyUser") || "null");
const studentName = document.querySelector("#studentName");
if (user && studentName) {
  studentName.textContent = `Welcome, ${user.email}`;
}
