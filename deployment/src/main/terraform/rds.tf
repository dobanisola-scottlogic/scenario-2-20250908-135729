resource "aws_db_subnet_group" "db_subnet_group" {
  description = "VPC subnets for the database"
  name        = "${local.workspace}-database-subnet-group"
  subnet_ids  = aws_subnet.private_subnets[*].id

  tags = {
    Name = "${local.workspace}-database-subnet-group"
  }
}

# engine_version defaults to latest
resource "aws_db_instance" "database" {
  allocated_storage          = 5
  auto_minor_version_upgrade = true
  db_name                    = local.db_name
  db_subnet_group_name       = aws_db_subnet_group.db_subnet_group.name
  engine                     = var.db_type
  identifier                 = local.db_name
  instance_class             = "db.t3.small"
  password                   = var.db_password
  skip_final_snapshot        = true
  username                   = var.db_user
  vpc_security_group_ids     = [aws_security_group.aws_db_security_group.id]

  tags = {
    Name = "${local.workspace}-database"
  }
}
