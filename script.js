// Calculator State
let display = document.getElementById('display');
let history = [];
let memory = 0;
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Get all button elements
const numberBtns = document.querySelectorAll('.btn.number');
const operatorBtns = document.querySelectorAll('.btn.operator');
const functionBtns = document.querySelectorAll('.btn.function-btn');
const sciFuncBtns = document.querySelectorAll('.btn.sci-func');
const equalsBtn = document.querySelector('.btn.equals');

// Mode toggle
const basicMode = document.getElementById('basicMode');
const scientificMode = document.getElementById('scientificMode');
const basicCalc = document.getElementById('basicCalc');
const scientificCalc = document.getElementById('scientificCalc');

// History
const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const closeHistory = document.getElementById('closeHistory');
const clearHistory = document.getElementById('clearHistory');

// Initialize
initializeEventListeners();
updateDisplay();

function initializeEventListeners() {
    // Number buttons
    numberBtns.forEach(btn => {
        btn.addEventListener('click', () => handleNumberInput(btn.dataset.number));
    });

    // Operator buttons
    operatorBtns.forEach(btn => {
        btn.addEventListener('click', () => handleOperator(btn.dataset.operator));
    });

    // Function buttons
    functionBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFunction(btn.dataset.action));
    });

    // Scientific function buttons
    sciFuncBtns.forEach(btn => {
        btn.addEventListener('click', () => handleScientificFunction(btn.dataset.sciFunc));
    });

    // Equals button
    equalsBtn.addEventListener('click', calculate);

    // Mode toggle
    basicMode.addEventListener('click', () => switchMode('basic'));
    scientificMode.addEventListener('click', () => switchMode('scientific'));

    // History
    historyBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
    });

    closeHistory.addEventListener('click', () => {
        historyPanel.classList.add('hidden');
    });

    clearHistory.addEventListener('click', () => {
        history = [];
        updateHistoryDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

function handleNumberInput(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === '.' && currentInput.includes('.')) {
        return;
    }

    if (number === '.' && currentInput === '') {
        currentInput = '0.';
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function handleOperator(op) {
    if (currentInput === '') return;

    if (previousInput !== '' && operator !== null) {
        calculate();
    }

    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function handleFunction(action) {
    switch (action) {
        case 'clear':
            currentInput = '';
            previousInput = '';
            operator = null;
            shouldResetDisplay = false;
            break;
        case 'delete':
            currentInput = currentInput.slice(0, -1);
            break;
        case 'toggleSign':
            if (currentInput !== '') {
                currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
            }
            break;
        case 'memoryClear':
            memory = 0;
            updateMemoryDisplay();
            break;
        case 'memoryRecall':
            currentInput = memory.toString();
            shouldResetDisplay = true;
            break;
        case 'memoryAdd':
            if (currentInput !== '') {
                memory += parseFloat(currentInput);
                shouldResetDisplay = true;
                updateMemoryDisplay();
                updateDisplay();
            }
            break;
        case 'memorySubtract':
            if (currentInput !== '') {
                memory -= parseFloat(currentInput);
                shouldResetDisplay = true;
                updateMemoryDisplay();
                updateDisplay();
            }
            break;
    }
    updateDisplay();
}

function handleScientificFunction(func) {
    if (!currentInput && !['pi', 'e'].includes(func)) return;

    let result;
    const num = parseFloat(currentInput);

    switch (func) {
        case 'sin':
            result = Math.sin(toRadians(num));
            break;
        case 'cos':
            result = Math.cos(toRadians(num));
            break;
        case 'tan':
            result = Math.tan(toRadians(num));
            break;
        case 'asin':
            result = toDegrees(Math.asin(num));
            break;
        case 'acos':
            result = toDegrees(Math.acos(num));
            break;
        case 'log':
            result = Math.log10(num);
            break;
        case 'ln':
            result = Math.log(num);
            break;
        case 'sqrt':
            result = Math.sqrt(num);
            break;
        case 'square':
            result = num * num;
            break;
        case 'cube':
            result = num * num * num;
            break;
        case 'reciprocal':
            result = 1 / num;
            break;
        case 'factorial':
            result = factorial(Math.floor(num));
            break;
        case 'pi':
            if (currentInput === '') {
                currentInput = Math.PI.toString();
            } else {
                currentInput += Math.PI.toString();
            }
            updateDisplay();
            return;
        case 'e':
            if (currentInput === '') {
                currentInput = Math.E.toString();
            } else {
                currentInput += Math.E.toString();
            }
            updateDisplay();
            return;
        case 'percent':
            result = num / 100;
            break;
        case 'pow':
            // This will be handled as x^y by prompting for second number
            alert('Enter the exponent in the next prompt');
            const exponent = parseFloat(prompt('Enter exponent:'));
            if (!isNaN(exponent)) {
                result = Math.pow(num, exponent);
            } else {
                return;
            }
            break;
    }

    if (result !== undefined) {
        currentInput = formatResult(result);
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function calculate() {
    if (previousInput === '' || operator === null || currentInput === '') {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    const operation = `${previousInput} ${operator} ${currentInput}`;
    addToHistory(operation, result);

    currentInput = formatResult(result);
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function handleKeyboard(e) {
    if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
    } else if (e.key === '.') {
        handleNumberInput('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key === '/' ? '/' : e.key === '*' ? '*' : e.key === '-' ? '-' : '+');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        handleFunction('delete');
    } else if (e.key === 'Escape') {
        handleFunction('clear');
    }
}

function switchMode(mode) {
    if (mode === 'basic') {
        basicCalc.classList.add('active');
        scientificCalc.classList.remove('active');
        basicMode.classList.add('active');
        scientificMode.classList.remove('active');
    } else {
        basicCalc.classList.remove('active');
        scientificCalc.classList.add('active');
        basicMode.classList.remove('active');
        scientificMode.classList.add('active');
    }
}

function updateDisplay() {
    display.value = currentInput || '0';
}

function updateMemoryDisplay() {
    const memoryDisplays = document.querySelectorAll('.memory-display');
    memoryDisplays.forEach(md => {
        md.textContent = memory !== 0 ? `M: ${formatResult(memory)}` : '';
    });
}

function addToHistory(operation, result) {
    history.unshift({
        operation: operation,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 50 items
    if (history.length > 50) {
        history.pop();
    }

    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No history yet</div>';
        return;
    }

    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>${item.operation}</div>
            <div class="result">= ${item.result}</div>
            <small>${item.timestamp}</small>
        `;
        
        historyItem.addEventListener('click', () => {
            currentInput = item.result.toString();
            shouldResetDisplay = true;
            updateDisplay();
            historyPanel.classList.add('hidden');
        });

        historyList.appendChild(historyItem);
    });
}

// Helper Functions
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function formatResult(num) {
    // Handle very small and very large numbers
    if (Math.abs(num) < 1e-10 && num !== 0) {
        return num.toExponential(10);
    }
    
    // Limit decimal places
    const rounded = Math.round(num * 1e10) / 1e10;
    
    // Use exponential notation for very large numbers
    if (Math.abs(rounded) > 1e10) {
        return rounded.toExponential(6);
    }
    
    return rounded.toString();
}
