class MilestoneService {
    constructor($http, $q, apiPath, Upload) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
        this.Upload = Upload;
    }

    getMilestones() {
        return this.$http.get(`${this.apiPath}/milestone`).then(response => response.data);
    }
}

MilestoneService.$inject = ['$http', '$q', 'API_PATH', 'Upload'];

module.exports = MilestoneService;
