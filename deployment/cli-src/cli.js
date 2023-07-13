const program = require('commander');
const { updateTeam } = require('./command/updateTeam');
const { deploy } = require('./command/deploy');
const { readSavedConfig, configure } = require('./command/configure');
const { deleteStacks } = require('./command/delete');

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
process.env.AWS_SDK_LOAD_CONFIG = '1';


program
  .command('configure')
  .description('Configure the hackathon deployer')
  .action(async () => await configure());

program
  .command('deploy')
  .description('Deploy the hackathon CloudFormation templates')
  .action(async () => {
    const config = readSavedConfig();
    await deploy(config);
  });

program
  .command('delete')
  .description('Delete the hackathon CloudFormation stacks')
  .action(async () => {
    const config = readSavedConfig();
    await deleteStacks(config);
  });

program
  .command('create-team')
  .option('-t', '--teamname', 'Name of the team to create')
  .description('Create a new team')
  .action(async (teamname) => {
    const config = readSavedConfig();
    await updateTeam(config, teamname, 'create');
  });

program
    .command('delete-team')
    .option('-t', '--teamname', 'Name of the team to delete')
    .description('Delete an existing team')
    .action(async (teamname) => {
        const config = readSavedConfig();
        await updateTeam(config, teamname, 'delete');
    });



program.parse(process.argv);
