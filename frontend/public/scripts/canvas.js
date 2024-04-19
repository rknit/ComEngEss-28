import { cooldown, isOnCooldown } from "./clickTimer.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CANVAS_SIZE = 256;
let cellSize = 40;

const colors = new Array(CANVAS_SIZE)
	.fill(0)
	.map(() => new Array(CANVAS_SIZE).fill("#FFFFFF"));

const colorStringToValue = new Map([
	["red", convertRgbToHex(255, 0, 0)],
	["blue", convertRgbToHex(0, 0, 255)],
	["green", convertRgbToHex(0, 128, 0)],
	["yellow", convertRgbToHex(255, 255, 0)],
]);
const color = colorStringToValue.get(localStorage.getItem("team"));

let posX = 0;
let posY = 0;

let dragging = false;
let dragX = 0;
let dragY = 0;

let lastClick = Date.now();

function convertRgbToHex(red, green, blue) {
	return (
		"#" +
		((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)
	);
}

function draw() {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	let xLimit = Math.min(
		CANVAS_SIZE * cellSize + posX,
		window.innerWidth + cellSize
	);
	let yLimit = Math.min(
		CANVAS_SIZE * cellSize + posY,
		window.innerHeight + cellSize
	);

	for (let y = posY; y < yLimit; y += cellSize) {
		for (let x = posX; x < xLimit; x += cellSize) {
			let gridX = Math.floor((x - posX) / cellSize);
			let gridY = Math.floor((y - posY) / cellSize);
			if (gridX < 0 || gridY < 0) continue;

			context.fillStyle = colors[gridX][gridY];
			context.fillRect(Math.floor(x), Math.floor(y), cellSize, cellSize);
			// context.fillStyle = "black";
			// context.fillText(
			// 	`${gridX},${gridY}`,
			// 	Math.floor(x),
			// 	Math.floor(y),
			// 	cellSize
			// );
		}
	}

	for (let x = posX; x <= xLimit; x += cellSize) {
		context.moveTo(x, posY);
		context.lineTo(x, yLimit);
	}
	for (let y = posY; y <= yLimit; y += cellSize) {
		context.moveTo(posX, y);
		context.lineTo(xLimit, y);
	}

	context.strokeStyle = "#d9d9d9";
	context.stroke();
}

function paint(x, y) {
	if (isOnCooldown()) return;

	let gridX = Math.floor((x - posX) / cellSize);
	let gridY = Math.floor((y - posY) / cellSize);
	if (gridX < 0 || gridY < 0 || gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE)
		return;
	colors[gridX][gridY] = color;
	draw();
	cooldown();
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
document.addEventListener("touchmove", (e) => {
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

	lastClick = Date.now();
});
document.addEventListener("touchstart", (e) => {
	dragging = true;
	dragX = e.clientX;
	dragY = e.clientY;

	lastClick = Date.now();
});

document.addEventListener("mouseup", (e) => {
	dragging = false;
	let curTime = Date.now();
	if (curTime - lastClick < 200) paint(e.clientX, e.clientY);
});
document.addEventListener("touchend", (e) => {
	dragging = false;
	let curTime = Date.now();
	if (curTime - lastClick < 200) paint(e.clientX, e.clientY);
});

document.addEventListener("wheel", (e) => {
	cellSize -= Math.sign(e.deltaY) * 3;
	cellSize = Math.max(cellSize, 10);
	cellSize = Math.min(cellSize, 100);
	draw();
});
