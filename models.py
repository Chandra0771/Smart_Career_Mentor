"""
Database Models
Contains all SQLAlchemy models for the application.
"""

from app import db
from datetime import datetime


class User(db.Model):
    """
    User model for authentication and profile management.
    
    Attributes:
        id (int): Primary key
        username (str): Unique username
        email (str): User's email address
        password (str): Hashed password
        created_at (datetime): Account creation timestamp
    """
    
    __tablename__ = 'users'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # User credentials
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    # (Can be extended for career profiles, applications, etc.)
    
    def __repr__(self):
        """String representation of the User object."""
        return f'<User {self.username}>'
    
    def to_dict(self):
        """Convert user object to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
