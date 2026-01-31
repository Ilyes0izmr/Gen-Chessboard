import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faDownload,
  faCircleInfo,
  faXmark,
  faDna,
  faUsers,
  faArrowsRotate,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import "./Navbar.css";

const Navbar = ({ onStart, onReset, statusMessage, isRunning }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const startX = useRef(0);

  const toggleInfo = () => setIsInfoOpen(!isInfoOpen);

  const handleClose = () => {
    setIsInfoOpen(false);
    setRotation(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - rotation;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newRotation = e.pageX - startX.current;
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const snapped = Math.round(rotation / 180) * 180;
    setRotation(snapped);
  };

  const handleCapture = () => {
    const boardElement = document.querySelector(".main-layout");

    if (boardElement) {
      html2canvas(boardElement, {
        backgroundColor: "#D6CFC7",
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `Gen-Solver-Capture-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      });
    }
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-section left">
          <div className="welcome-badge">
            <span className="welcome-text">{statusMessage}</span>
          </div>
        </div>

        <div className="navbar-section center">
          <div className="social-links-tray">
            <a
              href="https://www.linkedin.com/in/ilyes-izemmouren-901798337/"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faLinkedin} className="fa-icon-engraved" />
            </a>
            <a
              href="https://github.com/Ilyes0izmr"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faGithub} className="fa-icon-engraved" />
            </a>
            <a
              href="https://github.com/Ilyes0izmr"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faUserTie} className="fa-icon-engraved" />
            </a>
          </div>
        </div>

        <div className="navbar-section right">
          <div className={`status-led ${isRunning ? "active" : "idle"}`}></div>
          <div className="button-group-nav">
            <button
              className={`button-item info ${isInfoOpen ? "active-toggle" : ""}`}
              onClick={toggleInfo}
              title="Algorithm Info"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="fa-icon" />
            </button>
            <button
              className="button-item download"
              onClick={handleCapture}
              title="Download Board State"
            >
              <FontAwesomeIcon icon={faDownload} className="fa-icon" />
            </button>
            <div className="nav-divider"></div>
            <button className="button-item start" onClick={onStart}>
              <FontAwesomeIcon icon={faPlay} className="fa-icon" />
            </button>
            <button className="button-item stop" onClick={onReset}>
              <FontAwesomeIcon icon={faStop} className="fa-icon" />
            </button>
          </div>
        </div>
      </div>

      {isInfoOpen && (
        <div
          className="modal-overlay"
          onClick={handleClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="draggable-card-space"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
          >
            <div
              className="info-card-inner"
              style={{
                transform: `rotateY(${rotation}deg)`,
                transition: isDragging
                  ? "none"
                  : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* FRONT SIDE: PHASE I */}
              <div className="info-card-front">
                <h2 className="modal-title">AI Evolution: Phase I</h2>
                <div className="ga-steps-container">
                  <div className="ga-step-card">
                    <FontAwesomeIcon icon={faUsers} className="ga-step-icon" />
                    <p>
                      <strong>Population:</strong> Generates random boards to
                      explore millions of possibilities.
                    </p>
                  </div>
                  <div className="ga-step-card">
                    <FontAwesomeIcon
                      icon={faBullseye}
                      className="ga-step-icon"
                    />
                    <p>
                      <strong>Fitness & Elitism:</strong> Ranks boards by
                      conflicts; the top Alphas always survive.
                    </p>
                  </div>
                  <div className="ga-step-card">
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      className="ga-step-icon"
                    />
                    <p>
                      <strong>Crossover:</strong> Combines parent DNA to produce
                      superior offspring.
                    </p>
                  </div>
                </div>
                <div className="drag-hint">Grab edge to see Phase II →</div>
              </div>

              {/* BACK SIDE: PHASE II */}
              <div className="info-card-back">
                <h2 className="modal-title">AI Evolution: Phase II</h2>
                <div className="ga-steps-container">
                  <div className="ga-step-card">
                    <FontAwesomeIcon icon={faUsers} className="ga-step-icon" />
                    <p>
                      <strong>Selection:</strong> Prioritizes the "fittest"
                      boards to breed the next generation.
                    </p>
                  </div>
                  <div className="ga-step-card">
                    <FontAwesomeIcon icon={faDna} className="ga-step-icon" />
                    <p>
                      <strong>Mutation:</strong> Randomly shifts queens to
                      maintain diversity and find new paths.
                    </p>
                  </div>
                  <div className="ga-step-card">
                    <FontAwesomeIcon icon={faStop} className="ga-step-icon" />
                    <p>
                      <strong>Convergence:</strong> The cycle repeats until a
                      perfect, 0-conflict solution is found.
                    </p>
                  </div>
                </div>
                <div className="drag-hint">← Drag back to Phase I</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
