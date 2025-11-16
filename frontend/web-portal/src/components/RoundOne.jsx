import React, { useState, useRef, useEffect } from 'react';
import roundOneBgVideo from '../assets/roundone-bg.mp4';
import roundOneRewardVideo from '../assets/round-one-reward .mp4'; // Note: filename has a space
import Crossword from './Crossword';

const RoundOne = ({ loggedInYear, onComplete }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [showDicePopup, setShowDicePopup] = useState(true); // Always visible by default
  const [previewCardId, setPreviewCardId] = useState(null); // Intermediate preview before full question
  const [previewFromRect, setPreviewFromRect] = useState(null);
  const [previewTargetPos, setPreviewTargetPos] = useState(null);
  const [previewAnimActive, setPreviewAnimActive] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set()); // Track completed question IDs
  const [showRewardVideo, setShowRewardVideo] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showBlackOverlay, setShowBlackOverlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVignette, setShowVignette] = useState(false);
  const [mouseRotation, setMouseRotation] = useState({ x: 0, y: 0 });
  const diceRef = useRef(null);
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const rewardVideoRef = useRef(null);
  const cardRefs = useRef({});


  // Function to get dice transform based on value
  const getDiceTransform = (value) => {
    const transforms = {
      1: 'rotateX(0deg) rotateY(0deg)',
      2: 'rotateX(0deg) rotateY(-90deg)',
      3: 'rotateX(-90deg) rotateY(0deg)',
      4: 'rotateX(90deg) rotateY(0deg)',
      5: 'rotateX(0deg) rotateY(90deg)',
      6: 'rotateX(180deg) rotateY(0deg)'
    };
    return transforms[value] || transforms[1];
  };

  // Correct answers for each challenge
  const correctAnswers = {
    1: "THE UPSIDE DOWN",
    2: "JANE",
    3: "CROSSWORD", // Crossword is handled by the Crossword component
    4: "UPSIDE DOWN",
    5: "PROGRAMMING",
    6: "PORTAL"
  };

  const tasks = [
    {
      id: 1,
      title: "Binary Decoder",
      description: "Decode this binary message to uncover a hidden clue",
      challenge: "01010100 01101000 01100101 00100000 01010101 01110000 01110011 01101001 01100100 01100101 00100000 01000100 01101111 01110111 01101110",
      type: "binary"
    },
    {
      id: 2,
      title: "Stranger Things Quiz",
      description: "Answer this question about Stranger Things",
      challenge: "What is Eleven's real name?",
      type: "quiz"
    },
    {
      id: 3,
      title: "Crossword Challenge",
      description: "Solve the tech and Stranger Things crossword",
      challenge: "3-Down: Hawkins Lab's secret project (6 letters)",
      type: "crossword"
    },
    {
      id: 4,
      title: "Upside Down Riddle",
      description: "Crack this riddle related to the Upside Down",
      challenge: "In darkness I thrive, a mirror of your world, where monsters hide and shadows swirled. What am I?",
      type: "riddle"
    },
    {
      id: 5,
      title: "Word Unscrambler",
      description: "Unscramble this technical term",
      challenge: "OGRAMPRMING",
      type: "unscramble"
    },
    {
      id: 6,
      title: "Steganography Challenge",
      description: "Find the hidden message in the image",
      challenge: "Extract the hidden message from the steganographic image",
      type: "steganography"
    }
  ];

  // Handle mouse move anywhere in overlay to rotate dice following cursor
  const handleMouseMove = (e) => {
    if (isDiceRolling || expandedCard || isCompleted) return;
    
    // Calculate rotation based on cursor position relative to viewport center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position (limit rotation for smoother effect)
    const maxRotation = 30; // Limit rotation to prevent excessive spinning
    const rotateY = (deltaX / centerX) * maxRotation;
    const rotateX = -(deltaY / centerY) * maxRotation;
    
    setMouseRotation({ x: rotateX, y: rotateY });
  };

  // Handle mouse leave overlay to reset rotation
  const handleMouseLeave = () => {
    if (!isDiceRolling) {
      setMouseRotation({ x: 0, y: 0 });
    }
  };

  // Roll dice on simple click
  const handleOverlayClick = () => {
    if (!expandedCard && !isDiceRolling) {
      rollDice();
    }
  };

  // Realistic dice rolling animation with true randomness
  const rollDice = () => {
    if (isDiceRolling || expandedCard) return;
    
    // Get available (incomplete) questions
    const availableQuestions = [1, 2, 3, 4, 5, 6].filter(id => !completedQuestions.has(id));
    
    // If all questions are completed, show reward video
    if (availableQuestions.length === 0) {
      setShowRewardVideo(true);
      return;
    }
    
    setIsDiceRolling(true);
    setMouseRotation({ x: 0, y: 0 }); // Reset rotation when rolling
    const rollDuration = 2000; // 2 seconds
    
    // Use crypto.getRandomValues for better randomness if available, fallback to Math.random
    const getRandomValue = () => {
      // Get random value from available questions only
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      return availableQuestions[randomIndex];
    };
    
    // Rapidly change dice values during roll for visual effect (only from available questions)
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setDiceValue(availableQuestions[randomIndex]);
    }, 50); // Update every 50ms for smoother visual effect

    setTimeout(() => {
      clearInterval(rollInterval);
      // Generate final random value from available questions only
      const finalValue = getRandomValue();
      setDiceValue(finalValue);
      setIsDiceRolling(false);
      
      // After roll, show a centered preview first, then allow tap to continue
      setTimeout(() => {
        setShowDicePopup(false);
        setTimeout(() => {
          const el = cardRefs.current[finalValue];
          if (el) {
            const rect = el.getBoundingClientRect();
            const targetLeft = (window.innerWidth - rect.width) / 2;
            const targetTop = (window.innerHeight - rect.height) / 2;
            setPreviewFromRect({
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height
            });
            setPreviewTargetPos({ left: targetLeft, top: targetTop });
          } else {
            setPreviewFromRect(null);
            setPreviewTargetPos(null);
          }
          setPreviewCardId(finalValue);
        }, 200);
      }, 200);
    }, rollDuration);
  };

  // Get combined transform for dice (mouse rotation + value rotation)
  const getDiceTransformWithMouse = () => {
    const baseTransform = getDiceTransform(diceValue);
    
    if (isDiceRolling) {
      // During roll, show the current dice value but don't apply mouse rotation
      // The CSS animation will handle the spinning effect
      return baseTransform;
    }
    
    const mouseTransform = `rotateX(${mouseRotation.x}deg) rotateY(${mouseRotation.y}deg)`;
    
    // Combine base transform with mouse rotation
    // The base transform sets which face is visible, mouse adds interactive rotation
    return `${baseTransform} ${mouseTransform}`;
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!expandedCard) return;

    // Skip validation for crossword - it's handled by the Crossword component
    if (expandedCard === 3) {
      return;
    }

    const userAnswer = answer.trim().toUpperCase();
    const correct = correctAnswers[expandedCard].toUpperCase();

    if (userAnswer === correct) {
      setIsCompleted(true);
      setError('');
      
      // Mark this question as completed and check if all are done
      setCompletedQuestions(prev => {
        const newCompleted = new Set([...prev, expandedCard]);
        // Check if all questions are completed
        if (newCompleted.size === 6) {
          // All questions completed, show reward video after closing
          setTimeout(() => {
            setExpandedCard(null);
            setPreviewCardId(null);
            setIsCompleted(false);
            setAnswer('');
            setError('');
            setShowRewardVideo(true);
          }, 1000);
        } else {
          // Close the challenge view and allow rolling again
          setTimeout(() => {
            setExpandedCard(null);
            setPreviewCardId(null);
            setIsCompleted(false);
            setAnswer('');
            setError('');
            setShowDicePopup(true);
          }, 1000);
        }
        return newCompleted;
      });
    } else {
      setError('Incorrect answer. Try again!');
    }
  };

  const currentChallenge = expandedCard ? tasks[expandedCard - 1] : null;
  const previewChallenge = previewCardId ? tasks[previewCardId - 1] : null;

  // Trigger the fly-to-center animation after preview mounts
  useEffect(() => {
    if (previewCardId && previewFromRect && previewTargetPos) {
      setPreviewAnimActive(false);
      const rAF = requestAnimationFrame(() => {
        setPreviewAnimActive(true);
      });
      return () => cancelAnimationFrame(rAF);
    }
    return undefined;
  }, [previewCardId, previewFromRect, previewTargetPos]);

  // Ensure background video plays WITH audio when question page opens
  useEffect(() => {
    if (expandedCard && videoRef.current) {
      const video = videoRef.current;
      // Ensure video plays with audio
      const playVideo = async () => {
        try {
          video.muted = false;
          video.volume = 0.6;
          await video.play();
        } catch (err) {
          console.log('Video play error:', err);
        }
      };
      playVideo();
      
      return undefined;
    }
  }, [expandedCard]);

  // Handle reward video playback - play fully, then show message
  useEffect(() => {
    if (showRewardVideo && rewardVideoRef.current) {
      const video = rewardVideoRef.current;
      
      // Enter fullscreen and hide cursor (use the video element itself)
      const enterFullscreen = async () => {
        try {
          const el = video;
          if (el.requestFullscreen) {
            await el.requestFullscreen();
          } else if (el.webkitRequestFullscreen) {
            await el.webkitRequestFullscreen();
          } else if (el.mozRequestFullScreen) {
            await el.mozRequestFullScreen();
          } else if (el.msRequestFullscreen) {
            await el.msRequestFullscreen();
          }
          setIsFullscreen(true);
        } catch (err) {
          console.log('Fullscreen error:', err);
        }
        // Hide cursor on body, video, and fullscreen element
        document.body.style.cursor = 'none';
        video.style.cursor = 'none';
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (fsEl) {
          fsEl.style.cursor = 'none';
        }
      };
      
      // Aggressive cursor hiding - continuously hide cursor while video is playing
      const hideCursorAggressively = () => {
        // Hide cursor as long as video hasn't ended (regardless of play/pause state)
        if (!video.ended) {
          document.body.style.cursor = 'none';
          video.style.cursor = 'none';
          const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
          if (fsEl) {
            fsEl.style.cursor = 'none';
          }
          // Also hide on document and html
          document.documentElement.style.cursor = 'none';
        }
      };

      const playVideo = async () => {
        try {
          // Ensure video starts from the beginning
          video.currentTime = 0;
          await enterFullscreen();
          // Hide cursor immediately when video starts
          hideCursorAggressively();
          await video.play();
        } catch (err) {
          console.log('Reward video play error:', err);
        }
      };

      // Ensure cursor stays hidden during video playback
      const handleVideoPlay = () => {
        hideCursorAggressively();
      };

      const handleVideoPause = () => {
        // Keep cursor hidden even when paused - video hasn't ended yet
        if (!video.ended) {
          hideCursorAggressively();
        }
      };
      
      const exitFullscreenSafe = async () => {
        try {
          if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
              await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              await document.msExitFullscreen();
            }
          }
        } catch (err) {
          console.log('Exit fullscreen error:', err);
        }
      };

      const proceedAfterFullscreenExit = () => {
        setShowRewardVideo(false);
        setShowBlackOverlay(true);
        setTimeout(() => {
          setShowCompletionMessage(true);
          setShowVignette(true);
        }, 450);
      };

      const handleVideoEnd = async () => {
        // Restore cursor and exit fullscreen, then proceed
        document.body.style.cursor = '';
        await exitFullscreenSafe();
        setTimeout(() => {
          const stillFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
          if (stillFs) {
            exitFullscreenSafe().finally(() => {
              setIsFullscreen(false);
              proceedAfterFullscreenExit();
            });
          } else {
            setIsFullscreen(false);
            proceedAfterFullscreenExit();
          }
        }, 120);
      };

      const onFullscreenChange = () => {
        const active = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        setIsFullscreen(active);
        // Immediately hide cursor when fullscreen changes
        hideCursorAggressively();
      };

      // Continuous interval to ensure cursor stays hidden
      const cursorHideInterval = setInterval(() => {
        if (!video.ended) {
          hideCursorAggressively();
        }
      }, 100); // Check every 100ms

      // Also hide cursor on any mouse movement during video
      const handleMouseMove = () => {
        if (!video.ended) {
          hideCursorAggressively();
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      
      playVideo();
      
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('pause', handleVideoPause);
      video.addEventListener('timeupdate', hideCursorAggressively); // Hide on every time update
      document.addEventListener('fullscreenchange', onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);
      document.addEventListener('mozfullscreenchange', onFullscreenChange);
      document.addEventListener('MSFullscreenChange', onFullscreenChange);
      
      return () => {
        clearInterval(cursorHideInterval);
        document.removeEventListener('mousemove', handleMouseMove);
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
        video.removeEventListener('timeupdate', hideCursorAggressively);
        // Cleanup: restore cursor and exit fullscreen
        document.body.style.cursor = '';
        document.documentElement.style.cursor = '';
        exitFullscreenSafe();
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        document.removeEventListener('mozfullscreenchange', onFullscreenChange);
        document.removeEventListener('MSFullscreenChange', onFullscreenChange);
      };
    }
  }, [showRewardVideo]);

  // Handle completion message transition to next round
  useEffect(() => {
    if (showCompletionMessage) {
      // Remove any focus/caret from previous inputs
      try {
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      } catch (_) {}

      // Show both lines together with a slow cinematic fade-in
      const t1 = setTimeout(() => {
        setShowLine1(true);
        setShowLine2(true);
      }, 200);

      const t3 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4200); // allow enough time to enjoy the fade-in
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t3);
      };
    }
  }, [showCompletionMessage, onComplete]);

  // Safety: ensure text becomes visible even if timers are delayed
  useEffect(() => {
    if (!showCompletionMessage) return undefined;
    const safety = setTimeout(() => {
      setShowLine1((prev) => (prev ? prev : true));
      setShowLine2((prev) => (prev ? prev : true));
    }, 2500);
    return () => clearTimeout(safety);
  }, [showCompletionMessage]);

  return (
    <>
      {/* Reward Video */}
      {showRewardVideo && (
        <div className="reward-video-container">
          <video
            ref={rewardVideoRef}
            className="reward-video"
            src={roundOneRewardVideo}
            autoPlay
            playsInline
            preload="auto"
            onLoadedData={() => {
              // Ensure video starts from beginning when data is loaded
              if (rewardVideoRef.current) {
                rewardVideoRef.current.currentTime = 0;
              }
            }}
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 10000,
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Black fade overlay between video end and message */}
      {showBlackOverlay && (
        <div
          className={`black-fade-overlay ${showCompletionMessage ? 'dim' : ''}`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            transition: 'opacity 400ms ease',
            opacity: 1,
            zIndex: 10001,
            caretColor: 'transparent',
            outline: 'none'
          }}
        />
      )}

      {/* Cinematic Vignette */}
      {showVignette && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10002,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.85) 100%)',
            opacity: 1,
            transition: 'opacity 800ms ease'
          }}
        />
      )}

      {/* Completion Message */}
      {showCompletionMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2147483647,
            visibility: 'visible',
            isolation: 'isolate',
            pointerEvents: 'none',
            caretColor: 'transparent',
            outline: 'none'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#E6194B',
              fontFamily: 'inherit',
              letterSpacing: '0.5px',
              filter: 'none',
              mixBlendMode: 'normal',
              padding: '0 24px'
            }}
          >
            <div
              style={{
                fontSize: 'clamp(28px, 4vw, 56px)',
                fontWeight: 700,
                marginBottom: '0.4em',
                opacity: showLine1 ? 1 : 0,
                filter: showLine1 ? 'blur(0px)' : 'blur(6px)',
                transition: 'opacity 1400ms cubic-bezier(0.22, 1, 0.36, 1), filter 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
                lineHeight: 1.1,
                letterSpacing: '0.02em',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              You saved Max
            </div>
            <div
              style={{
                fontSize: 'clamp(20px, 2.8vw, 40px)',
                fontWeight: 600,
                opacity: showLine2 ? 1 : 0,
                filter: showLine2 ? 'blur(0px)' : 'blur(6px)',
                transition: 'opacity 1400ms cubic-bezier(0.22, 1, 0.36, 1), filter 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
                lineHeight: 1.15,
                letterSpacing: '0.015em',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              Welcome to Round 2
            </div>
          </div>
        </div>
      )}

      {/* Expanded Card - Hero Animation - Hides Round 1 completely */}
      {expandedCard && (
        <div className="expanded-card-hero">
          {/* Background Video - Only shown on question pages */}
          <video
            ref={videoRef}
            className="roundone-bg-video"
            autoPlay
            loop
            playsInline
            preload="auto"
            style={{
              width: '100vw',
              height: '100vh',
              minWidth: '100vw',
              minHeight: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              objectFit: 'cover',
              objectPosition: 'center center',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              margin: 0,
              padding: 0
            }}
            onLoadedMetadata={(e) => {
              const video = e.target;
              video.muted = false;
              video.volume = 0.6;
            }}
            onVolumeChange={(e) => {
              const video = e.target;
              if (video.muted) video.muted = false;
            }}
          >
            <source src={roundOneBgVideo} type="video/mp4" />
          </video>
          
          <div className={`expanded-card-hero-content ${currentChallenge?.type === 'crossword' ? 'crossword-full-width' : ''}`}>
            {currentChallenge.type !== 'crossword' && (
              <>
                <div className="save-max-banner">
                  <p className="save-max-text">Complete this round to save Max</p>
                </div>
                <h3 className="expanded-challenge-title">{currentChallenge.title}</h3>
                <p className="expanded-challenge-desc">{currentChallenge.description}</p>
              </>
            )}
            
            <div className="expanded-challenge-display">
              {currentChallenge.type === 'binary' && (
                <div className="challenge-display-box">
                  <p className="challenge-text-large">{currentChallenge.challenge}</p>
                  <small className="challenge-hint">Hint: Convert binary to ASCII text</small>
                </div>
              )}
              {currentChallenge.type === 'quiz' && (
                <div className="challenge-display-box">
                  <p className="challenge-question-large">{currentChallenge.challenge}</p>
                </div>
              )}
              {currentChallenge.type === 'crossword' && (
                <div style={{ 
                  width: '100%',
                  height: '100%',
                  background: 'transparent', 
                  border: 'none', 
                  padding: 0,
                  margin: 0
                }}>
                  <Crossword 
                    year={loggedInYear || '1st'} 
                    onComplete={() => {
                      setIsCompleted(true);
                      setError('');
                      // Mark crossword (id 3) as completed and check if all are done
                      setCompletedQuestions(prev => {
                        const newCompleted = new Set([...prev, 3]);
                        // Check if all questions are completed
                        if (newCompleted.size === 6) {
                          // All questions completed, show reward video after closing
                          setTimeout(() => {
                            setExpandedCard(null);
                            setPreviewCardId(null);
                            setIsCompleted(false);
                            setAnswer('');
                            setError('');
                            setShowRewardVideo(true);
                          }, 1000);
                        } else {
                          // Close the challenge view and allow rolling again
                          setTimeout(() => {
                            setExpandedCard(null);
                            setPreviewCardId(null);
                            setIsCompleted(false);
                            setAnswer('');
                            setError('');
                            setShowDicePopup(true);
                          }, 1000);
                        }
                        return newCompleted;
                      });
                    }}
                  />
                </div>
              )}
              {currentChallenge.type === 'riddle' && (
                <div className="challenge-display-box">
                  <p className="challenge-riddle-large">{currentChallenge.challenge}</p>
                </div>
              )}
              {currentChallenge.type === 'unscramble' && (
                <div className="challenge-display-box">
                  <p className="challenge-scramble-large">{currentChallenge.challenge}</p>
                  <small className="challenge-hint">Unscramble the letters to form a word</small>
                </div>
              )}
              {currentChallenge.type === 'steganography' && (
                <div className="challenge-display-box">
                  <p className="challenge-text-large">{currentChallenge.challenge}</p>
                  <small className="challenge-hint">Analyze the image for hidden text or data</small>
                </div>
              )}
            </div>

            {currentChallenge.type !== 'crossword' && (
              <form onSubmit={handleAnswerSubmit} className="expanded-answer-form">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="expanded-answer-input"
                  required
                  autoFocus
                  disabled={isCompleted}
                />
                <button type="submit" className="expanded-submit-button" disabled={isCompleted}>
                  {isCompleted ? '✓ Completed!' : 'Submit Answer'}
                </button>
              </form>
            )}

            {error && (
              <div className={`expanded-message ${error.includes('Correct') ? 'success' : 'error'}`}>
                {error}
              </div>
            )}

            {isCompleted && (
              <div className="challenge-completed-message">
                <h3>🎉 Challenge Complete! 🎉</h3>
                <p>Proceeding to Round 2...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Round 1 Content - Hidden when card is expanded */}
      {!expandedCard && (
        <div className="round-one-container">
          <h2 className="round-title">Round 1 - Dungeons and Dragons</h2>

          {/* Six Challenge Cards Grid */}
          <div className={`challenge-cards-grid ${previewCardId ? 'cards-hidden' : ''}`}>
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="challenge-card-number"
                ref={(el) => { cardRefs.current[task.id] = el; }}
                style={previewCardId === task.id ? { visibility: 'hidden' } : undefined}
              >
                <div className="card-front">
                  {completedQuestions.has(task.id) && (
                    <div className="card-completed-checkmark">✓</div>
                  )}
                  <div className="card-number">{task.id}</div>
                  <div className="card-title-small">{task.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Dice Popup - Click to roll */}
          {showDicePopup && (
            <div 
              ref={overlayRef}
              className="dice-popup-overlay"
              onClick={handleOverlayClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="dice-popup-container">
                <div 
                  ref={diceRef}
                  className={`dice-3d ${isDiceRolling ? 'rolling' : ''}`}
                  style={{ transform: getDiceTransformWithMouse() }}
                >
                  <div className="dice-face dice-face-1">
                    <div className="dice-dot"></div>
                  </div>
                  <div className="dice-face dice-face-2">
                    <div className="dice-dot"></div>
                    <div className="dice-dot"></div>
                  </div>
                  <div className="dice-face dice-face-3">
                    <div className="dice-dot"></div>
                    <div className="dice-dot"></div>
                    <div className="dice-dot"></div>
                  </div>
                  <div className="dice-face dice-face-4">
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                  </div>
                  <div className="dice-face dice-face-5">
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                  </div>
                  <div className="dice-face dice-face-6">
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                    <div className="dice-row">
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                      <div className="dice-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result Preview - fly from card position to center at same size; tap to continue below */}
          {previewCardId && previewChallenge && previewFromRect && previewTargetPos && (
            <>
              <div className="result-preview-scrim" />
              <div
                className={`result-preview-flycard ${previewAnimActive ? 'active' : ''}`}
                style={{
                  position: 'fixed',
                  left: previewFromRect.left,
                  top: previewFromRect.top,
                  width: previewFromRect.width,
                  height: previewFromRect.height,
                  transform: previewAnimActive
                    ? `translate(${previewTargetPos.left - previewFromRect.left}px, ${previewTargetPos.top - previewFromRect.top}px)`
                    : 'translate(0px, 0px)',
                }}
              >
                <div className="result-preview-card-inner">
                  <div className="result-preview-header">
                    <div className="result-preview-number">{previewChallenge.id}</div>
                    <div className="result-preview-title">{previewChallenge.title}</div>
                  </div>
                </div>
              </div>
              <button
                className={`tap-to-continue ${previewAnimActive ? 'visible' : ''}`}
                style={{
                  position: 'fixed',
                  left: Math.round(previewTargetPos.left + previewFromRect.width / 2),
                  top: Math.round(previewTargetPos.top + previewFromRect.height + 16),
                  transform: 'translateX(-50%)',
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
