const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userRoutes = require("./Routes/UserRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/files", express.static(path.join(__dirname, "files")));

// Create files directory if it doesn't exist
const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
  console.log("Created files directory");
}

// MongoDB Connection
mongoose
  .connect("mongodb+srv://joelnithushan6:fZH85Qog0Sg19p1o@cluster0.fdwwjge.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));

// Models
require("./Model/Register");
const Register = mongoose.model("Register");
require("./Model/PdfModel");
const PdfDetails = mongoose.model("PdfDetails");
require("./Model/ImgModel");
const ImgModel = mongoose.model("ImgModel");

// Authentication Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log("Registration request:", { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: "error", 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        status: "error", 
        message: "User already exists with this email" 
      });
    }

    // Create new user
    const newUser = await Register.create({ name, email, password });
    console.log("User registered successfully:", newUser._id);

    res.status(201).json({ 
      status: "ok", 
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message || "Registration failed" 
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login request:", { email });

    if (!email || !password) {
      return res.status(400).json({ 
        status: "error", 
        message: "Email and password are required" 
      });
    }

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        status: "error", 
        message: "Invalid credentials" 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        status: "error", 
        message: "Invalid credentials" 
      });
    }

    res.status(200).json({ 
      status: "ok", 
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Login failed" 
    });
  }
});

// User CRUD (separate from authentication)
app.use("/users", userRoutes);

// PDF Upload Configuration
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadPdf = multer({ 
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// PDF Routes
app.post("/uploadfile", uploadPdf.single("file"), async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ 
        status: "error", 
        message: "No file uploaded" 
      });
    }

    if (!req.body.title) {
      return res.status(400).json({ 
        status: "error", 
        message: "Title is required" 
      });
    }

    const title = req.body.title;
    const pdf = req.file.filename;

    const newPdf = await PdfDetails.create({ title, pdf });
    console.log("PDF saved to database:", newPdf);

    res.status(200).json({ 
      status: 200, 
      message: "File uploaded successfully",
      data: newPdf 
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message || "Upload failed" 
    });
  }
});

app.get("/getFile", async (req, res) => {
  try {
    const data = await PdfDetails.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      status: 200, 
      data,
      count: data.length 
    });
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
});

// Image Upload Configuration
const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadImg = multer({ 
  storage: imgStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for images
});

// Image Routes
app.post("/uploadImg", uploadImg.single("image"), async (req, res) => {
  try {
    console.log("Image upload request received");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ 
        status: "error", 
        message: "No image uploaded" 
      });
    }

    const imageName = req.file.filename;
    const newImage = await ImgModel.create({ image: imageName });
    console.log("Image saved to database:", newImage);
    
    res.status(200).json({ 
      status: "ok", 
      message: "Image uploaded successfully",
      data: newImage 
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
});

app.get("/getImg", async (req, res) => {
  try {
    console.log("Fetching images from database");
    const data = await ImgModel.find().sort({ createdAt: -1 });
    console.log("Found images:", data.length);
    
    res.status(200).json({ 
      status: "ok", 
      data,
      count: data.length 
    });
  } catch (err) {
    console.error("Get images error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
});

app.get("/getImage", async (req, res) => {
  try {
    const data = await ImgModel.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      status: "ok", 
      data,
      count: data.length 
    });
  } catch (err) {
    console.error("Get images error:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        status: "error", 
        message: "File too large" 
      });
    }
  }
  res.status(500).json({ 
    status: "error", 
    message: error.message 
  });
});
