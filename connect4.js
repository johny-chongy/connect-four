"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const BOARD = []; // array of rows, each row is array of cells  (board[y][x])
let currPlayer = 0; // active player: 0 or 1

/** Takes no input but generates an array of arrays of null values
 * Mutates BOARD such that:
 * makeBoard() => BOARD = const board = [[WIDTH]...HEIGHT]
 */
function makeBoard() {
  for (let rowIndex = 0; rowIndex < HEIGHT; rowIndex++) {
    let rowAdded = [];
    for (let counter = 0; counter < WIDTH; counter++) {
      rowAdded.push(null);
    }
    BOARD.push(rowAdded);
  }
}

/** Takes no input but generates the top row of the board by iterating and
 *  appending columnTops to the htmlBoard
 */
function makeHtmlBoard() {
  let htmlBoard = document.getElementById('board');

  // create columnTops to include click listener in order to place connect four pieces
  let columnTops = document.createElement("tr");
  columnTops.setAttribute("id", "column-top");
  columnTops.addEventListener("click", handleClick);

  // iterate through each column and append columnTop to columnTops
  for (let columnIndex = 0; columnIndex < WIDTH; columnIndex++) {
    let columnTop = document.createElement("td");
    columnTop.setAttribute("id", `top-${columnIndex}`);
    columnTops.append(columnTop);
  }
  htmlBoard.append(columnTops);

  // dynamically creates the main part of html board by iterating through HEIGHT & WIDTH
  // by creating a row and appending cells to each row and then each row to htmlBoard
  for (let rowCounter = 0; rowCounter < HEIGHT; rowCounter++) {
    let row = document.createElement("tr");
    for (let columnCounter = 0; columnCounter < WIDTH; columnCounter++) {
      let cell = document.createElement("td");
      cell.setAttribute('id', `c-${rowCounter}-${columnCounter}`)
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** Given column x, return bottom empty y (null if filled) */
function findSpotForCol(colNum) {
  for (let rowCount = HEIGHT-1; rowCount >= 0; rowCount--) {
    if (BOARD[rowCount][colNum] === null) {
      return rowCount;
    }
  }

  return null;
}

/** Updates DOM and places piece into HTML table of board */
function placeInTable(row, column) {
  console.log('placeInTable func ', row, column);
  // create newPiece div and add appropriate classes
  let newPiece = document.createElement('div');
  newPiece.classList.add('piece');
  newPiece.classList.add(`p${currPlayer}`);

  // Add newPiece to located coordinates
  let selectCell = document.getElementById(`c-${row}-${column}`);
  selectCell.append(newPiece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id[evt.target.id.length-1];

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  BOARD[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer+1} won!`);
  }

  // check for tie
  if (BOARD.every(row => !row.includes(null))) {
    endGame(`It's a tie!`);
  }

  // switch players
  currPlayer = (currPlayer + 1) % 2;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    for (let cell of cells) {
      if(cell[0] < 0 || cell[0] >= HEIGHT || cell[1] < 0 || cell[1] >= WIDTH) {
        return false;
      }
    }

    return cells.every(cell => BOARD[cell[0]][cell[1]] === currPlayer);
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDR = [[y, x], [y + 1, x - 1], [y + 2, x -2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
