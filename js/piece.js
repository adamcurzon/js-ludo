import { PLAYER_RULES } from "./playerRules.js";

export class Piece {
    constructor(bus, player, index) {
        this.bus = bus;
        this.player = player;
        this.index = index;

        this.inPlay = false;
        this.homeStretch = false;

        this.pos = PLAYER_RULES[player].startPos;
    }

    setInPlay() {
        this.inPlay = true;
    }

    move(distance) {
        this.inPlay = true;
        this.pos += distance;
        this.pos = this.pos % 52;
        if (this.pos > PLAYER_RULES[this.player].homeStretchPos) {
            console.log("Past home stretch");
        }
    }

    html() {
        const pieceDiv = document.createElement("div");
        pieceDiv.classList.add("piece");
        pieceDiv.classList.add(this.player);

        const ns = "http://www.w3.org/2000/svg";

        const pieceSvg = document.createElementNS(ns, "svg");
        pieceSvg.setAttribute("viewBox", "0 0 640 640");

        const piecePath = document.createElementNS(ns, "path");
        piecePath.setAttribute("d", "M320 32C386.3 32 440 85.7 440 152C440 179 431.1 203.9 416 224C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288L405.3 288L432 448L488.2 518.3C493.2 524.6 496 532.4 496 540.5C496 560.1 480.1 576 460.5 576L179.5 576C159.9 576 144 560.1 144 540.5C144 532.4 146.7 524.6 151.8 518.3L208 448L234.7 288L224 288C206.3 288 192 273.7 192 256C192 238.3 206.3 224 224 224C208.9 203.9 200 179 200 152C200 85.7 253.7 32 320 32z");

        pieceSvg.appendChild(piecePath);
        pieceSvg.appendChild(piecePath);
        pieceDiv.appendChild(pieceSvg);

        pieceDiv.addEventListener("click", e => {
            this.bus.dispatchEvent(new CustomEvent("piece:clicked", {
                detail: {
                    piece: this,
                }
            }));
        });

        return pieceDiv;
    }

    draw() {
        const pieceHtml = this.html();
        var piecePositionDiv = null;

        if (this.inPlay && !this.homeStretch) {
            piecePositionDiv = document.querySelector('div[data-pos="' + this.pos + '"]');
        }

        if (!this.inPlay && !this.homeStretch) {
            piecePositionDiv = document.querySelector('div[data-pos="start-' + this.player + '-' + this.index + '"]');
        }

        if (this.homeStretch) {
            console.log("Home stretch", this.index, this.player);
            return;
        }

        piecePositionDiv.appendChild(pieceHtml);
    }
}