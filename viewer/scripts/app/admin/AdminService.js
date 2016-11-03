class AdminService {
    constructor($http, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
    }

    getAdmin() {
        return this.$http.get(`${this.apiPath}/admin`).then(response => response.data);
    }

    updatePassword(password) {
        return this.$http.put(`${this.apiPath}/admin`, password).then(response => response.data);
    }
}

AdminService.$inject = ['$http', 'API_PATH'];

module.exports = AdminService;
