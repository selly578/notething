from flask_sqlalchemy import SQLAlchemy
from .. import db


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), unique=False, nullable=True)
    category = db.relationship("Category", back_populates="notes")

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.Text)
    notes = db.relationship("Note", back_populates="category", lazy="dynamic")

    
