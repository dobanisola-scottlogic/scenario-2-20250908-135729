# Create S3 bucket for contestant archives
resource "aws_s3_bucket" "contestant_bucket" {
  bucket = "${var.workspace}-contestant-bucket"

  tags = {
    Name = "${var.workspace}-contestant-bucket"
  }
}

# Contestant bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "contestant_bucket_ownership" {
  bucket = aws_s3_bucket.contestant_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "contestant_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.contestant_bucket_ownership]
  bucket     = aws_s3_bucket.contestant_bucket.id
  acl        = "private"
}

# Populate the S3 bucket with the each of the contestant archives
resource "aws_s3_object" "contestant_bucket_objects" {
  for_each = {
    for c in var.contestants : c => {
      name = "${c}-contestant.tgz"
      path = "${path.root}/../../../../${c}-contestant/build/${c}-contestant.tgz"
    }
  }
  bucket      = aws_s3_bucket.contestant_bucket.id
  key         = each.value.name
  source      = each.value.path
  source_hash = filemd5(each.value.path)
}
