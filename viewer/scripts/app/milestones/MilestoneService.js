class MilestoneService {
    constructor($http, $q, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
    }

    getMilestones() {
        return this.$http.get(`${this.apiPath}/milestone`).then(response => response.data);
    }
}

MilestoneService.$inject = ['$http', '$q', 'API_PATH'];

module.exports = MilestoneService;
