import mongoose from "mongoose";

/*
Example:
{
  x: 1024,
  y: 1024,
  color: "Red",

}
*/

const leaderboardSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  }
}, {
  timestamps: { createdAt: 'addedAt', updatedAt: 'modifiedAt' },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
