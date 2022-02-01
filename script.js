const MAX_SQUARES = 100;
const BOX_SIZE = 256;
const totalSquares = MAX_SQUARES * MAX_SQUARES;
const body = document.querySelector('body');
const buttons = document.querySelectorAll('button');
const box = document.querySelector('.box');
const slider = document.querySelector('.slider');
const number = document.querySelector('.number');

let tool = 'pencil';
let numSquares = 16;
let squareSize = 256 / numSquares;
let mouseDown = false;
let color = '#000000';

body.addEventListener('mousedown', () => { mouseDown = true; });
body.addEventListener('mouseup', () => { mouseDown = false; });

slider.addEventListener('change', () => {
    number.value = slider.value;
    configureSquares(slider.value);
})

number.addEventListener('change', () => {
    if (number.value < 16) number.value = 16;
    else if (number.value > 100) number.value = 100;

    slider.value = number.value
    configureSquares(number.value);
})

for (let i = 0; i < totalSquares; ++i) {
    let square = document.createElement('div');

    if (i < totalSquares - numSquares * numSquares)
        square.classList.add('hidden');

    const squareSize = BOX_SIZE / numSquares;
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    square.classList.add('square');
    square.setAttribute('ondragstart', 'return false;');
    square.setAttribute('ondrop', 'return false;');
    square.addEventListener('click', paintSquare);
    square.addEventListener('mousedown', paintSquare);
    square.addEventListener('mouseenter', processMouseover);
    square.addEventListener('mouseleave', removeMouseover);

    box.appendChild(square);

    function paintSquare(event) {
        switch (tool) {
            case 'pencil':
                event.target.style.backgroundColor = color;
                break;
            case 'eraser':
                const square = event.target;
                const squareSize = BOX_SIZE / numSquares;

                square.removeAttribute('style');
                square.style.width = `${squareSize}px`;
                square.style.height = `${squareSize}px`;
                break;
            default:
                throw 'unknown tool selected';
        }
    }

    function processMouseover(event) {
        if (mouseDown) paintSquare(event);
        else event.target.classList.add('mouseover');
    }

    function removeMouseover(event) {
        event.target.classList.remove('mouseover');
    }
}

buttons.forEach(addButtonListeners);

function addButtonListeners(button) {
    switch (button.className) {
        case 'color':
            const colorInput = button.querySelector('input');

            colorInput.addEventListener('change', (event) => {
                color = event.target.value;
            });

            break;
        case 'trash':
            button.addEventListener('click', clearSquares);

            break;
        case 'eraser':
            button.addEventListener('click', () => {
                tool = 'eraser';
            });

            break;
        case 'pencil':
            button.addEventListener('click', () => {
                tool = 'pencil';
            });

            break;
        default:
            throw 'unknown tool detected';
    }

    button.addEventListener('mouseenter', () => {
        button.classList.add('mouseover');
    });

    button.addEventListener('mouseleave', () => {
        button.classList.remove('mouseover');
        button.classList.remove('mousedown');
    });

    button.addEventListener('mousedown', () => {
        button.classList.add('mousedown');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('mousedown');
    });
}

function configureSquares(value) {
    numSquares = value;

    const squares = box.childNodes;
    const numHidden = totalSquares - numSquares * numSquares;

    for (let i = 1; i <= totalSquares; ++i) {
        const squareSize = BOX_SIZE / numSquares;
        const square = squares[i];

        if (i <= numHidden)
            square.classList.add('hidden');
        else
            square.classList.remove('hidden');
        
        square.removeAttribute('style');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
    }
}

function clearSquares() {
    const squares = box.childNodes;
    const numHidden = totalSquares - numSquares * numSquares;

    for (let i = totalSquares; i >= numHidden; --i) {
        const squareSize = BOX_SIZE / numSquares;
        const square = squares[i];

        square.removeAttribute('style');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
    }
}