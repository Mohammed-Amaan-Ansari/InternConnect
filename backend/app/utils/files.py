import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException


DEFAULT_UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))

ALLOWED_RESUME_MIME = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

ALLOWED_GENERIC_MIME = {
    *ALLOWED_RESUME_MIME,
    "image/png",
    "image/jpeg",
    "text/plain",
}


def _ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def save_upload(file: UploadFile, *, subdir: str, allowed_mime: set[str]) -> str:
    if not file.content_type or file.content_type not in allowed_mime:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    upload_dir = DEFAULT_UPLOAD_DIR / subdir
    _ensure_dir(upload_dir)

    suffix = Path(file.filename or "").suffix[:10]  # cheap guard
    name = f"{uuid.uuid4().hex}{suffix}"
    out_path = upload_dir / name

    # Stream to disk (avoid loading into memory)
    with out_path.open("wb") as f:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)

    # Return a relative URL-ish path the frontend can store.
    return str(out_path.as_posix())

