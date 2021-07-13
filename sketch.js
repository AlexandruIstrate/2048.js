const rowCount = 4;
const columnCount = 4;
var grid = [];

var score = 0;
var isGameOver = false;
var isWon = false;

const winningValue = 2048;

const upRotation = 90;
const downRotation = -90;
const leftRotation = 180;

const colors = {
    0: [238, 238, 238],
    2: [124, 181, 224],
    4: [68, 149, 208],
    8: [47, 104, 144],
    16: [245, 189, 112],
    32: [242, 160, 48],
    64: [205, 136, 32],
    128: [227, 112, 80],
    256: [222, 88, 48],
    512: [189, 74, 32],
    1024: [134, 26, 32],
    2048: [210, 230, 128],
    4096: [146, 196, 96],
    8192: [189, 74, 32],
    16384: [189, 74, 32],
    32768: [189, 74, 32],
    65536: [189, 74, 32],
    131072: [189, 74, 32],
    262144: [189, 74, 32]
};

function fillGrid(grid) {
    for (var i = 0; i < rowCount; ++i) {
        grid[i] = [];

        for (var j = 0; j < columnCount; ++j)
            grid[i][j] = 0;
    }
}

function isFull() {
    for (var i = 0; i < rowCount; ++i)
        for (var j = 0; j < columnCount; ++j)
            if (grid[i][j] === 0)
                return false;

    return true;
}

function hasPossibleMoves() {
    var gridCopy = grid.slice();

    let canMove = false;

    for (var n = 0; n < 2; ++n) {
        for (var i = 0; i < rowCount; ++i) {
            let row = shiftRow(grid[i]);

            for (var j = row.length - 1; j >= 0; --j) {
                let a = row[j];
                let b = row[j - 1];

                if (a === b)
                {
                    canMove = true;
                    break;
                }
            }
        }

        if (canMove)
            break;

        rotateGrid(90);
    }

    grid = gridCopy;    // Restore previous state

    return canMove;
}

function hasWinningTile() {
    for (var i = 0; i < rowCount; ++i)
        for (var j = 0; j < columnCount; ++j)
            if (grid[i][j] === winningValue)
                return true;

    return false;
}

function compareGrids(toCompare) {
    for (var i = 0; i < rowCount; ++i)
        for (var j = 0; j < columnCount; ++j)
            if (toCompare[i][j] !== grid[i][j])
                return false;

    return true;
}

function drawGrid() {
    background(255);
    textAlign(CENTER, CENTER);

    const padding = 5;
    const size = 100 - padding;

    for (var i = 0; i < rowCount; ++i) {
        for (var j = 0; j < columnCount; ++j) {
            let x = j * size + padding;
            let y = i * size + padding;

            let value = grid[i][j];
            let squareColor = value in colors ? colors[value] : colors[2];

            fill(squareColor[0], squareColor[1], squareColor[2]);
            rect(x, y, size - padding, size - padding, 5);

            if (value > 0) {
                fill(255);
                textSize(30);
                noStroke();
                text(value, x + size / 2, y + size / 2);
            }
        }
    }
}

function drawScore() {
    document.getElementById("score").innerHTML = "Score: " + score;
}

function showGameOver() {
    fill(55);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
}

function showWon() {
    fill(189, 74, 32);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("You Won!", width / 2, height / 2);
}

function addNewNumbers() {
    if (isFull())
        return;

    while (true) {
        let x = floor(random(rowCount));
        let y = floor(random(columnCount));

        if (grid[x][y] === 0) {
            if (random(1) > 0.5)
                grid[x][y] = 2;
            else
                grid[x][y] = 4;

            break;
        }
    }
}

function shiftRow(row) {
    let shifted = [];

    for (var i = 0; i < row.length; ++i) {
        let num = row[i];
        if (num !== 0)
            shifted.push(num);
    }

    let zeros = [];
    for (var i = 0; i < row.length - shifted.length; ++i)   // Add the number of removed zeros at the begining
        zeros.push(0);

    return zeros.concat(shifted);
}

function sumRow(row) {
    for (var i = row.length - 1; i > 0; i--) {
        let a = row[i];
        let b = row[i - 1];

        if (a === b) {
            row[i] = a + b;
            row[i - 1] = 0;

            score += row[i];
        }
    }
}

function rotateGridValues() {  // Rotate grid 90 degrees clock-wise
    let ret = [];
    fillGrid(ret);

    for (var i = 0; i < rowCount; ++i)
        for (var j = 0; j < columnCount; ++j)
            ret[i][j] = grid[rowCount - j - 1][i];

    return ret;
}

function rotateGrid(degrees) {  // Rotate the grid clockwise, -90, 90, -180 or 180 degrees
    switch (degrees) {
        case 90:
            grid = rotateGridValues();
            break;

        case -90:
            for (var i = 0; i < 3; ++i) // Rotating -90 degrees is the same as rotating 270, so rotate 90 degrees three times
                rotateGrid(90);
            break;

        case 180:
            rotateGrid(90);
            rotateGrid(90);
            break;

        case -180:
            rotateGrid(-90);
            rotateGrid(-90);
            break;

        default:
            // No-Op
    }
}

function moveRows() {
    for (var i = 0; i < rowCount; ++i) {
        grid[i] = shiftRow(grid[i]);
        sumRow(grid[i]);
        grid[i] = shiftRow(grid[i]);
    }
}

function handleKey() {
    let rotation = 0;

    switch (keyCode) {
        case UP_ARROW:
            rotation = upRotation;
            break;

        case DOWN_ARROW:
            rotation = downRotation;
            break;

        case LEFT_ARROW:
            rotation = leftRotation;
            break;

        case RIGHT_ARROW:
            // Don't do anything - default side
            break;

        default:
            return;     // Don't do the rest of the stuff for any other key
    }

    let lastGrid = grid.slice();   // Save the grid before attempting a shift

    rotateGrid(rotation);
    moveRows();
    rotateGrid(-rotation);  // Bring the grid back to its original orientation

    if (!compareGrids(lastGrid))  // If the grid actually changed
        addNewNumbers();
}

// p5.js functions

function setup() {
    createCanvas(401, 401);

    fillGrid(grid);
    addNewNumbers();    // Make sure the grid has numbers when starting the game
}

function draw() {
    drawGrid();
    drawScore();

    if (isGameOver || (isFull() && !hasPossibleMoves())) {
        isGameOver = true;
        showGameOver();
    } else if (isWon || hasWinningTile()) {
        isWon = true;
        showWon();
    }
}

function keyPressed() {
    handleKey();
}
