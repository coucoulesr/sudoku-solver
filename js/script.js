function genEmptyBoard(n) {
    let out = [];
    for (let i = 0; i < n; i++) {
        let mem = [];
        for (let j = 0; j < n; j++) {
            mem.push(0);
        }
        out.push(mem);
    }
    return out
}

class Sudoku {
    constructor(board = genEmptyBoard(9)) {
        this.setBoard(board);
        this.drawBoard();
    }

    setBoard(board) {
        if (!Number.isInteger(Math.sqrt(board.length))) {
            throw new Error("Sudoku must be nxn list where sqrt(n) is an integer.");
        }
        for (let ridx = 0; ridx < board.length; ridx++) {
            if (board[ridx].length != board.length) {
                throw new Error("Sudoku must be a square (nxn) list.");
            }
            for (let cidx = 0; cidx < board.length; cidx++) {
                if (!(typeof board[ridx][cidx] == 'number') && !Number.isInteger(board[ridx][cidx])) {
                    throw new Error("All sudoku items must be integers");
                }
                if (board[ridx][cidx] > board.length) {
                    throw new Error("Numbers on sudoku board must have value less than length of board.");
                }
            }
        }
        this.board = Array.from(board)
    }

    readBoard() {
        let board = genEmptyBoard(9)
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let coords = String(row).concat(String(col));
                let item = document.querySelector(String("#t" + coords)).textContent.trim()
                if (item == '') {
                    continue
                }
                if (isNaN(Number(item))) {
                    throw new Error("All sudoku items must be integers.")
                }
                board[row][col] = Number(item)
            }
        }
        this.setBoard(board);
    }

    clearBoard() {
        this.setBoard(genEmptyBoard(9))
    }

    drawBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let coords = String(row).concat(String(col));
                if (this.board[row][col] != 0) {
                    document.querySelector(String("#t" + coords)).textContent = this.board[row][col];
                } else {
                    document.querySelector(String("#t" + coords)).textContent = " ";
                }
            }
        }
    }

    solve() {
        if (this._isValid()){
            let t0 = performance.now()
            if (this._canSolveSudokuFromCell(0, 0)) {
                this.drawBoard()
            }
            let t1 = performance.now()
            console.log(`Solved in ${ t1 - t0}`)
        } else {
            throw new Error("Invalid sudoku input. No solution can be found.")
        }
    }

    _isValid() {
        for (let i = 0; i < this.board.length; i++) {
            let col = new Set();
            for (let j = 0; j < this.board.length; j++) {
                let row = new Set();
                if (this.board[i][j] != 0) {
                    if (row.has(this.board[i][j])) {
                        return false
                    } else {
                        row.add(this.board[i][j])
                    }
                }
                if (this.board[j][i] != 0) {
                    if (col.has(this.board[j][i])) {
                        return false
                    } else {
                        col.add(this.board[j][i])
                    }
                }
            }
        }
        const sector_length = Math.sqrt(this.board.length)
        for (let sector = 0; sector < this.board.length; sector++) {
            let s = new Set()
            for (let sector_y = 0; sector_y < sector_length; sector_y++) {
                for (let sector_x = 0; sector_x < sector_length; sector_x++) {
                    const x_idx = sector_x + (3 * (sector % 3))
                    const y_idx = sector_y + (3 * Math.floor(sector / 3))
                    if (this.board[y_idx][x_idx] != 0) {
                        if (s.has(this.board[y_idx][x_idx])) {
                            return false
                        } else {
                            s.add(this.board[y_idx][x_idx])
                        }
                    }
                }
            }
        }
        return true
    }

    _canSolveSudokuFromCell(row, col) {
        if (row == this.board.length) {
            return true;
        }
        if (col == this.board[row].length) {
            return this._canSolveSudokuFromCell(row + 1, 0);
        }
        if (this.board[row][col] != 0) {
            return this._canSolveSudokuFromCell(row, col + 1);
        }
        for (let i = 1; i <= this.board.length; i++) {
            if (this._canPlaceNumberAt(i, row, col)) {
                this.board[row][col] = i;
                if (this._canSolveSudokuFromCell(row, col + 1)) {
                    return true;
                }
                this.board[row][col] = 0;
            }
        }
        return false;
    }

    _canPlaceNumberAt(num, row, col) {
        let board_length = this.board.length;
        let sector_length = Math.sqrt(board_length);
        for (let i = 0; i < board_length; i++) {
            if (num == this.board[row][i] || num == this.board[i][col]) {
                return false;
            }
        }
        let v_sector = Math.floor(row / sector_length);
        let h_sector = Math.floor(col / sector_length);
        for (let i = 0; i < sector_length; i++) {
            for (let j = 0; j < sector_length; j++) {
                if (num == this.board[i + (v_sector * sector_length)][j + (h_sector * sector_length)]) {
                    return false
                }
            }
        }
        return true
    }
}

sudoku = new Sudoku()

document.querySelector("#solvebtn").addEventListener("click", () => {
    try {
        sudoku.readBoard();
        sudoku.solve();
    } catch(e) {
        console.error(e)
    }
});

document.querySelector("#clearbtn").addEventListener("click", () => {
    sudoku.clearBoard()
    sudoku.drawBoard()
});