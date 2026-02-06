## this is a demo for basic chatGPT client in python (chat completion)

from dotenv import load_dotenv # import load_dotenv to load environment variables
from openai import OpenAI # import OpenAI class
load_dotenv() # load environment variables from .env file
client=OpenAI() # create OpenAI client instance

response=client.chat.completions.create( # create chat completion
    model="gpt-4o", # specify model
    messages=[ # provide messages
        {"role":"system","content":"You are a Python programming assistant."},
        {"role":"user","content":"Hello, why Python is typically used for data science?"}
    ],
    temperature=0.7, # set temperature
    max_tokens=500, # set maximum tokens for response
    top_p=1.0, # set top_p
    frequency_penalty=0.0, # set frequency penalty      
    presence_penalty=0.0, # set presence penalty
)
print(response.choices[0].message.content) # print the response content