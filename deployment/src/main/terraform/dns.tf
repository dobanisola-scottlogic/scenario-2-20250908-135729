data "aws_route53_zone" "hosted_zone" {
  name = var.domain_name
}

# Declare an IPv4 DNS record for the public load balancer
# A separate DNS record will be needed if IPv6 support is required
resource "aws_route53_record" "public_load_balancer_record" {
  zone_id = data.aws_route53_zone.hosted_zone.zone_id
  name    = "${local.host_name}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.public_load_balancer.dns_name
    zone_id                = aws_lb.public_load_balancer.zone_id
    evaluate_target_health = true
  }
}
