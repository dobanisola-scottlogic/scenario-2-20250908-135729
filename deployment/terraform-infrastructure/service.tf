# ECS (Elastic Container Service) Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project}-ecs-cluster"

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.cloudwatch_logs_group.name
      }
    }
  }

  tags = {
    Name = "${var.project}-ecs-cluster"
  }
}

# The task definition. This is a simple metadata description of what
# container to run, and what resource requirements it has.
resource "aws_ecs_task_definition" "task_definition" {
  cpu                      = var.server_container_cpu
  execution_role_arn       = aws_iam_role.ecs_task_execution_iam_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_iam_role.arn
  family                   = var.server_service_name
  memory                   = var.server_container_memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions = jsonencode([
    {
      cpu    = tonumber(var.server_container_cpu)
      image  = var.server_image
      memory = tonumber(var.server_container_memory)
      name   = var.server_service_name
      portMappings = [
        {
          containerPort = tonumber(var.server_http_port)
        }
      ]
      environment = [
        {
          name  = "DB_NAME"
          value = var.db_name
        },
        {
          name  = "DB_TYPE"
          value = var.db_type
        },
        {
          name  = "DB_HOST"
          value = aws_db_instance.database.address
        },
        {
          name  = "DB_PORT"
          value = tostring(aws_db_instance.database.port)
        },
        {
          name  = "DB_USER"
          value = var.db_user
        },
        {
          name  = "DB_PASSWORD"
          value = var.db_password
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.cloudwatch_logs_group.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = var.server_service_name
        }
      }
    }
  ])

  tags = {
    Name = "${var.project}-ecs-task-definition"
  }
}


# The service. The service is a resource which allows you to run multiple
# copies of a type of task, and gather up their logs and metrics, as well
# as monitor the number of running tasks and replace any that have crashed
resource "aws_ecs_service" "service" {
  cluster                            = aws_ecs_cluster.ecs_cluster.id
  depends_on                         = [aws_iam_policy.ecs_task_execution_iam_role_policy, aws_db_instance.database]
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  desired_count                      = 1
  launch_type                        = "FARGATE"
  name                               = var.server_service_name
  task_definition                    = aws_ecs_task_definition.task_definition.arn

  load_balancer {
    container_name   = var.server_service_name
    container_port   = var.server_http_port
    target_group_arn = aws_lb_target_group.ecs_service_target_group.arn
  }

  # HAC-116 - Review network configuration
  # - Public IP: useful(?) for testing, shouldn't be needed
  # - Subnets: should it be on the public subnets?
  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.fargate_container_security_group.id]
    subnets          = aws_subnet.public_subnets[*].id
  }

  tags = {
    Name = "${var.project}-ecs-service"
  }
}
