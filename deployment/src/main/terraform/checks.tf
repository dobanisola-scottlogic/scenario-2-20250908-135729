check "workspace_check" {
  assert {
    condition     = terraform.workspace != "default" || var.allow_default_workspace
    error_message = "[Error] Deployment to the default workspace is not enabled. Please select a custom workspace."
  }
}
