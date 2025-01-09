const express = require("express")
const app = express()
const port = 3000
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const usermodel = require("./model/user")
const connection = require("./config/connection")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.get("/",(req,res)=>{
    res.render("homepage")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",async(req,res)=>{
    let {username,email,password} = req.body
    let user = await usermodel.findOne({username})
    if(user){
        res.send("User already exist")
    }
    else{
        bcrypt.genSalt(12,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                let user = await usermodel.create({
                    username,
                    email,
                    password:hash
                })
            })
            let token = jwt.sign({email},"hehe")
            res.cookie("token",token)
            res.render("homepage")
        })
    }
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login",async(req,res)=>{
    let {email,password} = req.body
    let user = await usermodel.findOne({email})
    if(!user){
        res.redirect("register")
    }
    else{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token = jwt.sign({email},"hehe")
                res.cookie("token",token)
                res.redirect("api")
            }
            else{
                res.send("Something went Wrong")
            }
        })
    }
})
app.get("/api",isloggedin,async(req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    console.log(user)
    res.render("api",{user})
})
function isloggedin(req,res,next){
    if(req.cookies.token ===""){
        res.redirect("login")
        next()
    }
    else{
        let data = jwt.verify(req.cookies.token,"hehe")
        req.user = data 
        next()
    }
}
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("login")
})
app.listen(port,()=>{
    console.log(`App is listening at ${port}`)
})
