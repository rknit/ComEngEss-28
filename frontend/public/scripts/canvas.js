import { cooldown, isOnCooldown } from "./clickTimer.js";
import { createTile, getCanvas } from "./api.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CANVAS_SIZE = 256;
let cellSize = 10;

const colors = new Array(CANVAS_SIZE)
	.fill(0)
	.map(() => new Array(CANVAS_SIZE).fill("#FFFFFF"));
	
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

	let xLimit = Math.min(CANVAS_SIZE * cellSize + posX, window.innerWidth);
	let yLimit = Math.min(CANVAS_SIZE * cellSize + posY, window.innerHeight);

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

async function  paintFromDatabase() {
	const response = await getCanvas();

	response.forEach((color,x,y) => {
		let gridX = Math.floor((x - posX) / cellSize);
		let gridY = Math.floor((y - posY) / cellSize);
		if (gridX < 0 || gridY < 0 || gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE)
			return;
		colors[gridX][gridY] = color;
		draw();
	});

}

paintFromDatabase();

setInterval(paintFromDatabase,1000)

function paint(x, y) {
	if (isOnCooldown()) return;

	let gridX = Math.floor((x - posX) / cellSize);
	let gridY = Math.floor((y - posY) / cellSize);
	if (gridX < 0 || gridY < 0 || gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE)
		return;
	colors[gridX][gridY] = document.getElementById('color-button').style.backgroundColor;
	draw();

	let team = localStorage.getItem("team");
	createTile({ x: gridX, y: gridY, color: colors[gridX][gridY], team });
	
	cooldown();
}

window.addEventListener("resize", draw);
window.addEventListener("load", () => {
	posX = window.innerWidth / 2 - (CANVAS_SIZE * cellSize) / 2;
	posY = window.innerHeight / 2 - (CANVAS_SIZE * cellSize) / 2;
	draw();
});

canvas.addEventListener("mousemove", (e) => {
	if (dragging) {
		let dx = e.clientX - dragX;
		let dy = e.clientY - dragY;
		dragX = e.clientX;
		dragY = e.clientY;

		posX += dx;
		posY += dy;

		console.log(posX + " " + posY);
		posX = Math.min(4 * cellSize, posX);
		posX = Math.max(
			-CANVAS_SIZE * cellSize + window.innerWidth - 4 * cellSize,
			posX
		);
		posY = Math.min(4 * cellSize, posY);
		posY = Math.max(
			-CANVAS_SIZE * cellSize + window.innerHeight - 4 * cellSize,
			posY
		);
		draw();
	}
});

canvas.addEventListener("mousedown", (e) => {
	dragging = true;
	dragX = e.clientX;
	dragY = e.clientY;

	lastClick = Date.now();
});

canvas.addEventListener("mouseup", (e) => {
	dragging = false;
	let curTime = Date.now();
	if (curTime - lastClick < 200) paint(e.clientX, e.clientY);
});

canvas.addEventListener("wheel", (e) => {
	let prevCellSize = cellSize;
	cellSize -= Math.sign(e.deltaY) * 3;
	cellSize = Math.max(cellSize, 10);
	cellSize = Math.min(cellSize, 100);

	let moveBackDelta = (CANVAS_SIZE * (cellSize - prevCellSize)) / 2;
	posX -= moveBackDelta;
	posY -= moveBackDelta;
	draw();
});
