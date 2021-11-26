
let inputContainer = document.querySelector('#input-container');
let answer = document.querySelectorAll('.quiz-form__ans');
const pages = document.querySelector('#pages'); 
let btnNext = document.querySelector('.next');
let btnSubmit = document.querySelector('.submit');
const inputsRadio = document.getElementsByClassName('q1');
let quizForm = document.querySelector('.quiz-form');
let result = document.querySelector('.result');

//СЧЕТЧИКИ
let namberQuiz = 0 ;
localStorage.setItem('questionCounter', 0);
localStorage.setItem('scoreCounter', 0);
localStorage.setItem('countClickQuizName', 0);


const NEWS_DATA = 'https://todo-app123432.herokuapp.com/api/tutorials';

const getResource = async (url) =>{
    const res = await fetch(url);

    if(!res.ok){
        throw new Error(`Error code ${res.status}`);
    }
    return res.json();
}


const getInfo = async () =>{
    const res = await getResource(`${NEWS_DATA}`);

    return res;
}


const getQuizNumber = async (e) => {
    const quizData = await getInfo();
    quizData.forEach((item, i) => {

        if(e.target.parentElement.classList.contains(`quiz${i+1}`) || e.target.parentElement.classList.contains(`item${i+1}`)){
            namberQuiz = i;
            window.scrollTo(0, 190);
        }
    });
    addFirstContent(e)
}


const openQuiz = (e) => {
    if(e.target.parentElement.classList.contains('quiz-name-item')){
        let quizNameItem = document.querySelectorAll('.quiz-name-item');

        quizNameItem.forEach((elem) =>{
            elem.classList.add('display-none');
        });

        e.target.parentElement.classList.remove('display-none');
        e.target.parentElement.classList.add('center');
    }
    getQuizNumber(e)
}


const addFirstContent = () => {
    if(!+localStorage.countClickQuizName){
        quizForm.classList.remove('display-none');
        btnSubmit.classList.add('display-none');
        addContent();
        localStorage.countClickQuizName = 1;
    }
}


const addContent = async () => {
    togglePreloader(true);
    const quizData = await getInfo();
    togglePreloader(false);

    document.querySelector('.quiz-form__question').innerHTML = '';
    inputContainer.innerHTML = `
        <p class="quiz-form__question">
            ${quizData[namberQuiz].title[+localStorage.questionCounter]}
        </p>`;
            
    for(let i = 0; i < quizData[namberQuiz].title[+localStorage.questionCounter+1].length; i++){
        inputContainer.innerHTML += `
            <label class="quiz-form__ans" for="q${i+11}">
                <input type="radio" class="q1 answer1" name="q1" id="q${i+11}" value="${i+1}">
                ${quizData[namberQuiz].title[+localStorage.questionCounter+1][i][0]}
            </label>
        `;
    }
}


const changeDisabled = async (e) => {
    await getInfo();
    
    if(e.target.classList.contains('q1')){

        for(let item of inputsRadio){
            item.setAttribute('disabled', true);
        }
        setTimeout(() => {
            btnNext.removeAttribute("disabled");
            btnSubmit.removeAttribute('disabled', true);
        }, 500);
    }
} 


const checkingСorrectOfAnswers = async (e) => {
    const quizData = await getInfo();

    if(e.target.parentElement.classList.contains('quiz-form__ans')){

        if(quizData[namberQuiz].title[+localStorage.questionCounter+1][e.target.value-1][1] === 1){
            e.target.parentElement.classList.add('correct-answers');
            localStorage.scoreCounter = +localStorage.scoreCounter + 1;
        }else{
            e.target.parentElement.classList.add('wrong-answers');

            setTimeout(() => {
                for(let i = 0; i < quizData[namberQuiz].title[+localStorage.questionCounter+1].length; i++){
                    if(quizData[namberQuiz].title[+localStorage.questionCounter+1][i][1] === 1){
                        inputsRadio[i].parentElement.classList.add('correct-answers');
                    }
                }
            }, 500);
        }
    }
}


const getInfoBtnNext = (e) => {
    if(e.target.classList.contains('next')){
        e.preventDefault();
        btnNext.setAttribute("disabled", true);
        btnSubmit.setAttribute('disabled', true);
        localStorage.questionCounter = + localStorage.questionCounter + 2;

        addContent();
        
    }
    checkingСorrectOfAnswers(e);
}


const getBtnSubmit = async() =>{
    const quizData = await getInfo();
    
    if(quizData[namberQuiz].title.length /2 === (+localStorage.questionCounter / 2) +1){
        btnNext.classList.add('display-none');
        btnSubmit.classList.remove('display-none');
    }
}

const getQuizResult = async (e) => {
    let result = document.querySelector('.result');
    
    if(e.target.classList.contains('submit')){
        e.preventDefault();
        quizForm.classList.add('display-none');
        togglePreloader(true);
        const quizData = await getInfo();
        togglePreloader(false);

        if(+localStorage.scoreCounter <= (quizData[namberQuiz].title.length / 2)*0.5){
            result.innerHTML = `
                <div class="result">
                    <h6>Ваш результат:</h6>
                    <p>На ${localStorage.scoreCounter} из ${quizData[namberQuiz].title.length / 2} вопросов дан правильный ответ, ${quizData[6].title[0].badly}</p>
                </div>`;
        }
        if(+localStorage.scoreCounter <= (quizData[namberQuiz].title.length / 2)*0.7 && +localStorage.scoreCounter > (quizData[namberQuiz].title.length / 2)*0.5 ){
            result.innerHTML = `
                <div class="result">
                    <h6>Ваш результат:</h6>
                    <p>На ${localStorage.scoreCounter} из ${quizData[namberQuiz].title.length / 2} вопросов дан правильный ответ, ${quizData[6].title[0].normally}</p>
                </div>`;
        }
        if(+localStorage.scoreCounter > (quizData[namberQuiz].title.length / 2)*0.7){
            result.innerHTML = `
                <div class="result">
                    <h6>Ваш результат:</h6>
                    <p>На ${localStorage.scoreCounter} из ${quizData[namberQuiz].title.length / 2} вопросов дан правильный ответ, ${quizData[6].title[0].perfectly}</p>
                </div>`;
        }
    }
    result.classList.remove('display-none');
}


const setNamberPages = async() =>{
    const quizData = await getInfo();

    pages.innerHTML = `
    <div class="footer__content" id="pages"> ${((+localStorage.questionCounter+2) / 2)} / ${quizData[namberQuiz].title.length / 2} </div>`;
}


// SEARCH


const openSearchPanel = (e) => {
    if(e.target.parentElement.classList.contains('search-btn')){
        let searchInput = document.querySelector('#searchInput');
        searchInput.classList.toggle('open-search');
        searchInput.focus();
    }
}

const closeSearchPanel = (e) => {
    let searchInput = document.querySelector('#searchInput');
    let searchBtn = document.querySelector('.search-btn');

    if(e.target.parentElement !== searchBtn && e.target !== searchInput){
        searchInput.classList.remove('open-search');
        searchInput.blur();
    }
}

const openSearchList = () => {
    let searchList = document.querySelector('#search-list');
    searchList.classList.remove('hide-search');
}

const closeSearchList = (e) => {
    const searchList = document.querySelector('#search-list');
    let searchInput = document.querySelector('#searchInput');

    if(!searchList.classList.contains('hide-search') && !e.target.closest('search-input')){
        searchList.classList.add('hide-search');
        searchInput.blur();
        searchInput.value = '';
    }
}

const renderSearchList = (e) => {
    let quizNameItem = document.querySelectorAll('.quiz-name-item');
    const searchContainer = document.querySelector('#search-list');
    quizNameItem = reduceSearchData(e, quizNameItem);

    if(quizNameItem.length > 0){
        searchContainer.innerHTML = ``;
        searchContainer.innerHTML = `
        <li class="head-item">
            <div class="search-title">
                <div class="search-descr">
                    <p class="public">ТЕСТЫ</p>
                </div>
            </div>
        </li>
        `;
        quizNameItem.forEach((item, i) => {
            searchContainer.innerHTML += `
            <li class="search-item">
                <div class="item item${i+1}">
                    <img src="./images/quiz/quiz${i+1}.jpg" class="item-pict">
                    <p class="item-title">${item.children[0].innerText}</p>
                </div>
                </a>
            </li>
            `;
        })
    }
}

const reduceSearchData = (e, quizNameItem) => {
    const searchValue = e.target.value.toLowerCase();
    quizNameItem = Array.prototype.slice.call(quizNameItem);

    const filteredPosts = quizNameItem.filter((item) => {
        return (
            item.children[0].innerText.toLowerCase().includes(searchValue) 
        )
    })

    return filteredPosts;
}


const openQuizSearch = async (e) => {
    if(e.target.parentElement.classList.contains('item')){
        localStorage.countClickQuizName = 0;
        localStorage.questionCounter = 0;
        localStorage.scoreCounter= 0;
        btnNext.classList.remove('display-none');
        btnNext.setAttribute("disabled", true);
        result.innerHTML = '';
        inputContainer.innerHTML ='';
        let quizNameItem = document.querySelectorAll('.quiz-name-item');

        quizNameItem.forEach((elem, i) =>{
            elem.classList.add('display-none');

            if(e.target.parentElement.classList.contains(`item${i+1}`)){
                quizNameItem[i].classList.remove('display-none');
                quizNameItem[i].classList.add('center');
            }
        });
        quizForm.classList.remove('display-none');
    }
    await addFirstContent(e);
    setNamberPages(e);
}
  

const togglePreloader = (isPreloader) => {
    const preloader = document.querySelector('.quiz-preloader');
    if(isPreloader){
        preloader.classList.add('show-preloader');
    }else{
        preloader.classList.remove('show-preloader');
    }
}


document.addEventListener('click',(e) => {
    openQuiz(e);
    changeDisabled(e);
    getInfoBtnNext(e);
    getBtnSubmit();
    getQuizResult(e);
    setNamberPages();

    openSearchPanel(e);
    closeSearchPanel(e);
    closeSearchList(e);
    openQuizSearch(e);
})

document.querySelector('#searchInput').addEventListener('input', openSearchList);

document.querySelector('#searchInput').addEventListener('input', renderSearchList);