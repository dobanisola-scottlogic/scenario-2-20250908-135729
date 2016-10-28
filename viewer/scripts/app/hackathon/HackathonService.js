class HackathonService {
    constructor($http, $q, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
    }

    getHackathonFromPath() {
        const searchParams = new URLSearchParams(window.location.search);
        return this.getHackathon(searchParams.get('hackathonId'));
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

    updateCurrentMilestone(hackathon, milestone) {
        return this.$http.put(`${this.apiPath}/hackathon/${hackathon.id}`, milestone).then(response => response.data);
    }
}

HackathonService.$inject = ['$http', '$q', 'API_PATH'];

module.exports = HackathonService;
