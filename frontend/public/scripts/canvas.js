const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CANVAS_SIZE = 256;
let cellSize = 40;
const GRID_OPACITY = 0.15;

window.addEventListener("resize", draw, false);
window.onload = draw;

export function draw() {
	let size = CANVAS_SIZE * cellSize;

	context.canvas.width = size;
	context.canvas.height = size;

	for (let v = 0; v <= size; v += cellSize) {
		context.moveTo(0.5 + v, 0);
		context.lineTo(0.5 + v, size);
	}

	for (let h = 0; h <= size; h += cellSize) {
		context.moveTo(0, 0.5 + h);
		context.lineTo(size, 0.5 + h);
	}

	context.strokeStyle = `rgba(0, 0, 0, ${GRID_OPACITY})`;
	context.stroke();
}

export function setCellSize(cellSize_) {
	cellSize = cellSize_;
}

export function getCellSize() {
	return cellSize;
}
