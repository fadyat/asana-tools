from fastapi import APIRouter

from src.api.be.asana.by_template import template_router
from src.api.be.asana.contractor import contractor_router

be_router = APIRouter(
    prefix='/api/v1/tasks',
    tags=['backend'],
)

be_router.include_router(
    router=template_router,
)
be_router.include_router(
    router=contractor_router,
)
