const questionOperations={
    questions:[],
    tests:[],
    addTest(obj){
        this.tests.push(obj);
    },
    getIds(){
        let ids =[];
        this.questions.forEach(question =>ids.push(question.id));
        return ids;
    },
    getNames(){
        let names =[];
        this.questions.forEach(question =>names.push(question.name));
        return names;
    },
    add(question){
        this.questions.push(question);
    },
    testMark(id){
        var testObject=this.tests.find(test=>test.testId==id);
        testObject.marked =!testObject.marked;        
    },
    mark(id){
        var questionObject=this.questions.find(question=>question.id==id);
        questionObject.marked =!questionObject.marked;        
    },
    countMark(key){
        return this[key].filter(question=>question.marked).length;
    },
    countUnMark(key){
        return this[key].length-this.countMark(key);
    },
    delete(){
        this.questions=this.questions.filter(question=> !question.marked);
        this.tests=this.tests.filter(test=> !test.marked);
    },
    testEdit(id){
        var testObject = this.tests.find(test=>test.testId==id);
        return testObject;
    },
    edit(id){
        var questionObject = this.questions.find(question=>question.id==id);
        return questionObject;
    },
    search(query){
        return this.questions.find(question=>question.id == query||question.name==query);
    },
    sort(sort){
        if(sort == 'id'||sort == 'score'){
            var arr = [...this.questions];
            arr.sort((a,b)=>a[sort]-b[sort]);
            return arr;
        }
        else if(sort=='name'){
            var arr = [...this.questions];
            arr.sort((first,second)=>first[sort].localeCompare(second[sort]));
            return arr;
        }
        else return false;
    },
    testSort(sort){
        if(sort == 'testId'||sort == 'score'){
            var arr = [...this.tests];
            arr.sort((a,b)=>a[sort]-b[sort]);
            return arr;
        }
        else if(sort=='testName'){
            var arr = [...this.tests];
            arr.sort((first,second)=>first[sort].localeCompare(second[sort]));
            return arr;
        }
        else return false;
    }
}