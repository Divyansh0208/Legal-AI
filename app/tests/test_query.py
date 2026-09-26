from app.api import routes_query


def test_query_returns_answer_and_disclaimer(client, monkeypatch):
    def fake_answer_question(question: str):
        return {"answer": "This is a mocked answer.", "sources": []}

    monkeypatch.setattr(routes_query, "answer_question", fake_answer_question)

    response = client.post("/api/query", json={"question": "Can my landlord evict me without notice?"})

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == "This is a mocked answer."
    assert "not legal advice" in body["disclaimer"].lower()


def test_query_rejects_empty_question(client):
    response = client.post("/api/query", json={"question": ""})
    assert response.status_code == 422
