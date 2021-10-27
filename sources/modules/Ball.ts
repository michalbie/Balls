interface BallCords {
	x: number;
	y: number;
}

interface IBall {
	color: string;
	cords: BallCords;
	div: HTMLDivElement;
	parentCell: HTMLDivElement;
}

class Ball implements IBall {
	color: string;
	cords: BallCords;
	div: HTMLDivElement;
	parentCell: HTMLDivElement;

	constructor(color: string, x: number, y: number, parentCell: HTMLDivElement) {
		this.color = color;
		this.cords = { x: x, y: y };
		this.div = document.createElement("div");
		this.div.setAttribute("class", "ball");
		this.div.style.backgroundColor = this.color;
		this.parentCell = parentCell;
	}

	changeParentCell(cell: HTMLDivElement) {
		this.parentCell = cell;
	}
}

export default Ball;
