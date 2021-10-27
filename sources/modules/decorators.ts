import BoardManager from "./BoardManager";

export function updatePointUI(target: any, name: string, descriptor: any) {
	var originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		var result = originalMethod.apply(this, args);
		document.getElementById("points-container").innerHTML = BoardManager.points.toString();
		return result;
	};
}

export function generatePositiveMessage(target: any, name: string, descriptor: any) {
	const messageContainer = document.getElementById("message-container");
	let messages = ["Nice one!", "That was great!", "Keep going!"];

	var originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		var result = originalMethod.apply(this, args);
		messageContainer.style.animation = "none";
		setTimeout(() => {
			messageContainer.innerHTML = messages[Math.floor(Math.random() * messages.length)];
			messageContainer.style.animation = "";
		}, 10);
		return result;
	};
}
