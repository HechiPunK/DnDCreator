from pydantic import BaseModel, Field, ConfigDict, AliasChoices

# MVC Pattern: Model layer
# Pydantic schemas validate request payloads and database response objects.
# These classes define the contract of the D&D character data.


class AttributesBase(BaseModel):
    strength: int = Field(..., ge=8, le=20)
    dexterity: int = Field(..., ge=8, le=20)
    constitution: int = Field(..., ge=8, le=20)
    intelligence: int = Field(..., ge=8, le=20)
    wisdom: int = Field(..., ge=8, le=20)
    charisma: int = Field(..., ge=8, le=20)


class AttributeModifiers(BaseModel):
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int


class CharacterCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    race: str = Field(..., min_length=2, max_length=30)
    class_name: str = Field(..., alias="class", min_length=2, max_length=30)
    level: int = Field(default=1, ge=1, le=20)
    attributes: AttributesBase

    model_config = ConfigDict(populate_by_name=True)


class CharacterResponse(BaseModel):
    id: str | None = None
    name: str
    race: str
    class_name: str = Field(
        alias="class",
        validation_alias=AliasChoices("class", "class_name"),
        min_length=2,
        max_length=30,
    )
    level: int = Field(default=1, ge=1, le=20)
    attributes: AttributesBase
    modifiers: AttributeModifiers

    model_config = ConfigDict(populate_by_name=True)
