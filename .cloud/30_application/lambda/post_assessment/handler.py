import json
import os
import uuid

import psycopg2

from shared import get_assessment_from_db

PENDING_STATUS = "PENDING"

def _response(status_code: int, body: dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def lambda_handler(event, context):
    """Minimal Lambda handler for POST /assessment

    Expects an API Gateway HTTP API v2 proxy event where `event['body']` is a JSON string.
    Validates required fields (`name`) and returns a 201 with the created assessment
    stub. Persistence (DB / S3) is intentionally left as a TODO placeholder.
    """
    # Basic JSON parsing
    body_str = event.get("body") if isinstance(event, dict) else None
    try:
        body = json.loads(body_str) if body_str else {}
    except Exception:
        return _response(400, {"error": "Invalid JSON body"})

    # Minimal validation
    name = body.get("name")
    if not name or not isinstance(name, str) or not name.strip():
        return _response(400, {"error": "Missing or invalid required field: name"})

    # Build the assessment object (in-memory stub)
    assessment = {
        "title": f"{name.strip()} - {uuid.uuid4()}",
        "description": body.get("description", "")
    }

    item = insert_assessment_to_db(assessment)

    return _response(201, {"assessment": item})

def insert_assessment_to_db(assessment) -> dict:
    with psycopg2.connect(os.environ["DB_URL"]) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO assessments(title, description, status)
                   VALUES(%s, %s, %s) RETURNING id;""",
                (assessment["title"], assessment["description"], PENDING_STATUS),
            )
            assessment_id = cur.fetchone()[0]

    return get_assessment_from_db(assessment_id)

if __name__ == "__main__":
    # Quick local test runner
    sample_event = {"body": json.dumps({"name": "Test evaluation", "description": "Sample"})}
    print(lambda_handler(sample_event, None))
