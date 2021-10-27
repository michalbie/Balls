enum Colors {
	RED = "red",
	YELLOW = "yellow",
	GREEN = "green",
	BLACK = "black",
	BLUE = "blue",
	PURPLE = "purple",
	BROWN = "brown",
}

interface IColorsQueue {
	colorsQueue: string[];
}

class ColorsQueue implements IColorsQueue {
	colorsQueue: string[];

	constructor() {
		this.colorsQueue = [this.getRandomColor(), this.getRandomColor(), this.getRandomColor()];
		this.setQueuePreview();
	}

	setQueuePreview() {
		const ball1 = document.getElementById("preview-ball-1");
		const ball2 = document.getElementById("preview-ball-2");
		const ball3 = document.getElementById("preview-ball-3");

		ball1.style.backgroundColor = this.colorsQueue[0];
		ball2.style.backgroundColor = this.colorsQueue[1];
		ball3.style.backgroundColor = this.colorsQueue[2];
	}

	getRandomColor() {
		const values = Object.values(Colors);
		const enumValue = values[Math.floor(Math.random() * values.length)];
		return enumValue;
	}

	getColorFromStack() {
		let colorFromStack = this.colorsQueue.shift();
		this.colorsQueue.push(this.getRandomColor());
		this.setQueuePreview();
		return colorFromStack;
	}
}

export default ColorsQueue;
