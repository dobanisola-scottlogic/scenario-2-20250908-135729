# Create the Cloud9 instances
resource "aws_cloud9_environment_ec2" "cloud9_instance" {
  count                       = var.team_count
  name                        = format("%s-%02d", var.workspace, count.index + 1)
  instance_type               = "t2.small"
  automatic_stop_time_minutes = 30
  connection_type             = "CONNECT_SSM"
  image_id                    = "amazonlinux-2023-x86_64"
  owner_arn                   = aws_iam_user.hackathon_contestant.arn
  subnet_id                   = var.public_subnet_id

  depends_on = [aws_iam_user.hackathon_contestant]
}

# Get the Cloud9 EC2 instances using a filter
data "aws_instance" "cloud9_ec2_instance" {
  for_each = { for index, environment in aws_cloud9_environment_ec2.cloud9_instance : index => environment.id }

  filter {
    name   = "tag:aws:cloud9:environment"
    values = [each.value]
  }
}
