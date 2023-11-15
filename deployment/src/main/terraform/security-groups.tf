# A security group for the containers we will run in Fargate.
resource "aws_security_group" "fargate_container_security_group" {
  name        = "${local.workspace}-fargate-container-security-group"
  description = "Access to the Fargate containers"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name = "${local.workspace}-fargate-container-security-group"
  }
}

resource "aws_vpc_security_group_egress_rule" "fargate_to_ecr" {
  security_group_id = aws_security_group.fargate_container_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"

  description = "Allows Fargate container to access ECR to acquire images"

  tags = {
    Name = "${local.workspace}-fargate-to-ecr-egress-rule"
  }
}

resource "aws_security_group" "aws_db_security_group" {
  name        = "${local.workspace}-aws-db-security-group"
  description = "Security group for DB access"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name = "${local.workspace}-aws-db-security-group"
  }
}

resource "aws_security_group" "public_load_balancer_sg" {
  description = "Access to the public facing load balancer"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name = "${local.workspace}-public-load-balancer-security-group"
  }
}

resource "aws_vpc_security_group_egress_rule" "ecs_to_db" {
  security_group_id            = aws_security_group.fargate_container_security_group.id
  referenced_security_group_id = aws_security_group.aws_db_security_group.id

  from_port   = 5432
  to_port     = 5432
  ip_protocol = "tcp"

  description = "Allows Fargate container to the database"

  tags = {
    Name = "${local.workspace}-fargate-to-db-egress-rule"
  }
}

resource "aws_vpc_security_group_ingress_rule" "db_to_ecs" {
  security_group_id            = aws_security_group.aws_db_security_group.id
  referenced_security_group_id = aws_security_group.fargate_container_security_group.id

  from_port   = 5432
  to_port     = 5432
  ip_protocol = "tcp"

  description = "Allows database to be accessed by Fargate container"

  tags = {
    Name = "${local.workspace}-db-from-fargate-ingress-rule"
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_load_balancer_sg_ingress_rule" {
  security_group_id = aws_security_group.public_load_balancer_sg.id

  cidr_ipv4   = "0.0.0.0/0" # Allow access from anywhere on the internet
  ip_protocol = "-1"        # Use -1 to specify all protocols, allows traffic on all ports

  tags = {
    Name = "${local.workspace}-public-load-balancer-security-group-ingress-rule"
  }
}

resource "aws_vpc_security_group_egress_rule" "public_load_balancer_sg_egress_rule" {
  security_group_id = aws_security_group.public_load_balancer_sg.id

  cidr_ipv4   = var.vpc_cidr_block
  from_port   = 8080
  to_port     = 8080
  ip_protocol = "tcp"

  tags = {
    Name = "${local.workspace}-public-load-balancer-security-group-egress-rule"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_security_group_ingress_from_public_alb" {
  security_group_id            = aws_security_group.fargate_container_security_group.id
  referenced_security_group_id = aws_security_group.public_load_balancer_sg.id

  description = "Ingress from the public load balancer"
  ip_protocol = -1

  tags = {
    Name = "${local.workspace}-ecs-security-group-ingress-from-public-alb"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_security_group_ingress_from_self" {
  security_group_id            = aws_security_group.fargate_container_security_group.id
  referenced_security_group_id = aws_security_group.fargate_container_security_group.id

  description = "Ingress from other containers in the same security group"
  ip_protocol = -1

  tags = {
    Name = "${local.workspace}-ecs-security-group-ingress-from-self"
  }
}
