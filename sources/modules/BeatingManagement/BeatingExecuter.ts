import BoardManager from "../BoardManager";
import { generatePositiveMessage, updatePointUI } from "../decorators";

class BeatingExecuter {
	clearCells(cellsToClear: HTMLDivElement[]): HTMLDivElement[] {
		let clearedCells: HTMLDivElement[] = [];
		cellsToClear.forEach((cell) => {
			cell.setAttribute("data-state", "blank");
			if (cell.children[0]) {
				this.removeCell(cell);
				clearedCells.push(cell);
			}
		});

		return clearedCells;
	}

	@updatePointUI
	@generatePositiveMessage
	private removeCell(cell: HTMLDivElement) {
		cell.removeChild(cell.children[0]);
		BoardManager.points += 1;
	}
}

export default BeatingExecuter;
