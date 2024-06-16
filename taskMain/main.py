from flask import Flask, g, render_template, redirect, request
from flask import Flask, jsonify, render_template, request, session, url_for 
from flask_socketio import emit, join_room, leave_room, send, SocketIO
from werkzeug.utils import secure_filename
import os
import os.path
from string import ascii_uppercase
import random
from pymongo import MongoClient
from bson import ObjectId
from flask import Flask, render_template, request
import tensorflow as tf
import numpy as np
import json
import pickle
import random
import nltk
from nltk.stem import WordNetLemmatizer
from datetime import datetime, timedelta
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar"]

#flask and socket setup
app = Flask(__name__)
app.secret_key = "bakwass"
app.config["UPLOAD_FOLDER"] = "static/files"
socketio = SocketIO(app) #-----------
    
#DB declaration
client = MongoClient("mongodb://localhost:27017")
db = client["productivity"]
db2 = client['login-records']
sclc = db2['login-records']
db3 = client['documents']
rooms = {} #----------

#Chat bot declarations
model = tf.keras.models.load_model('static/res/chatbot_model_updated2.h5')
intents = json.loads(open('static/res/intents.json').read())
words = pickle.load(open('static/res/words.pkl', 'rb'))
classes = pickle.load(open('static/res/classes.pkl', 'rb'))
lemmatizer = WordNetLemmatizer() #-----------

def generate_unique_code(length):   
    while True:
        code = ""
        for _ in range(0, length):
            code+=random.choice(ascii_uppercase)

        if code not in rooms:
            break
    
    return code


@app.route('/')
def logi():
    return render_template('login.html')

@app.route("/thome")
def taskfun():
    return render_template("thome.html")

@app.route('/cmp')
def cmp():
    print("cmp called")
    return render_template("cmp.html")

@app.route('/imp')
def imp():
    print("impo called")
    return render_template("imp.html")

@app.route("/choi")
def choi():
    message = session.get('uname')
    return render_template("choi.html", message = message)

@app.route("/chatnavig")
def chatnavig():
    print("chat came")
    return ""

@app.route("/unameret", methods=['POST'])
def unameret():
    print("uname came")
    uname = session.get('uname')
    return uname



@app.route("/tasknavig")
def tasknavig():
    print("task came")
    return ""

@app.route('/cuser', methods=['POST'])
def cuser():
    result = request.get_json()
    uname = result['val']
    clc = db[f'task-records-{uname}']
    clc.insert_one({'uname': uname})
    clc_name = f'task-records-{uname}'
    print(clc_name)
    session['clc'] = clc_name
    return ""



@app.route("/completedpage", methods=['POST'])    #Route for completed page
def completedfunc():
    clc_name = session.get('clc')
    clc = db[clc_name]
    completed_tasks_c = clc.find({'status': 'completed'}, {'_id': 0})
    completed_tasks = list(completed_tasks_c)
    print("completed came")
    for task in completed_tasks:
        task.pop('_id', None)
    print((completed_tasks))
    return dict(completed_task = completed_tasks)

@app.route("/imppage", methods=['POST'])          #Route for Important page
def impfunc():
    clc_name = session.get('clc')
    clc = db[clc_name]
    important_tasks_c = clc.find({'prio': 'high'}, {'_id': 0})
    important_tasks = list(important_tasks_c)
    print("important also ccame")
    for task in important_tasks:
        task.pop('_id', None)
    print((important_tasks))
    return dict(important_task = important_tasks)

@app.route("/homepage", methods=['POST'])          #Route for Home page
def homePage():
    clc_name = session.get('clc')
    clc = db[clc_name]
    homepageTasks_c = clc.find({})
    homepageTasks = list(homepageTasks_c)
    print("homepage is here")
    for task in homepageTasks:
        task.pop('_id', None)
    print((homepageTasks))
    return dict(homepageTasks = homepageTasks)

@app.route("/getId")
def getIDFromDB():
    clc_name = session.get('clc')
    clc = db[clc_name]
    id_val = clc.count_documents({})
    print("ID VALUE",id_val)
    return jsonify({"id_val": id_val})

@app.route('/process', methods=['POST']) 
def process():
    clc_name = session.get('clc')
    clc = db[clc_name]
    data = request.get_json() 
    if clc.count_documents({})!=0:
        pipeline = [
        {
            "$group": {
                "_id": None,
                "max_value": {"$max": "$task_ID"} 
            }
        }
        ]
        result = list(clc.aggregate(pipeline))
        max_value = result[0]['max_value']
        max_val = max_value[4:]
        max_val = int(max_val)+1
        tid_val = f"task{max_val}"
        data['task_ID'] = tid_val
        
    result = data
    clc.insert_one(data)
    print(result)
    return jsonify(result="result")

@app.route("/complete", methods=['POST'])
def complete():
    clc_name = session.get('clc')
    print(clc_name)
    clc = db[clc_name]
    val = request.get_json()
    tn = val['value']
    print(tn)
    clc.update_one({'task_ID': tn}, {"$set": {'status': "completed"}})

    return jsonify(result = tn)

@app.route("/edit", methods=['POST'])
def edit():
    clc_name = session.get('clc')
    clc = db[clc_name]
    val = request.get_json()
    tn = val['value']
    data = clc.find_one({'task_ID': tn}, {"_id":0, 'taskname':1, 'due': 1, 'desc': 1})
    # print(dict(data))
    return jsonify(result = dict(data))

@app.route("/update", methods=['POST'])
def update():
    clc_name = session.get('clc')
    clc = db[clc_name]
    print("Reached")
    val = request.get_json()
    print(val)
    tn = val['taskname']
    due = val['due']
    desc = val['desc']
    task_ID = val['task_ID']
    prio = val['prio']
    clc.update_one({'task_ID': task_ID}, {"$set": {'taskname': tn, 'due': due, 'desc': desc, 'prio': prio}})
    return ""




@app.route("/", methods=["POST", "GET"])
def login():
    # session.clear()
    if request.method =="POST":
        mail = request.form.get("email")
        pwd = request.form.get("pswd")
        qe = sclc.find_one({"email": mail})
        print(qe['uname'])
        clc_name = f'task-records-{qe['uname']}'
        clc = db[clc_name]
        session['clc'] = clc_name
        error=None
        if qe:  
            if qe["pass"]==pwd:
                session['uname'] = qe['uname']
                return render_template("choi.html", message = qe['uname'])
            else:
                print("NO")
                error = "Incorrect password"
                return render_template("login.html", error = error)   
        else:
            error = "Mail not found"
            return render_template("login.html", error = error)   
    return render_template("login.html")   



@app.route("/chathome", methods=["POST", "GET"])
def home():
    session.clear()
    if request.method =="POST":
        name = request.form.get("name")
        code = request.form.get("code")
        join = request.form.get("join", False)  
        create = request.form.get("create", False)

        if not name:
            return render_template("chathome.html", error="Please provide a name", code=code, name=name)
        
        if join!=False and not code:
            return render_template("chathome.html", error="Please provide a room code", code=code, name=name)

        room = code
        if create!=False:
            room = generate_unique_code(4)
            rooms[room] = {"members": 0, "messages":[]}
            # return render_template("chathome.html", error = f"{room}")
        elif code not in rooms:
            return render_template("chathome.html", error="Room does not exist", code=code, name=name)
            
        session["room"] = room
        session["name"] = name
        return redirect(url_for("room"))
    
    return render_template("chathome.html")

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method=='POST':
        mail = request.form.get('email')
        name = request.form.get('username')
        pwd = request.form.get('pswd')
        print(name)
        
        if mail!="" and name!="" and pwd!="":
            clc = db[f'task-records-{name}']
            clc.insert_one({'uname': name})
            clc_name = f'task-records-{name}'
            session['clc'] = clc_name
            sclc.insert_one({"email": mail, "uname": name, "pass": pwd})
            return redirect(url_for('login'))
        
    return render_template("signup.html")


 

@app.route("/calendaradd")
def calendar_add():
    clc_name = session.get('clc')
    added_tasks = []
    clc = db[clc_name]
    data = clc.find({})
    print(added_tasks)
    creds = None

    try:
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    "credentials.json", SCOPES
                )
                creds = flow.run_local_server(port=0)
                with open("token.json", "w") as token:
                    token.write(creds.to_json())
        service = build("calendar", "v3", credentials=creds)
        for task in data:
            due_time = datetime.strptime(task['due'], "%H:%M").time()

            today = datetime.now().date()

            start_datetime = datetime.combine(today, due_time)
            ctime_minutes = int(task['ctime'])
            end_datetime = start_datetime + timedelta(minutes=ctime_minutes)

            event = {
                'summary': task['taskname'],
                'description': task['desc'],
                'start': {
                    'dateTime': start_datetime.strftime('%Y-%m-%dT%H:%M:%S'),
                    'timeZone': 'Asia/Kolkata',
                },
                'end': {
                    'dateTime': end_datetime.strftime('%Y-%m-%dT%H:%M:%S'),
                    'timeZone': 'Asia/Kolkata',
                }
            }

            # Set color based on priority
            if task['prio'] == 'high':
                event['colorId'] = '11'  # Red
            elif task['prio'] == 'low':
                event['colorId'] = '10'  # Green

            event = service.events().insert(calendarId='primary', body=event).execute()
            print('Event created: %s' % (event.get('htmlLink')))
            added_tasks.append(event.get('id'))
            print(added_tasks)
            print("ADDED")


    except HttpError as error:
        print(f"An error occurred: {error}")
    return ""


@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home"))
    
    return render_template("room.html", code=room, messages= rooms[room]['messages'])


@app.route("/uploader", methods=['POST'])
def uploader():
    if request.method =='POST':
        room = session.get("room")
        f = request.files['file1']
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
        f.save(file_path)
        session['file_uploaded'] = True
        return "", 204
    return redirect(url_for('room'))

                

@socketio.on('file_uploaded')
def handle_file_uploaded(data):
    file_name = data['file_name']
    file_d = data['file_data']
    room = session.get("room")
    if room in rooms:
        emit('display_file', {'file_name': file_name, 'file_d': file_d}, room=room)
    
    
@socketio.on("message")
def message(data):
    room = session.get("room")
    if room not in rooms:
        return
    
    content = {
        "name": session.get("name"),
        "message": data["data"]
    }
    send(content, to=room)
    rooms[room]["messages"].append(content)
    print(f"{session.get('name')} said: {data['data']}")
    # print(rooms)  


# Chatbot Logic Functions
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print("found in bag: %s" % w)
    return np.array(bag)


def predict_class(sentence, model):
    # Clean up the sentence and tokenize it
    sentence_words = clean_up_sentence(sentence)
    # Perform bag-of-words encoding
    bag = bow(sentence, words, show_details=False)

    # Ensure that the bag-of-words vector has the correct shape
    assert len(bag) == len(words), "Bag-of-words vector has incorrect length"

    # Reshape the bag-of-words vector to match the input shape expected by the model
    bag = np.reshape(bag, (1, len(bag)))  # Assuming batch size of 1

    # Predict the class probabilities using the model
    res = model.predict(bag)[0]

    # Process the results and return the list of intents
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def getResponse(ints, intents_json):
    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

def chatbot_response(msg, rephrase_multi_goal=None):
    ints = predict_class(msg, model)
    if float(ints[0]['probability']) < 0.7:
        # Confidence is low, try rephrasing
        if rephrase_multi_goal is not None:  # Check if rephrase function is provided
            rephrased_questions = rephrase_multi_goal(msg)
            responses = []
            for question in rephrased_questions:
                new_ints = predict_class(question, model)
                if float(new_ints[0]['probability']) > 0.3:
                    res = getResponse(new_ints, intents)
                    responses.append(res)
                else:
                    responses.append(f"Sorry, I don't have specific information on '{question}'. Would you like me to search Wikipedia?")
            # Combine all responses into a single message
            return "Here's what I found:\n" + "\n".join(responses)
        else:
            # Rephrase function not provided, fallback to previous behavior
            return "Sorry, I couldn't understand that."
    else:
        # Confidence is high, use normal chatbot response
        res = getResponse(ints, intents)
        return res

@app.route("/get")
def get_bot_response():
    user_text = request.args.get('msg')
    return chatbot_response(user_text)

@socketio.on("connect")         #Room Connect operation
def connect(auth):
    room = session.get("room")
    name = session.get("name")

    if room is None or name is None:
        return
    if room not in rooms:
        leave_room(room)
        return
    
    join_room(room)
    send({"name":name, "message": "has entered the room"}, to=room)
    rooms[room]["members"] +=1
    print(f"{name} has joined the room {room}")

@socketio.on("disconnect")      #Room Disconnect operation
def disconnect():
    room = session.get("room")
    name = session.get("name")
    leave_room(room)

    if room in rooms:
        rooms[room]["members"]-=1
        if rooms[room]["members"]<=0:
            del rooms[room]

    send({"name":name, "message": "has left the room"}, to=room)
    print(f"{name} has left the room {room}")


if __name__ == "__main__":
    socketio.run(app, debug=True)