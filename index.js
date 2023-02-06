const express =require("express")
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const fs=require("fs")

const{connection} = require("./config/db")
const{UserModel}= require("./models/User.model")
const{authenticate} = require("./middlewares/authenticate");
const { authorise } = require("./middlewares/authorise");
const app =express();

app.use(express.json())

app.post("/signup",(req,res)=>{
    const {name, email, password, role}= req.body;
    bcrypt.hash(password, 5, async function(err, hash){
    const user =new UserModel({
        name,
        email,
        password:hash,
        role
    })
    await user.save()
    res.send("signup successful")
    }); 
})

app.post("/login", async (req,res)=>{
    const {email, password}=req.body;

    const user = await UserModel.findOne({email})
    if(!user){
        res.send("Please singup first")
    }
    const hashedpwd = user?.password
    bcrypt.compare(password, hashedpwd, function(err, result){
        if(result){
            const token= jwt.sign({userID : user._id, role : user.role}, "SECRET")
            res.send({msg:"login successful", token})
        }
        else{
            res.send("login failed")
        }
    })
})


app.get("/goldrate", authenticate, (req,res)=>{
    res.send("here are your gold rate")
})

app.get("/userstats", authenticate, authorise(["manager"]), (req,res)=>{
    res.send("your user stats")
})


app.get("/logout",(req, res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    const blacklisteddata= JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklisteddata.push(token)
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisteddata))
    res.send("Logout successful") 
})



app.listen(8080, async()=>{
    try{
        await connection;
        console.log("successfully connected to DB")
    }
    catch(err)
    {
        console.log("connecting to DB failed")
        console.log(err)
    }
    console.log("Listening on port 8080")
})