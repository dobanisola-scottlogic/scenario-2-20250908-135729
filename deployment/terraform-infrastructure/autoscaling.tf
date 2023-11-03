resource "aws_appautoscaling_target" "ecs_scaling_target" {
  max_capacity       = 1
  min_capacity       = 0
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${local.server_service_name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  depends_on         = [aws_ecs_service.service]
}

resource "aws_appautoscaling_scheduled_action" "ecs_scaling_action_start" {
  name               = "${local.workspace}-ecs-scaling-action-start"
  service_namespace  = aws_appautoscaling_target.ecs_scaling_target.service_namespace
  resource_id        = aws_appautoscaling_target.ecs_scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_scaling_target.scalable_dimension
  scalable_target_action {
    min_capacity = 1
    max_capacity = 1
  }
  schedule = "cron(${local.start_schedule})"
}

resource "aws_appautoscaling_scheduled_action" "ecs_scaling_action_stop" {
  name               = "${local.workspace}-ecs-scaling-action-stop"
  service_namespace  = aws_appautoscaling_target.ecs_scaling_target.service_namespace
  resource_id        = aws_appautoscaling_target.ecs_scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_scaling_target.scalable_dimension
  scalable_target_action {
    min_capacity = 0
    max_capacity = 0
  }
  schedule = "cron(${local.stop_schedule})"
}
