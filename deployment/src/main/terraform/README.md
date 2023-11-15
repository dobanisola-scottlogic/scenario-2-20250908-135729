## Useful Terraform Commands

### General Terraform commands

- `terraform init` is used to initialise the Terraform backend
- `terraform plan` will show you what changes Terraform intends to do
- `terraform apply` will run the Terraform code and make any changes you've
  added. It will ask you to confirm by typing `yes`
- `terraform destroy` will pull down all resources that are provisioned with
  your code. Will ask you to confirm by typing `yes`

### Workspace specific commands:

- `terraform workspace new <workspace_name>` create a new workspace
- `terraform workspace select <workspace_name>` change the active workspace
- `terraform workspace list` list all the current workspaces
- `terraform workspace show` show the name of the current workspace
- `terraform workspace delete <workspace_name>` delete the workspace

Our main AWS resources should be provisioned in the `default` workspace. **Only
use this workspace for changes that you want to be available to all and
sundry**. Any changes that are in-progress (i.e. being worked on as part of a
ticket) should be done in a separate workspace. This allows multiple people to
work on the Terraform files simultaneously, each having their own resources with
their own state. Once the changes are complete, and the PR has been merged, they
can be deployed in the default workspace.

Any new resources that are defined in the Terraform files should be named using
the workspace as part of their resource name. This ensures that resources in
different workspaces have unique names.

For example:

```hcl
resource "aws_lb" "public_load_balancer" {
  name = "${local.workspace}-public-load-balancer"
  # ...
}
```

When you need to deploy resources using Terraform as part of a ticket, you
should first create an appropriate workspace. For example, if you are working on
ticket **HAC-125**, you should create a workspace called `hac125`:

```bash
terraform workspace new hac125
```

**Note that the workspace name should be lowercase with no special characters, since it will be used as part of resource names, which in some cases only allow lowercase letters and numbers.**

Make your required changes to the Terraform files, and use `terraform plan`,
`terraform apply` and `terraform destroy` as usual. When you are finished with
the ticket, and have ensured that your resources have been destroyed, you can
delete the workspace:

```bash
terraform workspace delete hac125
```
---
### N.B. Remember to destroy your resources when they are not needed, since this is a complete copy of the project infrastructure so could incur significant costs if left running.
---