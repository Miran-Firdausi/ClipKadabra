# Clip Kadabra

Clip Kadabra is a powerful and intuitive video editing web application designed to cater to all your video editing needs. With a range of features from trimming and merging videos to adding filters and dubbing, Clip Kadabra aims to provide a seamless video editing experience. The application leverages React for the frontend, Django for the backend, and FFmpeg for video processing functionalities.

## Features

1. **Trimming the Video**
   - Easily trim your videos to the desired length by selecting the start and end points.

2. **Merging Videos**
   - Merge multiple video files into a single seamless video.

3. **Merging Audio to the Video**
   - Add and synchronize audio tracks to your video files.

4. **Adding Text to the Video**
   - Insert custom text into your videos with adjustable positions and styles.

5. **Adding Filters to the Video**
   - Apply various filters to enhance the visual quality of your videos.
6. **Dubbing the Video**
   - Add voiceovers or dubbed audio tracks to your videos.
7. **Timeline**
   - A user friendly timeline to track the flow of videos and audios.
## Tech Stack

- **Frontend:** React
- **Backend:** Django
- **Video Processing:** FFmpeg


## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (for running the React frontend)
- Python and pip (for running the Django backend)
- FFmpeg (for video processing)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/clip-kadabra.git
   cd clip-kadabra
   ```

2. **Setup the Backend:**

   Navigate to the `backend` directory and install the dependencies:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

   Apply the migrations and start the Django server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

3. **Setup the Frontend:**

   Navigate to the `frontend` directory and install the dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

   Start the React development server:

   ```bash
   npm run dev
   ```
### Usage

1. **Access the Application:**

   Open your web browser and navigate to `http://localhost:3000` to start using Clip Kadabra.

2. **Upload and Edit Videos:**

   - Use the provided interface to upload video files.
   - Select the desired editing functionalities (trimming, merging, adding audio/text, applying filters, dubbing).
   - Process the videos and download the edited files.

### Contributing

We welcome contributions to improve Clip Kadabra! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
