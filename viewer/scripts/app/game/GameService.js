class GameService {
    constructor($http, $q, apiPath) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
    }

    getGameFromPath() {
        const searchParams = new URLSearchParams(window.location.search);
        return this.getGame(searchParams.get('gameId'));
    }

    getGames() {
        return this.$http.get(`${this.apiPath}/game`).then(response => response.data);
    }

    getGamesByHackathon(hackathonId) {
        return this.$http.get(`${this.apiPath}/game?hackathonId=` + hackathonId).then(response => response.data);
    }

    getGame(id) {
        return this.$http.get(`${this.apiPath}/game/${id}`).then(response => response.data);
    }

    playGame(game) {
        return this.$http.post(`${this.apiPath}/game`, game).then(response => response.data);
    }
}

GameService.$inject = ['$http', '$q', 'API_PATH'];

module.exports = GameService;
