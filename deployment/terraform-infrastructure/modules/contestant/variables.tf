variable "aws_region" {
  type        = string
  description = "Region for AWS Resources"
}

variable "public_subnet_id" {
  type        = string
  description = "The ID of the public subnet to use for the contestant"
}

variable "workspace" {
  type        = string
  description = "The name of the workspace to use for this deployment"
}

variable "contestants" {
  type        = list(string)
  description = "Available contestant templates"
  default     = ["python", "java"]
}
