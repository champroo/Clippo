from flask import request, jsonify
from config import app, db
from models import ClipboardEntry

with app.app_context():
    db.create_all()

@app.route("/copy", methods=['POST'])
def copy():
    content = request.form.get("content")
    if not content:
        return jsonify({"error": "No content provided"}), 400

    entry = ClipboardEntry(
        content=content,
        token=ClipboardEntry.generate_token()
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({"clipboard_token": entry.token})

@app.route("/paste/<token>", methods=['GET'])
def paste(token):
    entry = ClipboardEntry.query.filter_by(token=token).first_or_404()
    return jsonify({"content": entry.content})

if __name__ == "__main__":
    app.run(debug=True)