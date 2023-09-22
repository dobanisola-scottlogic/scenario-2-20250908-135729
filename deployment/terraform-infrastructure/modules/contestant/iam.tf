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
