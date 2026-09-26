import io


def test_upload_rejects_non_pdf_by_content(client):
    """A .pdf-named file that is actually plain text must be rejected by the
    real MIME sniff (python-magic), not the file extension."""
    fake_file = io.BytesIO(b"this is not a real pdf")
    response = client.post(
        "/api/upload",
        files={"file": ("fake.pdf", fake_file, "application/pdf")},
    )
    assert response.status_code == 415


def test_upload_rejects_oversized_file(client, monkeypatch):
    from app.core import config

    monkeypatch.setattr(config.settings, "MAX_UPLOAD_MB", 0)
    fake_file = io.BytesIO(b"%PDF-1.4 minimal")
    response = client.post(
        "/api/upload",
        files={"file": ("test.pdf", fake_file, "application/pdf")},
    )
    assert response.status_code == 413
