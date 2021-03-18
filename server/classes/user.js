class User {
    constructor(data) {
        this.id = data.id
        this.last = data.last;
        this.first = data.first;
        this.middle = data.middle;
        this.birthdate = data.birthdate;
    }
}

module.exports = User;
