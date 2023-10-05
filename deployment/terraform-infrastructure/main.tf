module "contestant" {
  source = "./modules/contestant"

  aws_region       = var.aws_region
  public_subnet_id = aws_subnet.public_subnets[0].id
  team_count       = var.team_count
  workspace        = local.workspace
  game_server_host = aws_lb.public_load_balancer.dns_name
  game_server_port = aws_lb_listener.public_load_balancer_listener.port
}
