import express from "express";
import cors from "cors";

import TileRoute from "./routes/tileRoute.js";
import LeaderboardRoute from "./routes/leaderboardRoute.js";

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/tiles", TileRoute);
app.use("/leaderboard", LeaderboardRoute);

export default app;
