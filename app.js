// Player factory
const Player = (name, marker) => {
    return { name, marker };
};

// gameBoard module
const gameBoardManager = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const winConditions = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8],
    ];

    const getBoard = () => board;

    const checkForPattern = (p1Mark, p2Mark) => {
        const currBoard = board;

        for (let cond of winConditions) {
            let pos1 = cond[0];
            let pos2 = cond[1];
            let pos3 = cond[2];

            let firstMark = currBoard[pos1];
            let secMark = currBoard[pos2];
            let thirdMark = currBoard[pos3];

            if (
                firstMark === p1Mark &&
                secMark === p1Mark &&
                thirdMark === p1Mark
            ) {
                return p1Mark;
            } else if (
                firstMark === p2Mark &&
                secMark === p2Mark &&
                thirdMark === p2Mark
            ) {
                return p2Mark;
            }
        }
    };

    const renderBoard = () => {
        const currBoard = board;
        const allBlocks = domManager.allBlocks;

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

    // Returns board Arr, after being cleared of values
    const resetBoard = () => {
        board = [];
        board.push("", "", "", "", "", "", "", "", "");
        return board;
    };

    return {
        getBoard,
        checkForPattern,
        renderBoard,
        resetBoard,
    };
})();

// domMananger module.
const domManager = (() => {
    // access to all div.block in DOM, as a nodelist.
    const allBlocks = document.querySelectorAll(".block");
    // Access to player_div
    const playerDiv = document.querySelector(".player_div");

    const displayCurrPlayer = () => {
        let currPlayer = playerDiv.querySelector(".player");
        currPlayer.textContent = gameFlowManager.getMarker();
    };

    const displayWinner = (player) => {
        playerDiv.textContent = `Player ${player} wins!`;
    };

    return {
        allBlocks,
        displayCurrPlayer,
        displayWinner,
    };
})();

// GameFlow Module
const gameFlowManager = (() => {
    // Initial GameBoard Render
    gameBoardManager.renderBoard();

    // Creates Players in GameFlow, allowing them to choose.
    const player1 = Player("P1", "X");
    const player2 = Player("P2", "O");

    let currMarker = player1.marker ? player1.marker : player2.marker;

    // Returns Marker reference.
    const getMarker = () => currMarker;

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
            // Checking for win pattern here, aim to return true/false for win codition.

            // Always checking for a winning pattern
            let checkWinner = gameBoardManager.checkForPattern(
                player1.marker,
                player2.marker
            );

            // Once a winner exists, announce and stop game.
            if (checkWinner) {
                let winner = checkWinner;
                domManager.displayWinner(winner);
                domManager.allBlocks.forEach((block) =>
                    block.removeEventListener("click", playGame)
                );
            } else {
                switchCurrentPlayer();
                // Calls currMarker and dynamically changes it, on the DOM.
                domManager.displayCurrPlayer();
                // Removes the event listener from current event target (singleton).
                event.target.removeEventListener("click", playGame);
            }
        }
    };

    domManager.allBlocks.forEach((block) => {
        block.addEventListener("click", playGame);
    });

    return {
        getMarker,
    };
})();

// Must be called outside once, in order for player div > player info, to show contents.
domManager.displayCurrPlayer();
