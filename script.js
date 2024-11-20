// DOM Elements
const cards = document.querySelectorAll(".card");
const timeDisplay = document.querySelector(".time b");
const flipsDisplay = document.querySelector(".flips b");
const refreshButton = document.querySelector(".details button");

// Game Variables
const MAX_TIME = 120;
let timeLeft = MAX_TIME;
let flips = 0;
let matchedPairs = 0;
let isDeckDisabled = false;
let isGameStarted = false;
let firstCard = null;
let secondCard = null;
let timer = null;

// Initialize the game timer
function startTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        return;
    }
    timeLeft--;
    timeDisplay.textContent = timeLeft;
}

// Handle card flipping
function handleCardFlip({ target: clickedCard }) {
    if (!isGameStarted) {
        isGameStarted = true;
        timer = setInterval(startTimer, 1000);
    }

    if (
        clickedCard !== firstCard &&
        !isDeckDisabled &&
        timeLeft > 0 &&
        !clickedCard.classList.contains("flip")
    ) {
        flips++;
        flipsDisplay.textContent = flips;
        clickedCard.classList.add("flip");

        if (!firstCard) {
            firstCard = clickedCard;
            return;
        }

        secondCard = clickedCard;
        isDeckDisabled = true;

        const firstCardImg = firstCard.querySelector(".back-view img").src;
        const secondCardImg = secondCard.querySelector(".back-view img").src;

        checkForMatch(firstCardImg, secondCardImg);
    }
}

// Check if two flipped cards match
function checkForMatch(img1, img2) {
    if (img1 === img2) {
        matchedPairs++;
        if (matchedPairs === 6 && timeLeft > 0) {
            clearInterval(timer);
        }

        firstCard.removeEventListener("click", handleCardFlip);
        secondCard.removeEventListener("click", handleCardFlip);
        resetSelectedCards();
    } else {
        setTimeout(() => {
            firstCard.classList.add("shake");
            secondCard.classList.add("shake");
        }, 400);

        setTimeout(() => {
            firstCard.classList.remove("shake", "flip");
            secondCard.classList.remove("shake", "flip");
            resetSelectedCards();
        }, 1200);
    }
}

// Reset the selected cards and re-enable the deck
function resetSelectedCards() {
    firstCard = null;
    secondCard = null;
    isDeckDisabled = false;
}

// Shuffle cards and reset the game
function shuffleCards() {
    timeLeft = MAX_TIME;
    flips = 0;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;

    clearInterval(timer);
    timeDisplay.textContent = timeLeft;
    flipsDisplay.textContent = flips;
    isDeckDisabled = false;
    isGameStarted = false;

    // Shuffle card images
    const cardImages = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    cardImages.sort(() => Math.random() - 0.5);

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        const imgTag = card.querySelector(".back-view img");
        setTimeout(() => {
            imgTag.src = `images/img-${cardImages[index]}.png`;
        }, 500);

        // Re-add event listener for flipped cards
        card.addEventListener("click", handleCardFlip);
    });
}

// Event Listeners
refreshButton.addEventListener("click", shuffleCards);
cards.forEach(card => card.addEventListener("click", handleCardFlip));

// Initialize the game on page load
shuffleCards();
