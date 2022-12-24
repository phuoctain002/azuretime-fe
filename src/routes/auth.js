class auth {
    constructor() {
        const item = JSON.parse(sessionStorage.getItem('isLogin'));
        this.auth = item ? item : false;
    }
    login(cb) {
        this.auth = true;
        cb();
    }
    logout(cb) {
        this.auth = false;
        cb();
    }
    isAuth() {
        return this.auth;
    }
}
export default new auth();
