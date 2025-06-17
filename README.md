# Meeting Summarizer

A Node.js application that uses OpenAI's API to generate structured summaries from meeting text.

# Demo


https://github.com/user-attachments/assets/8409dbf7-fbe7-4248-a850-075f7bcfb0f0



## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to `http://localhost:3000`
3. Enter your meeting text in the textarea and click "Process Meeting"

## Features

- Processes meeting text using OpenAI's GPT-3.5 model
- Generates structured summaries including:
  - Meeting overview
  - Key decisions
  - Action items with owners and due dates
- Clean and responsive user interface
- Real-time processing with loading indicator

## API Endpoint

The application exposes a single endpoint:

- POST `/process-meeting`
  - Request body: `{ "meetingText": "your meeting text here" }`
  - Returns: JSON object with summary, decisions, and action items 
