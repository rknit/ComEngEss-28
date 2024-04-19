function assignTeam(color) {
	localStorage.setItem("team", color);
	  // Redirect to the next page
	  window.location.href = 'game.html';
}
