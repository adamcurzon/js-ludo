import { MAX_TRAVEL_DISTANCE, PLAYER_RULES } from "./playerRules.js";

export class Player {
    constructor(playerEnum) {
        this.enum = playerEnum;
        this.startPos = PLAYER_RULES[playerEnum].startPos;
        this.homeStretchPos = PLAYER_RULES[playerEnum].homeStretchPos;

        this.pieces = [];
    }

    hasPieceInPlay() {
        return this.pieces.some(piece => piece.inPlay);
    }

    hasOnePieceInPlay() {
        return this.pieces.filter(piece => piece.inPlay).length === 1;
    }

    getOnlyPieceInPlay() {
        return this.pieces.filter(piece => piece.inPlay)[0];
    }

    hasManyPieceInPlay() {
        return this.pieces.filter(piece => piece.inPlay).length > 1;
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
        const inPlayPieces = this.pieces.filter(piece => piece.inPlay);
        return inPlayPieces[0];
    }

    getFirstPieceAtStart() {
        const inPlayPieces = this.pieces.filter(piece => !piece.inPlay && !piece.home);
        return inPlayPieces[0];
    }

    getPossibleMovesCount(rolled) {
        let possibleMoves = 0;
        for (var piece of this.pieces) {
            if ((!piece.homeStretch && piece.distanceTraveled + rolled < MAX_TRAVEL_DISTANCE + 6) ||
                (piece.homeStretch && piece.distanceTraveled + rolled < 6) ||
                (!piece.inPlay && !piece.home && rolled == 6)) {
                possibleMoves++;
            }
        }
        return possibleMoves;
    }

    hasMultiplePossibleMoves(rolled) {
        return this.getPossibleMovesCount(rolled) > 1;
    }

    getOnlyPossibleMove(rolled) {
        if (this.getPossibleMovesCount(rolled) == 1) {
            for (var piece of this.pieces) {
                if ((!piece.homeStretch && piece.distanceTraveled + rolled < MAX_TRAVEL_DISTANCE + 6) ||
                    (piece.homeStretch && piece.distanceTraveled + rolled < 6) ||
                    (!piece.inPlay && !piece.home && rolled == 6)) {
                    return piece;
                }
            }
        };
    }

    hasAllPiecesHome() {
        return this.pieces.every(piece => piece.home == true);
    }
}