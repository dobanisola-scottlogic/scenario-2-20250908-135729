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
    command = "aws iam update-login-profile --user-name ${aws_iam_user.hackathon_contestant.name} --password ${var.hackathon_contestant_password}"
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
