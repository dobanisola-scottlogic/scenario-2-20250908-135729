# Create an SSM document to populate the Cloud9 environments with contestant files from the S3 bucket
# The SSM document defines the scripts to be executed on the Cloud9-managed EC2 instances
resource "aws_ssm_document" "s3_cloud9_sync_command" {
  name            = "${var.workspace}-s3-cloud9-sync-command"
  document_type   = "Command"
  document_format = "JSON"

  content = jsonencode({
    "schemaVersion" : "2.2",
    "description" : "Sync files from S3 to Cloud9",
    "parameters" : {
      "TeamName" : {
        "type" : "String",
        "description" : "The name of the team that this Cloud9 instance belongs to"
      }
    },
    "mainSteps" : [
      {
        "action" : "aws:runShellScript",
        "name" : "runShellScript",
        "inputs" : {
          # Create a directory for each contestant archive
          # Stream each contestant archive through tar to extract the files into the directory
          "runCommand" : flatten([
            [for c in var.contestants :
              [
                "mkdir -p /home/ec2-user/environment/${c}-contestant",
                "aws s3 cp s3://${aws_s3_bucket.contestant_bucket.bucket}/${c}-contestant.tgz - | tar -xz -C /home/ec2-user/environment/${c}-contestant",
                "chown -R ec2-user.ec2-user /home/ec2-user/environment/${c}-contestant"
              ]
            ],
            "echo -e '\\n\\n# Hackathon environment variables' >> /home/ec2-user/.bash_profile",
            "echo export PROJ_DIR=\"/home/ec2-user/environment\" >> /home/ec2-user/.bash_profile",
            "echo export TEAM_NAME=\"{{TeamName}}\" >> /home/ec2-user/.bash_profile",
            "echo export GAME_SERVER_HOST=\"${var.game_server_host}\" >> /home/ec2-user/.bash_profile",
            "echo export GAME_SERVER_PORT=\"${var.game_server_port}\" >> /home/ec2-user/.bash_profile",
            # "sudo yum -y install java-21-amazon-corretto-devel.x86_64",
            # HAC-203 Uncomment the above line and remove the below 3 lines when Terraform supports Amazon Linux 2023
            "curl -fL -o corretto.rpm https://corretto.aws/downloads/latest/amazon-corretto-21-x64-linux-jdk.rpm",
            "sudo yum localinstall -y corretto.rpm",
            "export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto",
            join(" ",
              [
                "su ec2-user -c",
                "'cd /home/ec2-user/environment/python-contestant",
                "&& python3 -m venv venv",
                "&& source venv/bin/activate",
                "&& pip install -r requirements.txt'",
            ])
          ])
        }
      }
    ]
  })
}

# Associate the S3Cloud9SyncCommand SSM document with Cloud9-managed EC2 instances to execute the commands on those instances
resource "aws_ssm_association" "execute_s3_cloud9_sync_command" {
  for_each = data.aws_instance.cloud9_ec2_instance
  name     = aws_ssm_document.s3_cloud9_sync_command.name

  parameters = {
    TeamName = format("Team%d", 1 + each.key)
  }

  targets {
    key    = "InstanceIds"
    values = [each.value.id]
  }
}
