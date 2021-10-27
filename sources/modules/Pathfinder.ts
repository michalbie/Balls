import BoardManager from "./BoardManager";

interface initializePathfindingSignature {
	(mode: string): HTMLDivElement[];
}

interface IPathfinder {
	cells: HTMLDivElement[][];
	start: HTMLDivElement;
	end: HTMLDivElement;
	initializePathfinding: initializePathfindingSignature;
}

class Pathfinder implements IPathfinder {
	cells: HTMLDivElement[][];
	start: HTMLDivElement;
	end: HTMLDivElement;

	constructor(start: HTMLDivElement, end: HTMLDivElement, cells: any[]) {
		this.start = start;
		this.end = end;
		this.cells = cells;
	}

	initializePathfinding(mode: string): HTMLDivElement[] {
		let found: Boolean = false;
		let startCords: number[] = [];
		let endCords: number[] = [];
		let path = [];

		for (let i = 0; i < BoardManager.boardSize; i++) {
			if (this.cells[i].indexOf(this.start) != -1) {
				startCords = [i, this.cells[i].indexOf(this.start)];
			}
			if (this.cells[i].indexOf(this.end) != -1) {
				endCords = [i, this.cells[i].indexOf(this.end)];
			}
		}

		if (this.start == this.end) return [];

		path = this.pathfind(startCords, endCords, mode);
		return path;
	}

	pathfind(startCords: number[], endCords: number[], mode: string) {
		this.fillPathForward(startCords, endCords);
		let path = this.getPathBackwards(endCords);

		for (let i = 0; i < path.length; i++) {
			if (mode == "preview") path[i].style.backgroundColor = "#ff5745";
			else if (mode == "move") path[i].style.backgroundColor = "gray";
		}

		return path;
	}

	fillPathForward(startCords: number[], endCords: number[]) {
		let currentNumber: number = 0;
		let currentNumberAllCords = [];
		let foundEnd = false;

		while (foundEnd == false) {
			currentNumberAllCords = [];

			if (currentNumber == 0) {
				currentNumberAllCords = [startCords];
			} else {
				for (let i = 0; i < BoardManager.boardSize; i++) {
					for (let j = 0; j < BoardManager.boardSize; j++) {
						if (this.cells[i][j].getAttribute("data-state") == currentNumber.toString()) {
							//pint
							currentNumberAllCords.push([i, j]);
						}
					}
				}
			}

			let allCurrentNumbersNeighbors = this.getNeighbors(currentNumberAllCords);
			let validNeighbors = [];

			for (let i = 0; i < allCurrentNumbersNeighbors.length; i++) {
				if (
					allCurrentNumbersNeighbors[i][0] <= BoardManager.boardSize - 1 &&
					allCurrentNumbersNeighbors[i][0] >= 0 &&
					allCurrentNumbersNeighbors[i][1] <= BoardManager.boardSize - 1 &&
					allCurrentNumbersNeighbors[i][1] >= 0
				) {
					if (this.cells[allCurrentNumbersNeighbors[i][0]][allCurrentNumbersNeighbors[i][1]].getAttribute("data-state") == "blank") {
						validNeighbors.push(allCurrentNumbersNeighbors[i]);
					} else if (this.cells[allCurrentNumbersNeighbors[i][0]][allCurrentNumbersNeighbors[i][1]].getAttribute("data-state") == "end") {
						foundEnd = true;
					}
				}
			}

			for (let i = 0; i < validNeighbors.length; i++) {
				this.cells[validNeighbors[i][0]][validNeighbors[i][1]].setAttribute("data-state", (currentNumber + 1).toString());
			}

			if (validNeighbors.length == 0) {
				foundEnd = true; // but path dont exist
			}

			currentNumber++;
		}
	}

	getPathBackwards(endCords: number[]) {
		let foundEnd = false;
		let consecutivePathElements = [this.cells[endCords[0]][endCords[1]]];
		let consecutivePathElementsCords = [endCords];
		let iter = 0;

		while (!foundEnd) {
			let allNeighbors = this.getNeighbors([consecutivePathElementsCords[consecutivePathElementsCords.length - 1]]);
			let validNeighbors = [];

			for (let i = 0; i < allNeighbors.length; i++) {
				if (
					allNeighbors[i][0] <= BoardManager.boardSize - 1 &&
					allNeighbors[i][0] >= 0 &&
					allNeighbors[i][1] <= BoardManager.boardSize - 1 &&
					allNeighbors[i][1] >= 0
				) {
					validNeighbors.push(allNeighbors[i]);
				}
			}

			if (validNeighbors.length == 0) {
				foundEnd = true;
				return consecutivePathElements;
			}

			let nextPathElement = this.cells[validNeighbors[0][0]][validNeighbors[0][1]];
			let nextPathElementCords = [validNeighbors[0][0], validNeighbors[0][1]];

			for (let i = 0; i < validNeighbors.length; i++) {
				if (
					this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state") == "start" ||
					nextPathElement.getAttribute("data-state") == "start"
				) {
					foundEnd = true;
					nextPathElement = this.cells[validNeighbors[i][0]][validNeighbors[i][1]];
					nextPathElementCords = [validNeighbors[i][0], validNeighbors[i][1]];
					consecutivePathElements.push(nextPathElement);
					consecutivePathElementsCords.push(nextPathElementCords);
					return consecutivePathElements;
				}

				if (
					nextPathElement.getAttribute("data-state") == "blank" ||
					nextPathElement.getAttribute("data-state") == "end" ||
					nextPathElement.getAttribute("data-state") == "ball"
				) {
					if (
						this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state") != "blank" &&
						this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state") != "end" &&
						this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state") != "ball"
					) {
						nextPathElement = this.cells[validNeighbors[i][0]][validNeighbors[i][1]];
						nextPathElementCords = [validNeighbors[i][0], validNeighbors[i][1]];
					} else if (i == validNeighbors.length - 1) {
						return [];
					}
				} else if (
					parseInt(this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state")) <
						parseInt(nextPathElement.getAttribute("data-state")) &&
					this.cells[validNeighbors[i][0]][validNeighbors[i][1]].getAttribute("data-state") != "blanks"
				) {
					{
						nextPathElement = this.cells[validNeighbors[i][0]][validNeighbors[i][1]];
						nextPathElementCords = [validNeighbors[i][0], validNeighbors[i][1]];
					}
				}
			}

			consecutivePathElements.push(nextPathElement);
			consecutivePathElementsCords.push(nextPathElementCords);
			iter += 1;
		}
	}

	getNeighbors(currentCords: number[][]) {
		let neighbors = [];

		for (let i = 0; i < currentCords.length; i++) {
			neighbors.push(
				// [parseInt(currentCords[i][0]) - 1, currentCords[i][1]],
				// [currentCords[i][0], parseInt(currentCords[i][1]) + 1],
				// [parseInt(currentCords[i][0]) + 1, currentCords[i][1]],
				// [currentCords[i][0], parseInt(currentCords[i][1]) - 1]
				[currentCords[i][0] - 1, currentCords[i][1]],
				[currentCords[i][0], currentCords[i][1] + 1],
				[currentCords[i][0] + 1, currentCords[i][1]],
				[currentCords[i][0], currentCords[i][1] - 1]
			);
		}

		return neighbors;
	}
}

export default Pathfinder;
