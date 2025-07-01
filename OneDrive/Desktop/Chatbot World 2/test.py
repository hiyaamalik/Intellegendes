import requests

BASE_URL = "http://localhost:7860"

# 1. Start a new session (get initial message/options)
session_id = "user123"  # You can use any unique string per user/session
init_resp = requests.get(f"{BASE_URL}/api/init", params={"session_id": session_id})
init_data = init_resp.json()
print("Bot:", init_data["response"])
print("Options:", init_data["options"])

# 2. Send a message to the bot
history = init_data["history"]

print("Bot:", init_data["response"])
while True:
    msg = input("You: ")
    payload = {
        "message": msg,
        "history": history,
        "session_id": session_id
    }
    chat_resp = requests.post(f"{BASE_URL}/api/chat", json=payload)
    chat_data = chat_resp.json()
    print("Bot:", chat_data["response"])
    history = chat_data["history"]
    print("Options:", chat_data["options"])
    print("Health Profile:", chat_data["health_profile"])