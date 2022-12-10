// Player factory
const Player = (name, marker) => {
    return { name, marker };
};

// gameBoard module
const gameBoardManager = (() => {
    // Index 0 = first block div on board --- id=1,etc
    const board = ["", "", "", "", "", "", "", "", ""];

    // Returns reference to board Arr
    const getBoard = () => board;

    // Returns board Arr, after being cleared of values
    const resetBoard = () => {
        board = [];
        board.push("", "", "", "", "", "", "", "", "");
        return board;
    };

    return {
        getBoard,
        resetBoard,
    };
})();

// domMananger module.
const domManager = (() => {
    // access to all div.block in DOM, as a nodelist.
    const allBlocks = document.querySelectorAll(".block");

    const renderBoard = () => {
        const currBoard = gameBoardManager.getBoard();

        for (let i = 0; i < currBoard.length; i++) {
            const newSpan = document.createElement("span");
            newSpan.classList.add("marker", `${i + 1}`);
            newSpan.textContent = currBoard[i];
            allBlocks[i].appendChild(newSpan);

            if (allBlocks[i].hasChildNodes()) {
                continue;
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
    // Initial GameBoard Render
    domManager.renderBoard();

    // Variables
    let gameActive = true;
    let currMarker = "X";

    // Creates Players in GameFlow, allowing them to choose.
    const player1 = Player("P1", "X");
    const player2 = Player("P2", "O");

    // Returns Marker reference.
    const getMarker = () => {
        return currMarker;
    };

    const switchCurrentPlayer = () => {
        return currMarker === "X"
            ? (currMarker = player2.marker)
            : (currMarker = player1.marker);
    };

    // Click event for players to place their markers
    const playGame = (event) => {
        // Retrieve reference from gameBoardManager.
        const currBoard = gameBoardManager.getBoard();
        // Dom access to marker span, via parent div.block.
        let currSpan = event.target.querySelector(".marker");

        // Prevents overriding of player markers
        if (currSpan.textContent !== "") {
            return;
        } else {
            let currSpanID = currSpan.classList[1];
            let currIndexAccess = parseInt(currSpanID) - 1;

            // Updates board
            currBoard[currIndexAccess] = currMarker;

            // Adds the current marker to the board, visually, via domManager;
            currSpan.textContent = getMarker();
            switchCurrentPlayer();
        }
        console.log(currBoard);
    };

    domManager.allBlocks.forEach((block) => {
        block.addEventListener("click", playGame);
    });

    return {
        getMarker,
        switchCurrentPlayer,
    };
})();
