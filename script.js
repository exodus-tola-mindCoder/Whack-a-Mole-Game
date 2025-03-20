const gameGrid = document.getElementById('gameGrid');
const moles = document.querySelectorAll('.mole');
const scoreDisplay = document.getElementById('score');
const startGameButton = document.getElementById('startGameButton');
const stopGameButton = document.getElementById('stopGameButton');
// const gameTimer = document.getElementById('gameTimer');
// const timerDisplay = document.getElementById('timerDisplay');


let score = 0;
let activeMoleIndex = null;
let gameInterval = null;


// Function to randomly activate a mole

function activeRandomMole() {
  if (activeMoleIndex !== null) {
    moles[activeMoleIndex].classList.remove('active'); // remove the active class from the current active mole
  }
  activeMoleIndex = Math.floor(Math.random() * moles.length);
  moles[activeMoleIndex].classList.add('active'); // add the active class to the new active mole
}

// Sound Effects
const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');
const gameOverSound = document.getElementById('gameOverSound');

// Function to handle mole clicks with sound
// Timer Extension
const timeExtensionThreshold = 10; // Score required to earn extra time
const timeExtensionAmount = 5; // Amount of time to add in seconds

// Modify the mole click handler to include timer extension logic
moles.forEach((mole, index) => {
  mole.addEventListener('click', () => {
    if (index === activeMoleIndex) {
      hitSound.play(); // Play hit sound
      score++;
      scoreDisplay.textContent = score; // Update the score
      moles[activeMoleIndex].classList.remove('active'); // Deactivate the mole
      activeMoleIndex = null;

      // Check if the player has reached the threshold for a timer extension
      if (score % timeExtensionThreshold === 0) {
        timer += timeExtensionAmount; // Add extra time
        timerDisplay.textContent = timer; // Update the timer display
        alert(`Bonus! ${timeExtensionAmount} seconds added to the timer!`);
      }

      // Check if the player has reached the threshold to level up
      if (score % levelThreshold === 0) {
        increaseLevel();
      }
    }
  });
});
// Whack-a-Mole Game Timer
const timerDisplay = document.getElementById('timerDisplay');
let timer = 30;
let timerInterval = null;
// Function to start the timer
function startTimer(resume = false) {
  if (!resume) {
    timer = 30; // Reset the timer if not resuming
  }
  timerDisplay.textContent = timer; // Update the timer display
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer; // Update the timer display
    if (timer <= 0) {
      clearInterval(timerInterval); // Stop the timer
      clearInterval(gameInterval); // Stop the game
      if (activeMoleIndex !== null) {
        moles[activeMoleIndex].classList.remove('active'); // Deactivate the active mole
      }
      activeMoleIndex = null;
      gameOverSound.play(); // Play game over sound
      showGameOverScreen(); // Show the Game Over Screen
    }
  }, 1000); // Decrease the timer every second
}

// Function to start the game
startGameButton.addEventListener('click', () => {
  const playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Please enter your name before starting the game!');
    return;
  }

  score = 0;
  scoreDisplay.textContent = score; // Reset the score
  if (gameInterval) clearInterval(gameInterval); // Clear any existing interval
  if (timerInterval) clearInterval(timerInterval); // Clear any existing timer
  startTimer(); // Start the timer
  gameInterval = setInterval(activeRandomMole, moleInterval); // Use the selected difficulty

  level = 1; // Reset the level
  levelDisplay.textContent = level; // Update the level display
  moleInterval = 1600; // Reset the mole interval to the default
  isPaused = false; // Reset pause state
  pauseGameButton.style.display = 'inline-block'; // Show Pause button
  resumeGameButton.style.display = 'none'; // Hide Resume button
});

stopGameButton.addEventListener('click', () => {
  clearInterval(gameInterval); // Stop the game
  clearInterval(timerInterval); // Stop the timer
  if (activeMoleIndex !== null) {
    moles[activeMoleIndex].classList.remove('active'); // Deactivate the active mole
  }
  activeMoleIndex = null;
  timer = 0; // Reset the timer
  timerDisplay.textContent = timer; // Update the timer display
  score = 0; // Reset the score
  scoreDisplay.textContent = score; // Update the score display
  hideGameOverScreen(); // Hide the Game Over Screen
});


// // Difficulty Levels
const difficultySelector = document.getElementById('difficulty');
let moleInterval = 1600;
// Update mole interval based on selected difficulty
difficultySelector.addEventListener('change', (event) => {
  moleInterval = parseInt(event.target.value, 10);
});


// Leaderboard
const leaderboardBody = document.getElementById('leaderboardBody');
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];



// Player Name Input
const playerNameInput = document.getElementById('playerName');

// Function to update the leaderboard{
function updateLeaderboard(playerName, score) {
  if (!playerName) {
    alert('Please enter your name before starting the game.');
    return;
  }

  leaderboard.push({ player: playerName, score })
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);

  // Save leaderboard to localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  // Clear the leaderboard table
  leaderboardBody.innerHTML = '';

  // Populate the leaderboard table
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${entry.player}</td><td>${entry.score}</td>`;
    leaderboardBody.appendChild(row);
  });
}

// Load leaderboard on page load
function loadLeaderboard() {
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${entry.player}</td><td>${entry.score}</td>`;
    leaderboardBody.appendChild(row);
  });
};

loadLeaderboard();


// reset the leaderboard

const resetLeaderboardButton = document.getElementById('resetLeaderboardButton');

resetLeaderboardButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the leaderboard?')) {
    leaderboard = [];
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    leaderboardBody.innerHTML = '';
    alert('Leaderboard has been reset successfully!');
  }
})


// Function to handle missed clicks
gameGrid.addEventListener('click', (event) => {
  if (!event.target.classList.contains('mole')) {
    missSound.play(); // Play miss sound
  }
});


// Game Levels
const levelDisplay = document.getElementById('levelDisplay');
let level = 1; // Initial level
let levelThreshold = 10; // Score required to advance to the next level

// Function to increase the level
function increaseLevel() {
  level++;
  levelDisplay.textContent = level; // Update the level display
  moleInterval = Math.max(200, moleInterval - 100); // Decrease mole interval (minimum 200ms)
  clearInterval(gameInterval); // Clear the current interval
  gameInterval = setInterval(activeRandomMole, moleInterval); // Start a new interval with the updated speed
  alert(`Level Up! Welcome to Level ${level}.`);
}

// Pause and Resume Buttons
const pauseGameButton = document.getElementById('pauseGameButton');
const resumeGameButton = document.getElementById('resumeGameButton');
let isPaused = false;

// Function to pause the game
pauseGameButton.addEventListener('click', () => {
  if (!isPaused) {
    clearInterval(timerInterval); // Pause the timer
    clearInterval(gameInterval); // Pause mole activation
    isPaused = true;
    pauseGameButton.style.display = 'none'; // Hide Pause button
    resumeGameButton.style.display = 'inline-block'; // Show Resume button
  }
});

// Function to resume the game
resumeGameButton.addEventListener('click', () => {
  if (isPaused) {
    isPaused = false;
    startTimer(true); // Resume the timer
    gameInterval = setInterval(activeRandomMole, moleInterval); // Resume mole activation
    pauseGameButton.style.display = 'inline-block'; // Show Pause button
    resumeGameButton.style.display = 'none'; // Hide Resume button
  }
});

// Game Over Screen
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGameButton');
const mainMenuButton = document.getElementById('mainMenuButton');

// Function to show the Game Over Screen
function showGameOverScreen() {
  finalScoreDisplay.textContent = score; // Display the final score
  gameOverScreen.style.display = 'flex'; // Show the Game Over Screen

  // update the leaderboard
  updateLeaderboard(playerNameInput.value.trim(), score); // Update the leaderboard with the player's name and score
  gameOverScreen.style.display = 'flex'; // Show the Game Over Screen
}
// Function to hide the Game Over Screen
function hideGameOverScreen() {
  gameOverScreen.style.display = 'none'; // Hide the Game Over Screen
}

// Restart Game Button
restartGameButton.addEventListener('click', () => {
  hideGameOverScreen(); // Hide the Game Over Screen
  startGameButton.click(); // Trigger the Start Game button
});

// Main Menu Button
mainMenuButton.addEventListener('click', () => {
  hideGameOverScreen(); // Hide the Game Over Screen
  stopGameButton.click(); // Trigger the Stop Game button
});


