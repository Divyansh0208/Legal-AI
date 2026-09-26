import io

from app.api import routes_voice


def test_voice_returns_transcript(client, monkeypatch):
    monkeypatch.setattr(routes_voice, "transcribe_audio", lambda audio_bytes, filename: "mocked transcript")

    response = client.post(
        "/api/voice",
        files={"file": ("clip.wav", io.BytesIO(b"fake audio bytes"), "audio/wav")},
    )

    assert response.status_code == 200
    assert response.json()["transcript"] == "mocked transcript"


def test_voice_rejects_unsupported_extension(client):
    response = client.post(
        "/api/voice",
        files={"file": ("clip.txt", io.BytesIO(b"not audio"), "text/plain")},
    )
    assert response.status_code == 415


def test_voice_rejects_oversized_file(client, monkeypatch):
    from app.core import config

    monkeypatch.setattr(config.settings, "MAX_UPLOAD_MB", 0)
    response = client.post(
        "/api/voice",
        files={"file": ("clip.wav", io.BytesIO(b"fake audio bytes"), "audio/wav")},
    )
    assert response.status_code == 413
