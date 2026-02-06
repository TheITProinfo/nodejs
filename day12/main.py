# main.py
# Call other modules to read Slack messages and summarize them using OpenAI API

import os
from datetime import datetime, timezone, timedelta

from dotenv import load_dotenv
load_dotenv()  # load environment variables from .env file

from slack_reader import fetch_channel_messages, format_messages_for_prompt
from summarizer import summarize_transcript


def main():
    # 1) Read secrets from env
    slack_token = os.environ.get("SLACK_BOT_TOKEN", "").strip()
    channel_id = os.environ.get("SLACK_CHANNEL_ID", "").strip()
    openai_key = os.environ.get("OPENAI_API_KEY", "").strip()

    if not slack_token or not channel_id or not openai_key:
        raise RuntimeError("Missing env vars: SLACK_BOT_TOKEN, SLACK_CHANNEL_ID, OPENAI_API_KEY")

    # 2) Time window (UTC) — last 7 days (demo-friendly)
    end_time_utc = datetime.now(timezone.utc)
    start_time_utc = end_time_utc - timedelta(days=7)

    # 3) Slack -> messages
    messages = fetch_channel_messages(slack_token, channel_id, start_time_utc, end_time_utc)

    print("messages count:", len(messages))
    if not messages:
        print("No messages found in the time window.")
        return

    # 4) messages -> transcript
    transcript = format_messages_for_prompt(slack_token, messages)

    # 5) transcript -> summary
    summary = summarize_transcript(transcript, api_key=openai_key, style="tldr")
    print("\n===== SUMMARY =====\n")
    print(summary)


if __name__ == "__main__":
    main()
