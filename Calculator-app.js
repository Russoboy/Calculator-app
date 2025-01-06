// Calculator logic
let displayValue = '';

function appendToDisplay(value) {
    displayValue += value;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = '';
}

function backspace() {
    displayValue = displayValue.slice(0, -1);
    document.getElementById('display').value = displayValue;
}
function equalsTo() {
    try {
        const result = Function(`"use strict"; return (${displayValue})`)();
        displayValue = result.toString();
        document.getElementById('display').value = displayValue;
        // displayValue = eval(displayValue);
        // document.getElementById('display').value = displayValue;
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}

