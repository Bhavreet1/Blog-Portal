// Simple client-side script for home.ejs
document.addEventListener("DOMContentLoaded", function () {
    console.log("public/app.js loaded");
    // Example: find an element with id "message" and log its content
    const msgEl = document.getElementById("message");
    if (msgEl) {
        console.log("Message on page:", msgEl.textContent);
    }
});
