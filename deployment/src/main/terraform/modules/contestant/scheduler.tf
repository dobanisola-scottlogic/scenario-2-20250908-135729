# Schedule Cloud9 start and stop times using EventBridge
# Logging of these events is in CloudTrail 🤷‍♂️

resource "aws_scheduler_schedule_group" "schedule_group" {
  name = "${var.workspace}-schedule-group"
}

resource "aws_scheduler_schedule" "cloud9_start_scheduler" {
  name       = "${var.workspace}-cloud9-start-scheduler"
  group_name = aws_scheduler_schedule_group.schedule_group.name

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(${var.start_schedule})"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ec2:startInstances"
    role_arn = aws_iam_role.ec2_start_stop_role.arn

    input = jsonencode({
      InstanceIds = [for i in data.aws_instance.cloud9_ec2_instance : i.id]
    })
  }
}

resource "aws_scheduler_schedule" "cloud9_stop_scheduler" {
  name       = "${var.workspace}-cloud9-stop-scheduler"
  group_name = aws_scheduler_schedule_group.schedule_group.name

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(${var.stop_schedule})"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ec2:stopInstances"
    role_arn = aws_iam_role.ec2_start_stop_role.arn

    input = jsonencode({
      InstanceIds = [for i in data.aws_instance.cloud9_ec2_instance : i.id]
    })
  }
}
