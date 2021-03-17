class User {
    constructor(data) {
        this.id = data.id
        this.last = data.last;
        this.first = data.first;
        this.middle = data.middle;
    }
}

module.exports = User;
