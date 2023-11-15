##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region

  default_tags {
    tags = {
      company     = var.company
      environment = var.environment
      project     = var.project
      e-code      = "E001682" # Project E-Code (Kimble)
    }
  }
}
