import { cooldown, isOnCooldown } from "./clickTimer.js";
import { createTile, getCanvas } from "./api.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CANVAS_SIZE = 256;
const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 100;
const ZOOM_SPEED = 3;
const enableLineFade = false;
const enableHoverBox = true;

const colors = new Array(CANVAS_SIZE)
	.fill(0)
	.map(() => new Array(CANVAS_SIZE).fill("#FFFFFF"));

let cellSize = MIN_CELL_SIZE;
let posX = 0;
let posY = 0;
let dragging = false;
let hoverX = -1;
let hoverY = -1;

function draw() {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	let xLimit = Math.min(CANVAS_SIZE * cellSize + posX, window.innerWidth);
	let yLimit = Math.min(CANVAS_SIZE * cellSize + posY, window.innerHeight);

	context.beginPath();
	for (let y = posY; y < yLimit; y += cellSize) {
		for (let x = posX; x < xLimit; x += cellSize) {
			let gridX = Math.floor((x - posX) / cellSize);
			let gridY = Math.floor((y - posY) / cellSize);
			if (gridX < 0 || gridY < 0) continue;
			if (gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE) continue;
			if (colors[gridX][gridY] == "#FFFFFF") continue;
			context.fillStyle = colors[gridX][gridY];
			context.fillRect(x, y, cellSize, cellSize);

			// context.fillStyle = "black";
			// context.fillText(
			// 	`${gridX},${gridY}`,
			// 	Math.floor(x),
			// 	Math.floor(y),
			// 	cellSize
			// );
		}
	}

	context.beginPath();
	for (let x = posX; x <= xLimit; x += cellSize) {
		if (x < 0 || x > window.innerWidth) continue;
		context.moveTo(x, posY);
		context.lineTo(x, yLimit);
	}
	for (let y = posY; y <= yLimit; y += cellSize) {
		if (y < 0 || y > window.innerHeight) continue;
		context.moveTo(posX, y);
		context.lineTo(xLimit, y);
	}
	context.strokeStyle = "#d9d9d9";
	if (enableLineFade)
		context.lineWidth = Math.sqrt((cellSize - 9.9) / MAX_CELL_SIZE);
	context.stroke();

	if (!enableHoverBox || hoverX < 0 || hoverY < 0) return;
	if (hoverX >= CANVAS_SIZE || hoverY >= CANVAS_SIZE) return;
	let pixelX = hoverX * cellSize;
	let pixelY = hoverY * cellSize;

	context.beginPath();
	context.rect(posX + pixelX, posY + pixelY, cellSize, cellSize);
	context.strokeStyle = "gray";
	context.lineWidth = (4 * cellSize) / MAX_CELL_SIZE;
	context.stroke();
}

async function paintFromDatabase() {
	const response = await getCanvas();
	response.forEach((tile) => {
		colors[tile.x][tile.y] = tile.color;
	});
	draw();
}

function paint(x, y) {
	if (isOnCooldown()) return;

	let gridX = Math.floor((x - posX) / cellSize);
	let gridY = Math.floor((y - posY) / cellSize);
	if (gridX < 0 || gridY < 0 || gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE)
		return;
	colors[gridX][gridY] =
		document.getElementById("color-button").style.backgroundColor;
	draw();

	let team = localStorage.getItem("team");
	createTile({ x: gridX, y: gridY, color: colors[gridX][gridY], team });

	cooldown();
}

function clampPos() {
	let padding = 1.5 * (MAX_CELL_SIZE - cellSize);
	posX = Math.max(
		window.innerWidth - CANVAS_SIZE * cellSize - padding,
		Math.min(padding, posX)
	);
	posY = Math.max(
		window.innerHeight - CANVAS_SIZE * cellSize - padding,
		Math.min(padding, posY)
	);
}

window.addEventListener("resize", draw);
window.addEventListener("load", () => {
	posX = window.innerWidth / 2 - (CANVAS_SIZE * cellSize) / 2;
	posY = window.innerHeight / 2 - (CANVAS_SIZE * cellSize) / 2;
	paintFromDatabase();
	setInterval(paintFromDatabase, 1000);
});

window.addEventListener("mousemove", (e) => {
	hoverX = Math.floor((e.clientX - posX) / cellSize);
	hoverY = Math.floor((e.clientY - posY) / cellSize);
	if (dragging) {
		posX += e.movementX;
		posY += e.movementY;
		clampPos();
	}
	draw();
});

window.addEventListener("mousedown", (e) => {
	if (e.button !== 0) {
		dragging = true;
	} else if (typeof e.target.id != "undefined" && e.target.id == "canvas") {
		paint(e.clientX, e.clientY);
	}
});

window.addEventListener("mouseup", (e) => {
	if (e.button !== 0) dragging = false;
});

window.addEventListener("wheel", (e) => {
	let prevCellSize = cellSize;
	cellSize -= Math.sign(e.deltaY) * ZOOM_SPEED;
	cellSize = Math.max(cellSize, MIN_CELL_SIZE);
	cellSize = Math.min(cellSize, MAX_CELL_SIZE);

	let gridX = Math.floor((e.clientX - posX) / prevCellSize) + 1;
	let gridY = Math.floor((e.clientY - posY) / prevCellSize) + 1;
	posX -= gridX * (cellSize - prevCellSize);
	posY -= gridY * (cellSize - prevCellSize);

	clampPos();
	draw();
});
