import Leaderboard from "../models/leaderboardModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find();
    res.status(200).json(leaderboard);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};



///// TODO: Delete all unnecessary endpoint below
/*
export const deleteItem = async (req, res) => {
  // TODO2: implement this function
  // HINT: you can serve the internet and find what method to use for deleting item.
  res.status(501).send("Unimplemented");
};

export const filterItems = async (req, res) => {
  // TODO3: implement this filter function
  // WARNING: you are not allowed to query all items and do something to filter it afterward.
  // Otherwise, you will be punished by -0.5 scores for this part
  res.status(501).send("Unimplemented");
};
*/