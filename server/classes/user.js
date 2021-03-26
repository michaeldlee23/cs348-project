class User {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.last = data.last;
        this.first = data.first;
        this.middle = data.middle;
        this.birthdate = data.birthdate;
        this.phone = data.phone;
        this.scope = data.scope;
    }
}

module.exports = User;
