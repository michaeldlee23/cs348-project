const User = require('./User');

class Student extends User {
    constructor(data) {
        super(data);
        this.year = data.year;
        this.gpa = data.gpa;
    }

    setYear(year) {
        this.year = year;
    }

    setGPA(gpa) {
        this.gpa = gpa;
    }
}

module.exports = Student;
