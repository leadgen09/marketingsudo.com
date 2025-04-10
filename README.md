# Lead Magnet Generator

A tool that helps you find problems on social media platforms and automatically generate digital products (lead magnets) to solve those problems. Perfect for building your email list with targeted, problem-solving content.

## Features

- Search for problems and pain points across multiple platforms:
  - Reddit
  - Twitter
  - Facebook
- Generate digital product ideas based on real problems
- Create lead magnet content using AI
- Package solutions as email list building tools

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your API credentials:
   ```bash
   cp .env.example .env
   ```
4. Get API credentials from:
   - Reddit: https://www.reddit.com/prefs/apps
   - Twitter: https://developer.twitter.com/
   - Facebook: https://developers.facebook.com/
   - OpenAI: https://platform.openai.com/

## Usage

1. Start the server:
   ```bash
   python main.py
   ```

2. The API will be available at `http://localhost:8000`

3. API Endpoints:
   - GET `/search-problems/{platform}` - Search for problems on a specific platform
     - Parameters:
       - platform: "reddit", "twitter", or "facebook"
       - query: Search query
       - limit: Number of results (default: 10)
   
   - POST `/generate-lead-magnet` - Generate a lead magnet for a specific problem
     - Body: Problem object with source, platform, content, url, and engagement

## Example Usage

```python
import requests

# Search for problems
response = requests.get("http://localhost:8000/search-problems/reddit?query=marketing&limit=5")
problems = response.json()

# Generate a lead magnet
lead_magnet = requests.post(
    "http://localhost:8000/generate-lead-magnet",
    json=problems[0]
).json()
```

## Contributing

Feel free to submit issues and enhancement requests! 