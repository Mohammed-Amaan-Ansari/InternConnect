from passlib.context import CryptContext
from passlib.exc import UnknownHashError

# Support both bcrypt and legacy bcrypt_sha256 hashes
pwd_context = CryptContext(schemes=["bcrypt", "bcrypt_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        return False

