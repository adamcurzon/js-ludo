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

    hasManyPieceOnOneSquareOnly() {
        if (!this.hasManyPieceInPlay()) return false;
        let firstPos = null;
        for (var piece of this.pieces) {
            if (piece.inPlay == false) continue;
            if (firstPos == null) {
                firstPos = piece.pos;
            } else {
                if (firstPos != piece.pos) {
                    return false;
                }
            }
        }
        return true;
    }

    getFirstPieceInPlay() {
        const inPlayPieces = this.pieces.filter(piece => piece.inPlay == true);
        return inPlayPieces[0];
    }

    getFirstPieceAtStart() {
        const inPlayPieces = this.pieces.filter(piece => piece.inPlay != true);
        return inPlayPieces[0];
    }

    hasMultiplePossibleMoves() {
        return true;
    }

    hasAnyPossibleMoves() {
        return true;
    }

    hasAllPiecesHome() {
        return this.pieces.every(piece => piece.home == true);
    }
}