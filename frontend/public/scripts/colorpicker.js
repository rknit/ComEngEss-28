const colorButton = document.getElementById('color-button');
const colorOptions = document.getElementById('color-options');

// Set color 

const teamColor = {
    "red" : "#ff0000",
    "green" : "#0B6E4F",
    "blue" : "#0972C4",
    "yellow" : "#e5de00",
}

const allColor = {
    "red" : [ 
         "#ffbaba" ,
         "#ff7b7b" ,
         "#ff5252" ,
         "#ff0000" ,
         "#a70000" ,
         "#c30101" ,
         "#940000" ,
         "#6f0000" ,
         "#5c1010" ,
    ],
    "green" : [       
         "#21D375" ,
         "#6BBF59" ,
         "#08A045" ,
         "#0B6E4F" ,
         "#073B3A" ,
         "#0A5C36" ,
         "#0F5132" ,
         "#14452F" ,
         "#18392B" ,
    ],
    "blue" : [  
         "#1BCBF2" ,
         "#0FB2F2" ,
         "#139DF2" ,
         "#0972C4" ,
         "#11538C" ,
         "#06508A" ,
         "#053E6B" ,
         "#04355C" ,
         "#032642" ,
    ],
    "yellow" : [  
         "#f1ee8e" ,
         "#ece75f" ,
         "#e8e337" ,
         "#e5de00" ,
         "#e6cc00" ,
         "#e6b400" ,
         "#e69b00" ,
         "#d29e00" ,
         "#b78700" ,
    ]
};

let team = localStorage.getItem("team");
colorButton.style.backgroundColor = teamColor[team];

function createColorPopup() {
    const colorPalette = document.getElementById("color-options");
    colorPalette.innerHTML = ""; // Clear existing list
    
    allColor[team].forEach((color, index) => {
      const colorItem = document.createElement("div");
      colorItem.classList.add("color-option");
      colorItem.style.backgroundColor = `${color}`;
      colorPalette.appendChild(colorItem);
    });
  }
  
  // Populate leaderboard on page load
  createColorPopup();
  const colorOptionItems = document.querySelectorAll('.color-option');

// Function to show color options
function showColorOptions() {
  colorOptions.style.display = 'block';
}

// Function to hide color options
function hideColorOptions() {
  colorOptions.style.display = 'none';
}

// Function to handle color option click
function handleColorOptionClick(event) {
  // Get selected color from clicked color option
  const color = event.target.style.backgroundColor;
  // Update color button with selected color
  colorButton.style.backgroundColor = color;
  // Hide color options
  hideColorOptions();
}

// Add event listener to color button
colorButton.addEventListener('click', function(event) {
  // Toggle visibility of color options when color button is clicked
  if (colorOptions.style.display === 'block') {
    hideColorOptions();
  } else {
    showColorOptions();
  }
});

// Add event listener to each color option
colorOptionItems.forEach(colorOption => {
  colorOption.addEventListener('click', handleColorOptionClick);
});

// Hide color options when clicking outside of the color picker
document.addEventListener('click', function(event) {
  if (!colorButton.contains(event.target) && !colorOptions.contains(event.target)) {
    hideColorOptions();
  }
});
