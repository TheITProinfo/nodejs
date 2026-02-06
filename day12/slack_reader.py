from slack_sdk import WebClient  # Slack SDK client import
from slack_sdk.errors import SlackApiError  # Slack API error handling
from datetime import datetime, timezone  # datetime imports
from typing import List, Dict # typing imports

def to_unix(dt: datetime) -> int:
    return int(dt.timestamp())


def fetch_channel_messages(
    slack_bot_token: str,
    channel_id: str,
    start_time_utc: datetime,
    end_time_utc: datetime,
) -> List[Dict]:
    """
    Read Slack channel messages within a UTC time window.
    Returns raw Slack message dicts.
    """
    client = WebClient(token=slack_bot_token)

    try:
        resp = client.conversations_history(
            channel=channel_id,
            oldest=to_unix(start_time_utc),
            latest=to_unix(end_time_utc),
        )

        if not resp.get("ok"):
            raise RuntimeError(f"Slack API error: {resp.get('error')}")

        # Slack returns newest-first; reverse to chronological
        return list(reversed(resp["messages"]))

    except SlackApiError as e:
        raise RuntimeError(f"SlackApiError: {e.response['error']}") from e


def resolve_user_name(client: WebClient, user_id: str) -> str:
    # Some messages might be bot/system messages without a "user"
    if not user_id:
        return "unknown"

    resp = client.users_info(user=user_id)
    if resp.get("ok"):
        return resp["user"]["name"]
    return "unknown"


def format_messages_for_prompt(slack_bot_token: str, messages: List[Dict]) -> str:
    """
    Convert Slack message dicts into a readable transcript for LLM prompt.
    Format: username [ISO timestamp]: text
    """
    client = WebClient(token=slack_bot_token)

    lines = []
    for m in messages:
        user_id = m.get("user")
        text = m.get("text", "")
        ts = m.get("ts")

        # Convert ts -> ISO time (UTC)
        try:
            dt = datetime.fromtimestamp(float(ts), tz=timezone.utc)
            ts_iso = dt.isoformat(timespec="seconds")
        except Exception:
            ts_iso = "unknown-time"

        user_name = resolve_user_name(client, user_id)
        lines.append(f"{user_name} [{ts_iso}]: {text}")

    return "\n".join(lines)
