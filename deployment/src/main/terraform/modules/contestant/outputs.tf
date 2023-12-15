data "aws_arn" "hackathon_user_arn" {
  arn = aws_iam_user.hackathon_contestant.arn
}

output "hackathon_contestants" {
  value = [
    for index, instance in aws_cloud9_environment_ec2.cloud9_instance : {
      "Team name"  = aws_ssm_association.execute_s3_cloud9_sync_command[index].parameters["TeamName"]
      "Cloud9 URL" = "https://${var.aws_region}.console.aws.amazon.com/cloud9/ide/${instance.id}"
      "Account ID" = data.aws_arn.hackathon_user_arn.account
      "Password"   = var.hackathon_contestant_password
      "User name"  = aws_iam_user.hackathon_contestant.name
    }
  ]
}

output "sorted_cloud9_ec2_instance_ids" {
  value = { for index, instance in data.aws_instance.cloud9_ec2_instance : format("%02d", index + 1) => instance.id }
}

output "hackathon_contestant_password" {
  value = var.hackathon_contestant_password
}
