class Question{
    constructor(id,name,opt1,opt2,opt3,opt4,score,ans){
        this.id = id;
        this.name = name;
        this.opt1 = opt1;
        this.opt2 = opt2;
        this.opt3 = opt3;
        this.opt4 = opt4;
        this.score = score;
        this.ans = ans;
        this.marked = false;
        this.user = "";
        
    }
}
class Test{
    constructor(testId,testName,testDescription){
        this.testId = testId;
        this.testName = testName;
        this.testDescription = testDescription;
        this.questions = [];
        this.score = "";
        this.testTime = '5';
        this.marked = false;
        this.user = "";
    }
}
