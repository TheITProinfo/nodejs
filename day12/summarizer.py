## this is demo for summarization the message of the Slack channel using chatGPT


from openai import OpenAI # import OpenAI class
# load environment variables from .env file

def summarize_transcript(
    transcript: str,
    api_key: str,
    style: str = "tldr",
) -> str:
    """
    style options:
      - 'tldr'
      - '3sentences'
      - 'manager'
      - 'qa_next_steps'
    """
    client = OpenAI(api_key=api_key)

    if style == "tldr":
        user_prompt = "Tl;dr"
        max_tokens = 360
        temperature = 1
        top_p = 1
    elif style == "3sentences":
        user_prompt = "Explain this in 3 sentences or less."
        max_tokens = 250
        temperature = 0.2
        top_p = 1
    elif style == "manager":
        user_prompt = "Summarize this conversation and explain it to me like I'm a manager with little technical experience."
        max_tokens = 750
        temperature = 0.5
        top_p = 1
    else:  # qa_next_steps
        user_prompt = "I'm a QA engineer at the company. Give me suggestions on next steps."
        max_tokens = 1200
        temperature = 1
        top_p = 0.75

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": transcript},
        {"role": "user", "content": user_prompt},
    ]

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=temperature,
        top_p=top_p,
        max_tokens=max_tokens,
    )

    return resp.choices[0].message.content.strip()