export class Dice {
    constructor(bus) {
        this.bus = bus;
        this.rolled = null;

        this.events();
    }

    roll() {
        this.random();
        this.draw();
        this.disable();
        this.bus.dispatchEvent(new CustomEvent("dice:roll", {
            detail: {
                rolled: this.rolled
            }
        }));
    }

    disable() {
        document.querySelector("#roll_dice").setAttribute("disabled", true);
    }

    enable() {
        setTimeout(() => { document.querySelector("#roll_dice").removeAttribute("disabled") }, 1);
    }

    draw() {
        const diceHtml = document.querySelector(".dice");
        diceHtml.innerHTML = this.rolled;
    }

    random() {
        this.rolled = Math.floor(Math.random() * 6) + 1;
    }

    events() {
        document.querySelector("#roll_dice").addEventListener("click", () => {
            this.roll();
        });
    }
}