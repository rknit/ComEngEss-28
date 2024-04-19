const colorInput = document.getElementById('color-input');
const colorPreview = document.getElementById('color-preview');

// Event listener for when color input changes
colorInput.addEventListener('input', function() {
  // Get selected color value
  const color = colorInput.value;
  // Convert color value to RGB components
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);
  // Check if the color is within the red shade range (e.g., between RGB values 100 and 255)
  if (red >= 100 && red <= 255 && green === 0 && blue === 0) {
    // Update color preview
    colorPreview.style.backgroundColor = color;
  } else {
    // Reset color picker to default red shade
    colorInput.value = '#ff0000';
    // Update color preview
    colorPreview.style.backgroundColor = '#ff0000';
    // Optionally, you can provide a message to inform the user that only red shades are allowed
    alert('Only shades of red are allowed!');
  }
});

