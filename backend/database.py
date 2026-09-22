from copy import deepcopy
from uuid import uuid4

# MVC Pattern: Model/Database layer
# This prototype uses an in-memory repository instead of an external database.
# It keeps the persistence contract asynchronous so it can later be replaced by MongoDB.

class CharacterMemoryRepository:
    """Singleton repository that stores characters during the application lifetime."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._characters = []
        return cls._instance

    async def insert(self, document: dict) -> dict:
        stored_document = deepcopy(document)
        stored_document["_id"] = str(uuid4())
        self._characters.append(stored_document)
        return deepcopy(stored_document)

    async def find_all(self) -> list[dict]:
        """Returns a snapshot of the fake database contents."""
        return deepcopy(self._characters)


async def insert_character(document: dict) -> dict:
    return await CharacterMemoryRepository().insert(document)


async def find_all_characters() -> list[dict]:
    return await CharacterMemoryRepository().find_all()
