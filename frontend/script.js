const BASE_URL = "https://kanji-quiz-backend.onrender.com/kanji";
const quiz = document.getElementById("quiz");
const input_form = document.getElementById("input-form")
const answer_reveal = document.getElementById("answer-reveal");
const score_counter = document.getElementById("score");

const select_start = document.querySelector("select[name='start']");
const select_end = document.querySelector("select[name='end']");


//btn
const skip_btn = document.getElementById("skip-btn");
const confirm_btn = document.getElementById("confirm-btn");
const finalize_btn = document.getElementById("finalize-btn");


var current_quiz;
var player = {
    scores:0,
    has_answered : false,
    total:0,
    start : 5,
    end:5
}

const reset = () =>{
    answer_reveal.classList.add('d-none');
    skip_btn.style.opacity = "1";
    skip_btn.removeAttribute("disabled")
    input_form.querySelector("input").value = "";
    confirm_btn.style.opacity = "0.5"

}
const getRandomWord = async() =>{
    const response = await fetch(`${BASE_URL}/random/?start=${player.start}&end=${player.end}`);
    const result = await response.json();
    current_quiz = result;
    player.has_answered = false
    const kanji = current_quiz.kanji;
    quiz.textContent = kanji;
    reset();
}

document.addEventListener("DOMContentLoaded",()=>{
    getRandomWord()
})

input_form.addEventListener("submit",(event)=>{
    event.preventDefault();

    if(player.has_answered == true){
        getRandomWord();
        return;
    }

    const answer = input_form.querySelector('input[type="text"]');
    player.total += 1;//doesn't matter if the answer is right or wrong
    if(answer.value == ""){
        answer_reveal.textContent = "Try Something."
        answer_reveal.classList.remove('d-none');
        return;
    }
    if(current_quiz.kunyomi.includes(answer.value.trim()) || current_quiz.meaning.includes(answer.value.trim())){
        //
        player.scores += 1;

    }
    
    
    player.has_answered = true;
    answer_reveal.textContent = `${current_quiz.kunyomi} (${current_quiz.meaning})`
    answer_reveal.classList.remove('d-none');
    skip_btn.setAttribute("disabled","true")
    skip_btn.style.opacity = "0.5" ;
    confirm_btn.style.opacity = 1;//no matter what happens the green button need to be relit
    score_counter.querySelector("b").textContent = player.scores;
})

skip_btn.addEventListener("click",async()=>{
    getRandomWord()
})
confirm_btn.addEventListener("click",()=>{
    getRandomWord()
})
finalize_btn.addEventListener('click',()=>{

})

select_start.addEventListener('change',()=>{
    player.start = select_start.value;
    if(player.end == 0 || player.start < player.end){
        select_end.value = select_start.value;

    }
})
select_end.addEventListener('change',(event)=>{
    if(select_end.value > player.start){
        select_end.value = player.start;
        return;
    }else if(select_end.value < player.start){
        player.end = select_end.value;

    }
})
