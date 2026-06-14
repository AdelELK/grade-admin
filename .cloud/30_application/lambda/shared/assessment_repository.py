import os
from datetime import datetime

import psycopg2


def get_assessment_from_db(assessment_id):
    with psycopg2.connect(os.environ["DB_URL"]) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, title, description, status, created_at
                   FROM assessments
                   WHERE id = %s;""",
                (assessment_id,),
            )
            row = cur.fetchone()

    if not row:
        return None

    return {
        "id": row[0],
        "title": row[1],
        "description": row[2],
        "status": row[3],
        "created_at": (
            row[4].isoformat()
            if isinstance(row[4], datetime)
            else str(row[4])
        ),
    }
