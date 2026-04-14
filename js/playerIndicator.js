export class PlayerIndicator {
    constructor() {
        this.html = document.querySelector("#current_player");
    }

    set(player) {
        this.html.className = "";
        this.html.classList.add("player");
        this.html.classList.add(player);
    }
}