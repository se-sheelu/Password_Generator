const inputSlider = document.querySelector("#slide");
const lengthDisplay = document.querySelector("[data-lenNum]");
const PasswordDisplay = document.querySelector("[display-password]");
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#id1");
const lowerCaseCheck = document.querySelector("#id2");
const numbersCheck = document.querySelector("#id3");
const symbolsCheck = document.querySelector("#id4");
const indicator = document.querySelector(".cir");
const generateButton = document.querySelector(".btn");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={}[]|\":;<>,.?/'

let password = "";
let passwordLen = 10;
let checkCount = 0;

handleSlider();

function handleSlider(){
    inputSlider.value = passwordLen;
    lengthDisplay.innerText = passwordLen;

    const min = inputSlider.min;
    const max = inputSlider.max;

    // inputSlider.style.backgroundSize = ((passwordLen-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,122));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbols(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let upper = false;
    let lower = false;
    let num = false;
    let sym = false;

    if(upperCaseCheck.checked) upper = true;
    if(lowerCaseCheck.checked) lower = true;
    if(numbersCheck.checked) num = true;
    if(symbolsCheck.checked) sym = true;

    if(upper && lower && (num || sym) && passwordLen >= 8){
        setIndicator("#0f0");
    }
    else if((lower || upper) && (num || sym) && passwordLen >=6){
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(PasswordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Falied";
    }
    // To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        // finding value for j
        const j = Math.floor(Math.random()*(i+1));
        // swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach( (el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBoxes.forEach( (checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    // special condition
    if(passwordLen < checkCount)
    {
        passwordLen = checkCount;
        handleSlider();
    }
}

allCheckBoxes.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLen = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if(PasswordDisplay.value)
    {
        copyContent();
    }
})

generateButton.addEventListener('click', () => {
    // no chech box are selected
    if(checkCount == 0)
    {
        return;
    }

    if(passwordLen < checkCount)
    {
        passwordLen = checkCount;
        handleSlider();
    }

    // // remove old password
    password = "";


    let funcArr = [];

    if(upperCaseCheck.checked)
    {
        funcArr.push(generateUpperCase);
    }

    if(lowerCaseCheck.checked)
    {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbols);
    }

    // compulsory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i<passwordLen-funcArr.length; i++){
        let randIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // show in UI
    PasswordDisplay.value = password;

    // calculate strength
    calcStrength();
})