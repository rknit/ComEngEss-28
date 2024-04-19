import mongoose from "mongoose";

/*
Example:
{
  x: 1024,
  y: 1024,
  color: "Red",

}
*/

const tileSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true
  }
},
{
  timestamps: { createdAt: 'addedAt', updatedAt: 'modifiedAt' },
});

tileSchema.index({ x: 1, y: 1 }, { unique: true })

const Tile = mongoose.model("Tile", tileSchema);

export default Tile;
