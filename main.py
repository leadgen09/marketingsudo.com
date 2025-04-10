import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import praw
from dotenv import load_dotenv
import json
from datetime import datetime
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI(title="Lead Magnet Generator")

# Initialize API clients
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

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

class Problem(BaseModel):
    source: str
    platform: str
    content: str
    url: str
    engagement: int

class LeadMagnet(BaseModel):
    title: str
    description: str
    problem_solved: str
    format: str
    content: str

@app.get("/")
async def root():
    return {"message": "Welcome to Lead Magnet Generator API"}

@app.get("/search-problems/{platform}")
async def search_problems(platform: str, query: str, limit: int = 10):
    problems = []
    
    if platform == "reddit":
        subreddits = reddit.subreddit("all").search(query, limit=limit)
        for post in subreddits:
            problems.append(Problem(
                source=post.title,
                platform="reddit",
                content=post.selftext,
                url=f"https://reddit.com{post.permalink}",
                engagement=post.score
            ))
    
    elif platform == "twitter":
        raise HTTPException(status_code=400, detail="Twitter search is temporarily unavailable")
    
    return problems

@app.post("/generate-lead-magnet")
async def generate_lead_magnet(problem: Problem):
    # Use Gemini to generate lead magnet content
    prompt = f"""
    Create a digital product (lead magnet) that solves this problem:
    Problem: {problem.content}
    
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
    
    # Parse the first line as title (assuming it's the title)
    title = content.split('\n')[0].strip()
    
    lead_magnet = LeadMagnet(
        title=title,
        description=content[:200] + "...",
        problem_solved=problem.content,
        format="PDF Guide",
        content=content
    )
    
    return lead_magnet

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 