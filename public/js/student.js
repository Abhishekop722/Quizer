window.addEventListener("load",init);
var testCollection=[];
var dataObject = [];
var seconds;
document.onreadystatechange = function(e)
{
    if (document.readyState === 'interactive')
    {
        isLogin();
    }
};
function isLogin(){
    if(sessionStorage.uid&&sessionStorage.role == 's'){
        document.querySelector("#user").innerHTML += sessionStorage.name;
    }
    else{
        sessionStorage.clear();
        location.href='studentlogin.html';
    }
}
function init(){
    bindEvents();
    loadData();
}
function bindEvents(){
    document.querySelector("#logout").addEventListener("click",logout);
}
function logout(){
    sessionStorage.clear();
    isLogin();
}
function loadData(){
    var userRef = firebase.database().ref("/users/teachers/");
    userRef.on('value',(snapshot)=>{
        var userObject = snapshot.val();
        for(let key in userObject){
            if(userObject[key].tests !=""){
                var obj = {uid:userObject[key].uid,questions:JSON.parse(userObject[key].questions)};
                dataObject.push(obj);
                testCollection=[...testCollection,...JSON.parse(userObject[key].tests)];;
            }
        }
        console.log(testCollection);
        showTests();
    })
}
function showTests(){
    if(document.querySelector('#backToHome')){
        var back = document.querySelector('#backToHome');
        back.parentNode.removeChild(back);
        document.querySelector('#dashboard').style.display = 'flex';
    }
    if(testCollection.length<=0){
        notification('No tests uploaded yet.');
        return;
    }
    document.querySelector('#testBody').innerHTML='';
    var h1 = document.createElement('h1') ;
    h1.innerHTML ='Total tests available - <span id="totaltest">0</span>';
    h1.className = 'animated slideInUp';
    document.querySelector('#testBody').appendChild(h1);
    testCollection.forEach(test=>{
        var div = document.createElement('div');
        div.setAttribute('id','test');
        div.setAttribute('testId',test.testId);
        div.setAttribute('uid',test.user);
        div.setAttribute('time',test.testTime);
        div.className = 'animated slideInUp';
        var heading = document.createElement('h1');
        heading.innerText = test.testName;
        var description = document.createElement('p');
        description.innerText = test.testDescription;
        var questions = document.createElement('div');
        
        questions.innerText = 'Questions - '+test.questions.length;
        var score = document.createElement('span');
        score.innerText = 'Total marks - '+ test.score;
        div.appendChild(score);
        div.appendChild(heading);
        div.appendChild(description);
        div.appendChild(questions);
        document.querySelector('#testBody').appendChild(div);
        
        div.addEventListener("click",collectQuestion);
    })
    document.querySelector('#totaltest').innerText = document.querySelectorAll('#test').length;
}
var countdownTimer;
function collectQuestion(){
    seconds = parseInt(this.getAttribute('time'))*60;
    timer();
    countdownTimer=setInterval('timer()', 1000);
    console.log(event);
    var questionObject=[];
    var questionsArr=[];
    dataObject.forEach(obj=>{
        if(obj.uid==this.getAttribute('uid')){
            var testId=this.getAttribute('testId');
            testCollection.forEach(test=>{
                if(test.user == this.getAttribute('uid')&& test.testId==testId){
                    questionsArr=[...test.questions];
                }
            });
            questionsArr.forEach(id=>{
                questionObject.push(obj.questions.find(q=>q.id==id));
            })
        }
    });
    var div = document.createElement('div');
    var back = document.createElement('button');
    //back.innerText = 'Back';
    div.setAttribute('id','backToHome');
    back.addEventListener('click',()=>{
        clearInterval(countdownTimer);
        document.querySelector('#timer').style.display = "none";
        document.querySelector('#totalScore').innerText = '0';
        document.querySelector('#questionInfo').style.display = 'none';
        showTests();
    });
    back.innerHTML = '<i class="fas fa-backward"></i>';
    div.appendChild(back);
    document.querySelector('#testBody').innerHTML='';
    var h1 = document.createElement('h1') ;
    h1.innerText ='Questions';
    document.querySelector('#testBody').appendChild(div);
    document.querySelector('#testBody').appendChild(h1);
    questionObject.forEach(question=>printQuestion(question));
    var submitButton = document.createElement('button');
    submitButton.setAttribute('id','submit');
    submitButton.setAttribute('tid',this.getAttribute('testid'));
    submitButton.setAttribute('uid',this.getAttribute('uid'));
    submitButton.className = 'btn btn-primary';
    submitButton.innerText = 'Submit';
    submitButton.addEventListener('click',submitTest);
    document.querySelector('#testBody').appendChild(submitButton);
    document.querySelector('#questionInfo').style.display = 'block';
    document.querySelector('#dashboard').style.display = 'none';
    document.querySelector('#timer').style.display = "flex";
    
}
function createLabel(value){
    var label =document.createElement('label');
    label.innerText = value;
    return label;
}
var radioCounter=0;
function createRadioBtn(value){
    var radioBtn = document.createElement('input');
    radioBtn.setAttribute('type','radio');
    radioBtn.setAttribute('name','option'+radioCounter);
    radioBtn.setAttribute('value',value);
    return radioBtn;
}
function countScore(){
    var redScore=0;
    var greenScore=0;
    var red = document.querySelectorAll('.red').forEach(question=>{redScore+=parseInt(question.getAttribute('score'))})
    var green = document.querySelectorAll('.green').forEach(question=>{greenScore+=parseInt(question.getAttribute('score'))})
    return {red:redScore,green:greenScore};
}
function printButtons(option1,option2,option3,option4){
    var opt1 = createRadioBtn('a');
    var opt2 = createRadioBtn('b');
    var opt3 = createRadioBtn('c');
    var opt4 = createRadioBtn('d');
    radioCounter++;
    var btn1 = document.createElement('div');
    btn1.className = 'button';
    btn1.appendChild(opt1);
    btn1.appendChild(createLabel(option1));
    var btn2 = document.createElement('div');
    btn2.className = 'button';
    btn2.appendChild(opt2);
    btn2.appendChild(createLabel(option2));
    var btn3 = document.createElement('div');
    btn3.className = 'button';
    btn3.appendChild(opt3);
    btn3.appendChild(createLabel(option3));
    var btn4 = document.createElement('div');
    btn4.className = 'button';
    btn4.appendChild(opt4);
    btn4.appendChild(createLabel(option4));
    var buttonsDiv = document.createElement('div');
    buttonsDiv.setAttribute('id','buttons');
    buttonsDiv.appendChild(btn1);
    buttonsDiv.appendChild(btn2);
    buttonsDiv.appendChild(btn3);
    buttonsDiv.appendChild(btn4);
    return buttonsDiv;
}
function printQuestion(questionObj){
    var div =document.createElement('div');
    div.setAttribute('id','question');
    div.setAttribute('qid',questionObj.id);
    div.setAttribute('uid',questionObj.user);
    div.setAttribute('score',questionObj.score);
    var question = document.createElement('p');
    question.innerText = questionObj.name;
    var score = document.createElement('span');
    score.innerText = questionObj.score+' marks';
    
    div.appendChild(score);
    div.appendChild(question);
    
    div.appendChild(printButtons(questionObj.opt1,questionObj.opt2,questionObj.opt3,questionObj.opt4));
    
    document.querySelector('#testBody').appendChild(div);
    document.querySelector('#total').innerText = document.querySelectorAll('#question').length;
    let totalMarks = countScore();
    document.querySelector('#totalScore').innerText= parseInt(document.querySelector('#totalScore').innerText) + parseInt(questionObj.score);
}

function timer() {
  var days        = Math.floor(seconds/24/60/60);
  var hoursLeft   = Math.floor((seconds) - (days*86400));
  var hours       = Math.floor(hoursLeft/3600);
  var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
  var minutes     = Math.floor(minutesLeft/60);
  var remainingSeconds = seconds % 60;
  function pad(n) {
    return (n < 10 ? "0" + n : n);
  }
  document.getElementById('hours').innerHTML = pad(hours);
  document.getElementById('minutes').innerHTML = pad(minutes);
  document.getElementById('seconds').innerHTML = pad(remainingSeconds);
  if(seconds == 10){
      document.querySelector('#timer').className = 'animated bounceIn'; 
  }
  if (seconds == 0) {
    clearInterval(countdownTimer);
    document.querySelector('#timer').classList.remove('bounceIn') ;
    submitTest();
    return;
  } else {
    seconds--;
  }
}

function updateCount(score){
    document.querySelector('#total').innerText = document.querySelectorAll('#question').length;
    document.querySelector('#incorrect').innerText=document.querySelectorAll('.red').length;
    document.querySelector('#correct').innerText=document.querySelectorAll('.green').length;
    document.querySelector('#scoreResult').innerText=score;
}
function getRadioVal(div){
    var val='';
    var radios = div.querySelectorAll('.button input');
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { 
            val = radios[i].value; 
            break; 
        }
    }
    return val;
}
function submitTest(){
    //console.log(getRadioVal(document.querySelector('#buttons'),'option'));
    var questions = document.querySelectorAll('#question');
    var index=0;
    questions.forEach(question=>{
        var checked=getRadioVal(question.querySelector('#buttons'));
        
        var btns = question.querySelectorAll('.button input');
        btns.forEach(btn=>btn.setAttribute('disabled',true));
        var qid = question.getAttribute('qid');
        var user = question.getAttribute('uid');
        var userObject = dataObject.find(obj=>obj.uid==user);
        var questionObj=userObject.questions.find(q=>q.id==qid);
        if(questionObj.ans==checked){
            question.className = 'green';
            index++;
        }
        else {question.className = 'red';index++;}
    });
    var scores = countScore();
    updateCount(scores.green);
    location.href = '#questionInfo';
    clearInterval(countdownTimer);
    let previousTests=[];
    if(sessionStorage.tests != "[]"){
        previousTests = [...JSON.parse(sessionStorage.tests)];
    }
    var stuTests = {testid:this.getAttribute('tid'),uid:this.getAttribute('uid'),totalscore:scores.red+scores.green,scores:scores.green};
    previousTests.push(stuTests);
    firebase.database().ref("/users/students/"+sessionStorage.uid+"/tests").set(JSON.stringify(previousTests));
    firebase.database().ref("/users/students/"+sessionStorage.uid+"/testCounter").set(parseInt(sessionStorage.testCounter) +1);
    let userRef = firebase.database().ref("/users/students/"+sessionStorage.uid+"/tests");
    userRef.on('value',(snapshot)=>{
        let newTests = snapshot.val();
        console.log(newTests);
        sessionStorage.tests = newTests;
    })
}