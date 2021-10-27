import Pathfinder from "./Pathfinder";
import BallsManager from "./BallsManager";

interface IBoardManager {
	ballsManager: BallsManager;
	pathfinder: Pathfinder;
	cells: HTMLDivElement[][];
}

class BoardManager implements IBoardManager {
	/** Contains all generated cells' divs */
	readonly cells: HTMLDivElement[][] = [];
	/** Size of the board */
	static readonly boardSize: number = 9;
	/** Obtained points */
	static points: number = 0;
	/** Instance of BallsManager class responsible for balls logic */
	ballsManager: BallsManager;
	/** Pathfinder instance */
	pathfinder: Pathfinder;

	constructor() {
		this.initializeFields();
		this.ballsManager = new BallsManager();
		this.ballsManager.initializeBalls(this.cells);
	}

	initializeFields() {
		for (let i = 0; i < BoardManager.boardSize * BoardManager.boardSize; i++) {
			let newCell = document.createElement("div");
			newCell.setAttribute("class", "cell");
			newCell.setAttribute("data-state", "blank");

			if (i % BoardManager.boardSize == 0) {
				this.cells.push([]);
			}

			this.cells[this.cells.length - 1].push(newCell);
			document.getElementById("field").appendChild(newCell);

			newCell.addEventListener("click", () => {
				if (
					this.ballsManager.end == null &&
					this.ballsManager.chosen == true &&
					!["ball", "start"].includes(newCell.getAttribute("data-state"))
				) {
					this.clearCellsOnMouseOver();
					this.ballsManager.setIsAnimatingMove(true);
					this.ballsManager.end = newCell;
					newCell.setAttribute("data-state", "end");
					this.pathfinder = new Pathfinder(this.ballsManager.start, this.ballsManager.end, this.cells);
					let path = this.pathfinder.initializePathfinding("move");

					if (path.length > 0) {
						this.ballsManager.moveBall();
						this.ballsManager.removeFreeField(i);
						this.ballsManager.addFreeFields(this.cells, [this.ballsManager.start]);
						setTimeout(() => {
							let clearedCells = this.ballsManager.beatingManager.beatBalls(this.cells);
							this.ballsManager.addFreeFields(this.cells, clearedCells);
							this.ballsManager.resetAfterMove();
							this.clearDataStates();
							this.clearCellsColors();
							this.ballsManager.createBalls(3, this.cells);
							// clearedCells = this.ballsManager.beatingManager.beatBalls(this.cells);
							// this.ballsManager.addFreeFields(this.cells, clearedCells);
							this.refreshStates();
						}, 500);
					} else {
						let startBallDiv = this.ballsManager.start.children[0] as HTMLDivElement;
						this.ballsManager.resetBallSize(startBallDiv);
						this.clearDataStates();
						this.ballsManager.resetAfterMove();
						this.refreshStates();
					}
				}
			});

			newCell.addEventListener("mouseover", () => {
				if (this.ballsManager.chosen == true && this.ballsManager.end == null && newCell.getAttribute("data-state") != "ball") {
					this.clearCellsOnMouseOver();
					this.pathfinder = new Pathfinder(this.ballsManager.start, newCell, this.cells);
					this.pathfinder.initializePathfinding("preview");
				}
			});
		}
	}

	clearCellsOnMouseOver() {
		for (let i = 0; i < BoardManager.boardSize; i++) {
			for (let j = 0; j < BoardManager.boardSize; j++) {
				this.cells[i][j].style.backgroundColor = "white";
				if (!["ball", "start", "end"].includes(this.cells[i][j].getAttribute("data-state"))) {
					this.cells[i][j].setAttribute("data-state", "blank");
				}
			}
		}
	}

	clearCellsColors() {
		for (let i = 0; i < BoardManager.boardSize; i++) {
			for (let j = 0; j < BoardManager.boardSize; j++) {
				this.cells[i][j].style.backgroundColor = "white";
			}
		}
	}

	clearDataStates() {
		for (let i = 0; i < BoardManager.boardSize; i++) {
			for (let j = 0; j < BoardManager.boardSize; j++) {
				if (this.cells[i][j].getAttribute("data-state") == "end") {
					this.cells[i][j].setAttribute("data-state", "ball");
				} else if (this.cells[i][j].getAttribute("data-state") == "start") {
					this.cells[i][j].setAttribute("data-state", "blank");
				} else if (this.cells[i][j].getAttribute("data-state") != "ball") {
					this.cells[i][j].setAttribute("data-state", "blank");
				}
			}
		}
	}

	refreshStates() {
		for (let i = 0; i < BoardManager.boardSize; i++) {
			for (let j = 0; j < BoardManager.boardSize; j++) {
				if (this.cells[i][j].children[0]) {
					this.cells[i][j].setAttribute("data-state", "ball");
				} else {
					this.cells[i][j].setAttribute("data-state", "blank");
				}
			}
		}
	}
}

export default BoardManager;
