# Create the Cloud9 instance:
resource "aws_cloud9_environment_ec2" "cloud9_instance" {
  automatic_stop_time_minutes = 30
  connection_type             = "CONNECT_SSM"
  instance_type               = "t2.micro"
  name                        = "${var.workspace}-cloud9-instance-01"
  owner_arn                   = aws_iam_user.hackathon_contestant.arn
  subnet_id                   = var.public_subnet_id

  depends_on = [aws_iam_user.hackathon_contestant]
}

# Get the cloud 9 security group using a filter:
data "aws_security_group" "cloud9_security_group" {
  filter {
    name = "tag:aws:cloud9:environment"
    values = [
      aws_cloud9_environment_ec2.cloud9_instance.id
    ]
  }
}

# Configure the egress rule to allow the cloud 9 to access the internet:
resource "aws_vpc_security_group_egress_rule" "cloud9_security_group_egress_rule" {
  security_group_id = data.aws_security_group.cloud9_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 0
  ip_protocol = "tcp"
  to_port     = 65535

  tags = {
    Name = "${var.workspace}-cloud9-security-group-egress-rule"
  }
}
