import BeatingChecker from "./BeatingChecker";
import BeatingExecuter from "./BeatingExecuter";

interface IBeatingManager {
	beatingChecker: BeatingChecker;
	beatingExecuter: BeatingExecuter;
}

class BeatingManager implements IBeatingManager {
	beatingChecker: BeatingChecker;
	beatingExecuter: BeatingExecuter;

    constructor(){
        this.beatingChecker = new BeatingChecker();
        this.beatingExecuter = new BeatingExecuter();
    }

    beatBalls(cells: HTMLDivElement[][]): HTMLDivElement[]{
        let allBeatings = this.beatingChecker.checkBeating(cells);
        let clearedCells = this.beatingExecuter.clearCells(allBeatings);
        return clearedCells;
    }
}

export default BeatingManager;
