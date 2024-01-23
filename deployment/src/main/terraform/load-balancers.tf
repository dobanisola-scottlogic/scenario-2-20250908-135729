# A public facing load balancer, this is used for accepting traffic from the public
# internet and directing it to public facing microservices
resource "aws_lb" "public_load_balancer" {
  enable_deletion_protection = false
  idle_timeout               = 600
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

# By default, block HTTPS access to the load balancer's auto-generated URL
resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.public_load_balancer.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Unsupported host domain name"
      status_code  = "403"
    }
  }
}

# Redirect HTTPS requests without a specific path to the application
resource "aws_lb_listener_rule" "https_default_redirect" {
  listener_arn = aws_lb_listener.https_listener.arn

  condition {
    host_header {
      values = ["${local.host_name}.${var.domain_name}"]
    }
  }

  condition {
    path_pattern {
      values = ["/"]
    }
  }
  action {
    type = "redirect"
    redirect {
      path        = "/application"
      status_code = "HTTP_301"
    }
  }
}

# Forward HTTPS traffic to the target group when using the correct domain name
resource "aws_lb_listener_rule" "https_forward_alias" {
  listener_arn = aws_lb_listener.https_listener.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_service_target_group.arn
  }

  condition {
    host_header {
      values = ["${local.host_name}.${var.domain_name}"]
    }
  }

  condition {
    path_pattern {
      values = ["/application*", "/admin/healthcheck"]
    }

  }

  tags = {
    Name = "${local.workspace}-https-forward-alias"
  }
}

# By default, block HTTP access to the load balancer's auto-generated URL
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.public_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Unsupported host domain name"
      status_code  = "403"
    }
  }
}

# Redirect HTTP traffic to HTTPS when using the correct domain name
resource "aws_lb_listener_rule" "http_redirect_alias" {
  listener_arn = aws_lb_listener.http_listener.arn

  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    host_header {
      values = ["${local.host_name}.${var.domain_name}"]
    }
  }

  tags = {
    Name = "${local.workspace}-http-redirect-alias"
  }
}

# Forward contestant connections on port 8080 to the target group
resource "aws_lb_listener" "contestant_listener" {
  load_balancer_arn = aws_lb.public_load_balancer.arn
  port              = 8080
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_service_target_group.arn
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
