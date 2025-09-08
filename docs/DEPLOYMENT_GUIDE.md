# Deployment Guide

This guide provides comprehensive instructions for deploying the Hackathon Game Platform in various environments, from local development to production AWS infrastructure.

## Table of Contents

1. [Deployment Options Overview](#deployment-options-overview)
2. [Local Development Setup](#local-development-setup)
3. [Docker Compose Deployment](#docker-compose-deployment)
4. [AWS Production Deployment](#aws-production-deployment)
5. [Infrastructure Components](#infrastructure-components)
6. [Configuration Management](#configuration-management)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Deployment Options Overview

The platform supports multiple deployment strategies:

| Deployment Type | Use Case | Complexity | Cost | Scalability |
|----------------|----------|------------|------|-------------|
| Local Development | Development/Testing | Low | Free | Limited |
| Docker Compose | Small Events | Medium | Low | Limited |
| AWS Production | Large Events | High | Variable | High |

## Local Development Setup

### Prerequisites
- Java 21 JDK
- Node.js 18+ and npm
- PostgreSQL 14+ (optional, H2 used by default)
- Git

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd hackathon-game-platform

# Build all components
./gradlew build

# Start the server (uses H2 database)
./gradlew :server:run

# In another terminal, start the UI development server
cd ui
npm install
npm run dev
```

### Access Points
- **Game Server**: http://localhost:8080
- **Admin Interface**: http://localhost:8080/application
- **Development UI**: http://localhost:5173 (Vite dev server)

### Default Credentials
- **Admin**: username `admin`, password `secret`

## Docker Compose Deployment

### Overview
Docker Compose deployment provides a complete production-like environment on a single machine with PostgreSQL database.

### Prerequisites
- Docker and Docker Compose
- Git

### Deployment Steps

1. **Clone and Build**
   ```bash
   git clone <repository-url>
   cd hackathon-game-platform
   
   # Build the Docker image
   ./gradlew :server:dockerBuild
   ```

2. **Start Services**
   ```bash
   cd deployment
   docker-compose up -d
   ```

3. **Verify Deployment**
   ```bash
   # Check service status
   docker-compose ps
   
   # View logs
   docker-compose logs -f server
   ```

### Configuration
Edit `deployment/docker-compose.yml` to customize:

```yaml
services:
  database:
    environment:
      POSTGRES_DB: hackathon
      POSTGRES_USER: scottlogic
      POSTGRES_PASSWORD: hackathon
      
  server:
    ports:
      - "8080:8080"  # Change external port if needed
    environment:
      DB_TYPE: postgres
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: hackathon
      DB_USER: scottlogic
      DB_PASSWORD: hackathon
```

### Management Commands
```bash
# Stop services
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Access database
docker-compose exec database psql -U scottlogic -d hackathon
```

## AWS Production Deployment

### Architecture Overview

The AWS deployment uses the following services:

```
Internet Gateway
       │
   Application Load Balancer (ALB)
       │
   ECS Fargate Service
       │
   ┌─────────────────┐    ┌─────────────────┐
   │  Game Server    │    │   RDS PostgreSQL│
   │  (ECS Tasks)    │────│    Database     │
   └─────────────────┘    └─────────────────┘
       │
   CloudWatch Logs
```

### Prerequisites
- AWS CLI configured with appropriate permissions
- Terraform installed
- Docker installed
- Valid AWS account with sufficient permissions

### Required AWS Permissions
Your AWS user/role needs permissions for:
- ECS (Elastic Container Service)
- RDS (Relational Database Service)
- VPC (Virtual Private Cloud)
- IAM (Identity and Access Management)
- CloudWatch Logs
- Application Load Balancer
- Route 53 (if using custom domain)
- ECR (Elastic Container Registry)

### Deployment Steps

#### 1. Build and Push Docker Image

```bash
# Build the application
./gradlew build

# Build and push Docker image to ECR
cd deployment
./push-to-aws.sh [tag-name]
```

The script will:
- Build the Docker image
- Create ECR repository if it doesn't exist
- Push the image to ECR

#### 2. Configure Terraform Variables

Create `deployment/src/main/terraform/terraform.tfvars`:

```hcl
# Basic Configuration
project_name = "hackathon-game"
environment = "production"
aws_region = "eu-west-2"

# Networking
vpc_cidr = "10.0.0.0/16"
availability_zones = ["eu-west-2a", "eu-west-2b"]

# Database Configuration
db_instance_class = "db.t3.micro"
db_allocated_storage = 20
db_name = "hackathon"
db_username = "hackathon_user"
db_password = "secure_password_here"

# ECS Configuration
ecs_task_cpu = 512
ecs_task_memory = 1024
ecs_desired_count = 2

# Domain Configuration (optional)
domain_name = "your-domain.com"
certificate_arn = "arn:aws:acm:region:account:certificate/cert-id"

# Team Configuration
teams = [
  {
    name = "team1"
    password = "team1_password"
  },
  {
    name = "team2"
    password = "team2_password"
  }
]
```

#### 3. Deploy Infrastructure

```bash
cd deployment/src/main/terraform

# Initialize Terraform
terraform init

# Create workspace for your deployment
terraform workspace new production

# Plan the deployment
terraform plan

# Apply the changes
terraform apply
```

#### 4. Configure Teams

After deployment, access the admin interface and configure teams:
1. Navigate to the ALB DNS name or custom domain
2. Login with admin credentials
3. Create hackathon event
4. Add teams with the configured passwords

### Infrastructure Components

#### VPC and Networking
- **VPC**: Isolated network environment
- **Public Subnets**: For load balancer
- **Private Subnets**: For ECS tasks and RDS
- **Internet Gateway**: Internet access
- **NAT Gateway**: Outbound internet for private subnets

#### ECS (Elastic Container Service)
- **Cluster**: Container orchestration
- **Service**: Manages desired number of tasks
- **Task Definition**: Container configuration
- **Auto Scaling**: Scales based on CPU/memory

#### RDS (Relational Database Service)
- **PostgreSQL**: Managed database service
- **Multi-AZ**: High availability
- **Automated Backups**: Point-in-time recovery
- **Security Groups**: Network access control

#### Load Balancer
- **Application Load Balancer**: HTTP/HTTPS traffic distribution
- **Target Groups**: Health checks and routing
- **SSL/TLS**: HTTPS termination

#### Security
- **Security Groups**: Firewall rules
- **IAM Roles**: Service permissions
- **VPC Endpoints**: Secure AWS service access

### Configuration Management

#### Environment Variables
The application supports configuration via environment variables:

```bash
# Database Configuration
DB_TYPE=postgres
DB_HOST=database-endpoint
DB_PORT=5432
DB_NAME=hackathon
DB_USER=username
DB_PASSWORD=password

# Application Configuration
SERVER_PORT=8080
ADMIN_PASSWORD=secure_admin_password

# AWS Configuration (for Cloud9 integration)
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=access_key
AWS_SECRET_ACCESS_KEY=secret_key
WORKSPACE=workspace_name
CONTESTANT_PASSWORD=contestant_password
```

#### Terraform Variables
Key Terraform variables for customization:

```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "hackathon-game"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "ecs_desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}
```

### Scaling Configuration

#### Auto Scaling Policies
```hcl
resource "aws_appautoscaling_policy" "scale_up" {
  name               = "${local.workspace}-scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

#### Database Scaling
- **Vertical Scaling**: Increase instance class
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: Optimize database connections

### Monitoring and Maintenance

#### CloudWatch Monitoring
- **Application Logs**: ECS task logs
- **Database Metrics**: RDS performance metrics
- **Load Balancer Metrics**: Request counts and latency
- **Custom Metrics**: Game-specific metrics

#### Health Checks
- **Load Balancer Health Checks**: HTTP endpoint monitoring
- **ECS Health Checks**: Container health monitoring
- **Database Health**: RDS monitoring

#### Backup Strategy
- **Database Backups**: Automated RDS backups
- **Configuration Backups**: Terraform state backups
- **Application Backups**: ECR image versioning

### Cost Optimization

#### Resource Sizing
- **ECS Tasks**: Right-size CPU and memory
- **RDS Instance**: Choose appropriate instance class
- **Load Balancer**: Use appropriate type

#### Cost Monitoring
- **AWS Cost Explorer**: Track spending
- **Resource Tagging**: Organize costs by component
- **Scheduled Scaling**: Scale down during off-hours

### Security Best Practices

#### Network Security
- **Private Subnets**: Database and application isolation
- **Security Groups**: Least privilege access
- **VPC Endpoints**: Secure AWS service access

#### Application Security
- **Secrets Management**: Use AWS Secrets Manager
- **IAM Roles**: Least privilege permissions
- **SSL/TLS**: Encrypt data in transit

#### Database Security
- **Encryption**: At-rest and in-transit encryption
- **Access Control**: Database user permissions
- **Network Isolation**: Private subnet deployment

## Troubleshooting

### Common Issues

#### Docker Build Failures
```bash
# Clean build
./gradlew clean build

# Check Docker daemon
docker info

# Rebuild image
./gradlew :server:dockerBuild --no-cache
```

#### Database Connection Issues
```bash
# Check database status
docker-compose ps database

# View database logs
docker-compose logs database

# Test connection
docker-compose exec database psql -U scottlogic -d hackathon
```

#### ECS Deployment Issues
```bash
# Check ECS service status
aws ecs describe-services --cluster cluster-name --services service-name

# View ECS logs
aws logs get-log-events --log-group-name /ecs/hackathon-game

# Check task definition
aws ecs describe-task-definition --task-definition task-definition-name
```

#### Load Balancer Issues
```bash
# Check target health
aws elbv2 describe-target-health --target-group-arn target-group-arn

# View load balancer logs
aws logs get-log-events --log-group-name /aws/elasticloadbalancing/app/load-balancer-name
```

### Performance Tuning

#### Database Performance
- **Connection Pooling**: Configure appropriate pool size
- **Query Optimization**: Analyze slow queries
- **Indexing**: Add appropriate database indexes

#### Application Performance
- **JVM Tuning**: Optimize heap size and GC settings
- **Thread Pool**: Configure appropriate thread pool sizes
- **Caching**: Implement application-level caching

### Disaster Recovery

#### Backup Procedures
1. **Database Backups**: Automated RDS snapshots
2. **Configuration Backups**: Terraform state files
3. **Application Backups**: ECR image versions

#### Recovery Procedures
1. **Database Recovery**: Restore from RDS snapshot
2. **Infrastructure Recovery**: Terraform apply from backup
3. **Application Recovery**: Deploy from ECR image

### Maintenance Windows

#### Planned Maintenance
- **Database Updates**: Schedule during low usage
- **Application Updates**: Blue-green deployment
- **Infrastructure Updates**: Rolling updates

#### Emergency Procedures
- **Incident Response**: Escalation procedures
- **Rollback Procedures**: Quick rollback steps
- **Communication**: Stakeholder notification

This deployment guide should be updated as the infrastructure evolves and new deployment strategies are implemented.