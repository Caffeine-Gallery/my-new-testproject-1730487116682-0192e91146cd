import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let clearBtn = document.getElementById('clear');
let equalsBtn = document.getElementById('equals');
let loading = document.getElementById('loading');

let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

buttons.forEach(button => {
    if (button.classList.contains('num') || button.classList.contains('op')) {
        button.addEventListener('click', () => {
            if (button.classList.contains('num')) {
                if (waitingForSecondOperand) {
                    display.value = button.textContent;
                    waitingForSecondOperand = false;
                } else {
                    display.value += button.textContent;
                }
            } else if (button.classList.contains('op')) {
                operator = button.textContent;
                currentValue = display.value;
                waitingForSecondOperand = true;
            }
        });
    }
});

clearBtn.addEventListener('click', () => {
    display.value = '';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
});

equalsBtn.addEventListener('click', async () => {
    if (currentValue && operator && !waitingForSecondOperand) {
        let result;
        let x = parseFloat(currentValue);
        let y = parseFloat(display.value);

        loading.classList.remove('hidden');

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    let divResult = await backend.divide(x, y);
                    if ('ok' in divResult) {
                        result = divResult.ok;
                    } else {
                        throw new Error(divResult.err);
                    }
                    break;
            }
            display.value = result.toString();
        } catch (error) {
            display.value = 'Error: ' + error.message;
        } finally {
            loading.classList.add('hidden');
        }

        currentValue = '';
        operator = '';
        waitingForSecondOperand = true;
    }
});
