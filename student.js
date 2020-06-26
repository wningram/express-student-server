class Student {
    constructor(id, name, grade) {
        this.id = id;
        this.name = name;
        this.grade = grade;
    }

    name = "";
    grade = [0, 1, 2];
    id = 0;
}

module.exports = Student