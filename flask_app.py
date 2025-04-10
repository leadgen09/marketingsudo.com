from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Gemini API
genai.configure(api_key=os.getenv("PALM_API_KEY"))

# Configure the model
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 800,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

# Create the model
model = genai.GenerativeModel(model_name="gemini-pro",
                            generation_config=generation_config,
                            safety_settings=safety_settings)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Lead Magnet Generator API"})

@app.route('/generate', methods=['POST'])
def generate_lead_magnet():
    data = request.get_json()
    problem = data.get('problem', '')
    
    prompt = f"""
    Create a digital product (lead magnet) that solves this problem:
    Problem: {problem}
    
    Generate a detailed outline for a digital product that would help solve this problem.
    Include:
    1. Title (make it compelling and benefit-focused)
    2. Description (explain the value proposition)
    3. Format (e.g., PDF guide, checklist, template, etc.)
    4. Main content structure (detailed outline)
    5. Key takeaways or results the reader will get
    
    Format the response in clear sections.
    """
    
    # Generate content using Gemini
    response = model.generate_content(prompt)
    content = response.text if response.text else "Could not generate content. Please try again."
    
    # Parse the first line as title
    title = content.split('\n')[0].strip()
    
    return jsonify({
        "title": title,
        "description": content[:200] + "...",
        "problem_solved": problem,
        "format": "PDF Guide",
        "content": content
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
