window.addEventListener("load",init);
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
    var userRef = firebase.database().ref("/users/students/"+sessionStorage.uid);
    userRef.on('value',(snapshot)=>{
        var userObject = snapshot.val();
        console.log(userObject);
        showData(userObject);
    })
}
function showData(userObject){
    if(userObject.tests=='[]'){
        document.querySelector('#root').innerHTML = "<h1 class='zerotests'>You not attempt any test yet.</h1>";
        return;
    }
    let tests = JSON.parse(userObject.tests);
    let table = document.createElement('table');
    table.className = 'table table-bordered';
    let thead = document.createElement('thead');
    let th1 = document.createElement('th');
    th1.innerHTML = 'Test ID';
    let th2 = document.createElement('th');
    th2.innerHTML = 'Created by';
    let th3 = document.createElement('th');
    th3.innerHTML = 'Total Score';
    let th4 = document.createElement('th');
    th4.innerHTML = 'Your Score';
    thead.appendChild(th1);
    thead.appendChild(th2);
    thead.appendChild(th3);
    thead.appendChild(th4);
    let tbody = document.createElement('tbody');
    tests.forEach(test=>{
        let tid = document.createElement('td');
        tid.innerHTML = test.testid;
        let uid = document.createElement('td');
        uid.innerHTML = '@'+test.uid;
        let total = document.createElement('td');
        total.innerHTML = test.totalscore;
        let score = document.createElement('td');
        score.innerHTML = test.scores;
        let tr = document.createElement('tr');
        tr.appendChild(tid);
        tr.appendChild(uid);
        tr.appendChild(total);
        tr.appendChild(score);
        tbody.appendChild(tr);
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    let h1= document.createElement('h1');
    h1.innerHTML = "Activities";
    document.querySelector('#root').appendChild(h1);
    document.querySelector('#root').appendChild(table);
    console.log(tests);
}