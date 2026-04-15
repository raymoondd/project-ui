// JS functions
//alert("Enter your name in both FIRST NAME & PASSWORD in lowercase");
//alert("If your first name and password match the stored data, you will proceed directly. For a better experience, please use a desktop or computer.");

function showAlert(html) {
    const alertBox = document.getElementById("customAlert");
    document.getElementById("alertText").innerHTML = html;
    alertBox.style.display = "block";
}


showAlert(
    'Enter your name in both <mark>First Name</mark> and <mark>Password</mark> in <span style="color:white;">lowercase</span>'
);


function closeAlert() {
    document.getElementById("customAlert").style.display = "none";

    document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});

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
        { firstname: "universefamily", password: "universefamily" },
        
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

        showAlert("Sorry, you don’t have permission to continue."); // custom alert

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
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});
