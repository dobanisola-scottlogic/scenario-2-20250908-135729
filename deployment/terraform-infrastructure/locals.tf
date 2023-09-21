locals {
  workspace           = terraform.workspace == "default" ? var.project : lower(replace(terraform.workspace, "-", ""))
  server_service_name = "${local.workspace}-server"
  db_name             = local.workspace
}
