class TeamService {
    constructor($http, $q, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
    }

    getTeams() {
        return this.$http.get(`${this.apiPath}/team`).then(response => response.data);
    }

    getTeamsByHackathon(hackathonId) {
        return this.$http.get(`${this.apiPath}/team?hackathonId=` + hackathonId).then(response => response.data);
    }

    deleteTeam(team) {
        return this.$http.delete(`${this.apiPath}/team/${team.id}`).then(response => response.data);
    }

    addTeam(team) {
        return this.$http.post(`${this.apiPath}/team`, team).then(response => response.data);
    }

    updatePassword(team, password) {
        let teamUpdate = {
            password: password
        };

        return this.$http.put(`${this.apiPath}/team/${team.id}`, teamUpdate).then(response => response.data);
    }
}

TeamService.$inject = ['$http', '$q', 'API_PATH'];

module.exports = TeamService;
