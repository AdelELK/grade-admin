import json
from unittest.mock import patch

from post_assessment import handler


def make_event(payload: dict):
    return {"body": json.dumps(payload)}


@patch("post_assessment.handler.insert_assessment_to_db")
def test_create_assessment_success(insert_assessment_to_db):
    insert_assessment_to_db.return_value = {
        "id": "assessment-id",
        "title": "Unit Test Assessment",
        "description": "desc",
        "metadata": {},
        "status": "PENDING",
        "created_at": "2026-06-14T12:00:00",
        "updated_at": "2026-06-14T12:00:00",
    }

    ev = make_event({"name": "Unit Test Assessment", "description": "desc"})
    resp = handler.lambda_handler(ev, None)
    assert isinstance(resp, dict)
    assert resp.get("statusCode") == 201
    body = json.loads(resp.get("body", "{}"))
    assert body["assessment"] == insert_assessment_to_db.return_value


if __name__ == "__main__":
    test_create_assessment_success()
    print("test passed")
