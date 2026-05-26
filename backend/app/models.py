from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    rows_count = Column(Integer)
    columns_count = Column(Integer)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())