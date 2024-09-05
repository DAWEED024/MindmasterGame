document.addEventListener('DOMContentLoaded', () => {
    const colors = ['purple', 'yellow', 'blue', 'gray', 'brown', 'turquoise', 'pink'];
    const difficultyLevels = {
        easy: { colors: 4, length: 4 },
        medium: { colors: 5, length: 4 },
        hard: { colors: 6, length: 4 },
        hardcore: { colors: 7, length: 5 }
    };
    const attemptsByDifficulty = {
        easy: 7,
        medium: 6,
        hard: 6,
        hardcore: 5
    };

    let currentDifficulty = 'easy'; // Default difficulty
    let solution = generateSolution();
    let selectedColors = [];
    let currentAttempt = 0;
    let remainingAttempts = attemptsByDifficulty[currentDifficulty];
    const previousAttempts = [];

    // Generate a random solution based on the difficulty
    function generateSolution() {
        const { colors: numColors, length } = difficultyLevels[currentDifficulty];
        let solution = [];
        for (let i = 0; i < length; i++) {
            const randomColor = colors.slice(0, numColors)[Math.floor(Math.random() * numColors)];
            solution.push(randomColor);
        }
        return solution;
    }

    // Update the display of selected colors and attach click listeners for undoing
    function updateSelectedColors() {
        const selectedDivs = document.querySelectorAll('#selected-colors div');
        selectedColors.forEach((color, index) => {
            selectedDivs[index].style.backgroundColor = color;
            selectedDivs[index].style.borderColor = 'black';
            selectedDivs[index].style.borderWidth = '4px';
        });

        // Attach click listener to undo a color by clicking on the selected color slot
        selectedDivs.forEach((div, index) => {
            div.addEventListener('click', () => {
                if (selectedColors.length > index) {
                    selectedColors.splice(index, 1); // Remove the selected color at the clicked index
                    updateSelectedColors(); // Update the UI to reflect this change
                    // Clear the remaining color visuals
                    for (let i = index; i < selectedDivs.length; i++) {
                        selectedDivs[i].style.backgroundColor = '#fff';
                    }
                }
            });
        });
    }

    // Generate color slots dynamically based on difficulty
    function generateColorSlots() {
        const selectedColorsDiv = document.getElementById('selected-colors');
        selectedColorsDiv.innerHTML = '';
        const { length } = difficultyLevels[currentDifficulty];

        for (let i = 0; i < length; i++) {
            const colorSlot = document.createElement('div');
            colorSlot.style.backgroundColor = '#fff';
            selectedColorsDiv.appendChild(colorSlot);
        }
    }

    // Handle color button click
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            if (selectedColors.length < difficultyLevels[currentDifficulty].length) {
                selectedColors.push(button.getAttribute('data-color'));
                updateSelectedColors();
            }
        });
    });

    // Check the guess against the solution with proper color counting
    function checkGuess(guess) {
        let feedback = [];
        let solutionCopy = [...solution]; // Create a copy of the solution for manipulation
        let guessCopy = [...guess]; // Copy the guess as well

        // First, check for exact matches (correct color in the correct position)
        for (let i = 0; i < solution.length; i++) {
            if (guess[i] === solution[i]) {
                feedback.push('correct');
                solutionCopy[i] = null; // Remove from solutionCopy
                guessCopy[i] = null; // Remove from guessCopy
            }
        }

        // Then, check for correct colors in the wrong position
        for (let i = 0; i < guess.length; i++) {
            if (guessCopy[i] !== null) {
                const colorIndex = solutionCopy.indexOf(guessCopy[i]);
                if (colorIndex !== -1) {
                    feedback.push('wrong position');
                    solutionCopy[colorIndex] = null; // Remove color from solutionCopy
                } else {
                    feedback.push('wrong'); // Color is not present in the solution
                }
            }
        }

        return feedback;
    }

    // Display feedback with border colors and messages
    function showFeedback(feedback) {
        const selectedDivs = document.querySelectorAll('#selected-colors div');
        const feedbackMessage = [];
        feedback.forEach((result, index) => {
            if (result === 'correct') {
                selectedDivs[index].style.borderColor = 'green';
                selectedDivs[index].style.borderWidth = '8px';
                feedbackMessage.push('Correct color in correct position');
            } else if (result === 'wrong position') {
                selectedDivs[index].style.borderColor = 'orange';
                selectedDivs[index].style.borderWidth = '8px';
                feedbackMessage.push('Correct color in wrong position');
            } else {
                selectedDivs[index].style.borderColor = 'red';
                selectedDivs[index].style.borderWidth = '8px';
                feedbackMessage.push('Incorrect color');
            }
        });
        document.getElementById('feedback').textContent = feedbackMessage.join(', ');
    }

    // Update the remaining attempts
    function updateAttempts() {
        document.getElementById('attempts').textContent = remainingAttempts;
    }

    // Show end message
    function showEndMessage(message) {
        const endMessageDiv = document.getElementById('end-message');
        endMessageDiv.textContent = message;
        endMessageDiv.classList.add('show');
    }

    // Display previous attempts (last used color combination) - latest attempts on top
    function displayPreviousAttempts() {
        const previousAttemptsDiv = document.getElementById('previous-attempts');
        const attemptDiv = document.createElement('div');
        attemptDiv.className = 'attempt';
        selectedColors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            attemptDiv.appendChild(colorDiv);
        });
        previousAttemptsDiv.prepend(attemptDiv); // Add the new attempt at the top
    }

    // Display the correct solution graphically
    function displayCorrectSolution() {
        const correctSolutionDiv = document.getElementById('correct-solution');
        correctSolutionDiv.innerHTML = '';
        solution.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            correctSolutionDiv.appendChild(colorDiv);
        });
        correctSolutionDiv.style.display = 'flex';
    }

    // Handle the submit guess button click
    document.getElementById('submit-guess').addEventListener('click', () => {
        if (selectedColors.length === difficultyLevels[currentDifficulty].length) {
            const feedback = checkGuess(selectedColors);
            showFeedback(feedback);
            previousAttempts.push([...selectedColors]); // Store the last used color combination
            displayPreviousAttempts(); // Show the last used combination
            currentAttempt++;
            remainingAttempts--;
            updateAttempts();
            
            if (feedback.every(el => el === 'correct')) {
                showEndMessage('Congratulations! You won!');
            } else if (remainingAttempts === 0) {
                showEndMessage('Game Over!');
                displayCorrectSolution();
            }

            selectedColors = [];
            updateSelectedColors();
        } else {
            alert('Please select exactly the correct number of colors!');
        }
    });

    // Reset game to initial state
    function resetGame() {
        selectedColors = [];
        currentAttempt = 0;
        remainingAttempts = attemptsByDifficulty[currentDifficulty];
        document.getElementById('previous-attempts').innerHTML = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('end-message').classList.remove('show');
        document.getElementById('correct-solution').style.display = 'none';
        solution = generateSolution();
        updateAttempts();
        generateColorSlots();
    }

    document.getElementById('new-game-btn').addEventListener('click', resetGame);

    // Toggle day/night mode
    const body = document.querySelector('body');
    document.getElementById('toggle-switch').addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // Handle difficulty button click
    document.getElementById('easy-btn').addEventListener('click', () => {
        currentDifficulty = 'easy';
        resetGame();
    });
    document.getElementById('medium-btn').addEventListener('click', () => {
        currentDifficulty = 'medium';
        resetGame();
    });
    document.getElementById('hard-btn').addEventListener('click', () => {
        currentDifficulty = 'hard';
        resetGame();
    });
    document.getElementById('hardcore-btn').addEventListener('click', () => {
        currentDifficulty = 'hardcore';
        resetGame();
    });

    // Initialize game
    generateColorSlots();
    updateAttempts();
});
