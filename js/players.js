import { PLAYER_RULES } from "./playerRules.js";

export class Player {
    constructor(playerEnum) {
        this.enum = playerEnum;
        this.startPos = PLAYER_RULES[playerEnum].startPos;
        this.homeStretchPos = PLAYER_RULES[playerEnum].homeStretchPos;

        this.pieces = [];
    }

    hasPieceInPlay() {
        return this.pieces.some(piece => piece.inPlay === true);
    }

    hasOnePieceInPlay() {
        return this.pieces.filter(piece => piece.inPlay === true).length === 1;
    }

    hasManyPieceInPlay() {
        return this.pieces.filter(piece => piece.inPlay === true).length > 1;
    }
}