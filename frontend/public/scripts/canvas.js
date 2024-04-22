import { cooldown, isOnCooldown } from "./clickTimer.js";
import { createTile, getCanvas } from "./api.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const pixCoordDiv = document.getElementById("pix-coord");

const CANVAS_SIZE = 256;
const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 100;
const ZOOM_SPEED = 3;
const ENABLE_LINE_FADE = true;
const ENABLE_HOVER_BOX = true;

const colors = new Array(CANVAS_SIZE)
	.fill(0)
	.map(() => new Array(CANVAS_SIZE).fill("#FFFFFF"));
const queuedColors = new Map();

let dragging = false;
let cellSize = Math.floor((MIN_CELL_SIZE + MAX_CELL_SIZE * 0.6) / 2);
let posX = 0;
let posY = 0;
let hoverX = -1;
let hoverY = -1;

// mobiles
let isMobile = false;
let zooming = false;
let lastTouchPosX = 0;
let lastTouchPosY = 0;
let lastTouchesDist = 0;

function draw() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	let xLimit = Math.min(CANVAS_SIZE * cellSize + posX, window.innerWidth);
	let yLimit = Math.min(CANVAS_SIZE * cellSize + posY, window.innerHeight);

	let startX = posX % cellSize;
	let startY = posY % cellSize;

	context.beginPath();
	for (let y = startY; y < yLimit; y += cellSize) {
		for (let x = startX; x < xLimit; x += cellSize) {
			let gridX = Math.floor((x - posX) / cellSize);
			let gridY = Math.floor((y - posY) / cellSize);
			if (queuedColors.has(`${gridX},${gridY}`))
				context.fillStyle = queuedColors.get(`${gridX},${gridY}`);
			else if (colors[gridX][gridY] == "#FFFFFF") continue;
			else context.fillStyle = colors[gridX][gridY];
			context.fillRect(x - 0.5, y - 0.5, cellSize + 0.5, cellSize + 0.5);

			// context.fillStyle = "black";
			// context.fillText(
			// 	`${gridX},${gridY}`,
			// 	Math.floor(x),
			// 	Math.floor(y),
			// 	cellSize
			// );
		}
	}

	if (!(ENABLE_LINE_FADE && cellSize == MIN_CELL_SIZE)) {
		context.beginPath();
		for (let x = startX; x <= xLimit; x += cellSize) {
			context.moveTo(x - 0.5, startY - 0.5);
			context.lineTo(x - 0.5, yLimit - 0.5);
		}
		for (let y = startY; y <= yLimit; y += cellSize) {
			context.moveTo(startX - 0.5, y - 0.5);
			context.lineTo(xLimit - 0.5, y - 0.5);
		}
		context.strokeStyle = "#d9d9d9";
		if (ENABLE_LINE_FADE)
			context.lineWidth =
				Math.min(Math.pow(cellSize - 9.5, 2), MAX_CELL_SIZE) /
				MAX_CELL_SIZE;
		context.stroke();
	}

	if (
		!ENABLE_HOVER_BOX ||
		isMobile ||
		hoverX < 0 ||
		hoverY < 0 ||
		hoverX >= CANVAS_SIZE ||
		hoverY >= CANVAS_SIZE
	) {
		pixCoordDiv.classList.add("disabled");
		return;
	}
	let pixelX = hoverX * cellSize;
	let pixelY = hoverY * cellSize;

	context.beginPath();
	context.rect(posX + pixelX, posY + pixelY, cellSize, cellSize);
	context.strokeStyle = "gray";
	context.lineWidth = (4 * cellSize) / MAX_CELL_SIZE;
	context.stroke();

	pixCoordDiv.classList.remove("disabled");
	pixCoordDiv.innerText = `(${hoverX}, ${hoverY})`;
}

async function paintFromDatabase() {
	const response = await getCanvas();
	response.forEach((tile) => {
		colors[tile.x][tile.y] = tile.color;
	});
}

async function paint(x, y) {
	if (isOnCooldown()) return;

	let gridX = Math.floor((x - posX) / cellSize);
	let gridY = Math.floor((y - posY) / cellSize);
	if (gridX < 0 || gridY < 0 || gridX >= CANVAS_SIZE || gridY >= CANVAS_SIZE)
		return;
	if (queuedColors.has(`${gridX},${gridY}`)) return;

	let color = document.getElementById("color-button").style.backgroundColor;
	let team = localStorage.getItem("team");
	queuedColors.set(`${gridX},${gridY}`, color);
	cooldown();
	await createTile({ x: gridX, y: gridY, color: color, team });
	await paintFromDatabase();
	queuedColors.delete(`${gridX},${gridY}`);
}

function clampPos() {
	let padding = 0; // 1.5 * (MAX_CELL_SIZE - cellSize);
	posX = Math.max(
		window.innerWidth - CANVAS_SIZE * cellSize - padding,
		Math.min(padding, posX)
	);
	posY = Math.max(
		window.innerHeight - CANVAS_SIZE * cellSize - padding,
		Math.min(padding, posY)
	);
}

window.addEventListener("resize", () => {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	clampPos();
});
window.addEventListener("load", () => {
	posX = window.innerWidth / 2 - (CANVAS_SIZE * cellSize) / 2;
	posY = window.innerHeight / 2 - (CANVAS_SIZE * cellSize) / 2;
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	clampPos();
	paintFromDatabase();
	setInterval(paintFromDatabase, 1000);

	let drawLoop = () => {
		draw();
		window.requestAnimationFrame(drawLoop);
	};
	window.requestAnimationFrame(drawLoop);
});

window.addEventListener("mousedown", (e) => {
	if (e.button !== 0) {
		dragging = true;
	} else if (typeof e.target.id != "undefined" && e.target.id == "canvas") {
		paint(e.clientX, e.clientY);
	}
});
window.addEventListener("mousemove", (e) => {
	hoverX = Math.floor((e.clientX - posX) / cellSize);
	hoverY = Math.floor((e.clientY - posY) / cellSize);
	if (dragging) {
		posX += e.movementX;
		posY += e.movementY;
		clampPos();
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
});

window.addEventListener("touchstart", (e) => {
	isMobile = true;
	lastTouchPosX = e.touches[0].clientX;
	lastTouchPosY = e.touches[0].clientY;
	if (e.touches.length == 2) {
		zooming = true;
		lastTouchesDist = Math.hypot(
			e.touches[0].clientX - e.touches[1].clientX,
			e.touches[0].clientY - e.touches[1].clientY
		);
	}
});
window.addEventListener("touchmove", (e) => {
	posX += e.touches[0].clientX - lastTouchPosX;
	posY += e.touches[0].clientY - lastTouchPosY;
	lastTouchPosX = e.touches[0].clientX;
	lastTouchPosY = e.touches[0].clientY;
	if (zooming) {
		let touchesDist = Math.hypot(
			e.touches[0].clientX - e.touches[1].clientX,
			e.touches[0].clientY - e.touches[1].clientY
		);
		let prevCellSize = cellSize;
		cellSize += Math.sign(touchesDist - lastTouchesDist) * ZOOM_SPEED;
		cellSize = Math.max(cellSize, MIN_CELL_SIZE);
		cellSize = Math.min(cellSize, MAX_CELL_SIZE);

		let centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
		let centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
		let gridX = Math.floor((centerX - posX) / prevCellSize) + 1;
		let gridY = Math.floor((centerY - posY) / prevCellSize) + 1;
		posX -= gridX * (cellSize - prevCellSize);
		posY -= gridY * (cellSize - prevCellSize);

		lastTouchesDist = touchesDist;
	}
	clampPos();
});
window.addEventListener("touchend", (e) => {
	zooming = false;
});

// Debug only
// window.onerror = (error, url, line) => {
//     alert('ERR: '+ error +', URL: '+ url + ' L: ' +line);
// };
