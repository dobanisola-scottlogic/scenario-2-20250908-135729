class AuthenticationService {
    constructor($http, $q, $window, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
        this.$window = $window;
    }

    login(username, password) {
        let loginDeferred = this.$q.defer();
        let authenticationData = this.$window.btoa(username + ':' + password);

        this.$http.defaults.headers.common.Authorization = 'Basic ' + authenticationData;
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
}

AuthenticationService.$inject = ['$http', '$q', '$window', 'API_PATH'];

module.exports = AuthenticationService;
