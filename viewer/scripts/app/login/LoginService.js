class LoginService {
    constructor($http, $q, $window, apiPath) {
        this.$http = $http;
        this.$q = $q;
        this.$window = $window;
        this.apiPath = apiPath;
    }
    login(username, password) {
        let loginDeferred = this.$q.defer();

        this.setAuthenticationData(username, password);

        this.loggedInUser = null;

        this.$http.post(`${this.apiPath}/login`).then(
            response => {
                this.loggedInUser = response.data;
                loginDeferred.resolve(this.loggedInUser);
            },
            () => loginDeferred.reject()
        );

        return loginDeferred.promise;
    }
    logout() {
        this.$http.defaults.headers.common.Authorization = undefined;
        this.loggedInUser = null;
    }
    get isLoggedIn() {
        return !!this.loggedInUser;
    }
    getLoggedInUserName() {
        return this.loggedInUser ? this.loggedInUser.name : null;
    }
    isAuthourised(role) {
        return this.loggedInUser && this.loggedInUser.role === role;
    }
    setAuthenticationData(username, password) {
        let authenticationData = this.$window.btoa(username + ':' + password);
        this.$http.defaults.headers.common.Authorization = 'Basic ' + authenticationData;
    }
}

LoginService.$inject = ['$http', '$q', '$window', 'API_PATH'];

module.exports = LoginService;
