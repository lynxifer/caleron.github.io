/**
 * Zur Autovervollständigung
 */
var DB = {
    Course: function () {
        this.id = "";
        this.type = "";
        this.module = "";
        this.begin = new Date();
        this.end = new Date();
        this.date = new Date();
        this.weekDay = 0;
        this.leader = "";
    },
    Faculty: function () {
        this.id = "";
        this.name = "";
    },
    Module: function () {
        this.id = "";
        this.name = "";
        this.shortname = "";
        this.credits = 0;
        this.possibleFaculties = [];
        this.possibleSemester = 0;
    },
    Registration: function () {
        this.id = "";
        this.module = "";
        this.semester = "";
        this.student = "";
        this.course = "";
    },
    Semester: function () {
        this.id = "";
        this.year = 0;
        this.semesterType = 0;
    },
    User: function () {
        this.id = "";
        this.username = "";
    },
    connect: function(url) {

    },
    ready: function (callback) {
        
    }
};

/*
 DB.modules.find().in("studiengang",stu).resultList().then(function(result) {
 Promise.all(result.map(function(obj) {
 return obj.studiengang.load();
 }).then(function(fullResult) {

 });;
 });

 DB.Module.load("40268900-9217-4e83-8f0f-193374d255c5",
 function(obj) {obj.isRequiredInMajor.load().then(
 function(resolvedObj) {
 console.log(JSON.stringify(resolvedObj));
 });
 });

 DB.Module.load("40268900-9217-4e83-8f0f-193374d255c5",
 function(obj) {obj.load({depth: 1}).then(
 function(resolvedObj) {
 console.log(JSON.stringify(resolvedObj));
 });
 });
 */