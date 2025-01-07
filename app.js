if(process.env.NODE_ENV!="Production"){
    require('dotenv').config();
}





const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter= require("./routes/review.js")
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const localStrategy= require("passport-local");
const userRouter= require("./routes/user.js");
const User= require("./models/user.js");

app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use((express.urlencoded({extended:true})));

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dbUrl= process.env.ATLASDB_URL;
main().then(()=>{console.log("connected to DB");})
.catch((err)=>{console.log(err);});
async function main (){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,    },
touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in store");
});
const sessionOptions= {
    store,
    secret: process.env.SECRET, 
    resave:false,
    saveUninitialized:true,
    cookie:{
expires:Date.now() +7*24*60*60*1000,
maxAge: 7*24*60*60*1000,
httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
// app.get("/demouser", async(re,res)=>{
// let fakeUser= new User({
//     email:"student@gmail.com",
//     username:"delta-student",
// });
// let registereduser= await User.register(fakeUser,"helloworld");
// res.send(registereduser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.get("/",(req,res)=>{
    res.send("it is a root");
});
//error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // (statusCode).send(message);
});

//starting browser
app.listen(8080,()=>{
    console.log("its working on port 8080");
});
