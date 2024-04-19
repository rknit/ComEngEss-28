import { BACKEND_URL } from "./config.js";

export async function getLeaderboard() {
    const leaderboard = await fetch(`${BACKEND_URL}/leaderboard`).then((r) => r.json());
    console.log(leaderboard);

    return leaderboard;
}

export async function getMap() {
    const canvas = await fetch(`${BACKEND_URL}/tiles/map-info`).then((r) => r.json());
 
    return canvas;
}

export async function getTile(x, y) {
    const tile = await fetch(`${BACKEND_URL}/tiles/tile-info`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({x, y}),
    }).then((r) => r.json());
 
    return tile;
}

export async function createTile(item) {
    const tile = await fetch(`${BACKEND_URL}/tiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    return tile;
}