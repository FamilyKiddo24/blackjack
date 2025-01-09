let deck = []; // Declare the deck globally
let playerHand = [];
let dealerHand = [];
let betAmount = 0;

// Function to initialize the deck
function initializeDeck() {
    deck = [
        '2H', '2D', '2C', '2S',
        '3H', '3D', '3C', '3S',
        '4H', '4D', '4C', '4S',
        '5H', '5D', '5C', '5S',
        '6H', '6D', '6C', '6S',
        '7H', '7D', '7C', '7S',
        '8H', '8D', '8C', '8S',
        '9H', '9D', '9C', '9S',
        '10H', '10D', '10C', '10S',
        'JH', 'JD', 'JC', 'JS',
        'QH', 'QD', 'QC', 'QS',
        'KH', 'KD', 'KC', 'KS',
        'AH', 'AD', 'AC', 'AS'
    ];
}

// Function to shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal a card
function dealCard(hand) {
    const card = deck.pop();
    hand.push(card);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        const cardValue = card.length === 2 ? card[0] : card.slice(0, 2); // Get the card value (e.g., '2', 'J', 'A', '10')

        if (['J', 'Q', 'K'].includes(cardValue)) {
            score += 10; // Face cards are worth 10 points
        } else if (cardValue === 'A') {
            aces += 1; // Count the Ace
            score += 11; // Initially count Ace as 11
        } else {
            score += parseInt(cardValue); // Add the numeric value of the card
        }
    }

    // Adjust for Aces if score exceeds 21
    while (score > 21 && aces > 0) {
        score -= 10; // Count one Ace as 1 instead of 11
        aces -= 1; // Reduce the count of Aces
    }

    return score; // Return the final score
}

// Function to check for Blackjack
function checkForBlackjack(hand) {
    return hand.length === 2 && calculateScore(hand) === 21;
}

// Function to reset the game
function resetGame() {
    // Show the bet input and start button
    document.getElementById('bet-input').style.display = 'inline-block';
    document.getElementById('start-button').style.display = 'inline-block';

    // Hide action buttons
    document.getElementById('hit-button').style.display = 'none';
    document.getElementById('stand-button').style.display = 'none';
    document.getElementById('split-button').style.display = 'none';
    document.getElementById('double-button').style.display = 'none';

    // Clear hands and results
    playerHand = [];
    dealerHand = [];
    document.getElementById('bet-display').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';

    // Initialize the deck
    initializeDeck();
}

// Function to display the result of the game
function displayResult() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    let resultMessage = '';

    if (playerScore > 21) {
        resultMessage = 'You busted! Dealer wins.';
    } else if (dealerScore > 21) {
        resultMessage = 'Dealer busted! You win!';
    } else if (playerScore === dealerScore) {
        resultMessage = 'It\'s a tie!';
    } else if (playerScore > dealerScore) {
        resultMessage = 'You win!';
    } else {
        resultMessage = 'Dealer wins!';
    }

    document.getElementById('result').innerText = resultMessage;

    // Call resetGame after a short delay to allow the user to see the result
    setTimeout(resetGame, 1500); // Adjust the delay as needed
}

// Function to start the game
function startGame() {
    betAmount = parseFloat(document.getElementById('bet-input').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }

    // Hide the bet input and start button
    document.getElementById('bet-input').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';

    // Hide action buttons initially
    document.getElementById('hit-button').style.display = 'none';
    document.getElementById('stand-button').style.display = 'none';
    document.getElementById('split-button').style.display = 'none';
    document.getElementById('double-button').style.display = 'none';

    // Show the bet amount
    document.getElementById('bet-display').innerText = `You bet: $${betAmount}`;

    // Shuffle the deck
    shuffleDeck();

    playerHand = [];
    dealerHand = [];
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
    revealCards();
    console.log(playerHand);
    // Show action buttons after the game starts
    document.getElementById('hit-button').style.display = 'inline-block';
    document.getElementById('stand-button').style.display = 'inline-block';
    document.getElementById('split-button').style.display = 'inline-block';
    document.getElementById('double-button').style.display = 'inline-block';

    // Check for Blackjack
    
    if (checkForBlackjack(playerHand)) {
        revealCards();
        document.getElementById('result').innerText = 'Blackjack! You win!';
        return;
    } else if (checkForBlackjack(dealerHand)) {
        revealCards();
        document.getElementById('result').innerText = 'Dealer has Blackjack! Dealer wins.';
        return;
    }
}

function revealCards() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');

    playerHand.forEach((card, index) => {
        if (index < 5) { // Limit to 5 cards
            console.log(card);
            const carUrl = `https://deckofcardsapi.com/static/img/${card}.png`;

            const cardImage = document.createElement('img');
            cardImage.src = carUrl;
            playerCardsDiv.appendChild(cardImage);
        }
    });

    dealerHand.forEach((card, index) => {
        if (index < 5) { // Limit to 5 cards
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${card}.png')`; // Using a public card sprite API
            dealerCardsDiv.appendChild(cardDiv);
        }
    });

    document.getElementById('player-cards').innerText += ` (Score: ${calculateScore(playerHand)})`;
    document.getElementById('dealer-cards').innerText += ` (Score: ${calculateScore(dealerHand)})`;
}

// Event listeners for buttons
document.getElementById('start-button').addEventListener('click', startGame);

document.getElementById('hit-button').addEventListener('click', () => {
    dealCard(playerHand);
    updateDisplay();
    if (calculateScore(playerHand) > 21) {
        revealCards();
        displayResult();
    }
});

document.getElementById('stand-button').addEventListener('click', () => {
    while (calculateScore(dealerHand) < 17) {
        dealCard(dealerHand);
    }
    revealCards();
    displayResult();
});

document.getElementById('split-button').addEventListener('click', () => {
    // Implement split logic here
});

document.getElementById('double-button').addEventListener('click', () => {
    // Implement double logic here
});

document.getElementById('bet-input').addEventListener('input', (event) => {
    betAmount = parseFloat(event.target.value) || 0;
});