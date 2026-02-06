"""
03) Fetch weather information using AccuWeather API (cleaned style + timeout).
- Input city
- Output: WeatherText, Fahrenheit, headline, icon URL
"""
import os
import requests
from dotenv import load_dotenv # import load_dotenv to load environment variables

load_dotenv() # load environment variables from .env file

ACCUWEATHER_API_KEY = os.getenv("ACCUWEATHER_API_KEY")
TIMEOUT_SECONDS = 10


def get_location_key(api_key: str, city_name: str) -> str | None:
    """Get AccuWeather location key for a city name."""
    url = "http://dataservice.accuweather.com/locations/v1/cities/search"
    params = {"apikey": api_key, "q": city_name}
    resp = requests.get(url, params=params, timeout=TIMEOUT_SECONDS)
    resp.raise_for_status()

    data = resp.json()
    if not data:
        return None
    return data[0].get("Key")


def get_current_conditions(api_key: str, location_key: str) -> dict | None:
    """Get current conditions for a location key."""
    url = f"http://dataservice.accuweather.com/currentconditions/v1/{location_key}"
    params = {"apikey": api_key}
    resp = requests.get(url, params=params, timeout=TIMEOUT_SECONDS)
    resp.raise_for_status()

    data = resp.json()
    return data[0] if data else None


def get_headline(api_key: str, location_key: str) -> str | None:
    """Get 1-day forecast headline text."""
    url = f"http://dataservice.accuweather.com/forecasts/v1/daily/1day/{location_key}"
    params = {"apikey": api_key}
    resp = requests.get(url, params=params, timeout=TIMEOUT_SECONDS)
    resp.raise_for_status()

    data = resp.json()
    headline = data.get("Headline", {}).get("Text")
    return headline


def main() -> None:
    """Main entry."""
    if not ACCUWEATHER_API_KEY:
        raise RuntimeError("Missing ACCUWEATHER_API_KEY in .env")

    user_city = input("Enter your city: ").strip()
    if not user_city:
        print("City is required.")
        return

    location_key = get_location_key(ACCUWEATHER_API_KEY, user_city)
    if not location_key:
        print("Location not found.")
        return

    conditions = get_current_conditions(ACCUWEATHER_API_KEY, location_key)
    if not conditions:
        print("Weather data not found.")
        return

    weather_text = conditions.get("WeatherText", "N/A")
    temp_f = conditions.get("Temperature", {}).get("Imperial", {}).get("Value", "N/A")

    icon_number = conditions.get("WeatherIcon", 0)
    icon_url = f"http://developer.accuweather.com/sites/default/files/{icon_number:02d}-s.png"

    headline_text = get_headline(ACCUWEATHER_API_KEY, location_key) or "N/A"

    print(f"\nWeather in {user_city}:")
    print(f"Temperature (F): {temp_f}")
    print(f"Weather Text: {weather_text}")
    print(f"Weather Headline: {headline_text}")
    print(f"Icon Number: {icon_number}")
    print(f"Icon URL: {icon_url}\n")


if __name__ == "__main__":
    main()
