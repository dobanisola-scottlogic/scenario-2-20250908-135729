# VPC in which containers will be networked.
# It has two public subnets, and two private subnets.
# We distribute the subnets across the first two available subnets
# for the region, for high availability.
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project}-vpc"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# Two public subnets, where containers can have public IP addresses
resource "aws_subnet" "public_subnets" {
  count                   = var.vpc_public_subnet_count
  cidr_block              = cidrsubnet(var.vpc_cidr_block, 8, count.index)
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "${var.project}-public-subnet-${count.index}"
  }
}


# Two private subnets where containers will only have private
# IP addresses, and will only be reachable by other members of the VPC
resource "aws_subnet" "private_subnets" {
  count             = var.vpc_public_subnet_count
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(var.vpc_cidr_block, 8, count.index + 2)
  vpc_id            = aws_vpc.vpc.id

  tags = {
    Name = "${var.project}-private-subnet-${count.index}"
  }
}

# Setup networking resources for the public subnets. Containers
# in the public subnets have public IP addresses and the routing table
# sends network traffic via the internet gateway.
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.project}-internet-gateway"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "${var.project}-public-route-table"
  }
}

resource "aws_route_table_association" "public_subnet_route_table_associations" {
  count          = var.vpc_public_subnet_count
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

# Setup networking resources for the private subnets. Containers
# in these subnets have only private IP addresses, and must use a NAT
# gateway to talk to the internet. We launch two NAT gateways, one for
# each private subnet.
resource "aws_nat_gateway" "nat_gateways" {
  count             = var.vpc_public_subnet_count
  connectivity_type = "private"
  subnet_id         = aws_subnet.public_subnets[count.index].id

  tags = {
    Name = "${var.project}-nat-gateway-${count.index}"
  }
}

resource "aws_route_table" "private_route_tables" {
  count  = var.vpc_public_subnet_count
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_gateways[count.index].id
  }

  tags = {
    Name = "${var.project}-private-route-table-${count.index}"
  }
}

resource "aws_route_table_association" "private_route_table_associations" {
  count          = var.vpc_public_subnet_count
  route_table_id = aws_route_table.private_route_tables[count.index].id
  subnet_id      = aws_subnet.private_subnets[count.index].id
}

# HAC-116 Remove these if not used
# # Create elastic IP address for our NAT Gateway 1:
resource "aws_eip" "eip_nat_gateway_one" {
  depends_on = [aws_internet_gateway.internet_gateway]
  domain     = "vpc"

  tags = {
    Name = "${var.project}-eip-nat-gateway-1"
  }
}

# # Create elastic IP address for our NAT Gateway 2:
resource "aws_eip" "eip_nat_gateway_two" {
  depends_on = [aws_internet_gateway.internet_gateway]
  domain     = "vpc"

  tags = {
    Name = "${var.project}-eip-nat-gateway-2"
  }
}
