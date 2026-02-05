// backend/server.js
const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------- DATABASE CONNECTION ------------------- */
const { connect_Db_register } = require("./config/create_account");
connect_Db_register();

/* ------------------- MIDDLEWARE ------------------- */
// Serve uploads folder (if any)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// USER SESSION
app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// ADMIN SESSION (only for /admin routes)
app.use(
  "/admin",
  session({
    name: "adminSession",
    secret: process.env.ADMIN_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

/* ------------------- STATIC FRONTEND PAGES ------------------- */
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/homepage.html"))
);
app.get("/api/homepage", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/homepage.html"))
);
app.get("/api/submit", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/submit.html"))
);
app.get("/api/trending", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/trending.html"))
);
app.get("/api/hotnews", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/hotnews.html"))
);
app.get("/api/support", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/supportus.html"))
);
app.get("/api/feedback", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/feedback.html"))
);
app.get("/api/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/signup.html"))
);
app.get("/api/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"))
);
app.get("/gunaso/:id", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/detail_gunaso.html"))
);
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/admin_login.html"))
);
app.get(
  "/admin/dashboard",
  require("./routes/admin_login").isAdmin,
  (req, res) =>
    res.sendFile(path.join(__dirname, "../frontend/html/admin_dashboard.html"))
);

/* ------------------- API ROUTES ------------------- */
// All functional routes under /api
app.use("/api/submit", require("./routes/submit-gunaso"));
app.use("/api/register", require("./routes/register-account"));
app.use("/api/login", require("./routes/login_verify"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));

// Admin login/logout routes
app.use("/admin", require("./routes/admin_login"));

/* ------------------- START SERVER ------------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
