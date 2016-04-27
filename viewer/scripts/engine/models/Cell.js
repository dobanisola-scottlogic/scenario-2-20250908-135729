
let PHASER = require('../../enums/phaser.js');

class Cell {
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }
    clone() {
        return new Cell(this.column, this.row);
    }
    getCentreXPosition() {
        return (this.column + 0.5) * PHASER.CELL.WIDTH;
    }
    getCentreYPosition() {
        return (this.row + 0.5) * PHASER.CELL.HEIGHT;
    }
}

module.exports = Cell;
