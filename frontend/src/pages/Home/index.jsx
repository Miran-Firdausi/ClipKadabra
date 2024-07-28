import Header from "@/components/Commons/Header";
import Footer from "@/components/Commons/Footer";
import FeatureCard from "@/components/Commons/FeatureCard";
import { Link } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <>
      <Header />
      <main className="homepage">
        <section className="hero">
          <div className="container">
            <h1 class="welcome-heading">
              Welcome to <span class="clip-kadabra">Clip Kadabra</span>
            </h1>
            <p>Unleash the Magic of AI-Powered Video Editing</p>
            <div className="buttons">
              <a href="#features" className="btn-secondary">
                Discover Features
              </a>
              <Link to="/editor" className="btn-primary">
                Start Editing
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="features">
          <h2>Magical Features</h2>

          <div className="features-container">
            <div className="features-grid">
              <FeatureCard
                title="Precision Editing"
                description="Trim your videos to perfection with our precise cutting tools. Seamlessly merge multiple clips into one cohesive video. Enhance your visuals with a wide range of background music and sound effects."
              />
              <FeatureCard
                title="Captivating Visuals"
                description="Add dynamic text overlays to your videos with stylish fonts and animations. Create engaging titles, subtitles, and call-to-actions. Customize text color, size, and position for a professional look."
              />
              <FeatureCard
                title="Global Reach"
                description="Break language barriers with our AI-powered dubbing feature. Translate your videos into multiple languages effortlessly. Reach a wider audience and expand your global impact."
              />
            </div>
          </div>
        </section>
        <section id="about" className="about">
          <div className="container">
            <h2>About Clip Kadabra</h2>
            <p>
              Clip Kadabra is your ultimate AI-powered video editing software.
              Designed to make video editing simple, fast, and fun, Clip Kadabra
              empowers you to create professional-quality videos with ease.
              Whether you're a seasoned editor or just getting started, our
              intuitive tools and magical features will help you bring your
              vision to life.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
