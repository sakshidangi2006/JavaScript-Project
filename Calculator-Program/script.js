// ===== Global Variables =====
let display = document.getElementById('display');
let history = document.getElementById('history');
let memoryIndicator = document.getElementById('memory-indicator');
let modeBtn = document.getElementById('mode-btn');

let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;
let angleMode = 'DEG'; // DEG or RAD
let shouldResetDisplay = false;

// ===== Initialize Calculator =====
window.onload = function() {
    updateDisplay();
    document.addEventListener('keydown', handleKeyboard);
};

// ===== Display Functions =====
function updateDisplay() {
    display.textContent = currentInput;
    history.textContent = previousInput || '0';
    updateMemoryDisplay();
}

function updateMemoryDisplay() {
    if (memory !== 0) {
        memoryIndicator.textContent = `M: ${memory}`;
    } else {
        memoryIndicator.textContent = '';
    }
}

// ===== Number Input =====
function insertNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else if (currentInput.includes('.') && num === '.') {
            return; // Prevent multiple decimal points
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

// ===== Operator Input =====
function insertOperator(op) {
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }
    
    // Special handling for power operator
    if (op === '^') {
        currentInput += '**';
    } else {
        currentInput += op;
    }
    updateDisplay();
}

// ===== Function Input =====
function insertFunction(func) {
    if (shouldResetDisplay) {
        currentInput = func + '(';
        shouldResetDisplay = false;
    } else {
        currentInput += func + '(';
    }
    updateDisplay();
}

// ===== Value Input (Constants) =====
function insertValue(value) {
    if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

// ===== Clear Functions =====
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// ===== Calculation Functions =====
function calculate() {
    try {
        previousInput = currentInput;
        
        // Convert angle mode for trigonometric functions
        let expression = currentInput;
        
        if (angleMode === 'DEG') {
            // Convert degrees to radians for trig functions
            expression = expression.replace(/Math\.(sin|cos|tan)\(/g, function(match, func) {
                return `Math.${func}((Math.PI/180)*`;
            });
            
            // Convert radians to degrees for inverse trig
            expression = expression.replace(/Math\.(asin|acos|atan)\(/g, function(match, func) {
                return `(180/Math.PI)*Math.${func}(`;
            });
        }
        
        // Handle percentage
        expression = expression.replace(/(\d+)%/g, '($1/100)');
        
        // Evaluate the expression
        display.classList.add('calculating');
        
        let result = eval(expression);
        
        // Round to avoid floating point errors
        result = Math.round(result * 1000000000000) / 1000000000000;
        
        currentInput = result.toString();
        shouldResetDisplay = true;
        
        setTimeout(() => {
            display.classList.remove('calculating');
            updateDisplay();
        }, 200);
        
    } catch (error) {
        display.classList.add('error');
        currentInput = 'Error';
        updateDisplay();
        
        setTimeout(() => {
            display.classList.remove('error');
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}

// ===== Special Functions =====
function toggleSign() {
    if (currentInput !== '0') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

function square() {
    try {
        let value = eval(currentInput);
        currentInput = Math.pow(value, 2).toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        showError();
    }
}

function reciprocal() {
    try {
        let value = parseFloat(currentInput);
        if (value !== 0) {
            currentInput = (1 / value).toString();
            shouldResetDisplay = true;
            updateDisplay();
        } else {
            throw new Error('Division by zero');
        }
    } catch (error) {
        showError();
    }
}

function factorial() {
    try {
        let num = parseInt(currentInput);
        if (num < 0) {
            throw new Error('Negative factorial');
        }
        if (num > 170) {
            throw new Error('Number too large');
        }
        
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        showError();
    }
}

// ===== Memory Functions =====
function memoryAdd() {
    try {
        let value = eval(currentInput);
        memory += value;
        updateMemoryDisplay();
        shouldResetDisplay = true;
    } catch (error) {
        showError();
    }
}

function memorySubtract() {
    try {
        let value = eval(currentInput);
        memory -= value;
        updateMemoryDisplay();
        shouldResetDisplay = true;
    } catch (error) {
        showError();
    }
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
    shouldResetDisplay = true;
}

function memoryClear() {
    memory = 0;
    updateMemoryDisplay();
}

// ===== Angle Mode Toggle =====
modeBtn.addEventListener('click', function() {
    if (angleMode === 'DEG') {
        angleMode = 'RAD';
        modeBtn.textContent = 'RAD';
    } else {
        angleMode = 'DEG';
        modeBtn.textContent = 'DEG';
    }
});

// ===== Keyboard Support =====
function handleKeyboard(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        insertNumber(key);
    }
    
    // Decimal point
    if (key === '.') {
        insertNumber('.');
    }
    
    // Operators
    if (key === '+') insertOperator('+');
    if (key === '-') insertOperator('-');
    if (key === '*') insertOperator('*');
    if (key === '/') insertOperator('/');
    if (key === '%') insertOperator('%');
    if (key === '(') insertOperator('(');
    if (key === ')') insertOperator(')');
    
    // Enter = Calculate
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    
    // Escape = Clear All
    if (key === 'Escape') {
        clearAll();
    }
    
    // Backspace
    if (key === 'Backspace') {
        event.preventDefault();
        backspace();
    }
    
    // Delete = Clear Entry
    if (key === 'Delete') {
        clearEntry();
    }
}

// ===== Error Display =====
function showError() {
    display.classList.add('error');
    currentInput = 'Error';
    updateDisplay();
    
    setTimeout(() => {
        display.classList.remove('error');
        currentInput = '0';
        updateDisplay();
    }, 1500);
}

// ===== Helper Functions =====
function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

// ===== Copy to Clipboard (Bonus Feature) =====
display.addEventListener('click', function() {
    if (currentInput !== '0' && currentInput !== 'Error') {
        navigator.clipboard.writeText(currentInput).then(() => {
            // Visual feedback
            const originalText = display.textContent;
            display.textContent = 'Copied!';
            setTimeout(() => {
                display.textContent = originalText;
            }, 1000);
        });
    }
});

// ===== Console Log for Debugging =====
console.log('%c Scientific Calculator Loaded! ', 'background: #667eea; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('%c Made with ❤️ by Sakshi Dangi', 'color: #764ba2; font-size: 14px;');
console.log('%c Keyboard shortcuts available!', 'color: #059669; font-size: 12px;');