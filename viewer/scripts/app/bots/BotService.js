class BotService {
    constructor($http, $q, apiPath, Upload) {
        this.apiPath = apiPath;
        this.$http = $http;
        this.$q = $q;
        this.Upload = Upload;
    }

    getBots() {
        return this.$http.get(`${this.apiPath}/bot`).then(response => response.data);
    }

    getBotsByTeamName(teamName) {
        return this.$http.get(`${this.apiPath}/bot/?teamName=${teamName}`).then(response => response.data);
    }

    getValidBotsFromJar(file) {
        return this.Upload.upload({
            url: `${this.apiPath}/bot/`,
            data: {file}
        }).then(response => response.data);
    }

    addBot(className, fileId) {
        return this.Upload.upload({
            url: `${this.apiPath}/bot/${className}`,
            data: {id: fileId}
        }).then(response => response.data);
    }

    addBotAsAdmin(className, teamName, fileId) {
        return this.Upload.upload({
            url: `${this.apiPath}/bot/${className}`,
            data: {
                id: fileId,
                teamName: teamName.trim()
            }
        }).then(response => response.data);
    }

    makeActive(bot) {
        let activeBot = {
            teamId: bot ? bot.teamId : null,
            botId: bot ? bot.id : null
        };

        return this.$http.put(`${this.apiPath}/bot/active`, activeBot).then(response => response.data);
    }

    deleteBot(bot) {
        return this.$http.delete(`${this.apiPath}/bot/${bot.id}`).then(response => response.data);
    }
}

BotService.$inject = ['$http', '$q', 'API_PATH', 'Upload'];

module.exports = BotService;
