console.log("hi")

const username = document.getElementById("username");
const password = document.getElementById("password");

document.getElementById("login-btn").addEventListener("click",function(){
    if(username.value == "admin" && password.value == "admin123"){
        window.location.assign("/home.html");
    }else{
        alert("Incorrect Password")
    }
    username.value = "";
    password.value = "";
})