const timerDiv = document.getElementById("cooldown-timer");
const COOLDOWN_SEC = 5;
let timer = 0;

function getTimeString(seconds) {
	let min = Math.floor(seconds / 60);
	let sec = seconds % 60;
	return `${"0".repeat(2 - min.toString().length)}${min}:${"0".repeat(
		2 - sec.toString().length
	)}${sec}`;
}

export function cooldown() {
	if (isOnCooldown()) return;

	timer = COOLDOWN_SEC;
	timerDiv.innerText = getTimeString(timer);
	timerDiv.classList.remove("disabled");
	let interval = setInterval(() => {
		timer--;
		timerDiv.innerText = getTimeString(timer);
		if (timer <= 0) {
			timerDiv.classList.add("disabled");
			clearInterval(interval);
		}
	}, 1000);
}

export function isOnCooldown() {
	return timer > 0;
}
