const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CANVAS_SIZE = 256;
let cellSize = 40;

let dragging = false;
let posX = 0;
let posY = 0;
let dragX = 0;
let dragY = 0;

function draw() {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	let vLimit = Math.min(CANVAS_SIZE * cellSize + posX, window.innerWidth);
	for (let v = posX; v <= vLimit; v += cellSize) {
		context.moveTo(v, 0);
		context.lineTo(v, window.innerHeight);
	}

	let hLimit = Math.min(CANVAS_SIZE * cellSize + posY, window.innerHeight);
	for (let h = posY; h <= hLimit; h += cellSize) {
		context.moveTo(0, h);
		context.lineTo(window.innerWidth, h);
	}

	context.strokeStyle = "#d9d9d9";
	context.stroke();
}

window.addEventListener("resize", draw);
window.addEventListener("load", draw);
document.addEventListener("mousemove", (e) => {
	if (dragging) {
		let dx = e.clientX - dragX;
		let dy = e.clientY - dragY;
		dragX = e.clientX;
		dragY = e.clientY;

		posX += dx;
		posY += dy;
		draw();
	}
});
document.addEventListener("mousedown", (e) => {
	dragging = true;
	dragX = e.clientX;
	dragY = e.clientY;
});
document.addEventListener("mouseup", () => (dragging = false));
document.addEventListener("wheel", (e) => {
	cellSize += e.deltaY * 0.01;
	draw();
});
