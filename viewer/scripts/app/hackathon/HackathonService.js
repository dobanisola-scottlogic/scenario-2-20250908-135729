class HackathonService {
    constructor($http, $q, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
    }

    getHackathonIdFromPath() {
        let pathName = window.location.pathname;
        let pathParts = pathName.split('/');
        return pathParts[2];
    }

    getHackathonIdFromQueryString() {
        let query = window.location.search;
        let queryParts = query.split('?');
        return queryParts[1];
    }

    getHackathonFromPath() {
        let hackId = this.getHackathonIdFromPath();
        if (!hackId) {
            hackId = this.getHackathonIdFromQueryString();
        }
        return this.getHackathon(hackId);
    }

    getHackathons() {
        return this.$http.get(`${this.apiPath}/hackathon`).then(response => response.data);
    }

    getHackathon(id) {
        return this.$http.get(`${this.apiPath}/hackathon/${id}`).then(response => response.data);
    }

    createHackathon(hackathon) {
        return this.$http.post(`${this.apiPath}/hackathon`, hackathon).then(response => response.data);
    }

    deleteHackathon(hackathon) {
        return this.$http.delete(`${this.apiPath}/hackathon/${hackathon.id}`).then(response => response.data);
    }
}

HackathonService.$inject = ['$http', '$q', 'API_PATH'];

module.exports = HackathonService;
