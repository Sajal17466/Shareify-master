require("dotenv").config();
const express = require("express");
const { MulterError } = require("multer");
const app = express();
const multer = require("multer");
const bcrypt= require("bcrypt");
const upload = multer({dest:"uploads"});
const mongoose = require("mongoose");
const File = require("./models/Files");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const nodemailer = require("nodemailer");
const sendMail = require("./models/sendMail");

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.json());


mongoose.connect(process.env.DATABASE_URL,()=>{
    mongoose.set("strictQuery",true);
        if(mongoose.connection.readyState === 1)
        console.log("Database connected.");
});

app.post("/send/:id",sendMail);

app.get("/",(req,res)=>{
    res.render("index");
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

app.post("/upload",upload.single("file"),async function(req,res){
    const fileData={
        path: req.file.path,
        originalName:req.file.originalname        
    }
    if(req.body.password != null && req.body.password !== ""){
        fileData.password =await bcrypt.hash(req.body.password,10);
    }

    const file=await File.create(fileData);
    console.log(file);
    res.header('origin', req.headers.origin)
    res.redirect(`/upload/${file.id}`)
}); 

app.get("/upload/:id",async function(req,res){
    const id  = req.params.id;
    console.log(`http://${req.headers.host}/file/${id}`);
    res.render("download",{fileLink: `http://${req.headers.host}/file/${id}`, fileid: id});
})

app.get("/find/:id",async (req,res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    res.json({filename: file.originalName});
})

async function handleDownload(req,res){
    const id = req.params.id;
    console.log({id});
    console.log(req.body.password)
    const file= await File.findById(req.params.id);
    if(file.password != null){
        if(req.body.password == null)
        {
            console.log("reached")
            res.render("password",{id});
            return;
        }
        if(!(await bcrypt.compare(req.body.password,file.password)))
        {
            
            res.render("password",{error: true});
            return;
        }
    }
    file.downloadCount++;
    console.log(file.downloadCount);
    await file.save();
    res.header("filename",file.originalName);
    res.download(file.path,file.originalName);
    // res.render("download",{fileLink: `http://${req.headers.host}/file/${id}`, fileid: id});
    // res.redirect("/")
    // res.redirect(`/upload/${id}`)
}

 


// app.listen(process.env.PORT,function(){
//     console.log("Server is running at port 3000..");
// });

app.listen(3000,function(){
    console.log("Server is running at port 3000..");
});