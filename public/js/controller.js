var autoObj;
var testObj;
window.addEventListener("load",init);


function init(){
    isUserExist();
    bindEvents();
    updateCount();
}
function bindEvents(){
    var slider = document.getElementById("score");
    var output = document.getElementById("scoreValue");
    output.innerHTML = slider.value;

    slider.oninput = function() {
      output.innerHTML = this.value;
    }
    document.querySelector("#name").focus();
    document.querySelector("#add").addEventListener("click",addQuestion);
    document.querySelector("#remove").addEventListener("click",removeQuestion);
    document.querySelector("#save").addEventListener("click",localSave);
    document.querySelector("#server").addEventListener("click",saveToServer);
    document.querySelector("#logout").addEventListener("click",logout);
    document.querySelector("#load").addEventListener("click",localLoad);
    document.querySelector("#createTest").addEventListener('click',createTest);
    document.querySelector("#next").addEventListener('click',()=>{createTest(true)});
    document.querySelector("#search").addEventListener("click",search);
    document.querySelector("#newTest").addEventListener("click",newTest);
    document.querySelector("#localClear").addEventListener("click",()=>{
        if(confirm('It will clear your local records. Do you want to continue.')){
            localStorage.clear();
            notification('Local storage cleared')
        }
    });
    document.querySelector("#idSort").addEventListener("click",function(){
        document.querySelector("#nameSort").className='';
        document.querySelector("#scoreSort").className='';
        this.className = 'current';
        clearTable();
        questionOperations.sort('id').forEach(q=>printQuestion(q));
    });
    document.querySelector("#nameSort").addEventListener("click",function(){
        document.querySelector("#idSort").className='';
        document.querySelector("#scoreSort").className='';
        this.className = 'current';
        clearTable();
        questionOperations.sort('name').forEach(q=>printQuestion(q));
    });
    document.querySelector("#scoreSort").addEventListener("click",function(){
        document.querySelector("#nameSort").className='';
        document.querySelector("#idSort").className='';
        this.className = 'current';
        clearTable();
        var arr=questionOperations.sort('score').forEach(q=>printQuestion(q));
    });
    document.querySelector("#testidSort").addEventListener("click",function(){
        document.querySelector("#testnameSort").className='';
        document.querySelector("#testscoreSort").className='';
        this.className = 'current';
        document.querySelector("#testTable table tbody").innerHTML="";
        questionOperations.testSort('testId').forEach(q=>printTestTable(q));
    });
    document.querySelector("#testnameSort").addEventListener("click",function(){
        document.querySelector("#testidSort").className='';
        document.querySelector("#testscoreSort").className='';
        this.className = 'current';
        document.querySelector("#testTable table tbody").innerHTML="";
        questionOperations.testSort('testName').forEach(q=>printTestTable(q));
    });
    document.querySelector("#testscoreSort").addEventListener("click",function(){
        document.querySelector("#testnameSort").className='';
        document.querySelector("#testidSort").className='';
        this.className = 'current';
        document.querySelector("#testTable table tbody").innerHTML="";
        var arr=questionOperations.testSort('score').forEach(q=>printTestTable(q));
    });
    document.querySelector("#clear").addEventListener("click",function(){
        if(confirm('It will erase your all data from local and server also. Do you want to continue.')){
            clearFields();
            clearTable();
            firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/questions").set("");
            firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/idCounter").set("0");
            firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/tests").set("");
            firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/testCounter").set("0");
            localStorage.clear();
            questionOperations.questions = [];
            questionOperations.tests = [];
            sessionStorage.isDataLoaded = 'true';
            isReloading();
            notification('Reset successfull.');
        }
        else return;
    });
}
function logout(){
    sessionStorage.clear();
    location.href = 'teacherlogin.html';
}
function isUserExist(){
    let user = firebase.database().ref('/users/teachers/'+sessionStorage.uid);
    user.on('value',(snapshot)=>{
        var userObject = snapshot.val();
        if(userObject){
            for(let key in userObject){
                if(sessionStorage[key]||sessionStorage[key]==''){
                    continue;
                }                
                else{
                    sessionStorage.clear();
                    location.href='teacherlogin.html';
                }
            }
            document.querySelector("#user").innerHTML = '<i class="fas fa-user-tie"></i>'+sessionStorage.name;
            isReloading();
        }
        else{
            sessionStorage.clear();
            location.href='teacherlogin.html';
        }
    })
}
function isReloading(){
    if(sessionStorage.isDataLoaded == 'false'){
        loadData(false);
    }
    else{
        let userRef = firebase.database().ref("/users/teachers/"+sessionStorage.uid);
        userRef.on('value',(snapshot)=>{
            var userObject = snapshot.val();
            if(userObject){
                for(let key in userObject){
                    sessionStorage[key] = userObject[key];
                }
                loadData(false);
            }
        })
    }
}
function loadData(status){
    let localCounter;
    let localTests;
    if(localStorage.questions){
        localCounter = JSON.parse(localStorage.questions);
        if(localCounter.length == 0){
            autoObj = numAutoGenerator(sessionStorage.idCounter);
        }
        else{
            if(sessionStorage.idCounter<localCounter[localCounter.length-1].id){
                autoObj = numAutoGenerator(localCounter[localCounter.length-1].id);
            }
            else autoObj = numAutoGenerator(sessionStorage.idCounter);
        }
    }
    if(localStorage.tests){
        localTests = JSON.parse(localStorage.tests);
        if(localTests.length == 0){
            testObj = numAutoGenerator(sessionStorage.testCounter);
        }
        else{
            if(sessionStorage.testCounter<localTests[localTests.length-1].testId){
                testObj = numAutoGenerator(localTests[localTests.length-1].testId);
            }
            else testObj = numAutoGenerator(sessionStorage.testCounter);
        }
    }
    else{
        autoObj = numAutoGenerator(sessionStorage.idCounter);
        testObj = numAutoGenerator(sessionStorage.testCounter);
    }
    
    idAutoGenerator();
    testIdAutoGenerator();
    if(sessionStorage.questions!=""){
        questionOperations.questions = [...JSON.parse(sessionStorage.questions)];
        document.querySelector('#dataBody').innerHTML = "";
        questionOperations.questions.forEach(q=>{printQuestion(q)});
        //console.log(JSON.parse(sessionStorage.questions));
        updateCount();
        searchEvent();
    }
    else if(sessionStorage.tests!=""){
        questionOperations.tests = [...JSON.parse(sessionStorage.tests)];
        document.querySelector('#dataBody').innerHTML = "";
        questionOperations.tests.forEach(q=>{printTestTable(q)});
        searchEvent();
    }
    else{
        document.querySelector('#dataBody').innerHTML = "";
    }
    sessionStorage.isDataLoaded = status;
}
/* function isLogin(){
    
    if(sessionStorage.uid&&sessionStorage.role =='t'){
        document.querySelector("#user").innerHTML += sessionStorage.name;        
    }
    else{
        sessionStorage.clear();
        location.href='index.html';        
    }
} */

function idAutoGenerator(){
    document.querySelector("#id").innerText = autoObj.next().value;
}
function testIdAutoGenerator(){
    document.querySelector("#testId").innerText = testObj.next().value;
}
function openTestModal(){
    document.querySelector("#testCross").style.display = "block";
    document.querySelector("#testModal").style.display = "block";
    document.querySelector("#blockage").style.display = "block";
}
function newTest(){
    document.querySelector('#next').style.display = 'none'
    document.querySelector('#updateTest').style.display = 'none';
    document.querySelector('#createTest').style.display = 'block';
    document.querySelector('#addInTest').style.display = 'block';
    openTestModal();
    document.querySelector("#testName").value = '';
    document.querySelector("#testDescription").value = '';
    document.querySelector("#testTime").value = '';
    document.querySelector("#testName").focus();
    closeBtn("testCross","testModal");
}
function isBothTablesEmpty(){
    if(questionOperations.questions.length <=0&&questionOperations.tests.length <=0){
        return true;
    }
    return false;
}
function isTableEmpty(){
    if(questionOperations.questions.length <=0){
        return true;
    }
    return false;
}
function addTest(flag){
    var obj = new Test();
    for(let key in obj){
        if(key =="marked"||key =="score"){
            continue;
        }
        if(key =="user"){
            obj[key] = sessionStorage.uid;
            continue;
        }
        if(key=="testId"){
            obj[key]=document.querySelector("#"+key).innerText;
            continue;
        }
        if(key == 'questions'){
            document.querySelectorAll(".testSelection").forEach(tr=>{
                obj[key].push(tr.querySelector("td").innerText);
            });
            obj.score=calculateScore(obj[key]);
            continue;
        }
        
        obj[key] = document.querySelector("#"+ key).value;
    }
    if(flag=='false'){
        questionOperations.addTest(obj);
        printTestTable(obj);
    }
    else{
        return obj;
    }
}
function createTest(flag){
    
    if(isTableEmpty()){
        notification('please add some questions first.');
        return;
    }
    if(document.querySelector("#testName").value == "" || document.querySelector("#testDescription").value == "" ||document.querySelector("#testTime").value == ""){
        notification('Please fill all details.');
        return;
    }
    if(document.querySelector("#testTime").value > 180){
        notification('Test time is not valid.');
        return;
    }
    //document.querySelector("#testCross").style.display = "none";
    //var obj =addTest();
    document.querySelector("#form .form-group").style.display = 'none';
    document.querySelector("#selectQuestion").style.display = 'block';
    if(flag!==true){
        questionOperations.questions.forEach(q=>printTestModal(q));
    }

    document.querySelectorAll("#selectQuestion table tbody tr").forEach(tr=>{
        tr.addEventListener('click',function(){
            this.classList.toggle("testSelection");
        });
    });
    document.querySelector("#testCross").style.display = "block";
    document.querySelector("#addInTest").addEventListener('click',addInTest);
    
}

function addInTest(){
    addTest('false');
    closeTestModal();
    testIdAutoGenerator();
    updateCount();
}
function closeTestModal(){
    document.querySelector("#testModal").style.display = "none";
    document.querySelector("#blockage").style.display = "none";
    document.querySelector("#form .form-group").style.display = 'block';
    document.querySelector("#selectQuestion").style.display = 'none';
    document.querySelector("#testBody").innerHTML="";
}
function printTestModal(questionObject,className){
    var tbody = document.querySelector("#testBody");
    var tr = tbody.insertRow();
    if(className){
        tr.className = className;
    }
    tr.setAttribute('id','testRows');
    var index=0;
    tr.insertCell(index).innerText = questionObject.id;
    index++;
    tr.insertCell(index).innerText = questionObject.name;
    index++;
    tr.insertCell(index).innerText = questionObject.score;
    index++;
}
function printTestTable(questionObject){
    var tbody = document.querySelector("#testTable tbody");
    var tr = tbody.insertRow();
    var index=0;
    for(let key in questionObject){
        if(key === "marked"||key === "user"){
            continue;
        }
        
        if(key === "testId"){
            tr.insertCell(index).innerText = questionObject[key];
            tr.setAttribute("scope","row");
            index++;
            continue;
        }
        if(key=='questions'){
            tr.insertCell(index).innerText = questionObject[key].length;
            index++;
            continue;
        }
        if(key=='score'){
            tr.insertCell(index).innerText =calculateScore(questionObject.questions);
            index++;
            continue;
        }
        tr.insertCell(index).innerText = questionObject[key];
        index++;
    }
    var td = tr.insertCell(index);
    td.appendChild(createIcon('fas fa-trash-alt',testTrash,questionObject.testId));
    td.appendChild(createIcon('fas fa-edit',testEdit,questionObject.testId));
}
function testEdit(){
    var idBackup = document.querySelector('#testId').innerText;
    openTestModal();
    document.querySelector('#next').style.display = 'block'
    document.querySelector('#updateTest').style.display = 'block';
    document.querySelector('#createTest').style.display = 'none';
    document.querySelector('#addInTest').style.display = 'none';
    document.querySelector("#testCross").addEventListener("click",function(){
        document.querySelector("#testModal").style.display = "none";
        document.querySelector("#blockage").style.display = "none";
        closeTestModal();
        document.querySelector('#testId').innerText = idBackup;
    });
    
    var id = this.getAttribute('qid');
    var testObject = questionOperations.tests.find(test=>test.testId==id);
    for(let key in testObject){
        if(key=='marked'||key=='score'||key=='user'){
            continue;
        }
        if(key=='testId'){
            document.querySelector('#testId').innerText = testObject[key];
            continue;
        }
        if(key=='questions'){
            questionOperations.questions.forEach(q=>{
                if(testObject[key].find(id=>id==q.id)){
                    printTestModal(q,'testSelection');
                }
                else printTestModal(q);
            });
            continue;
        }
        document.querySelector('#'+key).value = testObject[key];
    }
    updateTest(id,idBackup);
}
function updateTest(id,backup){
    document.querySelector("#updateTest").onclick = ()=>{
        var index = questionOperations.tests.findIndex(test=>test.testId==id);
        var testObject = addTest('true');
        console.log(testObject);
        questionOperations.tests[index] = testObject;
        document.querySelector('#testTable tbody').innerHTML='';
        document.querySelector('#testId').innerText = backup;
        questionOperations.tests.forEach(test=>printTestTable(test));
        closeTestModal();
        return;
    };
}
function calculateScore(obj){
    let sum =0;
    obj.forEach(id=>{
        sum +=parseInt(questionOperations.questions.find(q=>q.id==id).score);
    });
    return sum;
}
function addQuestion(){
    var questionObject = new Question();
    for(let key in questionObject){
        if(key === "marked"){
            continue;
        }
        if(key === "id"){
            questionObject[key] = document.querySelector("#"+key).innerText;
            continue;
        }
        if(key =="user"){
            questionObject[key] = sessionStorage.uid;
            continue;
        }
        if(key!='score'&&key!="ans"){
            if(document.querySelector("#"+key).value == ""){
                notification("Please fill all data first.");
                return;
            }
        }
        questionObject[key] = document.querySelector("#"+key).value;
    }
    questionOperations.add(questionObject);
    idAutoGenerator();
    printQuestion(questionObject);
    updateCount();
    clearFields();
    searchEvent();
}
function printQuestion(questionObject){
    var tbody = document.querySelector("#dataBody");
    var tr = tbody.insertRow();
    var index=0;
    for(let key in questionObject){
        if(key === "marked"||key=='user'){
            continue;
        }
        if(key === "id"){
            tr.insertCell(index).innerText = questionObject[key];
            tr.setAttribute("scope","row");
            index++;
            continue;
        }
        tr.insertCell(index).innerText = questionObject[key];
        index++;
    }
    var td = tr.insertCell(index);
    td.appendChild(createIcon('fas fa-trash-alt',trash,questionObject.id));
    td.appendChild(createIcon('fas fa-edit',edit,questionObject.id));
}
function createIcon(className,fn,id){
    var icon = document.createElement("i");
    icon.className = className;
    icon.setAttribute("qid",id);
    icon.addEventListener("click",fn);
    return icon;
}
function updateCount(){
    console.log('update count called...')
    document.querySelector("#total").innerText = questionOperations.questions.length;
    document.querySelector("#mark").innerText = questionOperations.countMark('questions');
    document.querySelector("#unmark").innerText = questionOperations.countUnMark('questions');
    document.querySelector("#testtotal").innerText = questionOperations.tests.length;
    document.querySelector("#testmark").innerText = questionOperations.countMark('tests');
    document.querySelector("#testunmark").innerText = questionOperations.countUnMark('tests');
}
function validateDelete(){
    var counter=0;
    questionOperations.questions.forEach(question=>{
        if(question.marked){
            counter++;
        }
    });
    questionOperations.tests.forEach(test=>{
        if(test.marked){
            counter++;
        }
    });
    if(counter>0){
        document.querySelector("#remove").removeAttribute("disabled");
    }
    else{
        document.querySelector("#remove").setAttribute("disabled",true);
    }
}
function testTrash(){
    var id = this.getAttribute("qid");
    questionOperations.testMark(id);
    var tr = this.parentNode.parentNode;
    tr.classList.toggle("alert-danger");
    updateCount();
    validateDelete();
}
function trash(){
    var id = this.getAttribute("qid");
    questionOperations.mark(id);
    var tr = this.parentNode.parentNode;
    tr.classList.toggle("alert-danger");
    updateCount();
    validateDelete();
}
function updateQuestion(){
    var questionObject = new Question();
    for(let key in questionObject){
        if(key === "marked"||key=='user'){
            continue;
        }
        if(key === "id"){
            questionObject[key] = document.querySelector("#e"+key).innerText;
            continue;
        }
        if(key!='score'&&key!="ans"){
            if(document.querySelector("#e"+key).value == ""){
                notification("Please fill all data first.");
                return;
            }
        }
        questionObject[key] = document.querySelector("#e"+key).value;
    }
    return questionObject;
}
function closeBtn(cross,modal){
    document.querySelector("#"+cross).addEventListener("click",function(){
        document.querySelector("#"+modal).style.display = "none";
        document.querySelector("#blockage").style.display = "none";
        if(modal=='testModal'){
            closeTestModal();
        }
    });
}
function editPopup(){
    document.querySelector("#blockage").style.display = "block";
    document.querySelector("#editPopup").style.display = "block";
    document.querySelector("#ename").focus();
    closeBtn("cross","editPopup");
}

function edit(){
    var id = this.getAttribute("qid");
    var questionObject = questionOperations.edit(id);
    for(let key in questionObject){
        if(key === "marked"||key=='user'){
            continue;
        }
        if(key === "id"){
            document.querySelector("#e"+key).innerText = questionObject[key];
            continue;
        }
        document.querySelector("#e"+key).value = questionObject[key];
    }
    editPopup();
    update();
}
function clearTable(){
    document.querySelector("#dataBody").innerHTML="";
}
function clearFields(){
    document.querySelectorAll(".clear").forEach(field=>field.value="");
    document.querySelector("#ans").selectedIndex = "0";
    document.querySelector("#name").focus();
}
function removeQuestion(){
    questionOperations.delete();
    clearTable();
    document.querySelector('#testTable table tbody').innerHTML = "";
    questionOperations.questions.forEach(question=>printQuestion(question));
    questionOperations.tests.forEach(test=>printTestTable(test));
    updateCount();
    validateDelete();
}
function localSave(){
    if(isBothTablesEmpty()){
        notification('No data to save.');
        return;
    }
    if(localStorage){
        var json = JSON.stringify(questionOperations.questions);
        var testJson = JSON.stringify(questionOperations.tests);
        localStorage.setItem("questions",json);
        localStorage.setItem("tests",testJson);
        notification("Data saved successfully.");
    }
    else{
        notification("Your browser not support this feature. Kindly update your browser.")
    }
}
function localLoad(){
    if(localStorage.questions){
        var testsList = JSON.parse(localStorage.getItem("tests"));
        var questionsList = JSON.parse(localStorage.getItem("questions"));
        checkDuplicacy(questionsList);
        checkTestDuplicacy(testsList);
        console.log(questionsList);
        questionOperations.tests = [...questionOperations.tests,...testsList];
        questionOperations.questions = [...questionOperations.questions,...questionsList];
        clearTable();
        document.querySelector('#testTable table tbody').innerHTML ='';
        questionOperations.tests.forEach(test=>printTestTable(test));
        questionOperations.questions.forEach(question=>printQuestion(question));

        /* if(document.querySelector("#id").innerText<questionOperations.questions[questionOperations.questions.length-1].id){
            document.querySelector("#id").innerText = parseInt(questionOperations.questions[questionOperations.questions.length-1].id) +1;
        }

        if(document.querySelector("#testId").innerText<questionOperations.tests[questionOperations.tests.length-1].testId){
            document.querySelector("#id").innerText = parseInt(questionOperations.tests[questionOperations.tests.length-1].testId) +1;
        } */
        notification("Load Completed.");
        updateCount();
        searchEvent();
    }
    else{
        notification("Data not found to load..");
    }
}
function saveToServer(){
    if(isBothTablesEmpty()){
        notification('No data to save.');
        return;
    }
    let idCounter =parseInt(document.querySelector("#id").innerText)-1;
    let testCounter =parseInt(document.querySelector("#testId").innerText)-1;

    let promiseQuestion = firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/questions").set(JSON.stringify(questionOperations.questions));
    promiseQuestion.then(data=>{
        //clearTable();
        //questionOperations.questions.forEach(q=>printQuestion(q));
        
        notification("Data Saved");
        sessionStorage.isDataLoaded = true;
        isReloading();
        //localStorage.clear();
    });
    firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/tests").set(JSON.stringify(questionOperations.tests));
    firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/idCounter").set(idCounter);
    firebase.database().ref("/users/teachers/"+sessionStorage.uid+"/testCounter").set(testCounter);
}

function checkTestDuplicacy(testsList){
    
    testsList.forEach((test) =>{
        var index =questionOperations.tests.findIndex(q=>q.testId==test.testId);
        if(index>=0){
            questionOperations.tests.splice(index,1);
        }
        
    });
}

function checkDuplicacy(questionsList){
    
    questionsList.forEach((question) =>{
        var index =questionOperations.questions.findIndex(q=>q.id==question.id);
        if(index>=0){
            questionOperations.questions.splice(index,1);
        }
        
    });
}

function update(){
    document.querySelector("#update").addEventListener("click",function(){
        var id= document.querySelector("#eid").innerText;
        var index=questionOperations.questions.findIndex(q=>q.id==id);
        if(updateQuestion()){
            questionOperations.questions[index] = updateQuestion();            
        }
        else return;
        clearTable();
        questionOperations.questions.forEach(question=>printQuestion(question));
        document.querySelector("#editPopup").style.display = "none";
        document.querySelector("#blockage").style.display = "none";
        searchEvent();
    });
}
function searchEvent(){
    var ids = questionOperations.getIds();
    var names = questionOperations.getNames();
    autocomplete(document.querySelector("#querySearch"),ids,names);    
}
function search(){
    var result =questionOperations.search(document.querySelector("#querySearch").value);
    if(!result) document.querySelector("#querySearch").value = "Invalid search.";
    clearTable();
    printQuestion(result);
    document.querySelector("#querySearch").addEventListener("keyup",function(){
        if(document.querySelector("#querySearch").value ==""){
            clearTable();
            questionOperations.questions.forEach(q=>printQuestion(q));
            updateCount();
        }
    })
}