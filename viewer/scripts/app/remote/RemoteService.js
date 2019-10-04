class RemoteService {
    constructor($http, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
    }

    connect(teamName) {
        return this.$http.post(`${this.apiPath}/remotebot/connect`, teamName, {'headers': {'Content-Type': 'text/plain'}}).then(response => response.data);
    }

    disconnect(teamName) {
        return this.$http.post(`${this.apiPath}/remotebot/disconnect`, teamName, {'headers': {'Content-Type': 'text/plain'}}).then(response => response.data);
    }

    getConnectedState(teamName) {
        return this.$http.get(`${this.apiPath}/remotebot/connectedState?teamName=${teamName}`).then(response => response.data);
    }

    test(teamName, milestone, map) {
        return this.$http.post(`${this.apiPath}/remotebot/test`, {teamName, milestone, map}).then(response => response.data);
    }

    getBotsByTeamName(teamName) {
        return this.$http.get(`${this.apiPath}/remotebot/?teamName=${teamName}`).then(response => response.data);
    }
}

RemoteService.$inject = ['$http', 'API_PATH'];

module.exports = RemoteService;
