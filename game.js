document.addEventListener('DOMContentLoaded', () => {
    const colors = ['purple', 'yellow', 'blue', 'gray', 'brown', 'turquoise', 'pink'];
    let solution = generateSolution();
    let selectedColors = [];
    let currentAttempt = 0;
    const maxAttempts = 7;
    let remainingAttempts = maxAttempts;
    const previousAttempts = [];

    // Generate a random solution
    function generateSolution() {
        let solution = [];
        for (let i = 0; i < 4; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            solution.push(randomColor);
        }
        return solution;
    }

    // Update the display of selected colors
    function updateSelectedColors() {
        const selectedDivs = document.querySelectorAll('#selected-colors div');
        selectedColors.forEach((color, index) => {
            selectedDivs[index].style.backgroundColor = color;
            selectedDivs[index].style.borderColor = 'black'; // Reset border color
            selectedDivs[index].style.borderWidth = '4px';   // Reset border width
        });
    }

    // Handle color button click
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            if (selectedColors.length < 4) {
                selectedColors.push(button.getAttribute('data-color'));
                updateSelectedColors();
            }
        });
    });

    // Handle undo of the last color selection
    document.querySelectorAll('.selected-colors div').forEach((div, index) => {
        div.addEventListener('click', () => {
            if (selectedColors.length > index) {
                selectedColors.splice(index, 1);
                updateSelectedColors();
                // Clear any remaining color visuals
                for (let i = index; i < 4; i++) {
                    document.querySelectorAll('#selected-colors div')[i].style.backgroundColor = '#fff';
                }
            }
        });
    });

    // Check the guess against the solution
    function checkGuess(guess) {
        let feedback = [];
        for (let i = 0; i < 4; i++) {
            if (guess[i] === solution[i]) {
                feedback.push('correct');
            } else if (solution.includes(guess[i])) {
                feedback.push('wrong position');
            } else {
                feedback.push('wrong');
            }
        }
        return feedback;
    }

    // Display feedback with border colors
    function showFeedback(feedback) {
        const selectedDivs = document.querySelectorAll('#selected-colors div');
        feedback.forEach((result, index) => {
            if (result === 'correct') {
                selectedDivs[index].style.borderColor = 'green';
                selectedDivs[index].style.borderWidth = '8px';
            } else if (result === 'wrong position') {
                selectedDivs[index].style.borderColor = 'orange';
                selectedDivs[index].style.borderWidth = '8px';
            } else {
                selectedDivs[index].style.borderColor = 'red';
                selectedDivs[index].style.borderWidth = '8px';
            }
        });
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

    // Display previous attempts
    function displayPreviousAttempts() {
        const previousAttemptsDiv = document.getElementById('previous-attempts');
        const attemptDiv = document.createElement('div');
        attemptDiv.className = 'attempt';
        selectedColors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            attemptDiv.appendChild(colorDiv);
        });
        previousAttemptsDiv.appendChild(attemptDiv);
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
        if (selectedColors.length === 4) {
            const feedback = checkGuess(selectedColors);
            showFeedback(feedback);
            previousAttempts.push([...selectedColors]);
            displayPreviousAttempts();
            currentAttempt++;
            remainingAttempts--;
            updateAttempts(); // Update the remaining attempts display
            
            if (feedback.every(el => el === 'correct')) {
                showEndMessage('Congratulations! You won!');
            } else if (remainingAttempts === 0) {
                showEndMessage('Game Over!');
                displayCorrectSolution(); // Show the correct solution graphically
            }

            // Reset selected colors after each attempt
            selectedColors = [];
            updateSelectedColors();
        } else {
            alert('Please select exactly 4 colors!');
        }
    });

    // Reset game to initial state
    function resetGame() {
        selectedColors = [];
        currentAttempt = 0;
        remainingAttempts = maxAttempts;
        document.getElementById('previous-attempts').innerHTML = '';
        document.getElementById('end-message').classList.remove('show');
        document.getElementById('correct-solution').style.display = 'none';
        solution = generateSolution();
        updateAttempts();
        updateSelectedColors();
    }

    document.getElementById('new-game-btn').addEventListener('click', resetGame);

    // Toggle day/night mode
    const body = document.querySelector('body');
    document.getElementById('toggle-switch').addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    updateAttempts(); // Initialize attempts
});
