import React, { useState, useEffect, useRef, useCallback } from 'react';
import './JoyceWall.css';
import joyceWallVideo from '../assets/joycewall.mp4';
import finaleVideo from '../assets/stranger-things-finale.mp4';
// Import background music files (add these audio files to your assets folder)
// import narrativeMusic from '../assets/narrative-music.mp3';
// import joyceWallMusic from '../assets/joyce-wall-music.mp3';

export default function JoyceWall({ triggerWord, onComplete, fragments = [], loggedInYear = '1st' }) {
  const [showJumbledMessage, setShowJumbledMessage] = useState(false);
  const [showJoyceWallVideo, setShowJoyceWallVideo] = useState(false);
  const [showFinaleVideo, setShowFinaleVideo] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showJoyceWallMessage, setShowJoyceWallMessage] = useState(false);
  const [showClues, setShowClues] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [joyceWallVideoComplete, setJoyceWallVideoComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [finaleVideoFading, setFinaleVideoFading] = useState(false);
  const joyceWallVideoRef = useRef(null);
  const finaleVideoRef = useRef(null);
  const finaleVideoContainerRef = useRef(null);
  const narrativeMusicRef = useRef(null);
  const joyceWallMusicRef = useRef(null);
  
  // Calculate correct password from fragments
  const correctPassword = fragments.length > 0 
    ? fragments.join('').toUpperCase() 
    : 'UPSIDE DOWN';
  
  // Time to pause finale video (when Eleven starts using power) - adjust this value
  const PAUSE_TIME = 8; // seconds - adjust based on your video

  // Clues for first year
  const firstYearClues = [
    "1. The quiet town hides a secret at its end. Take the last three letters of its name and reverse them. (letters all lowercase.)",
    "2. Count only the letters that are not vowels in the place where people collect ideas on boards. (The result is a digit.)",
    "3. The ruler of the Upside Down, who controls the mind, leaves a clue. Find letters 3–5, flip them backward, and write all three letters in uppercase.",
    "4. A lone number stands exactly as it is. Do not alter it.",
    "5. From the creature that lurks between the two worlds, whose name begins with dread, take its opening three-letter fragment and write it in ALL CAPS.",
    "6. The power that moves objects. Take the first and last letters and write both in uppercase.",
    "7. Finish with a sharp symbol: add #."
  ];

  // Clues for second year
  const secondYearClues = [
    "1. A beast born from Hawkins Lab hides a faithful pet within its very name. Take that pet, change it to CAPS , flip it backwards, and replace every \"o\" in it with 0.",
    "2. When all lights go out, one word describes that world. From that word, take the last three letters and enter them backwards, all in lowercase.",
    "3. She is a well-known goddess of power and destruction in India. Use the first two letters of her name in ALL CAPS.",
    "4. The mind's silent force begins and ends boldly. Take the first and last letters of the word and write both in uppercase.",
    "5. A timeless proverb about friends. Count the number of words in it and use that number.",
    "6. The boy who changed Hawkins forever left behind a surname of five letters. Replace every vowel with ! and write the result in ALL CAPS.",
    "7. Every coded message needs its closure. End yours with the mark that glints like a sharpened hook: $."
  ];

  const clues = loggedInYear === '1st' ? firstYearClues : secondYearClues;

  const [canContinue, setCanContinue] = useState(false);

  // Phase 1: Show narrative message first, then allow user to continue
  useEffect(() => {
    if (triggerWord) {
      setShowJumbledMessage(true);
      // Play narrative background music
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.volume = 0.5; // Set volume (0.0 to 1.0)
        narrativeMusicRef.current.loop = true; // Loop the music
        narrativeMusicRef.current.play().catch(error => {
          console.error('Error playing narrative music:', error);
        });
      }
      // Enable continue button after a short delay (give time to read)
      const enableTimer = setTimeout(() => {
        setCanContinue(true);
      }, 2000);
      return () => clearTimeout(enableTimer);
    }
  }, [triggerWord]);

  // Handle continue from narrative to JoyceWall video
  const handleContinueToJoyceWall = () => {
    if (canContinue) {
      // Stop narrative music
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.pause();
        narrativeMusicRef.current.currentTime = 0;
      }
      setShowJumbledMessage(false);
      setCanContinue(false);
      setShowJoyceWallVideo(true);
      // Play Joyce wall background music
      if (joyceWallMusicRef.current) {
        joyceWallMusicRef.current.volume = 0.5; // Set volume (0.0 to 1.0)
        joyceWallMusicRef.current.loop = true; // Loop the music
        joyceWallMusicRef.current.play().catch(error => {
          console.error('Error playing Joyce wall music:', error);
        });
      }
    }
  };

  // Handle JoyceWall video end - show message and enable continue
  const handleJoyceWallVideoEnd = () => {
    setIsPlaying(false);
    setJoyceWallVideoComplete(true);
    setShowJoyceWallMessage(true);
  };

  // Handle continue from JoyceWall to clues display
  const handleContinueToFinale = () => {
    // Stop Joyce wall music
    if (joyceWallMusicRef.current) {
      joyceWallMusicRef.current.pause();
      joyceWallMusicRef.current.currentTime = 0;
    }
    setShowJoyceWallVideo(false);
    setShowJoyceWallMessage(false);
    // Show clues first before finale video
    setShowClues(true);
  };

  // Handle continue from clues to finale video
  const handleContinueFromClues = () => {
    setShowClues(false);
    // Transition to finale video after a short delay
    setTimeout(() => {
      setShowFinaleVideo(true);
    }, 500);
  };

  // Handle replay JoyceWall video
  const handleReplayJoyceWall = () => {
    if (joyceWallVideoRef.current) {
      setShowJoyceWallMessage(false);
      setJoyceWallVideoComplete(false);
      joyceWallVideoRef.current.currentTime = 0;
      playJoyceWallVideo();
    }
  };

  // Handle JoyceWall video loaded metadata
  const handleJoyceWallVideoLoaded = useCallback(() => {
    if (joyceWallVideoRef.current && showJoyceWallVideo) {
      playJoyceWallVideo();
    }
  }, [showJoyceWallVideo]);

  // Play JoyceWall video
  const playJoyceWallVideo = useCallback(async () => {
    if (joyceWallVideoRef.current) {
      try {
        setIsPlaying(true);
        await joyceWallVideoRef.current.play();
      } catch (error) {
        console.error('Error playing JoyceWall video:', error);
        setIsPlaying(false);
      }
    }
  }, []);

  // Start JoyceWall video when it becomes visible
  useEffect(() => {
    if (showJoyceWallVideo && joyceWallVideoRef.current) {
      if (joyceWallVideoRef.current.readyState >= 2) {
        playJoyceWallVideo();
      }
    }
  }, [showJoyceWallVideo, playJoyceWallVideo]);

  // Play finale video function with fullscreen and cursor restrictions
  const playFinaleVideo = useCallback(async () => {
    if (finaleVideoRef.current && finaleVideoContainerRef.current) {
      const video = finaleVideoRef.current;
      const container = finaleVideoContainerRef.current;
      
      // Ensure video starts from the beginning
      video.currentTime = 0;
      
      // Enter fullscreen on CONTAINER (not video) so password overlay is included
      const enterFullscreen = async () => {
        try {
          const el = container;
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
      
      try {
        await enterFullscreen();
        setIsPlaying(true);
        setVideoPaused(false);
        // Ensure password input is reset when starting video
        setShowPasswordInput(false);
        // Hide cursor immediately when video starts
        document.body.style.cursor = 'none';
        video.style.cursor = 'none';
        await video.play();
      } catch (error) {
        console.error('Error playing finale video:', error);
        setIsPlaying(false);
      }
    }
  }, []);

  // Check if password was already cracked on mount
  useEffect(() => {
    try {
      const alreadyCracked = localStorage.getItem('round3PasswordCracked');
      if (alreadyCracked === 'true') {
        // Password already cracked - don't show password input, just play video
        setShowPasswordInput(false);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Handle finale video time update - pause at specific time
  const handleFinaleTimeUpdate = useCallback(() => {
    // Check if password was already cracked - if so, don't pause
    try {
      const alreadyCracked = localStorage.getItem('round3PasswordCracked');
      if (alreadyCracked === 'true') {
        // Password already cracked - let video continue playing
        return;
      }
    } catch (e) {
      // ignore
    }
    
    if (finaleVideoRef.current && finaleVideoRef.current.currentTime >= PAUSE_TIME && !videoPaused && !showPasswordInput) {
      finaleVideoRef.current.pause();
      setVideoPaused(true);
      setIsPlaying(false);
      setShowPasswordInput(true);
    }
  }, [PAUSE_TIME, videoPaused, showPasswordInput]);

  // Handle finale video end - game is complete!
  const handleFinaleVideoEnd = async () => {
    // Start fade-out transition
    setFinaleVideoFading(true);
    
    // Immediately stop and pause the video
    if (finaleVideoRef.current) {
      finaleVideoRef.current.pause();
      finaleVideoRef.current.currentTime = finaleVideoRef.current.duration; // Ensure it's at the end
      setIsPlaying(false);
    }
    
    // Mark finale video as complete in localStorage so refresh shows credits
    try {
      localStorage.setItem('finaleVideoComplete', 'true');
      localStorage.setItem('gameComplete', 'true');
    } catch (e) {
      // ignore
    }
    
    // Restore cursor and exit fullscreen after fade starts
    setTimeout(async () => {
      document.body.style.cursor = '';
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
      
      await exitFullscreenSafe();
      setIsFullscreen(false);
    }, 500);
    
    // Call onComplete to show credits after fade-out completes
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  // Handle finale video loaded metadata - start playing
  const handleFinaleVideoLoaded = useCallback(() => {
    if (finaleVideoRef.current && showFinaleVideo) {
      const video = finaleVideoRef.current;
      // Ensure video starts from beginning
      video.currentTime = 0;
      // Reset password input state
      setShowPasswordInput(false);
      setVideoPaused(false);
      playFinaleVideo();
    }
  }, [showFinaleVideo, playFinaleVideo]);

  // Start finale video when it becomes visible
  useEffect(() => {
    if (showFinaleVideo && finaleVideoRef.current) {
      const video = finaleVideoRef.current;
      // Ensure video starts from beginning
      video.currentTime = 0;
      // Reset password input state
      setShowPasswordInput(false);
      setVideoPaused(false);
      if (video.readyState >= 2) {
        playFinaleVideo();
      }
    }
  }, [showFinaleVideo, playFinaleVideo]);

  // Handle fullscreen change events for finale video
  useEffect(() => {
    if (!showFinaleVideo) return;
    
    const onFullscreenChange = () => {
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      setIsFullscreen(active);
      
      // Ensure cursor stays hidden when in fullscreen
      if (active) {
        document.body.style.cursor = 'none';
        if (finaleVideoRef.current) {
          finaleVideoRef.current.style.cursor = 'none';
        }
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (fsEl) {
          fsEl.style.cursor = 'none';
        }
      }
    };
    
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
    };
  }, [showFinaleVideo]);

  // Cleanup finale video: restore cursor and exit fullscreen
  useEffect(() => {
    if (!showFinaleVideo) return;
    
    return () => {
      // Restore cursor
      document.body.style.cursor = '';
      
      // Exit fullscreen
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
          // ignore
        }
      };
      exitFullscreenSafe();
    };
  }, [showFinaleVideo]);

  // Handle password submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    
    const userPassword = password.trim().toUpperCase();
    const expected = correctPassword.toUpperCase();
    
    if (userPassword === expected || userPassword === 'UPSIDE DOWN') {
      // Correct password - save to localStorage and resume finale video
      try {
        localStorage.setItem('round3PasswordCracked', 'true');
      } catch (e) {
        // ignore
      }
      setShowPasswordInput(false);
      setVideoPaused(false);
      if (finaleVideoRef.current) {
        // Ensure cursor is hidden when resuming video
        document.body.style.cursor = 'none';
        finaleVideoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setPasswordError('Incorrect password. Try again!');
      setPassword('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (joyceWallVideoRef.current) {
        joyceWallVideoRef.current.pause();
        joyceWallVideoRef.current.currentTime = 0;
      }
      if (finaleVideoRef.current) {
        finaleVideoRef.current.pause();
        finaleVideoRef.current.currentTime = 0;
      }
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.pause();
        narrativeMusicRef.current.currentTime = 0;
      }
      if (joyceWallMusicRef.current) {
        joyceWallMusicRef.current.pause();
        joyceWallMusicRef.current.currentTime = 0;
      }
      // Restore cursor and exit fullscreen on unmount
      document.body.style.cursor = '';
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
          // ignore
        }
      };
      exitFullscreenSafe();
    };
  }, []);

  return (
    <div className="joyce-wall-container">
      {/* Background Music - Narrative Message */}
      {/* Uncomment the import statements at the top and add your audio files to use background music */}
      <audio
        ref={narrativeMusicRef}
        preload="auto"
        loop
        style={{ display: 'none' }}
      >
        {/* Once you add narrative-music.mp3 to assets folder, uncomment the import and this source tag */}
        {/* <source src={narrativeMusic} type="audio/mpeg" /> */}
        {/* <source src={narrativeMusic} type="audio/ogg" /> */}
      </audio>

      {/* Background Music - Joyce Wall Video */}
      <audio
        ref={joyceWallMusicRef}
        preload="auto"
        loop
        style={{ display: 'none' }}
      >
        {/* Once you add joyce-wall-music.mp3 to assets folder, uncomment the import and this source tag */}
        {/* <source src={joyceWallMusic} type="audio/mpeg" /> */}
        {/* <source src={joyceWallMusic} type="audio/ogg" /> */}
      </audio>

      {/* Narrative Message - Explanation */}
      {showJumbledMessage && (
        <div className="jumbled-message-overlay">
          <div className="jumbled-message-content">
            <div className="narrative-title">MESSAGE FROM THE UPSIDE DOWN</div>
            <div className="narrative-text">
              <p>A message has emerged from the Upside Down—scrambled and distorted by the dimensional rift between worlds.</p>
              <p>This message contains vital information that will help Eleven close the gate and seal the portal once and for all.</p>
              <p>Watch carefully as the transmission reveals itself. Use the knowledge you've gathered to assist Eleven in her final stand against the darkness.</p>
            </div>
            {canContinue && (
              <button 
                onClick={handleContinueToJoyceWall}
                className="tap-to-continue-button"
              >
                Tap to Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Phase 1: JoyceWall Video */}
      {showJoyceWallVideo && (
        <>
          <video 
            ref={joyceWallVideoRef}
            src={joyceWallVideo}
            className="joyce-wall-video"
            onLoadedMetadata={handleJoyceWallVideoLoaded}
            onEnded={handleJoyceWallVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            preload="auto"
            muted={false}
          />
          
          {/* Message Received after JoyceWall video */}
          {showJoyceWallMessage && (
            <div className="message-received">
              <h2>Message Received</h2>
            </div>
          )}

          {/* Control Buttons for JoyceWall Video */}
          <div className="joyce-wall-controls">
            <button 
              onClick={handleReplayJoyceWall}
              className="replay-button"
              disabled={isPlaying}
            >
              <span className="button-icon">↻</span>
              <span className="button-text">REPLAY</span>
            </button>
            {showJoyceWallMessage && joyceWallVideoComplete && (
              <button 
                onClick={handleContinueToFinale}
                className="continue-button"
              >
                <span className="button-text">CONTINUE</span>
                <span className="button-icon">→</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Phase 2: Finale Video */}
      {showFinaleVideo && (
        <div 
          ref={finaleVideoContainerRef} 
          className={`finale-video-container ${finaleVideoFading ? 'fading-out' : ''}`}
        >
          <video 
            ref={finaleVideoRef}
            src={finaleVideo}
            className="joyce-wall-video finale-video"
            onLoadedMetadata={handleFinaleVideoLoaded}
            onTimeUpdate={handleFinaleTimeUpdate}
            onEnded={handleFinaleVideoEnd}
            onPlay={() => {
              setIsPlaying(true);
              // Hide cursor when video plays - target body, video, and fullscreen element
              document.body.style.cursor = 'none';
              if (finaleVideoRef.current) {
                finaleVideoRef.current.style.cursor = 'none';
              }
              const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
              if (fsEl) {
                fsEl.style.cursor = 'none';
              }
            }}
            onPause={() => {
              setIsPlaying(false);
              // Keep cursor hidden in fullscreen even when paused
              const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
              if (isFs) {
                document.body.style.cursor = 'none';
                if (finaleVideoRef.current) {
                  finaleVideoRef.current.style.cursor = 'none';
                }
                const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
                if (fsEl) {
                  fsEl.style.cursor = 'none';
                }
              }
            }}
            playsInline
            preload="auto"
            muted={false}
            onLoadedData={() => {
              // Ensure video starts from beginning when data is loaded
              if (finaleVideoRef.current) {
                finaleVideoRef.current.currentTime = 0;
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
              pointerEvents: 'none',
              cursor: 'none'
            }}
          />
          
          {/* Password Input Overlay - INSIDE the fullscreen container */}
          {showPasswordInput && (
            <div className="password-overlay">
              <div className="password-overlay-content">
                <div className="password-title-section">
                  <div className="password-round-label">ROUND 3: THE FINAL SEAL</div>
                  <h2 className="password-title">ELEVEN NEEDS YOUR HELP</h2>
                  <p className="password-subtitle">ENTER THE PASSWORD TO CLOSE THE GATE</p>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="password-form-overlay">
                  <div className="password-input-wrapper">
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ENTER PASSWORD..."
                      className="password-input-game"
                      autoFocus
                      autoComplete="off"
                      required
                    />
                    {passwordError && (
                      <div className="password-error">{passwordError}</div>
                    )}
                  </div>
                  
                  <button type="submit" className="password-submit-button">
                    <span className="button-text">SEAL THE GATE</span>
                    <span className="button-icon">🔒</span>
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Clues Display - Shows after Joyce Wall and before finale video */}
      {showClues && (
        <div className="clues-overlay">
          <div className="clues-content">
            <h2 className="clues-heading">THE PORTAL CLUES</h2>
            <div className="clues-list">
              {clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  {clue}
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={handleContinueFromClues}
            className="clue-tap-to-continue"
          >
            TAP TO CONTINUE
          </button>
        </div>
      )}
    </div>
  );
}
