let currentQuiz = 'Gluten.csv'; // Default quiz
let currentQuestionIndex = 0;
let score = 0;
let accumulatedScore = 0; // Variable to store the cumulative score
let questions = [];
let timerInterval;
let totalTime = 0; // Timer reset


// Function to load and display the selected quiz
function loadQuizData(callback) {
    fetch(currentQuiz)
        .then(response => response.text())
        .then(data => {
            questions = []; // Reset the questions array
            const rows = data.split('\n');
            for (let i = 1; i < rows.length; i++) { // Skip header row
                const cols = rows[i].split(',');
                if (cols.length > 1) {
                    questions.push({
                        questionNumber: cols[0],
                        questionText: cols[1],
                        answers: [cols[2], cols[3], cols[4], cols[5]],
                        correctAnswer: parseInt(cols[6])
                    });
                }
            }
            callback(); 
        });
}


// Function to handle quick links and load the appropriate quiz
function selectQuiz(quizFile) {
    currentQuiz = quizFile;
    currentQuestionIndex = 0; // Reset the question index
    score = 0; // Reset the score for new quiz
    loadQuizData(showQuestion); 
}

// Function to display the current question
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-box').textContent = question.questionText;

        const answerContainer = document.getElementById('answer-boxes');
        answerContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.classList.add('answer-box');
            answerButton.textContent = answer;
            answerButton.onclick = () => checkAnswer(index + 1);
            answerContainer.appendChild(answerButton);
        });

        resetTimer(); // Reset timer for each new question
        startTimer();
        updateProgress();
    } else {
        endQuiz();
    }
}

// Function to check if the selected answer is correct
function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    stopTimer();

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #888';
    popup.style.borderRadius = '8px';
    popup.style.textAlign = 'center';
    popup.style.backgroundColor = selectedAnswer === question.correctAnswer ? '#355952' : '#EAB63E';
    popup.style.color = selectedAnswer === question.correctAnswer ? 'white' : 'black';
    popup.textContent = selectedAnswer === question.correctAnswer ? 'Correct!' : `Incorrect! The correct answer was: ${question.answers[question.correctAnswer - 1]}`;
    
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.marginTop = '10px';
    okButton.onclick = () => {
        popup.remove();
        currentQuestionIndex++;
        showQuestion();
    };

    popup.appendChild(okButton);
    document.body.appendChild(popup);

    if (selectedAnswer === question.correctAnswer) {
        score++;
        accumulatedScore++; 
    }
}

// Function to handle the end of the quiz
function endQuiz() {
    stopTimer();
    document.getElementById('question-box').innerHTML = 'Quiz Complete!';
    document.getElementById('answer-boxes').innerHTML = '';
    document.getElementById('result-section').style.display = 'block';
    
    // Display current quiz score
    document.getElementById('final-score').textContent = `You scored ${score} out of ${questions.length} in this quiz.`;
    
    // Display accumulated score
    document.getElementById('accumulated-score').textContent = `Your total score across all quizzes is ${accumulatedScore}.`; 
}


// Timer functions
function startTimer() {
    totalTime = 0; // Reset time for each question
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        totalTime++;
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        timerElement.textContent = `Time: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    totalTime = 0; // Reset time count
    document.getElementById('timer').textContent = 'Time: 00:00'; // Reset display
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Progress bar update
function updateProgress() {
    const progressElement = document.getElementById('progress');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressElement.style.width = `${progress}%`;
}


// Event listeners for quick links
document.getElementById('gluten-quiz').addEventListener('click', function() {
    selectQuiz('Gluten.csv');
});

document.getElementById('allergies-quiz').addEventListener('click', function() {
    selectQuiz('FoodAllergies.csv');
});

document.getElementById('snacking-quiz').addEventListener('click', function() {
    selectQuiz('HealthySnacking.csv');
});

document.getElementById('balanced-quiz').addEventListener('click', function() {
    selectQuiz('Balanceddiet.csv');
});

// Event listener for "Retake Quiz" button
document.getElementById('retake-quiz').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0; // Reset the score for the current quiz
    document.getElementById('result-section').style.display = 'none';
    showQuestion();
});

// Initialize quiz when the page is loaded
window.onload = function() {
    loadQuizData(showQuestion); // Load the default quiz (Gluten.csv)
};
