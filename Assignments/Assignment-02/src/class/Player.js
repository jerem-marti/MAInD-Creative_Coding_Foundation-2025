export default class Player {
    #name;
    #score = 0;
    
    constructor(name = "Player") {
        this.#name = name;
        this.#score = 0;
    }

    getName() {
        return this.#name;
    }

    getScore() {
        return this.#score;
    }

    incrementScore() {
        this.#score += 1;
    }

    resetScore() {
        this.#score = 0;
    }
}