'use strict';

/*Position of moving element*/
let pickedElementPosition = {
    left: null,
    top: null
};

let attachedElement = null; //Moving element

let elementPositions = []; //Array of positions all elements in a document

/*execute when submit form*/
const submitAction = (event) => {
    clear()
    event.preventDefault();
    generateElementsByChars(parseStringToChar(event.target.str.value));
}

/*Add event on a document when form submit*/
document.getElementById('actionForm').addEventListener('submit', submitAction);

/*Generate a string's of elements*/
function generateElementsByChars(chars = []) {
    const charsWrapperElement = document.getElementById('charsWrapper');
    chars.forEach((char, index) => {
        const charElement = document.createElement('div');
        charElement.id = String(index);
        charElement.innerText = char;
        charElement.style.left = `${(index + 1) * 12}px`;
        charElement.addEventListener('click', attachElementToCursor); /*Add event 'click' on a element*/
        charsWrapperElement.appendChild(charElement);
    })
    /*Filling out the array by elements positions*/
    for (let i = 0; i < charsWrapperElement.children.length; i++) {
        elementPositions[i] = {
            top: charsWrapperElement.children[i].offsetTop,
            left: charsWrapperElement.children[i].offsetLeft
        }
    }
}

/*Pick element which will be moving*/
function attachElementToCursor(clickEvent) {
    if (attachedElement) return;
    attachedElement = clickEvent.target;
    pickedElementPosition = elementPositions[attachedElement.id];
    setTimeout(() => document.addEventListener("click", unattachElementFromCursor), 0); /*Add event 'click' on a element*/
    document.addEventListener("mousemove", moveAttachElement);/*Add event 'mousemove' on a document*/
}

/*Changes styles value a picked element*/
function moveAttachElement(event) {
    attachedElement.style.left = `${event.clientX - 3}px`;
    attachedElement.style.top = `${event.clientY - 15}px`;
}

/*Unpick element, Remove previous event, change position(s) of element(s) on a page*/
function unattachElementFromCursor(event) {
    /*Unpick element*/
    setTimeout(() => attachedElement = null, 0);

    /*Remove previous event*/
    document.removeEventListener("mousemove", moveAttachElement);
    document.removeEventListener("click", unattachElementFromCursor);

    /*change position(s) of element(s) on a page*/
    checkOtherElementInNewPosition()
}

/*Checking availability another item in new position of unpicked element*/
function checkOtherElementInNewPosition() {
    elementPositions.forEach((element, index) => {
        if (index === +attachedElement.id) return false


        const topLayering = (
            (attachedElement.offsetTop >= element.top
                && attachedElement.offsetTop <= element.top + 23)
            || (attachedElement.offsetTop + 23 >= element.top
                && attachedElement.offsetTop + 23 <= element.top + 23)
        );

        const leftLayering = (
            (attachedElement.offsetLeft >= element.left
                && attachedElement.offsetLeft <= element.left + 12)
            || (attachedElement.offsetLeft + 12 >= element.left
                && attachedElement.offsetLeft + 12 <= element.left + 12)
        );
        if (leftLayering && topLayering) {
            /*make if elements layering*/
            swapElements(element, index)
        } else {
            /*make if elements isn't layering*/
            fixPositionElement()
        }
    })
}

/*Swap positions of layering elements*/
function swapElements(passiveElementPosition, passiveElementIndex) {
        const passiveElement = document.getElementById(String(passiveElementIndex));

        passiveElement.style.top = `${pickedElementPosition.top}px`
        passiveElement.style.left = `${pickedElementPosition.left}px`
        elementPositions[passiveElementIndex] = {
            top: pickedElementPosition.top,
            left: pickedElementPosition.left
        };

        attachedElement.style.top = `${passiveElementPosition.top}px`
        attachedElement.style.left = `${passiveElementPosition.left}px`
        elementPositions[attachedElement.id] = {
            top: passiveElementPosition.top,
            left: passiveElementPosition.left
        };
}

/*Fixed positions of element*/
function fixPositionElement() {
    elementPositions[attachedElement.id] = {
        top: attachedElement.offsetTop,
        left: attachedElement.offsetLeft
    };
}

/*Clear data*/
function clear() {
    pickedElementPosition.left = null;
    pickedElementPosition.top = null;
    attachedElement = null
    elementPositions = []
    document.getElementById('charsWrapper').innerHTML = ""
}

/*String to Array of Char*/
function parseStringToChar(str) {
    return str.split('');
}
