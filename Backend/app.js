//fZH85Qog0Sg19p1o

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");

const app = express();
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);
app.use("/files", express.static("files"));

mongoose
  .connect(
    "mongodb+srv://joelnithushan6:fZH85Qog0Sg19p1o@cluster0.fdwwjge.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));

//call register model
require("./Model/Register");
const User = mongoose.model("Register");
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    res.send({ status: "ok" });
  } catch (err) {
    res.send({ status: "err" });
  }
});


//login-----------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) {
      return res.json({err: "User not found"})
    }
    if(user.password === password) {
      return res.json({status: "ok"});
    }else{
        return res.json({status: "Incorret Password"});
    }
} catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error" });
    }
});

//pdf----------------
const multer = require("multer");
const storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, "./files");
  },
  filesname: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

//insert model part
require("./Model/PdfModel");
const pdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage});

app.post("/uploadfile", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const pdf = req.file.filename;

  try {
    await pdfSchema.create({ title: title, pdf: pdf });
    console.log("File uploaded successfully");
    res.send({ status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error" });
  }
});

app.get("/getFile", async (req, res) => {
  try{
    const data = await pdfSchema.find();
    res.send({ status: 200, data: data });
  }catch (err) {
    console.log(err);
    res.status(500).send({ status: "error" });
  }
});



//image----------------

require("./Model/ImgModel");
const ImgSchema = mongoose.model("ImgModel");

const multerimg = require("multer");

const storageimg= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/src/Components/Imguploder/files");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() ;
    cb(null, uniqueSuffix + file.originalname);
  }
});

const uploading = multerimg({ storage: storage });

app.post("/uploadImg", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename;
  
  try {
    await ImgSchema.create({Image:imageName});
    res.json({status: "ok"});
  }catch(err){
    res.json({status:err});
  }
});

//display img

app.get("/getImage", async (req, res) => {
  try{
    ImgSchema.find({}).then((data)=>{
      res.send({status: "ok", data: data});
    });
    }catch(err){
      res.json({status: error});
  }

});
