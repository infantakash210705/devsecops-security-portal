const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LoginLog = require("./models/LoginLog");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://securityadmin:DevSecOps123@cluster0.ojrc5ro.mongodb.net/?appName=Cluster0")
.then(()=> console.log("MongoDB Connected"));

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "employee", password: "emp123", role: "employee" }
];

const loginAttempts = {};
const blockedIPs = {};

app.post("/login", async (req,res)=>{

    const {username,password} = req.body;
    const ip = req.ip;

    if(blockedIPs[ip]){
        return res.json({status:"blocked"});
    }

    const user = users.find(u=>u.username === username && u.password === password);

    if(!user){

        loginAttempts[ip] = (loginAttempts[ip] || 0) + 1;

        if(loginAttempts[ip] >= 5){
            blockedIPs[ip] = true;
        }

        await LoginLog.create({
            ip,
            username,
            status:"FAILED",
            attempts:loginAttempts[ip]
        });

        return res.json({status:"failed"});
    }

    loginAttempts[ip] = 0;

    await LoginLog.create({
        ip,
        username,
        status:"SUCCESS",
        attempts:0
    });

    res.json({
        status:"success",
        role:user.role
    });

});

app.get("/logs", async (req,res)=>{
    const logs = await LoginLog.find().sort({time:-1});
    res.json(logs);
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});