output "cloud9_url" {
  value = "https://${var.aws_region}.console.aws.amazon.com/cloud9/ide/${aws_cloud9_environment_ec2.cloud9_instance.id}"
}

output "hackathon_contestant_arn" {
  value = aws_iam_user.hackathon_contestant.arn
}

output "hackathon_contestant_password" {
  value = aws_iam_user_login_profile.hackathon_contestant.password
}
