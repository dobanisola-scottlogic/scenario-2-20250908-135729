resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = var.workspace

  dashboard_body = jsonencode(
    {
      widgets = [
        {
          type   = "metric"
          x      = 0
          y      = 0
          width  = 6
          height = 6
          properties = {
            liveData = true
            metrics = [
              [
                "AWS/RDS",
                "DatabaseConnections",
                "DBInstanceIdentifier",
                var.db_name,
                {
                  region = var.aws_region
                },
              ],
            ]
            period  = 60
            region  = var.aws_region
            stacked = true
            title   = "Database Connections"
            view    = "timeSeries"
          }
        },
        {
          type   = "metric"
          x      = 6
          y      = 0
          width  = 6
          height = 6
          properties = {
            liveData = true
            metrics = [
              [
                "AWS/ECS",
                "MemoryUtilization",
                "ServiceName",
                var.ecs_service_name,
                "ClusterName",
                var.ecs_cluster_name,
                {
                  region = var.aws_region
                },
              ],
              [
                ".",
                "CPUUtilization",
                ".",
                ".",
                ".",
                ".",
                {
                  region = var.aws_region
                },
              ],
            ]
            period  = 60
            region  = var.aws_region
            stacked = false
            title   = "ECS Cluster - CPU Utilization"
            view    = "timeSeries"
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 0
          width  = 6
          height = 6
          properties = {
            legend = {
              position = "bottom"
            }
            liveData = true
            metrics = [
              for padded_instance_number, instance_id in var.sorted_cloud9_ec2_instance_ids :
              [
                "AWS/EC2",
                "CPUUtilization",
                "InstanceId",
                instance_id,
                {
                  id     = "m${padded_instance_number}"
                  region = var.aws_region
                  stat   = "Average"
                  label  = padded_instance_number
                },
              ]
            ]
            period  = 60
            region  = var.aws_region
            stacked = false
            title   = "Cloud9 EC2 - CPU Utilization"
            view    = "timeSeries"
          }
        },
        {
          type   = "metric"
          x      = 18
          y      = 0
          width  = 6
          height = 6
          properties = {
            legend = {
              position = "bottom"
            }
            liveData = true
            metrics = [
              for padded_instance_number, instance_id in var.sorted_cloud9_ec2_instance_ids :
              [
                "AWS/EC2",
                "StatusCheckFailed",
                "InstanceId",
                instance_id,
                {
                  id     = "m${padded_instance_number}"
                  region = var.aws_region
                  stat   = "Sum"
                  label  = padded_instance_number
                },
              ]
            ]
            period  = 60
            region  = var.aws_region
            stacked = false
            title   = "Cloud9 EC2 - Status Check Failed"
            view    = "timeSeries"
          }
        },
        {
          type   = "log"
          x      = 0
          y      = 6
          width  = 24
          height = 8
          properties = {
            query   = <<-EOT
                            SOURCE '${var.cloudwatch_log_group_name}' | fields @timestamp, @message, @logStream, @log
                            | sort @timestamp desc
                            | filter @message like /ERROR/ 
                        EOT
            region  = var.aws_region
            stacked = false
            title   = "CloudWatch Logs - ERROR only"
            view    = "table"
          }
        },
      ]
    }
  )
}
