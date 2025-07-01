import os
import json
from datetime import datetime, timedelta
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.runnables.config import RunnableConfig

# Set up Google API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyBZePYnjTS09MfphUBMo2dpotBlrxm889s"

# Initialize the model
model = init_chat_model("gemini-2.0-flash", model_provider="google_genai")

# Create the chat prompt template
prompt_template = ChatPromptTemplate.from_messages([
    (
        "system",
        """
        You are a friendly and intelligent healthcare assistant designed to help users find healthcare services (like allergy tests, diagnostic labs, doctors, etc.) and assist with bookings. Speak like a helpful human assistant—professional, yet warm—with emojis where suitable 😊.

When users ask for healthcare services (e.g., "allergy test service providers in Delhi"), respond with:

✅ Structured, easy-to-read responses
✅ Bullet points for clarity
✅ Short paragraphs (not long or boring)
✅ Clickable links to websites
✅ Include:

📍 Name of provider

🗺️ Location

📞 Phone number

📧 Email

🔗 Website

🎯 Keep replies concise and focused. If the list is long, show 3–5 top results and offer to show more if needed.

You should also handle bookings if the user asks. Always end your replies with a friendly question like:
"Would you like to book an appointment or see more options?" 😊
        
        """,
    ),
    MessagesPlaceholder(variable_name="messages"),
])

# Define the workflow
workflow = StateGraph(state_schema=MessagesState)

def call_model(state: MessagesState):
    formatted_messages = prompt_template.format_messages(messages=state["messages"])
    response = model.invoke(formatted_messages)
    return {"messages": response}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Add memory
memory = MemorySaver()
app_graph = workflow.compile(checkpointer=memory)

# Health questions for initial assessment
HEALTH_QUESTIONS = [
    {
        "question": "What brings you here today?",
        "options": ["Book Appointment", "Health Question", "General Checkup", "Emergency", "Just Chatting"]
    },
    {
        "question": "How are you feeling today?",
        "options": ["Great!", "Good", "Okay", "Not Well", "Need Help"]
    },
    {
        "question": "Any specific health concerns?",
        "options": ["Fever/Cold", "Headache", "Stomach Issues", "Chest Pain", "Back Pain", "Skin Problems", "Mental Health", "No Issues"]
    },
    {
        "question": "When did you last visit a doctor?",
        "options": ["This Week", "This Month", "Few Months Ago", "Over a Year", "Never"]
    }
]

APPOINTMENT_TYPES = ["Doctor Consultation", "Lab Tests", "Health Screening", "Vaccination", "Dental", "Eye Checkup"]
TIME_SLOTS = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"]

# FastAPI app setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
# Set up templates
templates = Jinja2Templates(directory="templates")

# Global state management (in-memory for demo)
user_sessions = {}

def get_available_dates():
    dates = []
    current_date = datetime.now()
    for i in range(1, 6):
        future_date = current_date + timedelta(days=i)
        dates.append(future_date.strftime("%d %b (%A)"))
    return dates

# Helper for initial message
class HealthChatbot:
    def __init__(self):
        self.current_question = 0
        self.user_info = {}
        self.info_collected = False
    def create_question_with_buttons(self, question_data):
        question_text = f"""
**📋 {question_data['question']}**\n\nPlease choose one of the options below:
        """
        return question_text.strip(), question_data['options']
    def get_initial_message(self):
        welcome_msg = """🌟 **Welcome to Your AI Healthcare Assistant** 🌟\n\nI'm here to provide you with personalized healthcare support 24/7! Let me ask you a few quick questions to better understand your needs.\n\nThis will only take a moment, and then we can have a detailed conversation about your health! 😊\n\n---\n\n"""
        first_question, options = self.create_question_with_buttons(HEALTH_QUESTIONS[0])
        return welcome_msg + first_question, options, None
    def process_response(self, message, history, session_id="default"):
        if not message.strip():
            return history, "", [], None
        # Ensure session_id is always a string
        if not session_id:
            session_id = "default"
        # Initialize session if not exists
        if session_id not in user_sessions:
            user_sessions[session_id] = {
                "current_question": 0,
                "user_info": {},
                "info_collected": False
            }
        session = user_sessions[session_id]
        if not session["info_collected"] and session["current_question"] < len(HEALTH_QUESTIONS):
            question_key = f"q{session['current_question']}"
            session["user_info"][question_key] = message
            session["current_question"] += 1
            if session["current_question"] < len(HEALTH_QUESTIONS):
                next_question_data = HEALTH_QUESTIONS[session["current_question"]]
                next_question, options = self.create_question_with_buttons(next_question_data)
                response = f"""Perfect! I've recorded your response. 📝\n\n{next_question}"""
                history.append([message, response])
                return history, response, options, None
            else:
                session["info_collected"] = True
                profile = session["user_info"]
                response = (
                    "✅ <b>Health Profile Created!</b><br>"
                    "<ul style='margin:8px 0 8px 0;padding-left:18px;'><li><b>Primary concern:</b> {profile.get('q0', 'Not specified')}</li><li><b>Current wellness:</b> {profile.get('q1', 'Not specified')}</li><li><b>Health focus:</b> {profile.get('q2', 'None specified')}</li><li><b>Last consultation:</b> {profile.get('q3', 'Not specified')}</li></ul><div style='color:#2563eb;margin-top:8px;'>🎉 Now you can ask health questions, book appointments, or get wellness tips!<br>What would you like to do next?</div>"
                )
                history.append([message, response])
                return history, response, [], profile
        else:
            # Normal chat mode - use the AI model
            try:
                context_message = ""
                if session.get("user_info"):
                    context_message = f"User's health context: {session['user_info']}. "
                full_message = context_message + message
                input_messages = [HumanMessage(full_message)]
                # Use MessagesState constructor for correct type
                state = MessagesState(messages=[m if isinstance(m, BaseMessage) else HumanMessage(str(m)) for m in input_messages])
                config: RunnableConfig = RunnableConfig(configurable={"thread_id": str(session_id)})
                output = app_graph.invoke(state, config)
                response = output["messages"][-1].content
                # Try to structure the response (short, bullet points, etc.)
                # Removed static service provider list to let Gemini handle the response
                # if any(word in message.lower() for word in ["appointment", "book", "schedule", "doctor"]):
                #     response += f"<br><b>🗓️ Available Services:</b><ul style='margin:4px 0 8px 0;padding-left:18px;'><li>{'</li><li>'.join(APPOINTMENT_TYPES)}</li></ul>Which service interests you most?"
                if any(word in message.lower() for word in ["when", "time", "date"]) and "appointment" in message.lower():
                    response += f"<br><b>📅 Available Dates:</b><ul style='margin:4px 0 8px 0;padding-left:18px;'><li>{'</li><li>'.join(get_available_dates())}</li></ul>Which date works best for your schedule?"
            except Exception as e:
                response = "I'm experiencing some technical difficulties right now. Let me help you in a different way. What specific health topic would you like to discuss? 😊"
            history.append([message, response])
            profile = session.get("user_info") if session.get("info_collected") else None
            return history, response, [], profile

health_bot = HealthChatbot()

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/init")
def init():
    initial_msg, initial_options, profile = health_bot.get_initial_message()
    history = [[None, initial_msg]]
    return JSONResponse({"response": initial_msg, "options": initial_options, "history": history, "health_profile": profile})

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    history = data.get("history", [])
    # Always ensure session_id is a string
    session_id = request.client.host if request.client else "default"
    session_id = str(session_id)
    history, response, options, profile = health_bot.process_response(message, history, session_id=session_id)
    return JSONResponse({"response": response, "options": options, "history": history, "health_profile": profile})

@app.get("/api/init")
def api_init(request: Request):
    session_id = request.query_params.get("session_id") or "api_default"
    initial_msg, initial_options, profile = health_bot.get_initial_message()
    history = [[None, initial_msg]]
    return JSONResponse({
        "response": initial_msg,
        "options": initial_options,
        "history": history,
        "health_profile": profile,
        "session_id": session_id
    })

@app.post("/api/chat")
async def api_chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    history = data.get("history", [])
    session_id = data.get("session_id") or (request.client.host if request.client else "api_default")
    session_id = str(session_id)
    history, response, options, profile = health_bot.process_response(message, history, session_id=session_id)
    return JSONResponse({
        "response": response,
        "options": options,
        "history": history,
        "health_profile": profile,
        "session_id": session_id
    })

# To run: uvicorn app:app --host 0.0.0.0 --port 7860 