import { setCellSize, getCellSize, draw } from "./canvas.js";

let lastScrollPos = 0;

function zoom(scrollPos) {
	let diff = scrollPos - lastScrollPos;
	lastScrollPos = scrollPos;
	let newCellSize = getCellSize() + diff;

	setCellSize(newCellSize);
	draw();

	console.log(newCellSize);
}

window.onload = () => {
	lastScrollPos = window.scrollY;
	addEventListener("scroll", () => zoom(window.scrollY));
};
