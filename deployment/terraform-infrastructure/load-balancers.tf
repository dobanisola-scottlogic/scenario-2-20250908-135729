# A public facing load balancer, this is used for accepting traffic from the public
# internet and directing it to public facing microservices
resource "aws_lb" "public_load_balancer" {
  enable_deletion_protection = false
  idle_timeout               = 30
  internal                   = false
  load_balancer_type         = "application"
  name                       = "${local.workspace}-public-load-balancer"
  security_groups            = [aws_security_group.public_load_balancer_sg.id]
  subnets                    = aws_subnet.public_subnets[*].id

  tags = {
    Name = "${local.workspace}-public-load-balancer"
  }
}

resource "aws_lb_target_group" "public_load_balancer_target_group" {
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id

  health_check {
    enabled           = true
    healthy_threshold = 2
    interval          = 6
    path              = "/"
    protocol          = "HTTP"
    timeout           = 5
  }

  tags = {
    Name = "${local.workspace}-public-load-balancer-target-group"
  }
}

resource "aws_lb_listener" "public_load_balancer_listener" {
  load_balancer_arn = aws_lb.public_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.public_load_balancer_target_group.arn
  }

  tags = {
    Name = "${local.workspace}-public-load-balancer-listener"
  }
}

# Private load balancer, hosted in private subnets, that only
# accepts traffic from other containers in the Fargate cluster, and is
# intended for private services that should not be accessed directly
# by the public.
# HAC-116 - Do we need both public and private load balancers?
resource "aws_lb" "private_load_balancer" {
  enable_deletion_protection = false
  idle_timeout               = 30
  internal                   = true
  load_balancer_type         = "application"
  name                       = "${local.workspace}-private-load-balancer"
  security_groups            = [aws_security_group.private_load_balancer_sg.id]
  subnets                    = aws_subnet.private_subnets[*].id

  tags = {
    Name = "${local.workspace}-private-load-balancer"
  }
}

resource "aws_lb_target_group" "private_load_balancer_target_group" {
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id

  health_check {
    enabled           = true
    healthy_threshold = 2
    interval          = 6
    path              = "/"
    protocol          = "HTTP"
    timeout           = 5
  }

  tags = {
    Name = "${local.workspace}-private-load-balancer-target-group"
  }
}

resource "aws_lb_listener" "private_load_balancer_listener" {
  load_balancer_arn = aws_lb.private_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.private_load_balancer_target_group.arn
  }

  tags = {
    Name = "${local.workspace}-private-load-balancer-listener"
  }
}

# A target group. This is used for keeping track of all the tasks, and
# what IP addresses / port numbers they have. You can query it yourself,
# to use the addresses yourself, but most often this target group is just
# connected to an application load balancer, or network load balancer, so
# it can automatically distribute traffic across all the targets.
resource "aws_lb_target_group" "ecs_service_target_group" {
  name        = local.server_service_name
  port        = var.server_http_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  # HAC-116 - Review health_check parameters
  health_check {
    healthy_threshold   = 2
    interval            = 300
    path                = "/admin/healthcheck"
    protocol            = "HTTP"
    port                = "8080"
    timeout             = 120
    unhealthy_threshold = 10
  }

  tags = {
    Name = "${local.workspace}-ecs-service-target-group"
  }
}

# Create a rule on the public load balancer for routing application traffic 
# to the ECS service target group
resource "aws_lb_listener_rule" "application_load_balancer_rule" {
  listener_arn = aws_lb_listener.public_load_balancer_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_service_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/application*", "/admin/healthcheck"]
    }
  }
}
