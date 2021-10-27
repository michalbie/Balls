interface IBeatingChecker {
	beatThreshold: number;
	checkBeating: (cells: HTMLDivElement[][]) => HTMLDivElement[];
}

class BeatingChecker implements IBeatingChecker {
	beatThreshold: number;

	constructor() {
		this.beatThreshold = 5;
	}

	checkBeating(cells: HTMLDivElement[][]) {
		let cellsToBeat = [...this.checkHorizontally(cells), ...this.checkVertically(cells), ...this.checkDiagonally(cells)];

		return cellsToBeat;
	}

	checkHorizontally(cells: HTMLDivElement[][]): HTMLDivElement[] {
		let cellsToBeat: HTMLDivElement[] = [];
		cells.forEach((row) => {
			let rowBeatings = this.checkLine(row);
			if (rowBeatings.length > 0) cellsToBeat.push(...rowBeatings);
		});
		return cellsToBeat;
	}

	checkVertically(cells: HTMLDivElement[][]): HTMLDivElement[] {
		let cellsToBeat: HTMLDivElement[] = [];

		for (let i = 0; i < cells.length; i++) {
			let column: HTMLDivElement[] = [];
			for (let j = 0; j < cells.length; j++) {
				column.push(cells[j][i]); //creating columns from cells
			}
			let columnBeatings = this.checkLine(column);
			if (columnBeatings.length > 0) cellsToBeat.push(...columnBeatings);
		}

		return cellsToBeat;
	}

	checkDiagonally(cells: HTMLDivElement[][]): HTMLDivElement[] {
		let cellsToBeat: HTMLDivElement[] = [];

		//diagonal like vector [1, 1] (left part)
		for (let i = 0; i < cells.length; i++) {
			let diagonal: HTMLDivElement[] = [];
			let xCord = i;
			let yCord = 0;
			for (let j = 0; j <= i; j++) {
				diagonal.push(cells[xCord][yCord]);
				xCord -= 1;
				yCord += 1;
			}
			let columnBeatings = this.checkLine(diagonal);
			if (columnBeatings.length > 0) cellsToBeat.push(...columnBeatings);
		}

		//diagonal like vector [-1, -1] (right part)
		for (let i = cells.length - 1; i > 0; i--) {
			let diagonal: HTMLDivElement[] = [];
			let xCord = i;
			let yCord = cells.length - 1;
			for (let j = cells.length - 1; j >= i; j--) {
				diagonal.push(cells[xCord][yCord]);
				xCord += 1;
				yCord -= 1;
			}
			let columnBeatings = this.checkLine(diagonal);
			if (columnBeatings.length > 0) cellsToBeat.push(...columnBeatings);
		}

		//diagonal like vector [1, -1] (right part)
		for (let i = cells.length - 1; i >= 0; i--) {
			let diagonal: HTMLDivElement[] = [];
			let xCord = 0;
			let yCord = i;
			for (let j = i; j < cells.length; j++) {
				diagonal.push(cells[xCord][yCord]);
				xCord += 1;
				yCord += 1;
			}
			let columnBeatings = this.checkLine(diagonal);
			if (columnBeatings.length > 0) cellsToBeat.push(...columnBeatings);
		}

		//diagonal like vector [-1, 1] (left part)
		for (let i = 0; i < cells.length; i++) {
			let diagonal: HTMLDivElement[] = [];
			let xCord = cells.length - 1;
			let yCord = i;
			for (let j = 0; j <= i; j++) {
				diagonal.push(cells[xCord][yCord]);
				xCord -= 1;
				yCord -= 1;
			}
			let columnBeatings = this.checkLine(diagonal);
			if (columnBeatings.length > 0) cellsToBeat.push(...columnBeatings);
		}

		return cellsToBeat;
	}

	checkLine(line: HTMLDivElement[]): HTMLDivElement[] {
		let streakCount = 0;
		let streakColor: string = "blank";
		let streakCells: HTMLDivElement[] = [];

		for (let i = 0; i < line.length; i++) {
			let ball = line[i].children[0] as HTMLDivElement;
			if (ball) {
				if (ball.style.backgroundColor == streakColor) {
					streakCount += 1;
					streakCells.push(line[i]);
				} else {
					if (streakCount >= this.beatThreshold) {
						return streakCells;
					}
					streakCount = 1;
					streakCells = [line[i]];
					streakColor = ball.style.backgroundColor;
				}
			} else {
				if (streakCount >= this.beatThreshold) {
					return streakCells;
				}
				streakColor = "blank";
				streakCount = 0;
				streakCells = [];
			}
		}

		if (streakCount >= this.beatThreshold) {
			return streakCells;
		}

		return [];
	}
}

export default BeatingChecker;
