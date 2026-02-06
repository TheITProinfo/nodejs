# author: chatgpt
# date: 2024-06-19

# this is a python demo file for model usage
# list available models from openai to verify API key works

from openai import OpenAI
from dotenv import load_dotenv
import os   
load_dotenv() # load environment variables from .env file
client=OpenAI() # create OpenAI client instance
models=client.models.list() # list available models
print(models) # print the list of models
