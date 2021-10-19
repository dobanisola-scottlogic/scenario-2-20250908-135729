const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const { waitForCFStatus } = require('../utils/waitForDeployment');

module.exports.deploy = async (config) => {
    const {
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
        client,
        project,
        owner
    } = config;

    CloudFormation = new AWS.CloudFormation({ region });
    const infraTemplate = fs.readFileSync(path.join(__dirname, '../', 'cloudformation-infrastructure.yml'), 'utf8');

    await CloudFormation.createStack({
        StackName: infraStackName,
        TemplateBody: infraTemplate,
        Capabilities: [
            'CAPABILITY_IAM'
        ],
        Tags: [
            { Key: 'Project', Value: project },
            { Key: 'Client', Value: client },
            { Key: 'Owner', Value: owner },
        ]
    }).promise();

    await waitForCFStatus({
        stackname: infraStackName,
        region,
        doneStatuses: [ 'CREATE_COMPLETE' ],
        pendingStatues: [ 'CREATE_IN_PROGRESS' ],
    });

    const serverTemplate = fs.readFileSync(path.join(__dirname, '../', 'cloudformation-server.yml'), 'utf8');

    await CloudFormation.createStack({
        StackName: serverStackName,
        TemplateBody: serverTemplate,
        Parameters: [
            { ParameterKey: 'InfrastructureStackName', ParameterValue: infraStackName },
            { ParameterKey: 'ServerServiceName', ParameterValue: serverServiceName },
            { ParameterKey: 'ServerHTTPPort', ParameterValue: serverHttpPort },
            { ParameterKey: 'ServerContainerCpu', ParameterValue: serverCpu },
            { ParameterKey: 'ServerContainerMemory', ParameterValue: serverMemory },
            { ParameterKey: 'DBName', ParameterValue: dbName },
            { ParameterKey: 'DBUser', ParameterValue: dbUser },
            { ParameterKey: 'DBPassword', ParameterValue: dbPassword },
            { ParameterKey: 'ServerImage', ParameterValue: serverImage }
        ],
        Capabilities: [
            'CAPABILITY_IAM',
            'CAPABILITY_NAMED_IAM'
        ],
        Tags: [
            { Key: 'Project', Value: 'Hackathon Q3 2021' },
            { Key: 'Client', Value: 'Scott Logic' },
            { Key: 'Owner', Value: 'parmstrong@scottlogic.com' },
        ]
    }).promise();

    await waitForCFStatus({
        stackname: serverStackName,
        region,
        doneStatuses: [ 'CREATE_COMPLETE' ],
        pendingStatues: [ 'CREATE_IN_PROGRESS' ],
    });

    const stacks = await CloudFormation.describeStacks().promise();
    const publicLoadBalancerUrl = stacks.Stacks
        .filter(stack => stack.StackName === infraStackName)[0].Outputs
        .find(output => output.OutputKey === 'ExternalUrl').OutputValue;

    console.log('Public URL of HackathonServer is: ' + publicLoadBalancerUrl + '/application');
}
