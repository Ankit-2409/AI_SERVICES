import openai
import gradio
import json

openai.api_key = "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"

# Load guidelines from JSON file
with open("output.json", "r") as file:
    guidelines = json.load(file)

def check_guidelines(user_input):
    # Check if the user input matches any of the guidelines
    for guideline in guidelines:
        if guideline.lower() in user_input.lower():
            return True
    return False

def CustomChatGPT(user_input):
    messages = [{"role": "system", "content": "You are a financial expert that specializes in asset management, investment advisory, wealth management, fund management and negotiation"}]
    
    # Check if the user input matches any guideline
    if check_guidelines(user_input):
        ChatGPT_reply = "I'm sorry, but I am unable to provide a response to this question as it is beyond my scope of expertise."
    else:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages + [{"role": "user", "content": user_input}]
        )
        ChatGPT_reply = response["choices"][0]["message"]["content"]

    return ChatGPT_reply  # Return the response

def run_chatgpt():
    # Define Gradio interface with Textbox input and output
    demo = gradio.Interface(
        fn=CustomChatGPT,
        inputs=gradio.inputs.Textbox(label="User Input", placeholder="Enter your question"),
        outputs=gradio.outputs.Textbox(label="Response"),
        title="M&G AI"
    )
    demo.launch(share=True)

# Run the ChatGPT interface
run_chatgpt()
