// backend/server.js
const express = require("express");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- DATABASE ---------- */
const { connect_Db_register } = require("./config/create_account");
connect_Db_register();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// log every request
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

/* ---------- API ROUTES ONLY ---------- */
app.use("/api/register", require("./routes/register-account"));
app.use("/api/login", require("./routes/login_verify"));
app.use("/api/submit", require("./routes/submit-gunaso"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));
app.use("/admin", require("./routes/admin_login"));

/* ---------- TEST ENDPOINT ---------- */
app.get("/api", (req, res) => {
  res.json({ status: "API is running ✅" });
});

app.get("/", (req,res) => res.json({ message: "Backend API running" }));

/* ---------- START ---------- */
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
