const AWS = require('aws-sdk');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');
const { waitForCFStatus } = require('../utils/waitForDeployment');

const PREPEND_NAME_STRING = 'Hackathon-Contestant';

const assert = (val, message) => {
  if (!val) throw new Error(message);
};

const configFile = path.join(__dirname, '.cli-team-config');

module.exports.updateTeam = async (config, teamName, updateMode) => {
  const {
    region,
    serverStackName,
    infraStackName,
    clientImage,
    serverHttpPort,
  } = config;

  assert(region, "Region cannot be empty");
  assert(serverStackName, "Server Stack Name cannot be empty");
  assert(clientImage, "Client image cannot be empty");

  console.log('updating team ' + teamName);
  const CloudFormation = new AWS.CloudFormation({ region });
  const EC2 = new AWS.EC2({ region });

  const stacks = await CloudFormation.describeStacks().promise();
  const hackathonStacks = stacks.Stacks.filter(stack => stack.StackName === serverStackName);

  if (hackathonStacks.length === 0) {
    console.error('Could not find CloudFormation stack');
    return;
  }

  const stack = hackathonStacks[0];
  console.log('Found stack ' + serverStackName);


  const externalUrl = stacks.Stacks
    .filter(summary => summary.StackName === infraStackName)[0].Outputs
    .find(output => output.OutputKey === 'ExternalUrl').OutputValue;


  const template = YAML.parse(fs.readFileSync(path.join(__dirname, '../', 'cloudformation-server.yml'), 'utf8'));
  const teamsConfig = readTeamsConfig();
  if(updateMode === 'create'){
    if(!teamsConfig.teams.includes(teamName)) {
      teamsConfig.teams.push(teamName);
      saveTeamsConfig(teamsConfig)
    }
  }
  if(updateMode === 'delete'){
      teamsConfig.teams = teamsConfig.teams.filter(item  => item !== teamName);
      saveTeamsConfig(teamsConfig)
  }

  for (const team of teamsConfig.teams) {
    template.Resources[team] = getEc2Template(
        {
          teamName: team,
          password: team,
          image: clientImage,
          region,
          serverHost: externalUrl.replace(/(^\w+:|^)\/\//, ''),  // remove protocol
          serverPort: serverHttpPort,

        }
    )
  };
  const util = require('util')

  await CloudFormation.updateStack({
    StackName: stack.StackName,
    TemplateBody: YAML.stringify(template),
    Parameters: [
      { ParameterKey: 'InfrastructureStackName', UsePreviousValue: true },
      { ParameterKey: 'ServerServiceName', UsePreviousValue: true },
      { ParameterKey: 'ServerHTTPPort', UsePreviousValue: true },
      { ParameterKey: 'ServerContainerCpu', UsePreviousValue: true },
      { ParameterKey: 'ServerContainerMemory', UsePreviousValue: true },
      { ParameterKey: 'DBName', UsePreviousValue: true },
      { ParameterKey: 'DBUser', UsePreviousValue: true },
      { ParameterKey: 'DBPassword', UsePreviousValue: true },
      { ParameterKey: 'ServerImage', UsePreviousValue: true }
    ],
    Capabilities: [
      "CAPABILITY_NAMED_IAM"
    ]
  }).promise();
  console.log('Stack update started');
  await waitForCFStatus({
    stackname: serverStackName,
    region,
    doneStatuses: [ 'UPDATE_COMPLETE' ],
    pendingStatues: [ 'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS' ]
  });

  const response = await EC2.describeInstances({
    Filters: [
      {
        Name: 'tag:Name',
        Values: [`${PREPEND_NAME_STRING}-${teamName}`]
      }
    ]
  }).promise();

  if(updateMode === 'create'){
    console.log('Public URL of instance is: http://' + response.Reservations[0].Instances[0].PublicDnsName);
  }
}

function getEc2Template({
  teamName,
  password,
  image,
  region,
  serverHost,
  serverPort
}) {
  return {
    Type: "AWS::EC2::Instance",
    Properties: {
      AvailabilityZone: "eu-west-2a",
      CreditSpecification: {
        CPUCredits: "standard"
      },
      ImageId: "ami-045ebfbc7e36bb51d",
      InstanceType: "t3.medium",
      IamInstanceProfile: { Ref: 'ContestantInstanceProfile' },
      SubnetId: {
        "Fn::ImportValue": {
          "Fn::Join": [
            ':',
            [ { Ref: 'InfrastructureStackName' }, 'PublicSubnetOne' ]
          ]
        }
      },
      SecurityGroupIds: [{ Ref: "HackathonContestantSecurityGroup" }],
      Tags: [
        {
          Key: "Project",
          Value: "Hackathon Q3 2021"
        },
        {
          Key: 'Client',
          Value: 'Scott Logic'
        },
        {
          Key: 'Owner',
          Value: 'parmstrong@scottlogic.com'
        },
        {
          Key: "Name",
          Value: PREPEND_NAME_STRING + "-" + teamName
        }
      ],
      UserData: {
        "Fn::Base64": {
          "Fn::Join": [
            "",
            [
              "#!/bin/bash -xe\n",
              `eval $(aws ecr get-login --region ${region} --no-include-email)\n`,
              `docker run -d --rm -e GAME_SERVER_HOST=${serverHost} -e GAME_SERVER_PORT=80 -e TEAM_NAME=${teamName} -e PASSWORD=${password} --name code-server --security-opt=seccomp:unconfined -p 80:8080 -p 8081:8081 --expose 80 --expose 8081 ${image} --auth password \n`
            ]
          ]
        }
      }
    }
  };
}

function readTeamsConfig()  {
  try {
    if (fs.existsSync(configFile)) {
      const teams = JSON.parse(fs.readFileSync(configFile));
      console.log('Found saved config');
      return teams;
    }
  } catch (e) {}

  return {
    "teams" : []
  };
}

function saveTeamsConfig(config) {
  try{
    fs.writeFileSync(configFile, JSON.stringify(config));
  } catch(e) {}
}
