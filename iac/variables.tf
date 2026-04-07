variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
    description = "AWS profile to deploy resources with"
    type        = string
    default     = "terraform-demo2"
}

variable "app_name" {
    description = "Application name (used for naming resources)"
    type        = string
    default     = "my-app"
}
