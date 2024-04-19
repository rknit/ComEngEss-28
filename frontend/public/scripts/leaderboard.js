// Sample leaderboard data
const leaderboardData = [
    { name: "Red", score: 100 },
    { name: "Green", score: 90 },
    { name: "Blue", score: 80 },
    { name: "Yellow", score: 70 },
  ];
  
  // Function to populate leaderboard
  async function populateLeaderboard() {
    const response = await fetch('http://localhost:3222/')
    const leaderboardData = await response.json();
    
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing list
    
    leaderboardData.forEach((color, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${index + 1}. ${color.name}</span><span>${color.score}</span>`;
      leaderboardList.appendChild(listItem);
    });
  }
  
  // Populate leaderboard on page load
  populateLeaderboard();
  