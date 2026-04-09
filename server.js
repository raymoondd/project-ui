// JS functions
function showAlert(text) {
    const alertBox = document.getElementById("customAlert");
    document.getElementById("alertText").textContent = text;
    alertBox.style.display = "block";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";

}

// Modified login function
function login() {
    let firstname = document.getElementById("firstname").value.trim();
    let password = document.getElementById("password").value.trim();
    let message = document.getElementById("message");

    
//random user name & password    
    const users = [
        { firstname: "raymond", password: "raymond" },
        { firstname: "admin", password: "admin" },
        { firstname: "jenina", password: "jenina" },
        { firstname: "random", password: "random" },
        { firstname: "user", password: "user" },
        { firstname: "tiffany", password: "tiffany" },
        
    ];

    const validUser = users.some(user =>
        user.firstname === firstname && user.password === password
    );

    if (validUser) {
        message.style.color = "green";
        message.textContent = "Redirecting....";
        message.style.opacity = 1;

        setTimeout(() => {
            message.style.opacity = 0;
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        }, 2000);

    } else {
        message.style.color = "red";
        message.style.opacity = 1;

        showAlert("Invalid Credentials!!"); // custom alert

        setTimeout(() => {
            message.style.opacity = 0;
        }, 3000);
    }
}

function contact() {
    const info = document.getElementById("contactInfo");

    if (info.style.display === "block") {
        info.style.display = "none";
    } else {
        info.style.display = "block";
    }
}

