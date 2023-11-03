variable "aws_region" {
  type        = string
  description = "Region for AWS Resources"
}

variable "contestants" {
  type        = list(string)
  description = "Available contestant templates"
  default     = ["python", "java"]
}

variable "hackathon_contestant_password" {
  type        = string
  description = "Password to be set on the hackathon_contestant user"
  default     = "Password!1"
}

variable "public_subnet_id" {
  type        = string
  description = "The ID of the public subnet to use for the contestant"
}

variable "team_count" {
  type        = number
  description = "The number of Cloud9 environments to create (number of teams required)"
}

variable "workspace" {
  type        = string
  description = "The name of the workspace to use for this deployment"
}

variable "game_server_host" {
  type        = string
  description = "The hostname of the game server (usually the public load balancer)"
}

variable "game_server_port" {
  type        = number
  description = "The port of the game server (usually 80)"
}

variable "start_schedule" {
  type        = string
  description = "The schedule expression (UTC) for when Cloud9 instances should be started"
}

variable "stop_schedule" {
  type        = string
  description = "The schedule expression (UTC) for when Cloud9 instances should be stopped"
}
