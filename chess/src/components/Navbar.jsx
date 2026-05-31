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
  faGear,
  faChessQueen,
  faChessRook,
  faChessBishop,
  faChessKnight,
  faMinus,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import "./Navbar.css";

const MIN_PIECES = 4;
const MAX_PIECES = 16;

const PIECE_DEFS = [
  { key: "Q", label: "Queens", icon: faChessQueen },
  { key: "R", label: "Rooks", icon: faChessRook },
  { key: "B", label: "Bishops", icon: faChessBishop },
  { key: "K", label: "Knights", icon: faChessKnight },
];

const Navbar = ({ onStart, onReset, statusMessage, isRunning, pieceConfig, onPieceConfigChange }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const startX = useRef(0);

  // Local draft config — only applied when user clicks Apply
  const [draftConfig, setDraftConfig] = useState({ ...pieceConfig });

  const toggleInfo = () => setIsInfoOpen(!isInfoOpen);

  const toggleConfig = () => {
    if (!isConfigOpen) {
      setDraftConfig({ ...pieceConfig }); // Reset draft to current config
    }
    setIsConfigOpen(!isConfigOpen);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
    setRotation(0);
  };

  const handleCloseConfig = () => {
    setIsConfigOpen(false);
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
        link.href = ""; // Release data URL reference for memory cleanup
      });
    }
  };

  // --- Config card logic ---
  const draftTotal = Object.values(draftConfig).reduce((s, v) => s + v, 0);
  const isValidTotal = draftTotal >= MIN_PIECES && draftTotal <= MAX_PIECES && draftTotal % 2 === 0;

  const handleIncrement = (key) => {
    const newTotal = draftTotal + 1;
    if (newTotal <= MAX_PIECES) {
      setDraftConfig((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    }
  };

  const handleDecrement = (key) => {
    if (draftConfig[key] > 0) {
      setDraftConfig((prev) => ({ ...prev, [key]: prev[key] - 1 }));
    }
  };

  const handleApplyConfig = () => {
    if (isValidTotal) {
      onPieceConfigChange({ ...draftConfig });
      setIsConfigOpen(false);
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
              rel="noopener noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faLinkedin} className="fa-icon-engraved" />
            </a>
            <a
              href="https://github.com/Ilyes0izmr"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FontAwesomeIcon icon={faGithub} className="fa-icon-engraved" />
            </a>
            <a
              href="https://github.com/Ilyes0izmr"
              target="_blank"
              rel="noopener noreferrer"
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
              className={`button-item config ${isConfigOpen ? "active-toggle" : ""}`}
              onClick={toggleConfig}
              title="Board Configuration"
            >
              <FontAwesomeIcon icon={faGear} className="fa-icon" />
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

      {/* --- INFO MODAL --- */}
      {isInfoOpen && (
        <div
          className="modal-overlay"
          onClick={handleCloseInfo}
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

      {/* --- CONFIG MODAL --- */}
      {isConfigOpen && (
        <div className="modal-overlay" onClick={handleCloseConfig}>
          <div
            className="config-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="config-close-btn" onClick={handleCloseConfig}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h2 className="modal-title">Board Configuration</h2>
            <p className="config-subtitle">Customize pieces on the board</p>

            <div className="config-pieces-list">
              {PIECE_DEFS.map(({ key, label, icon }) => (
                <div className="config-piece-row" key={key}>
                  <div className="config-piece-info">
                    <FontAwesomeIcon icon={icon} className="config-piece-icon" />
                    <span className="config-piece-label">{label}</span>
                  </div>
                  <div className="config-stepper">
                    <button
                      className="stepper-btn"
                      onClick={() => handleDecrement(key)}
                      disabled={draftConfig[key] <= 0}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="stepper-value">{draftConfig[key]}</span>
                    <button
                      className="stepper-btn"
                      onClick={() => handleIncrement(key)}
                      disabled={draftTotal >= MAX_PIECES}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="config-footer">
              <div className={`config-total-badge ${isValidTotal ? "valid" : "invalid"}`}>
                <span className="config-total-label">Total</span>
                <span className="config-total-value">{draftTotal}</span>
                <span className="config-total-range">{MIN_PIECES}–{MAX_PIECES} even</span>
              </div>
              <button
                className={`config-apply-btn ${isValidTotal ? "" : "disabled"}`}
                onClick={handleApplyConfig}
                disabled={!isValidTotal}
              >
                <FontAwesomeIcon icon={faCheck} className="apply-icon" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
