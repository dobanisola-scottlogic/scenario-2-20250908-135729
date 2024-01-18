locals {
  workspace           = lower(terraform.workspace == "default" ? var.project : replace(terraform.workspace, "-", ""))
  server_service_name = "${local.workspace}-server"
  db_name             = local.workspace

  # Start/stop ECS and EC2 (Cloud9) 5' before/after the desired start/stop hour
  start_schedule = "55 ${var.start_hour - 1} ? * ${var.schedule_days} *"
  stop_schedule  = "05 ${var.stop_hour} ? * ${var.schedule_days} *"

  # Start/stop the database 5' before/after ECS and EC2
  rds_up_schedule   = "50 ${var.start_hour - 1} ? * ${var.schedule_days} *"
  rds_down_schedule = "10 ${var.stop_hour} ? * ${var.schedule_days} *"
}
