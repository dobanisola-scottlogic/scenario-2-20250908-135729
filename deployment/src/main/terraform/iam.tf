################################################################################
# Server IAM roles
################################################################################

# This is an IAM role which authorizes ECS to manage resources on your
# account on your behalf, such as updating your load balancer with the
# details of where your containers are, so that traffic can reach your
# containers.
resource "aws_iam_role" "ecs_manage_resources_iam_role" {
  name = "${local.workspace}-ecs-manage-resources-iam-role"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs.amazonaws.com"
        }
      }
    ]
  })
  force_detach_policies = true
  managed_policy_arns   = [aws_iam_policy.ecs_manage_resources_iam_role_policy.arn]
  path                  = "/"

  tags = {
    Name = "${local.workspace}-ecs-manage-resources-iam-role"
  }
}

resource "aws_iam_policy" "ecs_manage_resources_iam_role_policy" {
  name = "${local.workspace}-ecs-manage-resources-iam-role-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          # Rules which allow ECS to attach network interfaces to instances
          # on your behalf in order for AWS VPC networking mode to work right
          "ec2:AttachNetworkInterface",
          "ec2:CreateNetworkInterface",
          "ec2:CreateNetworkInterfacePermission",
          "ec2:DeleteNetworkInterface",
          "ec2:DeleteNetworkInterfacePermission",
          "ec2:Describe*",
          "ec2:DetachNetworkInterface",

          # Rules which allow ECS to update load balancers on your behalf
          # with the information about how to send traffic to your containers
          "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
          "elasticloadbalancing:DeregisterTargets",
          "elasticloadbalancing:Describe*",
          "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
          "elasticloadbalancing:RegisterTargets"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })

  tags = {
    Name = "${local.workspace}-ecs-manage-resources-iam-role-policy"
  }
}

# This is a role which is used by the ECS tasks
resource "aws_iam_role" "ecs_task_execution_iam_role" {
  name = "${local.workspace}-ecs-task-execution-iam-role"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Sid = ""
      }
    ]
    Version = "2012-10-17"
  })

  # HAC-116 - Are these fields required?
  # force_detach_policies = true
  # managed_policy_arns   = [aws_iam_policy.ecs_task_execution_iam_role_policy.arn]
  # path                  = "/"

  tags = {
    Name = "${local.workspace}-ecs-task-execution-iam-role"
  }
}

resource "aws_iam_policy" "ecs_task_execution_iam_role_policy" {
  name = "${local.workspace}-ecs-task-execution-iam-role-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          # Allow the ECS Tasks to download images from ECR
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",

          # Allow the ECS tasks to upload logs to CloudWatch
          "logs:CreateLogStream",
          "logs:PutLogEvents",

          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })

  tags = {
    Name = "${local.workspace}-ecs-task-execution-iam-role-policy"
  }
}

resource "aws_iam_policy_attachment" "attach" {
  name       = "${local.workspace}-ecs-task-execution-iam-role-policy-attachment"
  roles      = [aws_iam_role.ecs_task_execution_iam_role.name]
  policy_arn = aws_iam_policy.ecs_task_execution_iam_role_policy.arn
}

resource "aws_iam_role" "ecr_read_only_role" {
  name = "${local.workspace}-ecr-read-only-role"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Sid = "ECRReadOnly"
      }
    ]
    Version = "2012-10-17"
  })
  force_detach_policies = true
  managed_policy_arns   = [aws_iam_policy.ecr_readonly_iam_role_policy.arn]
  path                  = "/"

  tags = {
    Name = "${local.workspace}-ecr-read-only-role"
  }
}

resource "aws_iam_policy" "ecr_readonly_iam_role_policy" {
  name = "${local.workspace}-ecr-read-only-iam-role-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "ecr:GetAuthorizationToken",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetLifecyclePolicy",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetRepositoryPolicy",
          "ecr:ListImages",
          "ecr:ListTagsForResource"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })

  tags = {
    Name = "${local.workspace}-ecr-read-only-iam-role-policy"
  }
}

################################################################################
# Contestant IAM roles
################################################################################

resource "aws_iam_instance_profile" "contestant_instance_profile" {
  name = "${local.workspace}-contestant-instance-profile"
  role = aws_iam_role.ecr_read_only_role.name

  tags = {
    Name = "${local.workspace}-contestant-instance-profile"
  }
}

################################################################################
# Server user definitions
################################################################################

resource "aws_iam_user" "server_user" {
  name = "${local.workspace}-server-user"
  path = "/"

  tags = {
    Name = "${local.workspace}-server-user"
  }
}

resource "aws_iam_user_policy" "server_user_policy" {
  name = "${local.workspace}-server-user-policy"
  user = aws_iam_user.server_user.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cloud9:ListEnvironments",
          "cloud9:DescribeEnvironments"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_access_key" "server_user_access_key" {
  user = aws_iam_user.server_user.name
}
