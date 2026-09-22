import math

from database import find_all_characters, insert_character
from models import AttributeModifiers, AttributesBase, CharacterCreate, CharacterResponse

# MVC Pattern: Service layer
# This file contains the business logic of the D&D system.
# It transforms raw values submitted by the frontend into valid persisted data.


class CharacterFactory:
    """Factory responsible for building character documents and API responses."""

    @staticmethod
    def create_document(character: CharacterCreate, modifiers: AttributeModifiers) -> dict:
        return {
            "name": character.name,
            "race": character.race,
            "class": character.class_name,
            "level": character.level,
            "attributes": character.attributes.model_dump(),
            "modifiers": modifiers.model_dump(),
        }

    @staticmethod
    def create_response(document: dict) -> CharacterResponse:
        return CharacterResponse(**serialize_character(document))


def calculate_modifiers(attributes: AttributesBase) -> AttributeModifiers:
    """Applies D&D 5e modifier formula: floor((value - 10) / 2) for each attribute."""
    return AttributeModifiers(
        strength=math.floor((attributes.strength - 10) / 2),
        dexterity=math.floor((attributes.dexterity - 10) / 2),
        constitution=math.floor((attributes.constitution - 10) / 2),
        intelligence=math.floor((attributes.intelligence - 10) / 2),
        wisdom=math.floor((attributes.wisdom - 10) / 2),
        charisma=math.floor((attributes.charisma - 10) / 2),
    )


def serialize_character(document: dict) -> dict:
    """Converts MongoDB ObjectId into a JSON-safe value and keeps the API schema consistent."""
    result = dict(document)
    result["id"] = str(result.pop("_id"))
    if "class_name" in result:
        result["class"] = result.pop("class_name")
    return result


async def create_character_service(character: CharacterCreate) -> CharacterResponse:
    modifiers = calculate_modifiers(character.attributes)

    document = CharacterFactory.create_document(character, modifiers)

    created_document = await insert_character(document)
    return CharacterFactory.create_response(created_document)


async def list_characters_service() -> list[CharacterResponse]:
    documents = await find_all_characters()
    return [CharacterFactory.create_response(doc) for doc in documents]
