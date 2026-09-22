from fastapi import APIRouter, status

from models import CharacterCreate, CharacterResponse
from services import create_character_service, list_characters_service

# MVC Pattern: Controller layer
# Endpoints are responsible for receiving HTTP requests and delegating logic to the service layer.

router = APIRouter()


@router.post(
    "/characters",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_character(character: CharacterCreate):
    return await create_character_service(character)


@router.get("/characters", response_model=list[CharacterResponse])
async def get_characters():
    return await list_characters_service()
