import Tile from "../models/tileModel.js";
import Leaderboard from "../models/leaderboardModel.js";

export const createTile = async (req, res) => {
  try {
    const { x, y, color, team } = req.body; 
    const previousTile = await Tile.findOne({$and: [{ x }, { y }]});
    const previousLeaderboard = await Leaderboard.findOne({ team });

    // create new leaderboard with specified color field if it doesn't exist
    if (!previousLeaderboard) {
      const newLeaderboard = new Leaderboard({ team, count: 0 });
      await newLeaderboard.save();
    }

    // no update if place the tile with the same color at the same spot
    // otherwise update the database Tile and Leaderboard
    if (previousTile) {
      if (previousTile.color === color) {
        res.status(200).json({ message: "No updated, the same color is placed at the same spot" });
      } else {

        await Tile.updateOne({$and: [{ x }, { y }]}, { color });
        await Tile.updateOne({$and: [{ x }, { y }]}, { team });
        await Leaderboard.updateOne({ $and: [{team: previousTile.team}, {count: { $gte : 1 }}] }, { $inc: { count: -1 }});
        await Leaderboard.updateOne({ team }, { $inc: { count: 1 }});
        res.status(200).json({ message: "Updated existing Tile and Leaderboard success" });

      }
    } else {
    
      const newTile = new Tile(req.body);
      await newTile.save();
      await Leaderboard.updateOne({ team }, { $inc: { count: 1 }});

      res.status(200).json({ message: "Updated new Tile and Leaderboard success" });    
    }
    
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else if (err.name === "MongoServerError") {
      console.log(err);
      res.status(500).json({ error: `Error updating database` });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getTiles = async (req, res) => {
  const tiles = await Tile.find();

  res.status(200).json(tiles);
};

export const filterTile = async (req, res) => {
  const { x, y } = req.body; 
  const tile = await Tile.find({$and: [{ x }, { y }]});

  res.status(200).json(tile);
};

export const initialize = async (req, res) => {

  try {
    const operations = []
    // const startTime = new Date();
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {

        operations.push({
          updateOne: {
            filter: { x: i, y: j },
            update: { $setOnInsert: { x: i, y: j, color: "nocolor" } },
            upsert: true
          }
        });

      }
    }
    await Tile.bulkWrite(operations, { ordered: false });
    // const finishTime = new Date();
    // console.log((finishTime - startTime) / 1000);
    res.status(200).json({ message: "Map initialization success" });  
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
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