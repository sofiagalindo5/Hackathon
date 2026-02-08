from pydantic import BaseModel
from typing import List, Optional

class SummaryCreate(BaseModel):
    class_id: str
    note_id: str