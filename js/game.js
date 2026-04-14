
import { Piece } from './piece.js';
import { Dice } from './dice.js';
import { Player } from './players.js';
import { PlayerIndicator } from './playerIndicator.js';

const TOTAL_PIECES_PER_PLAYER = 4;

export class Game {
    constructor() {
        this.bus = new EventTarget();
        this.dice = new Dice(this.bus);
        this.playerIndicator = new PlayerIndicator();

        this.players = [
            new Player("red"),
            new Player("yellow"),
        ];
        this.turn = 0;
        this.awatingInput = false;

        this.events();

        this.playerIndicator.set(this.currentPlayer().enum);
    }

    currentPlayer() {
        return this.players[this.turn];
    }

    startGame() {
        this.createStartingPieces();
        this.clearPieces();
        this.drawPieces();
    }

    createStartingPieces() {
        this.players.forEach(player => {
            for (let pieceIndex = 0; pieceIndex < TOTAL_PIECES_PER_PLAYER; pieceIndex++) {
                player.pieces.push(new Piece(this.bus, player.enum, pieceIndex));
            }
        });
    }

    checkForWinner() {

    }

    drawPieces() {
        this.players.forEach(player => {
            for (let pieceIndex = 0; pieceIndex < player.pieces.length; pieceIndex++) {
                player.pieces[pieceIndex].draw();
            }
        });
    }

    clearPieces() {
        const pieces = document.querySelectorAll(".piece");
        pieces.forEach(p => p.remove());
    }

    setupNextMove(rollAgain = false) {
        this.dice.enable();
        if (!rollAgain) {
            this.turn++;
            this.turn = this.turn % this.players.length;
        }
        this.playerIndicator.set(this.currentPlayer().enum);
    }

    events() {
        this.bus.addEventListener("dice:roll", (e) => {
            const rolled = e.detail.rolled;

            console.log("Player " + this.currentPlayer().enum + " rolled:", rolled);

            if (!this.currentPlayer().hasPieceInPlay() && rolled != 6) {
                console.log("Player " + this.currentPlayer().enum + " has nothing in play and didn't roll 6");
                this.setupNextMove();
                return
            }

            if (!this.currentPlayer().hasPieceInPlay() && rolled == 6) {
                console.log("Player " + this.currentPlayer().enum + " is forced to bring out first piece");
                this.currentPlayer().pieces[0].setInPlay();
                this.clearPieces();
                this.drawPieces();
                this.setupNextMove(true);
                return
            }

            if (this.currentPlayer().hasOnePieceInPlay() && rolled != 6) {
                console.log("Player " + this.currentPlayer().enum + " is forced to move as only one in play");
                this.currentPlayer().pieces[0].move(rolled);
                this.clearPieces();
                this.drawPieces();
                this.setupNextMove();
                return
            }

            if (this.currentPlayer().hasPieceInPlay() && rolled == 6) {
                console.log("Player " + this.currentPlayer().enum + " has choice to bring out or move");
                this.awatingInput = true;
                return
            }

            if (this.currentPlayer().hasManyPieceInPlay() && rolled != 6) {
                // TODO: check if the pieces are on the same square
                // If they are then move either piece without input
                console.log("Player " + this.currentPlayer().enum + " has choice of which inplay piece to move");
                this.awatingInput = true;
                return
            }
        });

        this.bus.addEventListener("piece:clicked", e => {
            if (!this.awatingInput) {
                return;
            }

            const piece = e.detail.piece;

            if (piece.player != this.currentPlayer().enum) {
                console.log("This piece does not belong to " + this.currentPlayer().enum);
                return;
            }

            if (!piece.inPlay && this.dice.rolled != 6) {
                console.log("Cant move piece as not in play and not 6");
                return;
            }

            if (!piece.inPlay && this.dice.rolled == 6) {
                this.awatingInput = false;
                console.log("Moving piece to in play");
                piece.setInPlay();
                this.clearPieces();
                this.drawPieces();
                this.setupNextMove(true);
                return;
            }

            if (piece.inPlay) {
                this.awatingInput = false;
                console.log("Moving piece");
                piece.move(this.dice.rolled);
                this.clearPieces();
                this.drawPieces();
                this.setupNextMove(this.dice.rolled == 6);
                return;
            }
        });
    }
}