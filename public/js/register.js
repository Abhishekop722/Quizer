window.addEventListener("load",init);
window.addEventListener("offline",()=>{
    notification("Internet connection not available.");
});
function init(){
    var obj;
    let userRef = firebase.database().ref("/users/");
    userRef.on('value',(snapshot)=>{
        obj = snapshot.val();
        console.log(obj);
        document.querySelector("#register").addEventListener("click",()=>{register(obj)});
    })
}
function register(obj){
    var userId = document.querySelector("#uid").value;
    var password = document.querySelector("#pwd").value;
    var role = document.querySelector("#role").value;
    var name = document.querySelector("#name").value;
    //var counter=0;
    if(role==""||name==""||password==""||userId==""){
        notification("Please fill all details.");
        document.querySelector("#uid").innerText ="";
        document.querySelector("#name").innerText = "";
        document.querySelector("#pwd").innerText = "";
        return;
    }
    
    if(role=='t'){
        if(!checkUser('teachers',obj,userId)){
            return;
        }
        let userObject={"testCounter":0,"tests":"","name":name,"role":role,"questions":"","idCounter": 0,"uid":userId,"password":password};
        var promise = firebase.database().ref("/users/teachers/"+userId).set(userObject);
        promise.then(data=>{
            document.querySelector("#status").innerText = "Register Successfully ";
            document.querySelector("#uid").value ="";
            document.querySelector("#name").value = "";
            document.querySelector("#pwd").value = "";   
        }).catch(err=>{
            document.querySelector("#result").innerText = "Error During Register";
            console.log("Error is ",err);
        })
    }
    if(role=='s'){
        if(!checkUser('students',obj,userId)){
            return;
        }
        let userObject={"testCounter":0,"tests":"[]","name":name,"role":role,"uid":userId,"password":password};
        var promise = firebase.database().ref("/users/students/"+userId).set(userObject);
        promise.then(data=>{
            document.querySelector("#status").innerText = "Register Successfully ";
            document.querySelector("#uid").value ="";
            document.querySelector("#name").value = "";
            document.querySelector("#pwd").value = "";   
        }).catch(err=>{
            document.querySelector("#result").innerText = "Error During Register";
            console.log("Error is ",err);
        })
    }
}
function checkUser(role,obj,userId){
    for(let key in obj[role]){
        if(key == userId){
            notification('User already exist.');
            document.querySelector("#uid").value ="";
            document.querySelector("#name").value = "";
            document.querySelector("#pwd").value = "";
            return false;
        }
    }
    return true;
}