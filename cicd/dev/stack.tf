provider "aws" {
  profile = "default"
  region  = "eu-west-1"
}
module "ucm_stack" {
  source      = "../modules"
  AwsId       = "testZou"
  Environment = "dev"
  Prefix = "ucm"
}
