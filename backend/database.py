from copy import deepcopy
from uuid import uuid4

# MVC Pattern: Model/Database layer
# This prototype uses an in-memory repository instead of an external database.
# It keeps the persistence contract asynchronous so it can later be replaced by MongoDB.

_characters: list[dict] = []


async def insert_character(document: dict) -> dict:
    stored_document = deepcopy(document)
    stored_document["_id"] = str(uuid4())
    _characters.append(stored_document)
    return deepcopy(stored_document)


async def find_all_characters() -> list[dict]:
    """Returns a snapshot of the fake database contents."""
    return deepcopy(_characters)
