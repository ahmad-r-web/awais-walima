import { useEffect, useRef, useState } from "react";
import "./index.css";

const weddingDate = new Date("2026-12-20T13:00:00");

const eventDay = "Sunday";
const eventDate = "20 December 2026";
const eventTime = "01:00 PM";

const venueName = "Taj Mahal Plus Marquee";
const venueAddress = "Samundari Road, Faisalabad";

const developerName = "Ahmad Raza";
const developerWhatsApp = "923408102453";

const videoPath = "/videos/wedding-background.mp4";
const musicPath = "/music/wedding.mp3";
const mapUrl = "https://maps.app.goo.gl/WeRmzfsHe63Cz8dU6?g_st=aw";

function ScratchHeart({ date }) {
  const canvasRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const moveCountRef = useRef(0);
  const totalHeartPixelsRef = useRef(1);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const width = 720;
    const height = 640;
    canvas.width = width;
    canvas.height = height;

    const heartPath = new Path2D();
    heartPath.moveTo(360, 600);
    heartPath.bezierCurveTo(280, 530, 58, 390, 58, 230);
    heartPath.bezierCurveTo(58, 95, 245, 45, 360, 185);
    heartPath.bezierCurveTo(475, 45, 662, 95, 662, 230);
    heartPath.bezierCurveTo(662, 390, 440, 530, 360, 600);
    heartPath.closePath();

    const paper = context.createLinearGradient(100, 70, 620, 570);
    paper.addColorStop(0, "#fff4cf");
    paper.addColorStop(0.28, "#d8b56f");
    paper.addColorStop(0.55, "#f4dfaa");
    paper.addColorStop(0.8, "#b98b45");
    paper.addColorStop(1, "#f8e9c2");

    context.save();
    context.clip(heartPath);
    context.fillStyle = paper;
    context.fillRect(0, 0, width, height);

    const sheen = context.createLinearGradient(0, 0, width, height);
    sheen.addColorStop(0, "rgba(255,255,255,0.72)");
    sheen.addColorStop(0.45, "rgba(255,255,255,0.04)");
    sheen.addColorStop(1, "rgba(91,58,20,0.18)");
    context.fillStyle = sheen;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < 420; i += 1) {
      const x = (i * 97) % width;
      const y = (i * 173) % height;
      context.beginPath();
      context.arc(x, y, (i % 3) + 1, 0, Math.PI * 2);
      context.fillStyle =
        i % 2 === 0 ? "rgba(255,255,255,0.28)" : "rgba(105,73,31,0.12)";
      context.fill();
    }

    context.strokeStyle = "rgba(255,250,225,0.9)";
    context.lineWidth = 5;
    context.stroke(heartPath);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#65451e";
    context.font = "700 29px Montserrat, sans-serif";
    context.fillText("SCRATCH HERE", 360, 310);
    context.font = "600 19px Montserrat, sans-serif";
    context.letterSpacing = "4px";
    context.fillText("TO REVEAL THE DATE", 360, 355);

    context.restore();

    const pixels = context.getImageData(0, 0, width, height).data;
    let total = 0;
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        const index = (y * width + x) * 4 + 3;
        if (pixels[index] > 0) total += 1;
      }
    }
    totalHeartPixelsRef.current = Math.max(total, 1);
  }, []);

  const eraseAt = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.save();
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 48, 0, Math.PI * 2);
    context.fill();
    context.restore();

    moveCountRef.current += 1;
    if (moveCountRef.current % 7 !== 0) return;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let remaining = 0;
    for (let y = 0; y < canvas.height; y += 8) {
      for (let x = 0; x < canvas.width; x += 8) {
        const index = (y * canvas.width + x) * 4 + 3;
        if (pixels[index] > 30) remaining += 1;
      }
    }

    const erased = 1 - remaining / totalHeartPixelsRef.current;

    if (erased > 0.34) {
      setIsRevealed(true);
      isPointerDownRef.current = false;
    }
  };

  const handlePointerDown = (event) => {
    if (isRevealed) return;
    event.preventDefault();
    isPointerDownRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    eraseAt(event);
  };

  const handlePointerMove = (event) => {
    if (!isPointerDownRef.current || isRevealed) return;
    event.preventDefault();
    eraseAt(event);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className="scratch-section">
      <p className="scratch-overline">A LITTLE SURPRISE FOR YOU</p>
      <p className="scratch-instruction">
        Scratch the golden heart to reveal our special day
      </p>

      <div
        className={`scratch-heart ${isRevealed ? "scratch-revealed" : ""}`}
        aria-label={
          isRevealed
            ? `Wedding date: ${date}`
            : "Scratch the heart to reveal the wedding date"
        }
      >
        <svg
          className="scratch-heart-clip-defs"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id="scratch-heart-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.5 0.94 C 0.42 0.85, 0.08 0.60, 0.08 0.35 C 0.08 0.13, 0.34 0.05, 0.5 0.27 C 0.66 0.05, 0.92 0.13, 0.92 0.35 C 0.92 0.60, 0.58 0.85, 0.5 0.94 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="scratch-date" aria-live="polite">
          <span className="scratch-date-label">OUR SPECIAL DAY</span>
          <strong>{date}</strong>
          <span className="scratch-date-flourish">✦ ♥ ✦</span>
        </div>

        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
          aria-hidden="true"
        />
      </div>

      {!isRevealed && (
        <button
          className="scratch-access-button"
          type="button"
          onClick={() => setIsRevealed(true)}
        >
          Reveal date
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const audioRef = useRef(null);
  const openingTimerRef = useRef(null);

  const openInvitation = () => {
    if (isOpening || isOpen) return;

    setIsOpening(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.5;

      audioRef.current
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }

    openingTimerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 4900);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
      return;
    }

    try {
      await audioRef.current.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const difference = weddingDate.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(timer);

      if (openingTimerRef.current) {
        window.clearTimeout(openingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <audio ref={audioRef} loop preload="auto">
        <source src={musicPath} type="audio/mpeg" />
      </audio>

      {/* ENVELOPE INTRO */}
      {!isOpen && (
        <section
          className={`intro-screen ${isOpening ? "is-opening" : ""}`}
          aria-label="Wedding invitation envelope"
        >
          <div className="html-envelope-scene">
            <div className="html-envelope-depth" aria-hidden="true" />

            <div className="html-envelope-body">
              <div className="html-envelope-upper" aria-hidden="true" />
              <div className="html-envelope-lower" aria-hidden="true" />

              <div className="html-triangle-flap">
                <div className="html-triangle-front" aria-hidden="true" />
                <div className="html-triangle-back" aria-hidden="true" />
                <button
                  className="html-envelope-seal"
                  type="button"
                  onClick={openInvitation}
                  disabled={isOpening}
                  aria-label="Open invitation"
                >
                  <span className="html-seal-face html-seal-front">
                    <span className="html-seal-symbol" aria-hidden="true">
                      ❦
                    </span>
                  </span>
                  <span
                    className="html-seal-face html-seal-back"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="html-envelope-border" aria-hidden="true" />
              <div className="html-paper-texture" aria-hidden="true" />
            </div>

            <div className="html-effects-window" aria-hidden="true">
              <div className="html-light-rays">
                <svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="htmlRayGlow">
                      <stop offset="0%" stopColor="#fff7d8" stopOpacity=".95" />
                      <stop offset="35%" stopColor="#f5d58e" stopOpacity=".55" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="htmlRayWhite" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#fff8df" stopOpacity=".9" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="htmlRayGold" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#eac77e" stopOpacity=".85" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                    <filter id="htmlRayBlur">
                      <feGaussianBlur stdDeviation="9" />
                    </filter>
                  </defs>

                  <ellipse
                    cx="450"
                    cy="420"
                    rx="200"
                    ry="130"
                    fill="url(#htmlRayGlow)"
                    filter="url(#htmlRayBlur)"
                  />
                  <g opacity=".8">
                    <path
                      d="M450 420 L80 0 L260 0 Z"
                      fill="url(#htmlRayGold)"
                    />
                    <path
                      d="M450 420 L270 0 L355 0 Z"
                      fill="url(#htmlRayWhite)"
                    />
                    <path
                      d="M450 420 L390 0 L450 0 Z"
                      fill="url(#htmlRayGold)"
                    />
                    <path
                      d="M450 420 L465 0 L540 0 Z"
                      fill="url(#htmlRayWhite)"
                    />
                    <path
                      d="M450 420 L570 0 L680 0 Z"
                      fill="url(#htmlRayGold)"
                    />
                    <path
                      d="M450 420 L650 0 L850 0 Z"
                      fill="url(#htmlRayWhite)"
                    />
                  </g>
                  <g stroke="#fff8dc" strokeWidth="2" opacity=".7">
                    <path d="M450 420 L130 40" />
                    <path d="M450 420 L320 15" />
                    <path d="M450 420 L440 0" />
                    <path d="M450 420 L590 25" />
                    <path d="M450 420 L800 65" />
                  </g>
                  <g fill="#fff8df">
                    <circle cx="260" cy="190" r="3" />
                    <circle cx="580" cy="150" r="4" />
                    <circle cx="375" cy="105" r="2.5" />
                    <circle cx="680" cy="250" r="3" />
                    <circle cx="190" cy="285" r="2.5" />
                  </g>
                </svg>
              </div>

              {["one", "two", "three", "four"].map((cluster) => (
                <div
                  className={`html-sparkle-cluster html-cluster-${cluster}`}
                  key={cluster}
                >
                  {Array.from({ length: 6 }, (_, index) => (
                    <span key={index} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="intro-instruction">
            <div className="intro-instruction-divider">✦</div>
            <p className="intro-hint">TAP THE SEAL TO OPEN</p>
            <span className="intro-hint-arrow">↓</span>
          </div>
          {isOpening && (
            <div className="intro-opening-message" aria-live="polite">
              OPENING YOUR INVITATION
            </div>
          )}
          <div className="intro-bottom-note">A CELEBRATION OF LOVE</div>
        </section>
      )}

      {/* MAIN INVITATION */}
      {isOpen && (
        <main className="invitation-site">
          <video
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={videoPath} type="video/mp4" />
          </video>

          <div className="video-overlay"></div>

          <div className="floating-decoration" aria-hidden="true">
            <span>✦</span>
            <span>❀</span>
            <span>✧</span>
            <span>❀</span>
            <span>✦</span>
            <span>✧</span>
            <span>❀</span>
          </div>

          <button
            className="music-button"
            onClick={toggleMusic}
            aria-label={musicOn ? "Turn music off" : "Turn music on"}
          >
            <span className={musicOn ? "music-playing" : ""}>
              {musicOn ? "♫" : "♪"}
            </span>
            {musicOn ? "Music On" : "Music Off"}
          </button>

          <section className="hero-section">
            <div className="hero-content">
              <p className="hero-overline">WITH LOVE AND BLESSINGS</p>

              <div className="hero-flower">❀</div>

              {/* Groom & bride on one line: Awais & Mrs Awais */}
              <h1 className="couple-names">
                <span className="name-initial">A</span>
                <span className="name-rest">wais</span>
                <span className="name-ampersand">&</span>
                <span className="name-initial">M</span>
                <span className="name-rest">rs</span>
                <span className="name-space"> </span>
                <span className="name-initial">A</span>
                <span className="name-rest">wais</span>
              </h1>

              <div className="gold-divider">
                <span>✦</span>
              </div>

              <p className="hero-message">
                Together with our families, we invite you{" "}
                <br />
                to celebrate a beautiful new beginning.
              </p>

              <p className="hero-event">WALIMA CELEBRATION</p>

              <ScratchHeart date={eventDate} />
            </div>

            <div className="scroll-indicator">
              <span></span>
              SCROLL TO EXPLORE
            </div>
          </section>

          <section className="save-date-section">
            <div className="section-card">
              <p className="section-overline">PLEASE JOIN US</p>

              <h2 className="section-heading">Save The Date</h2>

              <div className="gold-divider">
                <span>✦</span>
              </div>

              <p className="save-date-text">
                Your presence will make our celebration even more special.
              </p>
            </div>
          </section>

          <section className="countdown-section">
            <p className="section-overline">THE CELEBRATION BEGINS IN</p>

            <h2 className="section-heading">Counting Every Moment</h2>

            <div className="countdown-container">
              <div className="countdown-box">
                <strong>{timeLeft.days}</strong>
                <span>Days</span>
              </div>

              <div className="countdown-box">
                <strong>{timeLeft.hours}</strong>
                <span>Hours</span>
              </div>

              <div className="countdown-box">
                <strong>{timeLeft.minutes}</strong>
                <span>Minutes</span>
              </div>

              <div className="countdown-box">
                <strong>{timeLeft.seconds}</strong>
                <span>Seconds</span>
              </div>
            </div>
          </section>

          <section className="event-section">
            <div className="section-card event-card">
              <p className="section-overline">WE WOULD LOVE TO SEE YOU</p>

              <h2 className="section-heading">Walima</h2>

              <div className="gold-divider">
                <span>✦</span>
              </div>

              <div className="event-icon">❀</div>

              <p className="event-description">
                Please join us as we celebrate this beautiful occasion with
                family and friends. Your presence and blessings mean a lot to
                us.
              </p>

              <div className="event-details">
                <div className="event-detail">
                  <span className="detail-icon">▦</span>
                  <div>
                    <h3>Date</h3>
                    <p>{eventDate}</p>
                  </div>
                </div>

                <div className="event-detail">
                  <span className="detail-icon">◷</span>
                  <div>
                    <h3>Time</h3>
                    <p>{eventTime}</p>
                  </div>
                </div>

                <div className="event-detail">
                  <span className="detail-icon">⌖</span>
                  <div>
                    <h3>Venue</h3>
                    <p>{venueName}</p>
                    <p>{venueAddress}</p>
                  </div>
                </div>
              </div>

              <a
                className="directions-button"
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="directions-icon">⌖</span>
                <span>Get Venue Directions</span>
                <span className="directions-arrow">↗</span>
              </a>
            </div>
          </section>

          <section className="personal-section">
            <div className="personal-card">
              <div className="personal-flower">❀</div>

              <p className="section-overline">WITH WARMEST REGARDS</p>

              <h2>
                Your Presence Is Our
                <br />
                Greatest Gift
              </h2>

              <p>
                We look forward to celebrating this memorable day with you.
                Please join us and bless the beginning of our new journey.
              </p>

              <div className="gold-divider">
                <span>♥</span>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-flower">✦</div>

            <p>Thank you for being a part of our happiness.</p>

            <div className="footer-divider"></div>

            <div className="developer-footer">
              <p>
                Designed &amp; Developed by <strong>{developerName}</strong>
              </p>

              <a
                href={`https://wa.me/${developerWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="developer-contact"
              >
                <span>☏</span>
                Contact Developer on WhatsApp
              </a>
            </div>

            <p className="copyright">© 2026 Wedding Invitation</p>
          </footer>
        </main>
      )}
    </div>
  );
}