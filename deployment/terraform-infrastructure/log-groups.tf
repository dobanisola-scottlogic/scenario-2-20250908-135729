resource "aws_cloudwatch_log_group" "cloudwatch_logs_group" {
  name              = "${local.workspace}-Logs"
  retention_in_days = 7

  tags = {
    Name = "${local.workspace}-cloudwatch-logs-group"
  }
}
