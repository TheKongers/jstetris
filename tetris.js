const canv = document.querySelector("#tetris");
const ctx = canv.getContext("2d");
const scoreElement = document.querySelector("#score");
const levelElement = document.querySelector("#level")

const sq = 20; //size of a square 

// Making Gameboard
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * sq, y * sq, sq, sq);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * sq, y * sq, sq, sq);
}



const row = 20;
const column = 10;
const empty = "WHITE";


let board = [];
for (let r = 0; r < row; r++) {
    board[r] = [];
    for (let c = 0; c < column; c++) {
        board[r][c] = empty;
    }
}

function drawBoard() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }

}
drawBoard();


// Making Tetrominos


const Z = [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]];

const S = [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]]];

const J = [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]], [[0, 1, 0], [0, 1, 0], [1, 1, 0]]];

const T = [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]];

const L = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]];

const I = [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]];

const O = [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]];


const allPiece = [[Z, "red"], [S, "green"], [T, "purple"], [O, "yellow"], [I, "cyan"], [L, "blue"], [J, "orange"]]

// Choosing a Random Piece
function randomPiece() {
    let randomNum = Math.floor(Math.random() * allPiece.length);
    return new Piece(allPiece[randomNum][0], allPiece[randomNum][1]);
}

let p = randomPiece();


function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.tetrominoRotation = 0;
    this.activeTetromino = this.tetromino[this.tetrominoRotation];
    this.color = color;
    this.x = 3;
    this.y = -2;
}


Piece.prototype.fill = function (color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {

            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}



// Displaying Tetrominos
Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(empty);
}




// Tetromino Control
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoRotation + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
        if (this.x > column / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }
    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoRotation = (this.tetrominoRotation + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoRotation];
        this.draw();
    }
}

let score = 0;

// Locking Pieces
Piece.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                alert("Game Over");
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }


    let level = 1;
    for (let r = 0; r < row; r++) {
        let isRowFull = true;
        for (let c = 0; c < column; c++) {
            isRowFull = isRowFull && (board[r][c] != empty);
        }
        if (isRowFull) {
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < column; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (let c = 0; c < column; c++) {
                board[0][c] = empty;
            }
            score += 10;
            level = Math.floor(score / 100) + 1;
            levelElement.innerText = level;
            delay = 1000 * (0.8 ** (level - 1));
        }
    }
    drawBoard();

    scoreElement.innerHTML = score;
}

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (e.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (e.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (e.keyCode == 40) {
        p.moveDown();
    }
})



// Collision Decetion ************************************************************************************************
Piece.prototype.collision = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= column || newY >= row) {
                return true;
            }

            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] != empty) {
                return true;
            }
        }
    }
    return false;
}





// Dropping Pieces
let dropStart = Date.now();
let gameOver = false;
let delay = 1000;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > delay) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();