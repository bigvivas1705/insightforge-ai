from sqlalchemy import create_engine, Column, Integer, String, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Connection string — tells SQLAlchemy how to connect to MySQL
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/insightforge_db"

# Create the engine — this is the actual connection to MySQL
engine = create_engine(DATABASE_URL)

# SessionLocal — used to interact with the database in each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base — all our database models will inherit from this
Base = declarative_base()

# Dependency — gives us a database session per request, then closes it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()