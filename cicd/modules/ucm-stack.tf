variable "AwsId" {
  type = string
}
variable "Environment" {
  type = string
}
variable "Prefix" {
  type = string
}


resource "aws_iam_role" "lambda_exec" {
  name = "${var.Prefix}-${var.Environment}-role-lambda"
  tags = {
    "Environment" = var.Environment
    "AwsId" = var.AwsId
  }
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_policy" "dynamo_access" {
  name = "${var.Prefix}-${var.Environment}-policy-dynamo"
  path = "/"
  description = "IAM policy for dynamoDB usage"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:*"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:181929501415:table/*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}


resource "aws_iam_role_policy_attachment" "lambda_dynamo" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.dynamo_access.arn
}

resource "aws_lambda_layer_version" "UCM_lambda_layer" {
  # filename   = "../src/push-api-lambdas.zip"
  s3_bucket = "papi-int-artifact-utils"
  s3_key = "layer-lambda.zip"
  layer_name = "${var.Prefix}-${var.Environment}-lambda_layer_name"

  compatible_runtimes = [
    "nodejs8.10",
    "nodejs12.x"]
}

resource "aws_lambda_function" "archiver" {
  # filename      = filebase64sha256(file("../src/push-api-lambdas.zip"))
  filename = "../../dist/push-api-lambdas.zip"
  function_name = "${var.Prefix}-${var.Environment}-archiver"
  role = aws_iam_role.lambda_exec.arn
  handler = "enricher-lambda/mainEnricher.handler"
  layers = [
    aws_lambda_layer_version.UCM_lambda_layer.arn]

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"

  # source_code_hash = filebase64sha256("lambda_function_payload.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
  tags = {
    "Environment" = var.Environment
    "AwsId" = var.AwsId
  }
}

resource "aws_dynamodb_table" "document_repository" {
  name = "${var.Prefix}-${var.Environment}-document-repository"
  billing_mode = "PROVISIONED"
  read_capacity = 20
  write_capacity = 20
  hash_key = "id"
  range_key = "revision"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "revision"
    type = "N"
  }

  # global_secondary_index {
  #   name               = "GameTitleIndex"
  #   hash_key           = "GameTitle"
  #   range_key          = "TopScore"
  #   write_capacity     = 10
  #   read_capacity      = 10
  #   projection_type    = "INCLUDE"
  #   non_key_attributes = ["UserId"]
  # }

  tags = {
    "Environment" = var.Environment
    "AwsId" = var.AwsId
  }
}



