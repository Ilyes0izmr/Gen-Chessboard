import React, { useState } from "react";
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

  // Toggle function for the info button
  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  const handleCapture = () => {
    const boardElement = document.querySelector(".chessboard-rim-outlier");
    if (boardElement) {
      html2canvas(boardElement, { backgroundColor: "#C9C9C9" }).then(
        (canvas) => {
          const link = document.createElement("a");
          link.download = "chessboard-capture.png";
          link.href = canvas.toDataURL();
          link.click();
        },
      );
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
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faLinkedin} className="fa-icon-engraved" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faGithub} className="fa-icon-engraved" />
            </a>
            <a
              href="https://yourportfolio.com"
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
            {/* Toggle logic applied here */}
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

      {/* Modal remains the same, but the Info button can now close it */}
      {isInfoOpen && (
        <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}>
          <div
            className="neomorphic-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setIsInfoOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h2 className="modal-title">Genetic Algorithm Logic</h2>
            <p className="modal-subtitle">
              Evolving a solution for the N-Queens puzzle.
            </p>

            <div className="ga-steps-container">
              <div className="ga-step-card">
                <FontAwesomeIcon icon={faUsers} className="ga-step-icon" />
                <p>
                  <strong>Population:</strong> Randomly generates board states
                  (chromosomes).
                </p>
              </div>

              <div className="ga-step-card">
                <FontAwesomeIcon icon={faBullseye} className="ga-step-icon" />
                <p>
                  <strong>Selection:</strong> Picks the "fittest" boards with
                  the fewest queen conflicts.
                </p>
              </div>

              <div className="ga-step-card">
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className="ga-step-icon"
                />
                <p>
                  <strong>Crossover:</strong> Swaps DNA between parents to
                  create better offspring.
                </p>
              </div>

              <div className="ga-step-card">
                <FontAwesomeIcon icon={faDna} className="ga-step-icon" />
                <p>
                  <strong>Mutation:</strong> Randomly shifts queens to prevent
                  the AI from getting stuck.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
