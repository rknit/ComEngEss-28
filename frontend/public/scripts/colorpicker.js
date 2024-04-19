const colorButton = document.getElementById('color-button');
const colorOptions = document.getElementById('color-options');
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
