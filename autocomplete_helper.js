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
