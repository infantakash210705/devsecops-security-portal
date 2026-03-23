async function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const res = await fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
});

const data = await res.json();

if(data.status === "blocked"){
document.getElementById("msg").innerText="IP Blocked due to brute force attack";
return;
}

if(data.status === "failed"){
document.getElementById("msg").innerText="Invalid credentials";
return;
}

if(data.role === "admin"){
window.location="admin-dashboard.html";
}

if(data.role === "employee"){
window.location="employee.html";
}

}