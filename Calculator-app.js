const inputField = document.getElementById('display');
let displayValue = '';

function appendToDisplay(value) {
    // Validation rules
    const lastChar = displayValue.slice(-1); // Get the last character

    // 1. Prevent multiple operators together (e.g., "+-", "++")
    if (/[+\-*/.%]/.test(lastChar) && /[+\-*/.%]/.test(value)) {
        return; // Reject new operator if last character is also an operator
    }

    // 2. Allow only one decimal per number
    if (value === '.' && /\.\d*$/.test(displayValue)) {
        return; // Reject extra decimal if a number already has one
    }

    // 3. Prevent incomplete expressions (e.g., "+" or ".")
    if (/[+\-*/.%]/.test(value) && (displayValue === '' || lastChar === '.')) {
        return; // Reject if first input is an operator or last character is a "."
    }

    // 4. Handle opening and closing brackets (if added)
    if (value === ')') {
        // Ensure the expression is valid for a closing bracket
        const openBrackets = (displayValue.match(/\(/g) || []).length;
        const closeBrackets = (displayValue.match(/\)/g) || []).length;
        if (closeBrackets >= openBrackets) {
            return; // Reject if there are no matching opening brackets
        }
    }

    // Allow opening bracket at any time
    if (value === '(' && lastChar !== '' && !/[+\-*/.%(]/.test(lastChar)) {
        return; // Reject opening bracket unless preceded by operator or empty
    }

    // Append validated value to the display
    displayValue += value;
    inputField.value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    inputField.value = '';
}

function backspace() {
    displayValue = displayValue.slice(0, -1);
    inputField.value = displayValue;
}

function equalsTo() {
    try {
        // Prevent incomplete expressions at the last moment (e.g., "5+")
        if (/[+\-*/.%]$/.test(displayValue)) {
            inputField.value = 'Error';
            displayValue = '';
            return;
        }

        // Prevent division by zero
        if (/\/0($|\D)/.test(displayValue)) {
            inputField.value = 'Cannot be divided by zero';
            displayValue = '';
            return;
        }

        const result = Function(`"use strict"; return (${displayValue})`)();
        displayValue = result.toString();
        inputField.value = displayValue;
    } catch (error) {
        inputField.value = 'Error';
        displayValue = '';
    }
}

//🎹 Keyboard input & navigation support
document.addEventListener("keydown", (event) => {
    const focusableButtons = Array.from(document.querySelectorAll(".btn"));
    const currentIndex = focusableButtons.indexOf(document.activeElement);

    // 1. When Enter is pressed, simulate a click for the focused button
    if (event.key === "Enter") {
        event.preventDefault();
        if (document.activeElement.tagName === "BUTTON") {
            document.activeElement.click(); // Trigger click on focused button
        }
    }

    // 2. Handle navigation with arrow keys, Tab, or Shift+Tab
    switch (event.key) {
        case "ArrowDown": // Move to the next row
        case "Tab": // Supports Tab navigation
            event.preventDefault();
            if (currentIndex >= 0 && currentIndex < focusableButtons.length - 1) {
                focusableButtons[currentIndex + 1].focus();
            } else {
                focusableButtons[0].focus(); // Loop back to the first button
            }
            break;

        case "ArrowUp": // Move up
            event.preventDefault();
            if (currentIndex > 0) {
                focusableButtons[currentIndex - 1].focus();
            }
            break;

        case "ArrowLeft": // Move left
            event.preventDefault();
            if (currentIndex % 4 !== 0) {
                focusableButtons[currentIndex - 1].focus();
            }
            break;

        case "ArrowRight": // Move right
            event.preventDefault();
            if (currentIndex % 4 !== 3) {
                focusableButtons[currentIndex + 1].focus();
            }
            break;

        default:
            break;
    }

    // Additional features, e.g., clearing display with Escape or 'C' key, etc.
    if (event.key === "Escape") {
        event.preventDefault();
        clearDisplay();
    } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
    }
});





