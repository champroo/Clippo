from config import db
from datetime import datetime
import secrets

class ClipboardEntry(db.Model):
    __tablename__ = "clipboard_entries"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(8), unique=True ,nullable=False)
    content = db.Column(db.Text, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "token": self.token,
            "content": self.content
        }

    @staticmethod
    def generate_token():
        while True:
            token = secrets.token_urlsafe(8)
            if not ClipboardEntry.query.filter_by(token=token).first():
                return token
