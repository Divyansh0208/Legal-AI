def test_security_headers_present(client):
    response = client.get("/api/health")
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert "content-security-policy" in response.headers


def test_hsts_only_in_production(client, monkeypatch):
    from app.core import config

    monkeypatch.setattr(config.settings, "ENV", "production")
    response = client.get("/api/health")
    assert "strict-transport-security" in response.headers
