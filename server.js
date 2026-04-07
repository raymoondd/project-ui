// script.js

// SHOW CUSTOM ALERT
function showAlert(text) {
    const alertBox = document.getElementById("customAlert");
    const alertText = document.getElementById("alertText");

    if (alertBox && alertText) {
        alertText.textContent = text;
        alertBox.style.display = "block";

        // Auto-hide after 3 seconds
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    }
}

// CLOSE ALERT (manual button)
function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    if (alertBox) alertBox.style.display = "none";
}

// LOGIN FUNCTION
function login() {
    const firstnameInput = document.getElementById("firstname");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    if (!firstnameInput || !passwordInput || !message) return;

    const firstname = firstnameInput.value.trim();
    const password = passwordInput.value.trim();

    // Hardcoded users (replace with backend API if needed)
    const users = [
        { firstname: "raymond", password: "raymond" },
        { firstname: "tiffany", password: "tiffany" },
        { firstname: "jenina", password: "jenina" }
    ];

    const validUser = users.some(user => 
        user.firstname === firstname && user.password === password
    );

    if (validUser) {
        // Success message
        message.style.color = "green";
        message.textContent = "Redirecting....";
        message.style.opacity = 1;

        // Fade out message then redirect
        setTimeout(() => {
            message.style.opacity = 0;
            setTimeout(() => {
                window.location.href = "./pages/home.html";
            }, 500);
        }, 2000);
    } else {
        // Invalid credentials
        message.style.color = "red";
        message.style.opacity = 1;
        showAlert("Invalid Credentials!!");

        setTimeout(() => {
            message.style.opacity = 0;
        }, 3000);
    }
}

// CONTACT INFO TOGGLE
function contact() {
    const info = document.getElementById("contactInfo");
    if (!info) return;

    if (info.style.display === "block") {
        info.style.display = "none";
    } else {
        info.style.display = "block";
    }
}

// OPTIONAL: Press Enter to login
document.addEventListener("DOMContentLoaded", () => {
    const firstnameInput = document.getElementById("firstname");
    const passwordInput = document.getElementById("password");

    [firstnameInput, passwordInput].forEach(input => {
        if (input) {
            input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") login();
            });
        }
    });
});
