import base64
import hashlib
from cryptography.fernet import Fernet
from sqlalchemy.types import TypeDecorator, LargeBinary
from app.core.config import settings

# Create a 32-byte url-safe base64 key from the SECRET_KEY for Fernet
_key_bytes = hashlib.sha256(settings.SECRET_KEY.encode('utf-8')).digest()
_fernet = Fernet(base64.urlsafe_b64encode(_key_bytes))

class EncryptedString(TypeDecorator):
    """
    Transparently encrypts string data using Fernet and stores it as LargeBinary (BYTEA in Postgres).
    """
    impl = LargeBinary
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return _fernet.encrypt(value.encode('utf-8'))
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return _fernet.decrypt(value).decode('utf-8')
        return value
