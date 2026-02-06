## author: ChatGPT
## date: 2026-02-03
# this is a demo model file to verify OpenAI API key works
# to make the output simpler, we just list available models from OpenAI

from openai import OpenAI # import OpenAI class
from dotenv import load_dotenv # import load_dotenv to load environment variables


load_dotenv() # load environment variables from .env file
client=OpenAI() # create OpenAI client instance
models=client.models.list() # list available models
# for loop to iterate through models and print model ids
for model in models.data:
    print(f"Model ID: {model.id}")    # print model id
    print(f"Created: {model.created}")  # print model creation time
    print(f"Object: {model.object}")     # print object type
    print(f"Owned By: {model.owned_by}")  # print owner information
    print("\n============================\n")