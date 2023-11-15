variable "aws_region" {
  type        = string
  description = "Region for AWS Resources"
}

variable "cloudwatch_log_group_name" {
  type        = string
  description = "The name of the CloudWatch log group"
}

variable "db_name" {
  type        = string
  description = "Name of the PostgreSQL database"
}

variable "ecs_cluster_name" {
  type        = string
  description = "Name of the ECS cluster"
}

variable "ecs_service_name" {
  type        = string
  description = "Name of the ECS service"
}

variable "sorted_cloud9_ec2_instance_ids" {
  type        = map(string)
  description = "Map of Cloud9 EC2 instance IDs sorted by ascending padded instance number"
}

variable "workspace" {
  type        = string
  description = "The name of the workspace to use for this deployment"
}
