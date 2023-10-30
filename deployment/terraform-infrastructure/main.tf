module "contestant" {
  source = "./modules/contestant"

  aws_region       = var.aws_region
  public_subnet_id = aws_subnet.public_subnets[0].id
  team_count       = var.team_count
  workspace        = local.workspace
  game_server_host = aws_lb.public_load_balancer.dns_name
  game_server_port = aws_lb_listener.public_load_balancer_listener.port
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
