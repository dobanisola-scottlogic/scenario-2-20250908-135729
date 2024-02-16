module "contestant" {
  source = "./modules/contestant"

  aws_region       = var.aws_region
  aws_access_key   = var.aws_access_key
  aws_secret_key   = var.aws_secret_key
  aws_role_arn     = var.aws_role_arn
  public_subnet_id = aws_subnet.public_subnets[0].id
  team_count       = var.team_count
  workspace        = local.workspace
  game_server_host = aws_lb.public_load_balancer.dns_name
  game_server_port = var.server_http_port
  start_schedule   = local.start_schedule
  stop_schedule    = local.stop_schedule
}

module "monitoring" {
  source = "./modules/monitoring"

  aws_region                     = var.aws_region
  cloudwatch_log_group_name      = aws_cloudwatch_log_group.cloudwatch_logs_group.name
  db_name                        = aws_db_instance.database.db_name
  ecs_cluster_name               = aws_ecs_cluster.ecs_cluster.name
  ecs_service_name               = aws_ecs_service.service.name
  sorted_cloud9_ec2_instance_ids = module.contestant.sorted_cloud9_ec2_instance_ids
  workspace                      = local.workspace
}

module "rds_schedule" {
  source     = "github.com/barryw/terraform-aws-rds-scheduler"
  identifier = local.workspace

  up_schedule   = local.rds_up_schedule
  down_schedule = local.rds_down_schedule

  rds_identifier = aws_db_instance.database.identifier
  is_cluster     = false

  depends_on = [aws_db_instance.database]
}
