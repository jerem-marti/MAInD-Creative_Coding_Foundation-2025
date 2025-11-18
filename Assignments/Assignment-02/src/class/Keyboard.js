export default class Keyboard {
    // Constructeur de la classe Keyboard qui prendra en paramètre les touches du clavier.
    constructor() {
        this.keydown = new Set();
        this.init();
    }

    // Méthode init() qui initialise les touches du clavier.
    init() {
        document.addEventListener('keydown', event => {
            this.keydown.add(event.code);
        });
        document.addEventListener('keyup', event => {
            this.keydown.delete(event.code);
        });
    }

    // Méthode isDown() qui vérifie si une touche est enfoncée.
    isDown(keyCode) {
        return this.keydown.has(keyCode);
    }
}