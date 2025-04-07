import gradio as gr 
import assemblyai as aai

def voice_to_voice(audio_file):
    #transcribe audio
    transcription_response = audio_trancription(audio_file)

def audio_trancription():
    return True

def text_translation():
    return True

def text_to_speech():
    return True

audio_input = gr.Audio(
    sources=["microphone"],
    type="filepath"
)

demo = gr.Interface(
    fn=voice_to_voice,
    inputs=audio_input,
    outputs=[gr.Audio(label="Spanish"), gr.Audio(label="Turkish"), gr.Audio(label="Japanese")]  # Ensure 'outputs' is correct
)

if __name__ == "__main__":
    demo.launch()

