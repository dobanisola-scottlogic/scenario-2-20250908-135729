##################################################################################
# VARIABLES
##################################################################################

variable "aws_region" {
  type        = string
  description = "Region for AWS Resources"
  default     = "eu-west-2"
}

variable "aws_access_key" {
  type        = string
  description = "AWS access key"
  sensitive   = true
}

variable "aws_secret_key" {
  type        = string
  description = "AWS secret key"
  sensitive   = true
}

variable "aws_role_arn" {
  type        = string
  description = "AWS role that provides required permissions"
  sensitive   = true
  default     = "arn:aws:iam::033692923448:role/hackathon-deployer-role"
}

variable "company" {
  type        = string
  description = "Company name for resource tagging"
  default     = "Scott Logic"
}

variable "environment" {
  type        = string
  description = "Environment for deployment"
  default     = "development"
}

variable "project" {
  type        = string
  description = "Project name for resource tagging"
  default     = "Hackathon"
}

variable "server_http_port" {
  description = "The port used by the server application, to which the load balancer will route traffic from the publicly exposed port (i.e. port 80)"
  type        = string
  default     = 8080
}

variable "server_container_cpu" {
  description = "How much CPU to give the server container. 1024 is 1 CPU"
  type        = string
  default     = 4096
}

variable "server_container_memory" {
  description = "How much memory in megabytes to give the server container"
  type        = string
  default     = 8192
}

variable "db_type" {
  description = "The type of the database"
  type        = string
  default     = "postgres"
}

variable "db_user" {
  description = "The username to run the database as"
  type        = string
  default     = "hackathon"
}

variable "db_password" {
  description = "The password for the database user"
  type        = string
  default     = "hackathon" # TODO: HAC-113 Remove password from Terraform configuration
}

variable "server_image" {
  description = "The fully-qualified name of the server Docker image to use (e.g. 033692923448.dkr.ecr.eu-west-2.amazonaws.com/hackathon-gameserver:latest)"
  type        = string
  default     = "033692923448.dkr.ecr.eu-west-2.amazonaws.com/hackathon-gameserver:latest"
}

variable "team_count" {
  type        = number
  description = "The number of Cloud9 environments to create (number of teams required)"
  default     = 3
}

variable "vpc_public_subnet_count" {
  description = "How many public subnets to create in the VPC"
  type        = number
  default     = 2
}

variable "vpc_cidr_block" {
  description = "The CIDR block to use for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "allow_default_workspace" {
  description = "Enforce deployment to the default workspace being an explicit choice"
  type        = bool
  default     = false
}

variable "start_hour" {
  description = "The UTC hour of the day by which resources should be available"
  type        = number
  default     = 8
}

variable "stop_hour" {
  description = "The UTC hour of the day after which resources will not be available"
  type        = number
  default     = 18
}
