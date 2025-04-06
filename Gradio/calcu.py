import gradio as gr 

def calculator(num1, operation, num2):
    if operation == "add":
        return num1 + num2
    elif operation == "subtract":
        return num1 - num2 
    elif operation == "multiply":
        return num1 * num2
    elif operation == "devide":
        if num2 == 0:
            raise gr.Error('Cannot divide by zero!')
        return num1 / num2
    
demo = gr.Interface(
    calculator,
    [
        "number",
        gr.Radio(["add", "subtract", "multiply", "divide"]),
        "number"
    ],
    "number",
    examples=[
        [45, "add", 3],
        [3.14, "divide", 2],
        [144, "multiply", 2.5],
        [0, "subtract", 1.2],
    ],
    title="Gradio test Calculator",
    description="Here's a sample using Gradio calculator.",
)

demo.launch()