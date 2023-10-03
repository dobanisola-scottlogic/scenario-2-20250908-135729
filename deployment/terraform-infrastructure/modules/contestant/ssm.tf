# Create an SSM document to populate the Cloud9 environments with contestant files from the S3 bucket
# The SSM document defines the scripts to be executed on the Cloud9-managed EC2 instances
resource "aws_ssm_document" "s3_cloud9_sync_command" {
  name            = "${var.workspace}-s3-cloud9-sync-command"
  document_type   = "Command"
  document_format = "JSON"

  content = jsonencode({
    "schemaVersion" : "2.2",
    "description" : "Sync files from S3 to Cloud9",
    "mainSteps" : [
      {
        "action" : "aws:runShellScript",
        "name" : "runShellScript",
        "inputs" : {
          # Create a directory for each contestant archive
          # Stream each contestant archive through tar to extract the files into the directory
          "runCommand" : flatten([for c in var.contestants :
            ["mkdir -p /home/ec2-user/environment/${c}-contestant",
          "aws s3 cp s3://${aws_s3_bucket.contestant_bucket.bucket}/${c}-contestant.tgz - | tar -xz -C /home/ec2-user/environment/${c}-contestant"]])
        }
      }
    ]
  })
}

# Associate the S3Cloud9SyncCommand SSM document with Cloud9-managed EC2 instances to execute the commands on those instances
resource "aws_ssm_association" "execute_s3_cloud9_sync_command" {
  for_each = data.aws_instance.cloud9_ec2_instance
  name     = aws_ssm_document.s3_cloud9_sync_command.name

  targets {
    key    = "InstanceIds"
    values = [each.value.id]
  }
}
