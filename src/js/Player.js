export class Player {
    constructor() {
        this._score = 0;
    }

    increaseScore(value) {
        this._score += value;
    }


    get score() {
        return this._score;
    }
}

