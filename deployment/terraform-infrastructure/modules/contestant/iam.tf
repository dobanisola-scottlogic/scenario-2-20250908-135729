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
