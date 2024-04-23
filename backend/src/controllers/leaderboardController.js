import Leaderboard from "../models/leaderboardModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({ team : { $ne: "noteam" }});
    res.status(200).json(leaderboard);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};