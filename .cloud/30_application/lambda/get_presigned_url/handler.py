import json
import os
import uuid

import boto3

s3 = boto3.client("s3")


def _response(status_code: int, body: dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def lambda_handler(event, context):
    bucket = os.environ.get("UPLOAD_BUCKET") or os.environ["S3_BUCKET"]
    prefix = os.environ.get("UPLOAD_PREFIX", "assessments/")
    query = event.get("queryStringParameters") or {}

    filename = query.get("filename")
    content_type = query.get("contentType")

    if not filename or not content_type:
        return _response(
            400,
            {"error": "Missing required query parameters: filename, contentType"},
        )

    key = f"{prefix}{uuid.uuid4()}-{filename}"

    upload_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": bucket,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=300,
    )

    return _response(200, {
        "uploadUrl": upload_url,
        "key": key,
    })
