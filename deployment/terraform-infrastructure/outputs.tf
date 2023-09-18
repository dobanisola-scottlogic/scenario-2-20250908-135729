# HAC-116 - These outputs were previously used by the CLI script. Which are still useful?
# external_url: definitely needed
output "vpc_arn" {
  description = "The ARN of the VPC in which this stack is deployed"
  value       = aws_vpc.vpc.arn
}

output "public_subnet_one" {
  description = "Public subnet one"
  value       = aws_subnet.public_subnets[0].id
}

output "public_subnet_two" {
  description = "Public subnet two"
  value       = aws_subnet.public_subnets[1].id
}

output "private_subnet_one" {
  description = "Private subnet one"
  value       = aws_subnet.private_subnets[0].id
}

output "private_subnet_two" {
  description = "Private subnet two"
  value       = aws_subnet.private_subnets[1].id
}

output "fargate_container_security_group" {
  description = "A security group used to allow Fargate containers to receive traffic"
  value       = aws_security_group.fargate_container_security_group.arn
}

output "external_url" {
  description = "Public DNS for the external application load balancer"
  value       = "http://${aws_lb.public_load_balancer.dns_name}"
}

output "public_listener_arn" {
  description = "The ARN of the public load balancer's Listener"
  value       = aws_lb_listener.public_load_balancer_listener.arn
}

output "internal_url" {
  description = "The URL of the private load balancer"
  value       = "http://${aws_lb.private_load_balancer.dns_name}"
}

output "private_listener_arn" {
  description = "The ARN of the private load balancer's Listener"
  value       = aws_lb_listener.private_load_balancer_listener.arn
}

output "ecs_role_arn" {
  description = "The ARN of the Manage Resources IAM role"
  value       = aws_iam_role.ecs_manage_resources_iam_role.arn
}

output "ecs_task_execution_role_arn" {
  description = "The ARN of the Task Execution IAM role"
  value       = aws_iam_role.ecs_task_execution_iam_role.arn
}

output "log_group_arn" {
  description = "A CloudWatch log group that can be logged to"
  value       = aws_cloudwatch_log_group.cloudwatch_logs_group.arn
}
