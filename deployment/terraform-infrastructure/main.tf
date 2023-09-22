module "contestant" {
  source = "./modules/contestant"

  aws_region       = var.aws_region
  public_subnet_id = aws_subnet.public_subnets[0].id
  workspace        = local.workspace
}
