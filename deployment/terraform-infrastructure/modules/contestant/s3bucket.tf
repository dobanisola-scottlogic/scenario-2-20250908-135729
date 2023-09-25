locals {
  python_contestant_tgz = "${path.root}/../../python-contestant/build/python-contestant.tgz"
  java_contestant_tgz   = "${path.root}/../../java-contestant/build/java-contestant.tgz"
}

# Create S3 bucket for Python contestant
resource "aws_s3_bucket" "python_contestant_bucket" {
  bucket = "${var.workspace}-python-contestant-bucket"

  tags = {
    Name = "${var.workspace}-python-contestant-bucket"
  }
}

# Python contestant bucket ownership controls
# HAC-121 might need to revise these settings
resource "aws_s3_bucket_ownership_controls" "python_contestant_bucket_ownership" {
  bucket = aws_s3_bucket.python_contestant_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "python_contestant_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.python_contestant_bucket_ownership]
  bucket     = aws_s3_bucket.python_contestant_bucket.id
  acl        = "private"
}

# Populate the S3 bucket with the Python contestant archive
resource "aws_s3_object" "python_contestant_bucket_object" {
  bucket = aws_s3_bucket.python_contestant_bucket.id
  key    = "python-contestant"
  source = local.python_contestant_tgz
  etag   = filemd5("${local.python_contestant_tgz}")
}

# Create S3 bucket for Java contestant
resource "aws_s3_bucket" "java_contestant_bucket" {
  bucket = "${var.workspace}-java-contestant-bucket"

  tags = {
    Name = "${var.workspace}-java-contestant-bucket"
  }
}

# Populate the S3 bucket with the Java contestant archive
resource "aws_s3_object" "java_contestant_bucket_object" {
  bucket = aws_s3_bucket.java_contestant_bucket.id
  key    = "java-contestant"
  source = local.java_contestant_tgz
  etag   = filemd5("${local.java_contestant_tgz}")
}


# Java contestant bucket ownership controls
# HAC-121 might need to revise these settings
resource "aws_s3_bucket_ownership_controls" "java_contestant_bucket_ownership" {
  bucket = aws_s3_bucket.java_contestant_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "java_contestant_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.java_contestant_bucket_ownership]
  bucket     = aws_s3_bucket.java_contestant_bucket.id
  acl        = "private"
}