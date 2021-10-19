const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { questionPromptFactory } = require('../utils/question');
const os = require('os');
const _ = require('lodash');

const configFile = path.join(__dirname, '.cli-config');

const configDefaults = {
    region: 'eu-west-2',
    serverServiceName: 'hackathon-server',
    serverHttpPort: '8080',
    serverCpu: '4096',
    serverMemory: '8192',
    dbName: 'hackathon',
    dbUser: 'hackathon',
    // URLs available on aws in services -> ECR -> Repositories
    serverImage: '032044580362.dkr.ecr.eu-west-2.amazonaws.com/hackathon-gameserver:latest',
    clientImage: '032044580362.dkr.ecr.eu-west-2.amazonaws.com/hackathon-contestant:latest',
    owner: os.userInfo().username,
    client: 'Scott Logic'
}

const configPrompt = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const questionPrompt = questionPromptFactory(rl);

        const region = await questionPrompt(`region (${configDefaults.region})> `);
        const infraStackName = await questionPrompt('Infrastructure Stack Name> ');
        const serverStackName = await questionPrompt('Server Stack Name> ');
        const serverServiceName = await questionPrompt(`ECS Service Name (${configDefaults.serverServiceName})> `);
        const serverHttpPort = await questionPrompt(`Server HTTP Port (${configDefaults.serverHttpPort})> `);
        const serverCpu = await questionPrompt(`CPU (${configDefaults.serverCpu})> `);
        const serverMemory = await questionPrompt(`Memory (${configDefaults.serverMemory})> `);
        const dbName = await questionPrompt(`Database Name (${configDefaults.dbName})> `);
        const dbUser = await questionPrompt(`Database User (${configDefaults.dbUser})> `);
        const dbPassword = await questionPrompt('Database Password (8 characters min)> ');
        const serverImage = await questionPrompt(`Hackathon Gameserver Image URI (${configDefaults.serverImage})> `);
        const clientImage = await questionPrompt(`Hackathon Contestant Image URI> (${configDefaults.clientImage})> `);
        const owner = await questionPrompt(`Owner [used for tagging] (${configDefaults.owner})> `);
        const project = await questionPrompt('Project [used for tagging]> ');
        const client = await questionPrompt(`Client [used for tagging]  (${configDefaults.client})> `);

        return _.assignWith({}, {
            region,
            infraStackName,
            serverStackName,
            serverServiceName,
            serverHttpPort,
            serverCpu,
            serverMemory,
            dbName,
            dbUser,
            dbPassword,
            serverImage,
            clientImage,
            owner,
            project,
            client
        }, configDefaults, (objValue, srcValue)=>{return objValue !== '' ? objValue: srcValue});
    } finally {
        rl.close();
    }


}

module.exports = {
    configure: async () => {
        const config = await configPrompt();
        fs.writeFileSync(configFile, JSON.stringify(config));
        return config;
    },
    readSavedConfig: () => {
        try {
            if (fs.existsSync(configFile)) {
                const config = JSON.parse(fs.readFileSync(configFile));
                console.log('Found saved config');
                return config;
            }
        } catch (e) {}

        return {};
    }
};
