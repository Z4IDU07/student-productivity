# Student Productivity Web Application

Welcome to the Student Productivity Web Application! This project is designed to enhance students' study habits and collaboration by leveraging advanced technologies such as AI, real-time communication, and dynamic scheduling. Below, you will find detailed information about the modules included in this application, along with instructions on how to set it up and use it effectively.

## Table of Contents
1. [Introduction](#introduction)
2. [Modules Overview](#modules-overview)
    - [Personalized Study Plans and Daily Routines](#personalized-study-plans-and-daily-routines)
    - [Collaborative Study Group Initialization and Configuration](#collaborative-study-group-initialization-and-configuration)
    - [AI Chatbot Initialization and Model Loading](#ai-chatbot-initialization-and-model-loading)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

The Student Productivity Web Application is designed to cater to individual learning preferences and optimize time management for students. It includes modules for personalized study plans, collaborative study groups, and an AI-powered chatbot to assist users in managing their study routines and collaborating with peers.

## Modules Overview

### Personalized Study Plans and Daily Routines

This module leverages artificial intelligence and advanced scheduling models to tailor study plans and daily routines to the unique needs and habits of users. Key features include:

- **Task Allocation**: Allocates appropriate durations for each study session, breaks, and revision periods.
- **Task Prioritization**: Uses machine learning to prioritize tasks based on importance, urgency, and relevance to long-term learning goals.
- **Long-term Performance Tracking**: Tracks users' focus trends and provides insights into study habits and productivity patterns.
- **Google Calendar Integration**: Syncs with Google Calendar to automatically add tasks and study sessions, ensuring centralized time and task management.
- **Dynamic Scheduling**: Adjusts study plans and routines based on real-time data from Google Calendar.

### Collaborative Study Group Initialization and Configuration

This module facilitates real-time collaboration among students through study groups. Key features include:

- **Real-time Communication**: Uses WebSocket for bidirectional communication between clients and the server.
- **Room Management**: Maintains active rooms, their members, and messages using a dictionary.
- **User Authentication and Authorization**: Authenticates users via login/signup forms and manages user sessions.
- **User Interaction and Messaging**: Enables users to join/create rooms, chat in real-time, and upload files.
- **Error Handling**: Implements mechanisms to manage exceptions and provide informative error messages.

### AI Chatbot Initialization and Model Loading

The AI Chatbot module enhances user interaction by providing intelligent responses and assistance. Key features include:

- **Model Loading**: Loads the pre-trained model and necessary data upon application startup.
- **Input Processing**: Processes user messages and predicts intents using the loaded model and NLTK library.
- **Feedback Mechanism**: Allows users to provide feedback on the accuracy of responses, enabling continuous improvement.
- **Context Awareness**: Considers previous interactions to predict the intent of incoming messages.
- **Confidence Check and Rephrasing**: Handles low-confidence predictions by rephrasing user questions.
- **Web Interface Interaction**: Displays chatbot responses in real-time on the web interface.

## Technologies Used

- **Backend**: Flask
- **Database**: MongoDB
- **Frontend**: JavaScript, HTML, CSS
- **Scheduling**: Google Calendar (optional)
- **Real-time Communication**: WebSocket
- **Chatbot Processing**: NLTK

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/student-productivity-web-app.git
    cd student-productivity-web-app
    ```

2. **Set Up a Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Configure Environment Variables**:
    - Set up your MongoDB URI and Google Calendar API credentials in a `.env` file.

5. **Run the Application**:
    ```bash
    flask run
    ```

## Usage

1. **Access the Web Application**:
    - Open your web browser and navigate to `http://localhost:5000`.

2. **Personalized Study Plans**:
    - Log in and configure your study preferences and goals.
    - Sync with Google Calendar to manage your schedule.

3. **Collaborative Study Groups**:
    - Create or join study groups to collaborate with peers in real-time.
    - Use the chat interface for messaging and file sharing.

4. **AI Chatbot**:
    - Interact with the AI chatbot for study tips, scheduling assistance, and more.
    - Provide feedback to improve the chatbot's responses.

## Contributing

We welcome contributions to enhance this project. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
If you have any questions or need further assistance, please feel free to reach out.
gmail : zaidu0710@gmail.com
