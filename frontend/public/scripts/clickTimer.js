const timerDiv = document.getElementById("cooldown-timer");
const COOLDOWN_SEC = 5;
let timer = 0;

export function cooldown() {
	if (isOnCooldown()) return;

	timer = COOLDOWN_SEC;
	timerDiv.innerText = `00:${timer}`;
	timerDiv.classList.remove("disabled");
	let interval = setInterval(() => {
		timer--;
		timerDiv.innerText = `00:${timer}`;
		if (timer <= 0) {
			timerDiv.classList.add("disabled");
			clearInterval(interval);
		}
	}, 1000);
}

export function isOnCooldown() {
	return timer > 0;
}
