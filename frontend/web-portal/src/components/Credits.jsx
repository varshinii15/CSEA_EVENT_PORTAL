import React, { useEffect, useRef } from 'react';
import './Credits.css';

const Credits = ({ onComplete }) => {
  const creditsRef = useRef(null);

  // Credits data organized by sections
  const creditsData = [
    {
      title: "FRONTEND",
      items: [
        { role: "", name: "Suganth" },
        { role: "", name: "Shloka" },
        { role: "", name: "Vishwanath" },
        { role: "", name: "Hari Krishna" },
        { role: "", name: "Nyajum" },
      ]
    },
    {
      title: "BACKEND",
      items: [
        { role: "", name: "Ahamed" },
        { role: "", name: "Srivarshini" },
        { role: "", name: "Dharaneesh S.L" },
        { role: "", name: "Thejas Achyuth J" },
        { role: "", name: "Preethi P S" },
        { role: "", name: "Sukesh" },
        { role: "", name: "Moorthi" },
        { role: "", name: "Santhosh S" },
      ]
    },
    {
      title: "PORTAL CHALLENGES",
      items: [
        { role: "", name: "Delicia" },
        { role: "", name: "Praveen" },
        { role: "", name: "Deepakkumar S" },
        { role: "", name: "Avantika" },
        { role: "", name: "Sanjana" },
        { role: "", name: "Pavithra" },
        { role: "", name: "Swetha" },
        { role: "", name: "Avanthika" },
      ]
    },
    {
      title: "POSTERS",
      items: [
        { role: "", name: "Shruthi" },
        { role: "", name: "Harsha" },
        { role: "", name: "Shakthi" },
        { role: "", name: "Harikesava" },
      ]
    },
    {
      title: "REELS AND EDITS",
      items: [
        { role: "Editor", name: "Nathan" },
        { role: "", name: "Dharanesh" },
        { role: "", name: "Alamelu" },
        { role: "", name: "Delicia" },
        { role: "", name: "Santhosh" },
        { role: "", name: "Praveen" },
        { role: "", name: "Vishwanath" },
        { role: "", name: "Hari Krishna" },
        { role: "", name: "Deepakkumar S" },
      ]
    },
    {
      title: "PUBLICITY",
      items: [
        { role: "", name: "Delicia" },
        { role: "", name: "Deepakkumar S" },
        { role: "", name: "Praveen" },
        { role: "", name: "Sneha" },
        { role: "", name: "Nathan" },
        { role: "", name: "Akshaya" },
      ]
    },
    {
      title: "DOCUMENTATION",
      items: [
        { role: "", name: "Shahana" },
        { role: "", name: "Praveen" },
      ]
    },
    {
      title: "SPECIAL THANKS",
      items: [
        { role: "Secretary", name: "Arulkumara B R" },
        { role: "Joint Secretary", name: "Sanjay Jayakumar" },
        { role: "Joint Secretary", name: "Delicia Angeline" },
        { role: "", name: "CSEA" },
        { role: "", name: "Computer Science and Engineering Association" },
        { role: "", name: "PSG College of Technology" },
      ]
    },
    {
      title: "DEDICATED TO",
      items: [
        { role: "", name: "All the Players Who" },
        { role: "", name: "Dared to Enter" },
        { role: "", name: "The Upside Down" },
        { role: "", name: "And Saved Hawkins" },
      ]
    }
  ];

  useEffect(() => {
    // Wait for content to render, then set initial position
    const initScroll = () => {
      if (creditsRef.current) {
        // Start at the very top (scrollTop = 0) which shows black background
        // Content is pushed down by top padding, so it starts below viewport
        creditsRef.current.scrollTop = 0;
      }
    };

    // Set initial position immediately and after a small delay to ensure DOM is ready
    initScroll();
    const initTimer = setTimeout(initScroll, 100);
    const initTimer2 = setTimeout(initScroll, 300);

    // Calculate total scroll duration based on content height
    const scrollDuration = 30000; // 30 seconds total
    const startTime = Date.now() + 800; // Start after 800ms to ensure content is positioned

    const scroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.max(elapsed / scrollDuration, 0), 1);
      
      if (creditsRef.current) {
        const scrollHeight = creditsRef.current.scrollHeight - window.innerHeight;
        creditsRef.current.scrollTop = progress * scrollHeight;
      }

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        // Credits finished - stop scrolling and keep final message visible
        // Don't call onComplete - stay on credits screen
      }
    };

    // Start scrolling after brief delay
    const scrollTimer = setTimeout(() => {
      requestAnimationFrame(scroll);
    }, 800);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(initTimer2);
      clearTimeout(scrollTimer);
    };
  }, [onComplete]);

  return (
    <div className="credits-container">
      <div 
        ref={creditsRef} 
        className="credits-scroll"
        tabIndex={-1}
        onFocus={(e) => e.target.blur()}
      >
        <div className="credits-content">
          {/* Opening Title */}
          <div className="credits-opening">
            <div className="credits-main-title">THE GATE IS CLOSED</div>
            <div className="credits-main-subtitle">CSEA EVENT PORTAL</div>
          </div>

          {/* Credits Sections */}
          {creditsData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="credits-section">
              <div className="credits-section-title">{section.title}</div>
              <div className="credits-divider"></div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="credits-item">
                  {item.role && (
                    <div className="credits-role">{item.role}</div>
                  )}
                  <div className="credits-name">{item.name}</div>
                </div>
              ))}
            </div>
          ))}

          {/* Closing Message */}
          <div className="credits-closing">
            <div className="credits-closing-line">HAWKINS IS SAFE</div>
            <div className="credits-closing-line">UNTIL NEXT TIME...</div>
            <div className="credits-logo">CSEA EVENT PORTAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
