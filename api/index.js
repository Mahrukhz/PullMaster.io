// server.js
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const express = require("express");
require("dotenv").config();
const rewardsRoute = require("./routes/rewards.routes");
const repositoriesRoute = require("./routes/repositories.routes");
const pullRequestHistoryRoute = require("./routes/pullRequestHistory.routes");
const userRoute = require("./routes/user.routes");
const trackerRoute = require("./routes/tracker.routes");

const app = express();

// connect database
connectDB();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("Server up and running"));


// routes
app.use("/", authRoutes);
app.use("/management/rewards", rewardsRoute);
app.use("/rewards", rewardsRoute);
app.use("/management/repositories", repositoriesRoute);
app.use("/management/users", userRoute);
app.use("/trackers", trackerRoute);
app.use("/pullrequests", pullRequestHistoryRoute);

// setting up port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});

module.exports = app;
