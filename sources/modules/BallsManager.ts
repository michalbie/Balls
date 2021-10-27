import Ball from "./Ball";
import BoardManager from "./BoardManager";
import ColorsQueue from "./ColorsQueue";
import BeatingManager from "./BeatingManagement/BeatingManager";

interface IBallsManager {
	balls: Ball[];
	colorsQueue: ColorsQueue;
	start: HTMLDivElement;
	end: HTMLDivElement;
	chosen: Boolean;
}

/** Class responsible for balls logic and management */
class BallsManager implements IBallsManager {
	/** Creating colors for new balls with preview of next 3 */
	public colorsQueue: ColorsQueue;
	/** True if any ball is chosen */
	public chosen: Boolean;
	/** Contains starting cell for pathfinder algorithm */
	public start: HTMLDivElement;
	/** Contains ending cell for pathfinder algorithm */
	public end: HTMLDivElement;
	/** Contains all balls */
	public balls: Ball[];
	/** Responsible for beating groups of cells*/
	public beatingManager: BeatingManager;
	/** Contains free cells */
	private freeFields: number[];
	/** True 0.5s after successful ball movement */
	private isAnimatingMove: Boolean;

	constructor() {
		this.beatingManager = new BeatingManager();
		this.colorsQueue = new ColorsQueue();
		this.balls = [];
		this.chosen = false;
		this.freeFields = Array.from(Array(BoardManager.boardSize * BoardManager.boardSize).keys());
		this.setIsAnimatingMove(false);
	}

	/** Generates 3 initial balls
	 * @param cells 2D array of all cells
	 */
	initializeBalls(cells: HTMLDivElement[][]) {
		for (let i = 0; i < 3; i++) {
			const ball = this.createBall(this.colorsQueue.getColorFromStack(), cells);
		}
	}

	/** Sets listeners for ball
	 * @param ball Ball which we want listeners to be set
	 */
	setBallsEventListener(ball: Ball) {
		ball.div.addEventListener("click", () => {
			if (this.chosen == false) {
				this.start = ball.parentCell;
				ball.parentCell.setAttribute("data-state", "start");
				ball.div.style.transform = "scale(1.2)";
				this.chosen = true;
			} else if (this.chosen == true) {
				if (this.start == ball.parentCell) {
					this.start = null;
					ball.parentCell.setAttribute("data-state", "ball");
					this.resetBallSize(ball.div);
					this.chosen = false;
				} else if (!this.getIsAnimatingMove()) {
					let previousStart = this.start.children[0] as HTMLElement;
					this.start.setAttribute("data-state", "ball");
					previousStart.setAttribute("data-state", "ball"); //chyba nie do balla tylko do cella (ale dziala lol)
					previousStart.style.transform = "scale(1)";

					this.start = ball.parentCell;
					ball.parentCell.setAttribute("data-state", "start");

					ball.div.style.transform = "scale(1.2)";
				}
			}
		});
	}

	/** Creates new ball
	 * @param color New ball's color
	 * @param cells 2D array of all cells
	 */
	createBall = (color: string, cells: HTMLDivElement[][]) => {
		const [x, y] = this.getRandomFreeCellCords();
		const parentCell = cells[x][y];
		const ball = new Ball(color, x, y, cells[x][y]);
		this.balls.push(ball);
		parentCell.appendChild(ball.div);
		parentCell.setAttribute("data-state", "ball");
		this.setBallsEventListener(ball);
		return ball;
	};

	/** Creates new ball
	 * @param value How many new balls you want to create
	 * @param cells 2D array of all cells
	 */
	createBalls(value: number, cells: HTMLDivElement[][]) {
		for (let i = 0; i < value; i++) {
			if (this.freeFields.length > 0) {
				this.createBall(this.colorsQueue.getColorFromStack(), cells);
			} else {
				alert("You scored " + BoardManager.points + " points");
				window.location.reload();
				return;
			}
		}

		if (this.freeFields.length == 0) {
			alert("You scored " + BoardManager.points + " points");
			window.location.reload();
			return;
		}
	}

	/** Get random free cell coordinates
	 * @returns Array with coordinates [x, y]
	 */
	getRandomFreeCellCords() {
		const randIndex = Math.floor(Math.random() * this.freeFields.length);
		const randomCords = this.freeFields[randIndex];
		this.freeFields.splice(randIndex, 1);
		const randX = Math.floor(randomCords / BoardManager.boardSize);
		const randY = randomCords % BoardManager.boardSize;

		return [randX, randY];
	}

	/** Adds free fields values
	 * @param cells 2D array of all cells
	 * @param freeCells Cells we want to add
	 */
	addFreeFields(cells: HTMLDivElement[][], freeCells: HTMLDivElement[]) {
		freeCells.forEach((freeCell) => {
			for (let x = 0; x < cells.length; x++) {
				for (let y = 0; y < cells[x].length; y++) {
					if (cells[x][y] == freeCell) {
						this.freeFields.push(x * BoardManager.boardSize + y);
						return;
					}
				}
			}
		});
	}

	/** Removes free field
	 * @param value Calculated from (x * boardSize + y) where x and  y are  cell's coordinates
	 */
	removeFreeField(value: number) {
		this.freeFields.splice(this.freeFields.indexOf(value), 1);
	}

	/** Moves ball from  start div to end div (determined by where we click)*/
	moveBall() {
		let startBallDiv = this.start.children[0] as HTMLDivElement;
		this.resetBallSize(startBallDiv);
		this.end.appendChild(startBallDiv);

		this.balls.forEach((ball) => {
			if (ball.div == startBallDiv) {
				ball.changeParentCell(this.end);
			}
		});
	}

	/** Resets ball transform: scale value to 1*/
	resetBallSize(ball: HTMLDivElement) {
		ball.style.transform = "scale(1)";
	}

	/** Sets all variables responsible for balls moving to default ones*/
	resetAfterMove() {
		this.start = null;
		this.end = null;
		this.chosen = false;
		this.isAnimatingMove = false;
	}

	/** Sets isAnimatingMove variable
	 * @param value Value we want to be set
	 */
	setIsAnimatingMove(value: Boolean) {
		this.isAnimatingMove = value;
	}

	/** Gets isAnimatingMove variable value
	 * @returns isAnimatingMove value
	 */
	getIsAnimatingMove(): Boolean {
		return this.isAnimatingMove;
	}
}

export default BallsManager;
