from django.core.files.storage import default_storage
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from googletrans import Translator
from gtts import gTTS
from moviepy.editor import *
import speech_recognition as sr
import os

@api_view(['POST'])
def process_video(request):
    if 'video' not in request.FILES or 'language' not in request.data:
        return Response({'error': 'No video file or language provided'}, status=400)
    
    video_file = request.FILES['video']
    target_language = request.data['language']
    video_path = default_storage.save(video_file.name, video_file)
    video_path = os.path.join(default_storage.location, video_path)

    try:
        # Extract audio from video
        audio_path = "extracted_audio.wav"
        video = VideoFileClip(video_path)
        audio = video.audio
        audio.write_audiofile(audio_path, codec='pcm_s16le')

        # Recognize speech from audio
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text_recognized = recognizer.recognize_google(audio_data)

        # Translate text
        translator = Translator()
        translated_text = translator.translate(text_recognized, dest=target_language).text

        # Convert text to speech
        tts = gTTS(text=translated_text, lang=target_language)
        converted_audio_path = "converted_audio.mp3"
        tts.save(converted_audio_path)

        # Merge new audio with the video
        audio = AudioFileClip(converted_audio_path)
        video = video.set_audio(audio)
        processed_video_path = "processed_video.mp4"
        video.write_videofile(processed_video_path, codec="libx264")

        # Return the processed video
        with open(processed_video_path, 'rb') as video_file:
            response = HttpResponse(video_file.read(), content_type='video/mp4')
            response['Content-Disposition'] = f'attachment; filename={os.path.basename(processed_video_path)}'
            return response

    except sr.RequestError as e:
        return Response({'error': f'Speech recognition request error: {e}'}, status=500)
    except sr.UnknownValueError:
        return Response({'error': 'Speech recognition could not understand audio'}, status=500)
    except Exception as e:
        return Response({'error': f'An error occurred: {e}'}, status=500)
    finally:
        # Clean up temporary files
        if os.path.exists(video_path):
            os.remove(video_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if os.path.exists(converted_audio_path):
            os.remove(converted_audio_path)
        if os.path.exists(processed_video_path):
            os.remove(processed_video_path)
