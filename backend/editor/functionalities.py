from tkinter import filedialog
from gtts import gTTS
from moviepy.editor import *
import speech_recognition
from googletrans import Translator


# Extract audio from Video
def extract_audio(video_path, audio_path="extracted_audio.wav"):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path, codec='pcm_s16le') # wav
    # audio.write_audiofile(sys.argv[2], codec='mp3') # For mp3: compressed audio
    return audio_path


# Speech Recognition
def recognize_speech(audio_path):
    # Initialize the recognizer
    sr = speech_recognition.Recognizer()
    try:
        with speech_recognition.AudioFile(audio_path) as source:
            audio_data = sr.record(source)
            print("Processing...")

            # Using google to recognize audio
            text_recognized = sr.recognize_google(audio_data)
            return text_recognized

    except speech_recognition.RequestError as e:
        print("Could not request results; {0}".format(e))

    except speech_recognition.UnknownValueError:
        print("Unknown error occurred!")


# Translate text
def translate_text(text, target_language="hi"):
    translator = Translator()
    translated_text = translator.translate(text, dest=target_language)
    return translated_text.text


# Convert text to audio
# def text_to_audio(text, rate=150, volume=1.0, language='en'):
#     tts = gTTS(text=text, lang=language)
#     converted_audio_path = "converted_audio.mp3"
#     tts.save(converted_audio_path)
#     return converted_audio_path
#     # os.system(
#     #     f"mpg123 {output_file}")


# Merge the audio back to video
# def combine_audio_with_video(video_path, audio_path):
#     # Load the video and audio clips
#     video = VideoFileClip(video_path)
#     audio = AudioFileClip(audio_path)

#     # Set the video's audio to the loaded audio clip
#     video = video.set_audio(audio)

#     # Output the final video with combined audio
#     video.write_videofile("video_with_audio.mp4", codec="libx264")


# Resize image
# def resize_image(image):
#     image_height = 300
#     aspect_ratio = image.width / image.height
#     image_width = int(image_height * aspect_ratio)
#     resized_image = image.resize((image_width, image_height))
#     return resized_image


# # extract_audio("video2.mp4")
# recognized_text = recognize_speech("extracted_audio.wav")
# translated = translate_text(recognized_text, "mr")
# print(translated)
# text_to_audio(translated, language="mr")
# combine_audio_to_video("video2.mp4", "converted_audio.mp3")

