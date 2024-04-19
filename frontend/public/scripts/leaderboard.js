import { getLeaderboard } from "../../../backend/src/controllers/leaderboardController";

// Sample leaderboard data
const leaderboardData = [
    { name: "Red", score: 100 },
    { name: "Green", score: 90 },
    { name: "Blue", score: 80 },
    { name: "Yellow", score: 70 },
  ];
  
  // Function to populate leaderboard
  async function populateLeaderboard() {
    const response = getLeaderboard(); // get leaderboard from backend
    
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing list
    
    response.forEach((color, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${index + 1}. ${color.name}</span><span>${color.score}</span>`;
      leaderboardList.appendChild(listItem);
    });
  }
  
  // Populate leaderboard on page load
  populateLeaderboard();

  setInterval(populateLeaderboard,5000);
  