import React, { useState, useRef, useEffect, useContext } from "react";
import roundOneBgVideo from "../assets/roundone-bg.mp4";
import roundOneRewardVideo from "../assets/round-one-reward .mp4"; // keep filename as-is
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

/*
  Refactored RoundOne component
  - Uses backend-driven questions (allQues state)
  - Respects AuthContext token (AuthProvider should set axios.defaults.headers.common.Authorization)
  - Robust loading / error handling
  - Falls back to a small set of built-in tasks if fetch fails
  - Maintains the dice + preview + expanded UX from your original file
  - Answer validation uses backend-provided `answer` field when present, otherwise uses local mapping

  Usage notes:
  - Ensure AuthProvider wraps the app so token is available in context and axios header is set.
  - Endpoint expected: GET /api/v1/round1/getallquestion/:yr -> returns array of question objects
    each question object should contain at minimum: { id, title, description, challenge, type, answer? }
*/

const BUILTIN_TASKS = [
  {
    id: 1,
    title: "Binary Decoder",
    description: "Decode this binary message to uncover a hidden clue",
    challenge:
      "01010100 01101000 01100101 00100000 01010101 01110000 01110011 01101001 01100100 01100101 00100000 01000100 01101111 01110111 01101110",
    type: "binary",
    answer: "THE UPSIDE DOWN",
  },
  {
    id: 2,
    title: "Stranger Things Quiz",
    description: "Answer this question about Stranger Things",
    challenge: "What is Eleven's real name?",
    type: "quiz",
    answer: "JANE",
  },
  {
    id: 3,
    title: "Crossword Challenge",
    description: "Solve the tech and Stranger Things crossword",
    challenge: "3-Down: Hawkins Lab's secret project (6 letters)",
    type: "crossword",
    answer: "HAWKINS",
  },
  {
    id: 4,
    title: "Upside Down Riddle",
    description: "Crack this riddle related to the Upside Down",
    challenge:
      "In darkness I thrive, a mirror of your world, where monsters hide and shadows swirled. What am I?",
    type: "riddle",
    answer: "UPSIDE DOWN",
  },
  {
    id: 5,
    title: "Word Unscrambler",
    description: "Unscramble this technical term",
    challenge: "OGRAMPRMING",
    type: "unscramble",
    answer: "PROGRAMMING",
  },
  {
    id: 6,
    title: "Steganography Challenge",
    description: "Find the hidden message in the image",
    challenge: "Extract the hidden message from the steganographic image",
    type: "steganography",
    answer: "PORTAL",
  },
];

const RoundOne = ({ loggedInYear, onComplete }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [showDicePopup, setShowDicePopup] = useState(true);
  const [previewCardId, setPreviewCardId] = useState(null);
  const [previewFromRect, setPreviewFromRect] = useState(null);
  const [previewTargetPos, setPreviewTargetPos] = useState(null);
  const [previewAnimActive, setPreviewAnimActive] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRewardVideo, setShowRewardVideo] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showBlackOverlay, setShowBlackOverlay] = useState(false);
  const [showVignette, setShowVignette] = useState(false);
  const [mouseRotation, setMouseRotation] = useState({ x: 0, y: 0 });
  const diceRef = useRef(null);
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const rewardVideoRef = useRef(null);
  const cardRefs = useRef({});

  const [allQues, setAllQues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const year = loggedInYear === "1st" ? 1 : 2;
  const { token, logout } = useContext(AuthContext) || {};

  // Helper transforms for dice
  const getDiceTransform = (value) =>
    ({
      1: "rotateX(0deg) rotateY(0deg)",
      2: "rotateX(0deg) rotateY(-90deg)",
      3: "rotateX(-90deg) rotateY(0deg)",
      4: "rotateX(90deg) rotateY(0deg)",
      5: "rotateX(0deg) rotateY(90deg)",
      6: "rotateX(180deg) rotateY(0deg)",
    }[value] || "rotateX(0deg) rotateY(0deg)");

  // Use backend-provided answer when available; fallback to builtin map
  const builtinAnswerMap = BUILTIN_TASKS.reduce(
    (acc, t) => ({ ...acc, [t.id]: t.answer }),
    {}
  );

  // Fetch questions when token or year changes
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchQues() {
      if (!token) {
        setAllQues([]);
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/round1/getallquestion/${year}`,
          { signal: controller.signal }
        );
        console.log(res.data.data)

        if (cancelled) return;

        if (Array.isArray(res.data?.data)) {
          setAllQues(res.data.data); // 🎉 Your backend data
        } else {
          console.warn("Unexpected shape:", res.data);
          if (!allQues.length) setAllQues(BUILTIN_TASKS);
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
          return; // React StrictMode 2nd render cancel
        }

        console.error("Fetch error:", err);
        setFetchError(err);

        if (!allQues.length) {
          setAllQues(BUILTIN_TASKS);
        }

        if (err.response && err.response.status === 401) {
          console.warn("Unauthorized - token expired");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchQues();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [token, year]);

  // derived current/preview challenge using backend data
  const currentChallenge = expandedCard
    ? allQues.find((q) => Number(q.id) === Number(expandedCard))
    : null;
  const previewChallenge = previewCardId
    ? allQues.find((q) => Number(q.id) === Number(previewCardId))
    : null;

  // mouse rotations
  const handleMouseMove = (e) => {
    if (isDiceRolling || expandedCard || isCompleted) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const maxRotation = 30;
    const rotateY = (deltaX / centerX) * maxRotation;
    const rotateX = -(deltaY / centerY) * maxRotation;
    setMouseRotation({ x: rotateX, y: rotateY });
  };
  const handleMouseLeave = () => {
    if (!isDiceRolling) setMouseRotation({ x: 0, y: 0 });
  };

  // Roll dice
  const rollDice = () => {
    if (isDiceRolling || expandedCard || isCompleted) return;
    setIsDiceRolling(true);
    setMouseRotation({ x: 0, y: 0 });
    const rollDuration = 1800;

    const getRandomValue = () => {
      if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return (array[0] % Math.max(6, allQues.length || 6)) + 1; // ensure at least 6 faces
      }
      return Math.floor(Math.random() * 6) + 1;
    };

    const rollInterval = setInterval(() => setDiceValue(getRandomValue()), 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = getRandomValue();
      setDiceValue(finalValue);
      setIsDiceRolling(false);

      // show preview fly animation
      setTimeout(() => {
        setShowDicePopup(false);
        const el = cardRefs.current[finalValue];
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetLeft = (window.innerWidth - rect.width) / 2;
          const targetTop = (window.innerHeight - rect.height) / 2;
          setPreviewFromRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          });
          setPreviewTargetPos({ left: targetLeft, top: targetTop });
        } else {
          setPreviewFromRect(null);
          setPreviewTargetPos(null);
        }
        setPreviewCardId(finalValue);
      }, 160);
    }, rollDuration);
  };

  const getDiceTransformWithMouse = () => {
    const base = getDiceTransform(diceValue);
    if (isDiceRolling) return base;
    return `${base} rotateX(${mouseRotation.x}deg) rotateY(${mouseRotation.y}deg)`;
  };

  // submit answer
const handleAnswerSubmit = async (e) => {
  e.preventDefault();
  if (!expandedCard || !currentChallenge?._id) return;

  const userAnswer = (answer || "").trim();
  if (!userAnswer) return setError("Please type an answer");

  try {
    setError("");

    const res = await axios.post(
      "http://localhost:5000/api/v1/round1/player/submit-answer",
      {
        questionId: currentChallenge._id,
        userAnswer: userAnswer
      }
    );

    const isCorrect = res?.data?.data?.isCorrect;

    if (isCorrect) {
      // SUCCESS UI
      setIsCompleted(true);

      // Reset UI for next question
      setTimeout(() => {
        setIsCompleted(false);
        setExpandedCard(null);
        setAnswer("");
        setShowDicePopup(true); // Show dice again
      }, 1000);

    } else {
      // WRONG ANSWER UI
      setError("Incorrect answer. Try again!");
    }
  } catch (err) {
    console.error(err);
    setError("Server error. Try again.");
  }
};

  // preview animation trigger
  useEffect(() => {
    if (previewCardId && previewFromRect && previewTargetPos) {
      setPreviewAnimActive(false);
      const r = requestAnimationFrame(() => setPreviewAnimActive(true));
      return () => cancelAnimationFrame(r);
    }
  }, [previewCardId, previewFromRect, previewTargetPos]);

  // Reward video handling (similar to your original logic but simplified)
  useEffect(() => {
    if (!showRewardVideo || !rewardVideoRef.current) return undefined;
    const v = rewardVideoRef.current;
    let cleaned = false;

    const enterFsAndPlay = async () => {
      try {
        if (v.requestFullscreen) await v.requestFullscreen();
        v.play().catch(() => {});
        document.body.style.cursor = "none";
      } catch (err) {
        console.warn("Reward video play error", err);
      }
    };

    const onEnded = async () => {
      document.body.style.cursor = "";
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
      } catch (_) {}
      setShowRewardVideo(false);
      setShowBlackOverlay(true);
      setTimeout(() => {
        setShowCompletionMessage(true);
        setShowVignette(true);
      }, 380);
    };

    enterFsAndPlay();
    v.addEventListener("ended", onEnded);

    return () => {
      cleaned = true;
      v.removeEventListener("ended", onEnded);
      document.body.style.cursor = "";
      try {
        if (document.exitFullscreen) document.exitFullscreen();
      } catch (_) {}
    };
  }, [showRewardVideo]);

  useEffect(() => {
    if (!showCompletionMessage) return undefined;
    const t1 = setTimeout(() => {
      setShowLine1(true);
      setShowLine2(true);
    }, 200);
    const t2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);
    const safety = setTimeout(() => {
      setShowLine1(true);
      setShowLine2(true);
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(safety);
    };
  }, [showCompletionMessage, onComplete]);

  // small guards for rendering
  const questionsToRender =
    Array.isArray(allQues) && allQues.length ? allQues : BUILTIN_TASKS;

  return (
    <>
      {/* Reward video overlay */}
      {showRewardVideo && (
        <div
          className="reward-video-container"
          style={{ position: "fixed", inset: 0, zIndex: 10000 }}
        >
          <video
            ref={rewardVideoRef}
            className="reward-video"
            src={roundOneRewardVideo}
            autoPlay
            playsInline
            preload="auto"
            style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          />
        </div>
      )}

      {showBlackOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10001,
          }}
        />
      )}
      {showVignette && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10002,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      )}

      {showCompletionMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2147483647,
          }}
        >
          <div
            style={{ textAlign: "center", color: "#E6194B", padding: "0 24px" }}
          >
            <div
              style={{
                fontSize: "clamp(28px, 4vw, 56px)",
                fontWeight: 700,
                opacity: showLine1 ? 1 : 0,
                transition: "opacity 1200ms",
              }}
            >
              You saved Max
            </div>
            <div
              style={{
                fontSize: "clamp(20px, 2.8vw, 40px)",
                fontWeight: 600,
                opacity: showLine2 ? 1 : 0,
                transition: "opacity 1200ms",
              }}
            >
              Welcome to Round 2
            </div>
          </div>
        </div>
      )}

      {/* Expanded challenge view */}
      {expandedCard && currentChallenge && (
        <div className="expanded-card-hero">
          <video
            ref={videoRef}
            className="roundone-bg-video"
            autoPlay
            loop
            playsInline
            preload="auto"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              position: "fixed",
              inset: 0,
              zIndex: 0,
            }}
          >
            <source src={roundOneBgVideo} type="video/mp4" />
          </video>

          <div
            className="expanded-card-hero-content"
            style={{ position: "relative", zIndex: 2, padding: 24 }}
          >
            <div className="save-max-banner">
              <p className="save-max-text">Complete this round to save Max</p>
            </div>
            <h3 className="expanded-challenge-title">
              {currentChallenge.title}
            </h3>
            <p className="expanded-challenge-desc">
              {currentChallenge.description}
            </p>

            <div className="expanded-challenge-display">
              <div className="challenge-display-box">
                <p className="challenge-main">{currentChallenge.challenge}</p>
                {currentChallenge.hint && (
                  <small className="challenge-hint">
                    {currentChallenge.hint}
                  </small>
                )}
              </div>
            </div>

            <form
              onSubmit={handleAnswerSubmit}
              className="expanded-answer-form"
              style={{ marginTop: 12 }}
            >
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                required
                autoFocus
                disabled={isCompleted}
                style={{ padding: "8px 12px", fontSize: 16 }}
              />
              <button
                type="submit"
                disabled={isCompleted}
                style={{ marginLeft: 8 }}
              >
                {isCompleted ? "✓ Completed!" : "Submit Answer"}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: 8, color: "salmon" }}>{error}</div>
            )}
            {isCompleted && (
              <div style={{ marginTop: 12 }}>
                <h3>🎉 Challenge Complete!</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main round view when nothing expanded */}
      {!expandedCard && (
        <div className="round-one-container">
          <h2 className="round-title">Round 1 - Dungeons and Dragons</h2>

          {loading && <div style={{ padding: 12 }}>Loading questions...</div>}
          {fetchError && (
            <div style={{ padding: 12, color: "tomato" }}>
              Failed to fetch questions - using fallback questions.
            </div>
          )}

          <div
            className={`challenge-cards-grid ${
              previewCardId ? "cards-hidden" : ""
            }`}
          >
            {questionsToRender.map((task) => (
              <div
                key={task.id}
                className="challenge-card-number"
                ref={(el) => {
                  cardRefs.current[task.id] = el;
                }}
                style={
                  previewCardId === task.id
                    ? { visibility: "hidden" }
                    : undefined
                }
              >
                <div className="card-front">
                  <div className="card-number">{task.id}</div>
                  <div className="card-title-small">{task.title}</div>
                </div>
              </div>
            ))}
          </div>

          {showDicePopup && (
            <div
              ref={overlayRef}
              className="dice-popup-overlay"
              onClick={() => {
                if (!isDiceRolling) rollDice();
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="dice-popup-container">
                <div
                  ref={diceRef}
                  className={`dice-3d ${isDiceRolling ? "rolling" : ""}`}
                  style={{ transform: getDiceTransformWithMouse() }}
                >
                  {/* faces simplified - keep your original DOM if preferred */}
                  <div className="dice-face dice-face-1">
                    <div className="dice-dot" />
                  </div>
                  <div className="dice-face dice-face-2">
                    <div className="dice-dot" />
                    <div className="dice-dot" />
                  </div>
                  <div className="dice-face dice-face-3">
                    <div className="dice-dot" />
                    <div className="dice-dot" />
                    <div className="dice-dot" />
                  </div>
                  <div className="dice-face dice-face-4">
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                  </div>
                  <div className="dice-face dice-face-5">
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot" />
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                  </div>
                  <div className="dice-face dice-face-6">
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                      <div className="dice-dot" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewCardId &&
            previewChallenge &&
            previewFromRect &&
            previewTargetPos && (
              <>
                <div className="result-preview-scrim" />
                <div
                  className={`result-preview-flycard ${
                    previewAnimActive ? "active" : ""
                  }`}
                  style={{
                    position: "fixed",
                    left: previewFromRect.left,
                    top: previewFromRect.top,
                    width: previewFromRect.width,
                    height: previewFromRect.height,
                    transform: previewAnimActive
                      ? `translate(${
                          previewTargetPos.left - previewFromRect.left
                        }px, ${previewTargetPos.top - previewFromRect.top}px)`
                      : "translate(0,0)",
                  }}
                >
                  <div className="result-preview-card-inner">
                    <div className="result-preview-header">
                      <div className="result-preview-number">
                        {previewChallenge.id}
                      </div>
                      <div className="result-preview-title">
                        {previewChallenge.title}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={`tap-to-continue ${
                    previewAnimActive ? "visible" : ""
                  }`}
                  style={{
                    position: "fixed",
                    left: Math.round(
                      previewTargetPos.left + previewFromRect.width / 2
                    ),
                    top: Math.round(
                      previewTargetPos.top + previewFromRect.height + 16
                    ),
                    transform: "translateX(-50%)",
                  }}
                  onClick={() => {
                    const id = previewCardId;
                    setPreviewCardId(null);
                    setPreviewFromRect(null);
                    setPreviewTargetPos(null);
                    setPreviewAnimActive(false);
                    setTimeout(() => setExpandedCard(id), 120);
                  }}
                >
                  Tap to continue
                </button>
              </>
            )}
        </div>
      )}
    </>
  );
};

export default RoundOne;
