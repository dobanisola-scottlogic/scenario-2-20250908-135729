# A security group for the containers we will run in Fargate.
# Three rules, allowing network traffic from a public facing load
# balancer, a private internal load balancer, and from other members
# of the security group.
resource "aws_security_group" "fargate_container_security_group" {
  name        = "${local.workspace}-fargate-container-security-group"
  description = "Access to the Fargate containers"
  vpc_id      = aws_vpc.vpc.id

  # HAC-116 - Remove this if not helpful
  # Attempting to fix ECS task error
  # https://stackoverflow.com/a/69915083
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.workspace}-fargate-container-security-group"
  }
}

resource "aws_security_group" "aws_db_security_group" {
  name        = "${local.workspace}-aws-db-security-group"
  description = "Security group for DB access"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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

resource "aws_security_group_rule" "ecs_to_db" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.fargate_container_security_group.id
  source_security_group_id = aws_security_group.aws_db_security_group.id
}

resource "aws_security_group_rule" "db_to_ecs" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.aws_db_security_group.id
  source_security_group_id = aws_security_group.fargate_container_security_group.id
}

resource "aws_security_group" "private_load_balancer_sg" {
  description = "Access to the private load balancer"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name = "${local.workspace}-private-load-balancer-security-group"
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_load_balancer_sg_ingress_rule" {
  cidr_ipv4         = "0.0.0.0/0" # Allow access from anywhere on the internet
  ip_protocol       = "-1"        # Use -1 to specify all protocols, allows traffic on all ports
  security_group_id = aws_security_group.public_load_balancer_sg.id

  tags = {
    Name = "${local.workspace}-public-load-balancer-security-group-ingress-rule"
  }
}

resource "aws_vpc_security_group_egress_rule" "public_load_balancer_sg_egress_rule" {
  cidr_ipv4         = var.vpc_cidr_block
  from_port         = 8080
  to_port           = 8080
  ip_protocol       = "tcp"
  security_group_id = aws_security_group.public_load_balancer_sg.id

  tags = {
    Name = "${local.workspace}-public-load-balancer-security-group-egress-rule"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_security_group_ingress_from_public_alb" {
  description                  = "Ingress from the public load balancer"
  ip_protocol                  = -1
  referenced_security_group_id = aws_security_group.public_load_balancer_sg.id
  security_group_id            = aws_security_group.fargate_container_security_group.id

  tags = {
    Name = "${local.workspace}-ecs-security-group-ingress-from-public-alb"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_security_group_ingress_from_self" {
  description                  = "Ingress from other containers in the same security group"
  ip_protocol                  = -1
  referenced_security_group_id = aws_security_group.fargate_container_security_group.id
  security_group_id            = aws_security_group.fargate_container_security_group.id

  tags = {
    Name = "${local.workspace}-ecs-security-group-ingress-from-self"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_security_group_ingress_from_fargate_container_security_group" {
  description                  = "Only accept traffic from a container in the fargate container security group"
  ip_protocol                  = -1
  referenced_security_group_id = aws_security_group.fargate_container_security_group.id
  security_group_id            = aws_security_group.private_load_balancer_sg.id

  tags = {
    Name = "${local.workspace}-ecs-security-group-ingress-from-fargate-container-security-group"
  }
}


##################################################################################
# Contestant resources
##################################################################################
# HAC-116 - Review these rules with respect to Cloud9 access;
# Shouldn't need to allow access from anywhere on the internet
resource "aws_security_group" "contestant_security_group" {
  description = "Security group for the hackathon contestant instances"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name = "${local.workspace}-contestant-security-group"
  }
}

resource "aws_vpc_security_group_ingress_rule" "contestant_security_group_ingress_rule_1" {
  cidr_ipv4         = "0.0.0.0/0" # Allow access from anywhere on the internet
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  security_group_id = aws_security_group.contestant_security_group.id

  tags = {
    Name = "${local.workspace}-contestant-security-group-ingress-rule-1"
  }
}

resource "aws_vpc_security_group_ingress_rule" "contestant_security_group_ingress_rule_2" {
  cidr_ipv4         = "0.0.0.0/0" # Allow access from anywhere on the internet
  ip_protocol       = "tcp"
  from_port         = 8081
  to_port           = 8081
  security_group_id = aws_security_group.contestant_security_group.id

  tags = {
    Name = "${local.workspace}-contestant-security-group-ingress-rule-2"
  }
}

resource "aws_vpc_security_group_egress_rule" "contestant_security_group_egress_rule" {
  security_group_id = aws_security_group.contestant_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 0
  ip_protocol = "tcp"
  to_port     = 65535

  tags = {
    Name = "${local.workspace}-contestant-security-group-egress-rule"
  }
}

