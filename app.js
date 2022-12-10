// Player factory
const Player = (name, marker) => {
    return { name, marker };
};

// gameBoard revealing module
const gameBoardManager = (() => {
    // Index 0 = first block div on board --- id=1,etc
    const board = ["", "", "", "", "", "", "", "", ""];

    // Returns reference to board Arr
    const getBoard = () => board;

    // Updates board before being rendered, by domManager.
    const appendToBoard = (event) => {
        // Taps into span child of containing target block div.
        const currSpanMarker = event.target.querySelector("span");
        let currentSpanNum = parseInt(currSpanMarker.classList[1]);
        let currIndex = currentSpanNum - 1;

        /*
        Need to Tie marker to currentPlayer.
        */
        board[currIndex] = "O";

        // Calls domManager to update the display, reflecting updated board.
        domManager.renderBoard();
    };

    // Returns board Arr, after being cleared of values
    const resetBoard = () => {
        board = [];
        board.push("", "", "", "", "", "", "", "", "");
        return board;
    };

    return {
        getBoard,
        appendToBoard,
        resetBoard,
    };
})();

// domMananger revealing module.
const domManager = (() => {
    // access to all div.block in DOM, as a nodelist.
    const allBlocks = document.querySelectorAll(".block");

    const renderBoard = () => {
        // Retrieves current board, saving it in const variable.
        const currBoard = gameBoardManager.getBoard();

        /*
        Loops through both allBlocks NodeList & CurrBoard Elements,
        using i, to tap into the index.
         */
        for (let i = 0; i < currBoard.length; i++) {
            if (allBlocks[i].textContent !== "") continue;
            else {
                /* 
                Creates a newSpan, to add currBoard marker,
                to the current block.
                 */
                const newSpan = document.createElement("span");
                newSpan.classList.add("marker", `${i + 1}`);
                newSpan.textContent = currBoard[i];
                allBlocks[i].appendChild(newSpan);
            }
        }
    };

    return {
        allBlocks,
        renderBoard,
    };
})();

// GameFlow Module
const gameFlowManager = (() => {
    domManager.renderBoard();
    let gameActive = true;

    // Creates Players in GameFlow, allowing them to choose.
    const player1 = Player("P1", "X");
    const player2 = Player("P2", "O");

    // Adds Event Listeners to allBlocks, handled by the gameBoardManager.
    domManager.allBlocks.forEach((block) =>
        block.addEventListener("click", gameBoardManager.appendToBoard)
    );

    return {
        currentMarker,
    };
})();
