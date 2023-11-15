terraform {
  backend "s3" {
    bucket         = "hackathon-tfstate"
    key            = "global/s3/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "hackathon_state_locks"
    encrypt        = true
  }
}
