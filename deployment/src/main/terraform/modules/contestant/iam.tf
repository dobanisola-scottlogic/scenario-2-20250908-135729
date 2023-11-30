# Creates user
resource "aws_iam_user" "hackathon_contestant" {
  name          = "${var.workspace}-contestant"
  path          = "/"
  force_destroy = true

  tags = {
    Name = "${var.workspace}-contestant"
  }
}

# Creates login profile; AWS sets default password
resource "aws_iam_user_login_profile" "hackathon_contestant" {
  user = aws_iam_user.hackathon_contestant.name
}

# Wait for the aws_iam_user_login_profile resource to be fully created before
# attempting to execute the local-exec provisioner to update user's password.
# Though 'depends_on' controls the order in which resources are created, it
# doesn't necessarily guarantee that the resource has been completely created by
# the time Terraform executes the local-exec provisioner
resource "time_sleep" "wait_for_login_profile_creation" {
  create_duration = "60s"

  depends_on = [aws_iam_user_login_profile.hackathon_contestant]
}

# Update user's password to be easier to type (Password!1)
# Terraform offers limited support for password creation via the
# aws_iam_user_login_profile resource so using local exec to run AWS CLI command
resource "null_resource" "update_hackathon_contestant_password" {

  provisioner "local-exec" {
    # Pass our key credentials as environment variables to ensure
    # that the appropriate credentials are used, then explicitly
    # assume the appropriate hackathon-deployer-role
    environment = {
      AWS_ACCESS_KEY_ID     = var.aws_access_key
      AWS_SECRET_ACCESS_KEY = var.aws_secret_key
      AWS_ROLE              = var.aws_role_arn
      WORKSPACE             = var.workspace
      CONTESTANT_NAME       = aws_iam_user.hackathon_contestant.name
      CONTESTANT_PASSWORD   = var.hackathon_contestant_password
    }
    interpreter = ["bash", "-c"]
    command     = <<-EOT
      eval $(aws sts assume-role --role-arn $AWS_ROLE \
        --role-session-name=$WORKSPACE-role-session \
        --query "join('', ['export AWS_ACCESS_KEY_ID=', Credentials.AccessKeyId, ' AWS_SECRET_ACCESS_KEY=', Credentials.SecretAccessKey, ' AWS_SESSION_TOKEN=', Credentials.SessionToken])" \
        --output text)
      aws iam update-login-profile --user-name $CONTESTANT_NAME --password $CONTESTANT_PASSWORD
    EOT
  }

  depends_on = [time_sleep.wait_for_login_profile_creation]
}

# Needed to allow IAM user to log in to Cloud9 IDE
resource "aws_iam_user_policy" "cloud_9_policy" {
  name = "AWSCloud9EnvironmentMember"
  user = aws_iam_user.hackathon_contestant.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Action" : [
          "cloud9:GetUserSettings",
          "cloud9:UpdateUserSettings",
          "iam:GetUser",
          "iam:ListUsers"
        ],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "cloud9:DescribeEnvironmentMemberships"
        ],
        "Resource" : [
          "*"
        ],
        "Condition" : {
          "Null" : {
            "cloud9:UserArn" : "true",
            "cloud9:EnvironmentId" : "true"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : "ssm:StartSession",
        "Resource" : "arn:aws:ec2:*:*:instance/*",
        "Condition" : {
          "StringLike" : {
            "ssm:resourceTag/aws:cloud9:environment" : "*"
          },
          "StringEquals" : {
            "aws:CalledViaFirst" : "cloud9.amazonaws.com"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:StartSession"
        ],
        "Resource" : [
          "arn:aws:ssm:*:*:document/*"
        ]
      }
    ]
  })
}

# Define an IAM policy allowing read access to S3 contestant bucket and attach it to the AWSCloud9SSMAccessRole
# Grants Cloud9-managed EC2 instances permissions to sync contestant files from the S3 bucket
resource "aws_iam_policy" "s3_contestant_bucket_read_policy" {
  name        = "${var.workspace}-s3-contestant-bucket-read-policy"
  description = "Policy to read from S3 contestant bucket"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject",
          "s3:ListBucket",
        ],
        "Resource" : [
          "arn:aws:s3:::${aws_s3_bucket.contestant_bucket.bucket}/*",
          "arn:aws:s3:::${aws_s3_bucket.contestant_bucket.bucket}"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_contestant_bucket_read_policy_attachment" {
  policy_arn = aws_iam_policy.s3_contestant_bucket_read_policy.arn
  role       = "AWSCloud9SSMAccessRole"
}

resource "aws_iam_policy" "ec2_start_stop_policy" {
  name = "${var.workspace}-ec2-start-stop-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:DescribeInstances",
          "ec2:StartInstances",
          "ec2:StopInstances"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role" "ec2_start_stop_role" {
  name = "${var.workspace}-ec2-start-stop-role"
  path = "/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "attach" {
  name       = "${var.workspace}-ec2-start-stop-role-policy-attachment"
  roles      = [aws_iam_role.ec2_start_stop_role.name]
  policy_arn = aws_iam_policy.ec2_start_stop_policy.arn
}
