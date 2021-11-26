var modalForm = document.querySelector('.background__form');
var modalForm2 = document.querySelector('.make-an-appointment__form');
var btnCallBack = document.querySelector('.callback');
var btnCallBack2 = document.querySelector('.callback2');
var close = document.querySelector('#close__form')



function openForm(){
    close.style.display = 'block';
    modalForm.classList.add('show__form');
    modalForm2.classList.add('show__form2');
}

function closeForm(){
    close.style.display = 'none';
    modalForm.classList.remove('show__form');
    modalForm2.classList.remove('show__form2');
}

function openForm2(){
    close.style.display = 'block';
    modalForm2.classList.add('show__form2');
}
function closeForm2(){
    close.style.display = 'none'
    modalForm2.classList.remove('show__form2');
}
    


btnCallBack.onclick =openForm; 
btnCallBack2.onclick =openForm;
close.onclick = closeForm;


