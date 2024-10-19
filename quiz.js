let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;

// Load CSV and initialize quiz
function loadCSVData(callback) {
    fetch('questions.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            for (let i = 1; i < rows.length; i++) { // Skip the header
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

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-title').textContent = `Question ${question.questionNumber}`;
        document.getElementById('question-box').innerHTML = `<p>${question.questionText}</p>`;
        
        const answerContainer = document.getElementById('answer-boxes');
        answerContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer-box');
            answerDiv.textContent = answer;
            answerDiv.onclick = () => checkAnswer(index + 1);
            answerContainer.appendChild(answerDiv);
        });

        startTimer();
        updateProgress();
    } else {
        endQuiz();
    }
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    stopTimer();
    if (selectedAnswer === question.correctAnswer) {
        score++;
        alert('Correct!');
    } else {
        alert('Incorrect! The correct answer was: ' + question.answers[question.correctAnswer - 1]);
    }
    document.getElementById('score').textContent = score;
    currentQuestionIndex++;
    showQuestion();
}

function startTimer() {
    let time = 0;
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        time++;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerElement.textContent = `Time: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateProgress() {
    const progressElement = document.getElementById('progress');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressElement.style.width = `${progress}%`;
}

function endQuiz() {
    stopTimer();
    document.getElementById('question-box').innerHTML = '<p>Quiz Complete!</p>';
    document.getElementById('answer-boxes').innerHTML = '';
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('final-score').textContent = `You scored ${score} out of ${questions.length}`;
}

document.getElementById('retake-quiz').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-section').style.display = 'none';
    showQuestion();
});

window.onload = function() {
    loadCSVData(showQuestion);
};


