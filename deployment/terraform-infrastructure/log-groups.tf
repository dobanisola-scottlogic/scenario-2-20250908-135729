resource "aws_cloudwatch_log_group" "cloudwatch_logs_group" {
  name              = "${var.project}-Logs"
  retention_in_days = 7

  tags = {
    Name = "${var.project}-cloudwatch-logs-group"
  }
}
