const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')




mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const UserSCH = new mongoose.Schema({
    email: String,
    password: String
})

const scrt = "ThisIsOurSecret"

UserSCH.plugin(encrypt,{
    secret:scrt ,encryptedField:["password"]
})

const User = new mongoose.model('User', UserSCH)

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.route('/').get((req, res) => {
    res.render('home')
}).post((req, res) => {

})

//register
app.route('/register').get((req, res) => {
    res.render('register')
}).post((req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)
    
 const usr1 = new User({
     email: req.body.username,
     password: req.body.password
 })

    usr1.save()
    res.render("secrets")
})

//login
app.route('/login').get((req, res) => {
    res.render('login')
}).post((req, res) => {

    User.findOne({email:req.body.username} , (err,result)=>{
        if(err){
            console.log(err);
        }else{
            
            if(result){
                if(result.password == req.body.password){
                    res.render("secrets")
                }else{
                    res.render("login")
                }
            }
        }
    })

})


app.listen(4000, () => {
    console.log("port 4000");
})



