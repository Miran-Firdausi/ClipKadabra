from googletrans import Translator
from gtts import gTTS
from moviepy.editor import *
import speech_recognition as sr

# Extract audio from Video
def extract_audio(video_path, audio_path="extracted_audio.wav"):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path, codec='pcm_s16le') # wav
    return audio_path

# Speech Recognition
def recognize_speech(audio_path):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text_recognized = recognizer.recognize_google(audio_data)
            return text_recognized
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
    except sr.UnknownValueError:
        print("Unknown error occurred!")

# Translate text
def translate_text(text, target_language):
    translator = Translator()
    translated_text = translator.translate(text, dest=target_language)
    return translated_text.text

# Convert text to audio
def text_to_audio(text, language):
    tts = gTTS(text=text, lang=language)
    converted_audio_path = "converted_audio.mp3"
    tts.save(converted_audio_path)
    return converted_audio_path

# Merge the audio back to video
def combine_audio_with_video(video_path, audio_path, output_path="processed_video.mp4"):
    video = VideoFileClip(video_path)
    audio = AudioFileClip(audio_path)
    video = video.set_audio(audio)
    video.write_videofile(output_path, codec="libx264")
    return output_path