import json

from shared import get_assessment_from_db


def _response(status_code: int, body: dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def lambda_handler(event, context):
    """Minimal Lambda handler for GET /assessment/{id}

    Expects an API Gateway HTTP API v2 proxy event where `event['pathParameters']['id']` is the assessment ID.
    Returns a 200 with the assessment stub if found, or a 404 if not found. Persistence (DB / S3) is intentionally left as a TODO placeholder.
    """
    # Basic path parameter extraction
    path_params = event.get("pathParameters") if isinstance(event, dict) else None
    assessment_id = path_params.get("id") if path_params else None

    if not assessment_id:
        return _response(400, {"error": "Missing required path parameter: id"})

    assessment = get_assessment_from_db(assessment_id)

    if not assessment:
        return _response(404, {"error": "Assessment not found"})

    return _response(200, {"assessment": assessment})
