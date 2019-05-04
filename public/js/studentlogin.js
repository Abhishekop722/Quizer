window.addEventListener("load",init);
window.addEventListener("offline",()=>{
    notification("You are not connected to the internet.");
});
function init(){
    document.querySelector("#login").addEventListener("click",login);
    document.querySelector("#register").addEventListener("click",redirect);
}
function redirect(){
    location.href='register.html';
}
function login(){
    if(document.querySelector("#uid").value==''||document.querySelector("#pwd").value==''){
        notification('Please fill all details.');
        return;
    }
    var userid = document.querySelector("#uid").value;
    var password = document.querySelector("#pwd").value;
    var userRef = firebase.database().ref("/users/students/"+userid);
    userRef.on('value',(snapshot)=>{
        var userObject = snapshot.val();
        if(userObject && userObject.password == password){
            for(let key in userObject){
                sessionStorage[key] = userObject[key];
            }
            sessionStorage.isDataLoaded = false;
            if(userObject.role == "t")location.href='question.html';
            else location.href='student.html';
        }
        else{
            notification('Invalid userid or password');
        }
    })
}
