import BoardManager from "./modules/BoardManager";

/** Main game instance */
class Game {
	boardManager: BoardManager;

	constructor() {
		this.boardManager = new BoardManager();
	}
}

let game = new Game();
