//fZH85Qog0Sg19p1o

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");

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
// const upload = multer({ storage}); // Removed duplicate declaration

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
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use("/files", express.static(path.join(__dirname, "uploads")));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models
const User = require("./models/User");
const Pdf = require("./models/Pdf");
const Image = require("./models/Image");

// File Storage Configuration
const createStorage = (destination) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: createStorage(path.join(__dirname, "uploads")),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  }
});

// Routes
// Auth Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ 
      status: "success",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      status: "success",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PDF Routes
app.post("/uploadfile", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newPdf = await Pdf.create({
      title,
      pdf: req.file.filename
    });

    res.status(201).json({ 
      status: "success",
      pdf: { id: newPdf._id, title: newPdf.title }
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
});

app.get("/getFile", async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort("-createdAt");
    res.json({ status: "success", count: pdfs.length, data: pdfs });
  } catch (err) {
    console.error("PDF fetch error:", err);
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
});

// Image Routes
app.post("/uploadImg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const newImage = await Image.create({
      image: req.file.filename
    });

    res.status(201).json({ 
      status: "success",
      image: { id: newImage._id, filename: newImage.image }
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

app.get("/getImage", async (req, res) => {
  try {
    const images = await Image.find().sort("-createdAt");
    res.json({ status: "success", count: images.length, data: images });
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
