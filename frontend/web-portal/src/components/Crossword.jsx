import React, { useState, useEffect } from 'react';

const Crossword = ({ year, onComplete }) => {
  // First year crossword data - based on first image
  const firstYearCrossword = {
    size: 15,
    blockedCells: [
      // Row 0: active cols 0-7, block 8-14
      [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14],
      // Row 1: active cols 2, 4, block all others
      [1, 0], [1, 1], [1, 3], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12], [1, 13], [1, 14],
      // Row 2: active cols 2, 4, 8, block all others
      [2, 0], [2, 1], [2, 3], [2, 5], [2, 6], [2, 7], [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14],
      // Row 3: active cols 2, 4, 5, 6, 7, 8, block all others
      [3, 0], [3, 1], [3, 3], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13], [3, 14],
      // Row 4: active cols 2, 4, 8, block all others
      [4, 0], [4, 1], [4, 3], [4, 5], [4, 6], [4, 7], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14],
      // Row 5: active cols 4, 6, 7, 8, 9, 10, block all others
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 5], [5, 11], [5, 12], [5, 13], [5, 14],
      // Row 6: active col 10, block all others
      [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 11], [6, 12], [6, 13], [6, 14],
      // Row 7: active cols 7, 8, 9, 10, 11, 12, 13, block all others
      [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 14],
      // Row 8: active cols 5, 7, 10, block all others
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 6], [8, 8], [8, 9], [8, 11], [8, 12], [8, 13], [8, 14],
      // Row 9: active cols 4, 5, 6, 7, block all others
      [9, 0], [9, 1], [9, 2], [9, 3], [9, 8], [9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14],
      // Row 10: active cols 1, 5, 7, block all others
      [10, 0], [10, 2], [10, 3], [10, 4], [10, 6], [10, 8], [10, 9], [10, 10], [10, 11], [10, 12], [10, 13], [10, 14],
      // Row 11: active cols 1, 2, 3, 4, 5, 6, block all others
      [11, 0], [11, 7], [11, 8], [11, 9], [11, 10], [11, 11], [11, 12], [11, 13], [11, 14],
      // Row 12: active col 1, block all others
      [12, 0], [12, 2], [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11], [12, 12], [12, 13], [12, 14],
      // Row 13: active col 1, block all others
      [13, 0], [13, 2], [13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12], [13, 13], [13, 14],
      // Row 14: active col 1, block all others
      [14, 0], [14, 2], [14, 3], [14, 4], [14, 5], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10], [14, 11], [14, 12], [14, 13], [14, 14]
    ],
    across: [
      { num: 1, clue: "Max's lifeline in Season 4", answer: "XXXXXXXX", start: [0, 0] }, // Row 0, columns 0-7 (8 boxes: 1x1 to 1x8)
      { num: 2, clue: "Placeholder clue - update me", answer: "X", start: [1, 2] }, // Row 1, col 2 (2x3)
      { num: 3, clue: "Placeholder clue - update me", answer: "X", start: [1, 4] }, // Row 1, col 4 (2x5)
      { num: 4, clue: "Placeholder clue - update me", answer: "X", start: [2, 2] }, // Row 2, col 2 (3x3)
      { num: 5, clue: "Placeholder clue - update me", answer: "X", start: [2, 4] }, // Row 2, col 4 (3x5) - no number displayed here
      { num: 6, clue: "Placeholder clue - update me", answer: "X", start: [2, 8] }, // Row 2, col 8 (3x9) - no number displayed here
      { num: 7, clue: "Placeholder clue - update me", answer: "X", start: [3, 2] }, // Row 3, col 2 (4x3)
      { num: 5, clue: "The main antagonist from Season 4", answer: "XXXXX", start: [3, 4] }, // Row 3, cols 4-8 (4x5 to 4x9) - number 5
      { num: 9, clue: "Placeholder clue - update me", answer: "X", start: [4, 2] }, // Row 4, col 2 (5x3)
      { num: 10, clue: "Steve Harrington's iconic feature", answer: "X", start: [4, 4] }, // Row 4, col 4 (5x5)
      { num: 11, clue: "Placeholder clue - update me", answer: "X", start: [4, 8] }, // Row 4, col 8 (5x9)
      { num: 12, clue: "Country where Hopper was imprisoned", answer: "X", start: [5, 4] }, // Row 5, col 4 (6x5)
      { num: 13, clue: "Family name of Will and Jonathan", answer: "XXXXX", start: [5, 6] }, // Row 5, cols 6-10 (6x7 to 6x11) - number 6
      { num: 14, clue: "Placeholder clue - update me", answer: "X", start: [6, 10] }, // Row 6, col 10 (7x11)
      { num: 8, clue: "Younger version of a Demogorgon", answer: "XXXXXXX", start: [7, 7] }, // Row 7, cols 7-13 (8x8 to 8x14) - number 8
      { num: 16, clue: "Placeholder clue - update me", answer: "X", start: [8, 5] }, // Row 8, col 5 (9x6) - number 9, but this is ACROSS, clue 9 is DOWN
      { num: 17, clue: "Placeholder clue - update me", answer: "X", start: [8, 7] }, // Row 8, col 7 (9x8)
      { num: 18, clue: "Placeholder clue - update me", answer: "X", start: [8, 10] }, // Row 8, col 10 (9x11)
      { num: 19, clue: "Steve Harrington's iconic feature", answer: "XXXX", start: [9, 4] }, // Row 9, cols 4-7 (10x5 to 10x8) - number 10
      { num: 20, clue: "Placeholder clue - update me", answer: "X", start: [10, 1] }, // Row 10, col 1 (11x2)
      { num: 21, clue: "Placeholder clue - update me", answer: "X", start: [10, 5] }, // Row 10, col 5 (11x6)
      { num: 22, clue: "Placeholder clue - update me", answer: "X", start: [10, 7] }, // Row 10, col 7 (11x8)
      { num: 23, clue: "Country where Hopper was imprisoned", answer: "XXXXXX", start: [11, 1] }, // Row 11, cols 1-6 (12x2 to 12x7) - number 12
      { num: 24, clue: "Placeholder clue - update me", answer: "X", start: [12, 1] }, // Row 12, col 1 (13x2)
      { num: 25, clue: "Placeholder clue - update me", answer: "X", start: [13, 1] }, // Row 13, col 1 (14x2)
      { num: 26, clue: "Placeholder clue - update me", answer: "X", start: [14, 1] } // Row 14, col 1 (15x2)
    ],
    down: [
      { num: 1, clue: "Placeholder clue - update me", answer: "X", start: [0, 0] }, // Col 0, row 0 only (1 cell)
      { num: 2, clue: "House linked to Vecna's past", answer: "XXXXX", start: [10, 1] }, // Col 1, rows 10-14 (5 cells) - number 11
      { num: 3, clue: "Former popular kid, now a 'babysitter'", answer: "XXXXX", start: [0, 2] }, // Col 2, rows 0-4 (5 cells) - number 2
      { num: 4, clue: "Portal to the Upside Down", answer: "XXXXX", start: [2, 8] }, // Col 8, rows 2,3,4,7 (5 cells) - number 4
      { num: 5, clue: "The girl with telekinetic powers in Hawkins", answer: "XXXXXXX", start: [0, 4] }, // Col 4, rows 0,1,2,3,4,5,9 (7 cells) - number 3
      { num: 6, clue: "Placeholder clue - update me", answer: "XXXXXX", start: [0, 5] }, // Col 5, rows 0,5,8,9,10,11 (6 cells)
      { num: 7, clue: "Placeholder clue - update me", answer: "XXXX", start: [0, 6] }, // Col 6, rows 0,5,9,11 (4 cells)
      { num: 8, clue: "Dustin's pet Demodog", answer: "XXXXX", start: [7, 7] }, // Col 7, starting at row 7 (8x8) - number 8
      { num: 9, clue: "Short for where the Byers moved", answer: "XXXX", start: [8, 5] }, // Col 5, starting at row 8 (9x6) - number 9
      { num: 10, clue: "Placeholder clue - update me", answer: "XXX", start: [5, 9] }, // Col 9, rows 5,7 (3 cells)
      { num: 11, clue: "Ball where Mike and Eleven danced", answer: "XXXXX", start: [5, 10] }, // Col 10, rows 5,6,7,8 (5 cells) - number 7
      { num: 12, clue: "Placeholder clue - update me", answer: "X", start: [7, 11] }, // Col 11, row 7 only (1 cell)
      { num: 13, clue: "Placeholder clue - update me", answer: "X", start: [7, 12] }, // Col 12, row 7 only (1 cell)
      { num: 14, clue: "Placeholder clue - update me", answer: "X", start: [7, 13] } // Col 13, row 7 only (1 cell)
    ]
  };

  // Second year crossword data - EXACT structure matching the filled puzzle image
  // Active cells per row from filled puzzle:
  // Row 0: ALL 12 cells (0-11) - numbers 1,2,4 at [0,0], [0,2], [0,11]
  // Row 1: cols 0,1,2,3,7,11 - number 3 at [1,3]
  // Row 2: cols 0,1,3,7,11
  // Row 3: cols 0,1,3,7,11
  // Row 4: cols 0-7,9-11 (black at 8) - number 5 at [4,0]
  // Row 5: cols 0,3,5-10 - number 6 at [5,5]
  // Row 6: cols 0,3,7
  // Row 7: cols 0-4,7,8 - numbers 7,8,9 at [7,1], [7,0], [7,8]
  // Row 8: cols 0,1,3,4,7,8
  // Row 9: cols 0,1,3,4,7,8 - number 10 at [9,4]
  // Row 10: cols 0-4,7,8 (black at 5) - number 11 at [10,0]
  // Row 11: cols 0-4,8 - number 12 at [11,0]
  const secondYearCrossword = {
    size: 15,
    blockedCells: [
      [0, 11], // Block 1x12 (column 11 in row 0)
      [1, 0], [1, 1], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 11], [1, 13], [1, 14], // Block all in row 1 except columns 2, 10, and 12 (2x3, 2x11, 2x13)
      [2, 0], [2, 1], [2, 4], // Block row 2 except column 2 (3x3) and columns 5-14 (3x6 to 3x15)
      [3, 0], [3, 1], [3, 3], [3, 4], [3, 6], [3, 7], [3, 8], [3, 9], [3, 11], [3, 13], [3, 14], // Block row 3 except columns 2 (4x3), 5 (4x6), 10 (4x11), 12 (4x13)
      [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 6], [4, 13], [4, 14], // Block row 4 except columns 5 (5x6) and 7-12 (5x8 to 5x13), block 5x14
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 7], [5, 8], [5, 9], [5, 11], [5, 12], [5, 13], [5, 14], // Block row 5 except columns 5 (6x6) and 10 (6x11)
      [6, 0], [6, 1], [6, 3], [6, 4], [6, 6], [6, 7], [6, 8], [6, 9], [6, 11], [6, 12], [6, 13], [6, 14], // Block row 6 except columns 2 (7x3), 5 (7x6), 10 (7x11)
      [7, 0], [7, 6], [7, 7], [7, 8], [7, 9], [7, 11], [7, 12], [7, 13], [7, 14], // Block row 7 except columns 1-5 (8x2 to 8x6) and 10 (8x11), block 8x12
      [8, 0], [8, 1], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 9], [8, 11], [8, 12], [8, 13], [8, 14], // Block row 8 except columns 2 (9x3), 8 (9x9), 10 (9x11)
      [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 7], [9, 9], [9, 11], [9, 12], [9, 13], [9, 14], // Block row 9 except columns 6 (10x7), 8 (10x9), 10 (10x11)
      [10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 11], [10, 12], [10, 13], [10, 14], // Block row 10 except columns 6-10 (11x7 to 11x11)
      [11, 0], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5], [11, 7], [11, 9], [11, 10], [11, 11], [11, 12], [11, 13], [11, 14], // Block row 11 except columns 6 (12x7), 8 (12x9)
      [12, 0], [12, 1], [12, 2], [12, 3], [12, 4], [12, 9], [12, 10], [12, 11], [12, 12], [12, 13], [12, 14], // Block row 12 except columns 5-8 (13x6 to 13x9)
      [13, 0], [13, 1], [13, 2], [13, 3], [13, 4], [13, 5], [13, 7], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12], [13, 13], [13, 14] // Block row 13 except column 6 (14x7)
    ],
    across: [
      { num: 1, clue: "Local newspaper where Nancy worked", answer: "HAWKINSPOST", start: [0, 0] }, // Row 0, cols 0-10 (11 cells: 1x1 to 1x11)
      { num: 13, clue: "", answer: "X", start: [0, 12] }, // 1x13 (column 12)
      { num: 5, clue: "Evil entity controlling minds from the Upside Down", answer: "PLACEHOLDER", start: [2, 5] }, // Row 2, cols 5-14 (10 cells: 3x6 to 3x15)
      { num: 6, clue: "Device the kids use to communicate, a talkie partner", answer: "PLACEH", start: [4, 7] }, // Row 4, cols 7-12 (6 cells: 5x8 to 5x13)
      { num: 20, clue: "", answer: "X", start: [4, 5] }, // Row 4, col 5 (5x6) - no number displayed
      { num: 8, clue: "Mike's older sister, an aspiring journalist", answer: "PLACEHOLDER", start: [7, 1] }, // Row 7, cols 1-5 (5 cells: 8x2 to 8x6)
      { num: 11, clue: "Doctor who helps Eleven regain her powers", answer: "PLACEHOLDER", start: [10, 6] }, // Row 10, cols 6-10 (5 cells: 11x7 to 11x11)
      { num: 12, clue: "Nancy's younger brother and Eleven's friend", answer: "PLACEHOLDER", start: [12, 5] } // Row 12, cols 5-8 (4 cells: 13x6 to 13x9)
    ],
    down: [
      { num: 2, clue: "Boy who goes missing in Season 1, connected to the Upside Down", answer: "HILL", start: [0, 2] }, // Col 2, rows 0-3 (4 cells)
      { num: 3, clue: "Eleven's power to move objects with her mind", answer: "TELEKINESIS", start: [0, 10] }, // Col 10, rows 0-10 (11 cells) - from 1x11 to 11x11
      { num: 14, clue: "", answer: "X", start: [1, 10] }, // Col 10, row 1 (2x11)
      { num: 17, clue: "", answer: "X", start: [3, 5] }, // Col 5, row 3 (4x6)
      { num: 18, clue: "", answer: "X", start: [3, 10] }, // Col 10, row 3 (4x11)
      { num: 20, clue: "", answer: "X", start: [5, 5] }, // Col 5, row 5 (6x6)
      { num: 19, clue: "", answer: "X", start: [5, 10] }, // Col 10, row 5 (6x11)
      { num: 24, clue: "", answer: "X", start: [6, 2] }, // Col 2, row 6 (7x3)
      { num: 25, clue: "", answer: "X", start: [6, 5] }, // Col 5, row 6 (7x6)
      { num: 26, clue: "", answer: "X", start: [6, 10] }, // Col 10, row 6 (7x11)
      { num: 27, clue: "", answer: "X", start: [7, 10] }, // Col 10, row 7 (8x11)
      { num: 28, clue: "", answer: "X", start: [8, 2] }, // Col 2, row 8 (9x3)
      { num: 29, clue: "", answer: "X", start: [8, 8] }, // Col 8, row 8 (9x9)
      { num: 30, clue: "", answer: "X", start: [8, 10] }, // Col 10, row 8 (9x11)
      { num: 31, clue: "", answer: "X", start: [9, 6] }, // Col 6, row 9 (10x7)
      { num: 32, clue: "", answer: "X", start: [9, 8] }, // Col 8, row 9 (10x9)
      { num: 33, clue: "", answer: "X", start: [9, 10] }, // Col 10, row 9 (10x11)
      { num: 34, clue: "", answer: "X", start: [11, 6] }, // Col 6, row 11 (12x7)
      { num: 35, clue: "", answer: "X", start: [11, 8] }, // Col 8, row 11 (12x9)
      { num: 36, clue: "", answer: "X", start: [13, 6] }, // Col 6, row 13 (14x7)
      { num: 4, clue: "Will and Jonathan's mother, played by Winona Ryder", answer: "JOYCE", start: [0, 12] }, // Col 12, rows 0-4 (5 cells)
      { num: 5, clue: "Conspiracy theorist and private investigator", answer: "MURRAY", start: [2, 5] }, // Col 5, rows 2-7 (6 cells) - from 3x6 to 8x6, row 8 col 5 is blocked
      { num: 7, clue: "Redhead who moves to Hawkins, joins the group", answer: "MAX", start: [6, 2] }, // Col 2, rows 6-8 (3 cells) - from 7x3 to 9x3
      { num: 9, clue: "Nancy's ex-boyfriend who worked at Scoops Ahoy", answer: "STEVE", start: [8, 8] }, // Col 8, rows 8-12 (5 cells) - from 9x9 to 13x9 (row 13 col 8 IS blocked)
      { num: 10, clue: "Steve's coworker at Scoops Ahoy, code-breaker", answer: "ROBIN", start: [9, 6] } // Col 6, rows 9-13 (5 cells) - from 10x7 to 14x7, row 13 col 6 is active
    ]
  };

  const crosswordData = year === '1st' ? firstYearCrossword : secondYearCrossword;
  const [selectedClue, setSelectedClue] = useState(null);
  const [grid, setGrid] = useState(() => {
    const size = crosswordData.size;
    return Array(size).fill(null).map(() => Array(size).fill(''));
  });

  useEffect(() => {
    const newGrid = Array(crosswordData.size).fill(null).map(() => Array(crosswordData.size).fill(''));
    setGrid(newGrid);
  }, [crosswordData.size]);

  const isBlocked = (row, col) => {
    return crosswordData.blockedCells.some(([r, c]) => r === row && c === col);
  };

  // Helper to check if a clue is a real clue (not a placeholder)
  const isRealClue = (clue) => {
    return clue.clue && clue.clue.trim() !== '' && !clue.clue.includes('Placeholder clue') && clue.answer && clue.answer.length > 1 && clue.answer !== 'X';
  };

  const isCellActive = (row, col) => {
    if (isBlocked(row, col)) return false;
    
    // Check if cell is part of any across clue (consecutive cells from start position)
    // Only check real clues, and account for blocked cells in the path
    const inAcross = crosswordData.across.some(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      if (row !== startRow) return false;
      // Cell must be within the answer length range
      if (col < startCol || col >= startCol + clue.answer.length) return false;
      // Check that all cells from start to this cell are not blocked
      for (let c = startCol; c <= col; c++) {
        if (isBlocked(row, c)) return false;
      }
      return true;
    });
    
    // Check if cell is part of any down clue (consecutive cells from start position)
    // Only check real clues, and account for blocked cells in the path
    const inDown = crosswordData.down.some(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      if (col !== startCol) return false;
      // Cell must be within the answer length range
      if (row < startRow || row >= startRow + clue.answer.length) return false;
      // Check that all cells from start to this cell are not blocked
      for (let r = startRow; r <= row; r++) {
        if (isBlocked(r, col)) return false;
      }
      return true;
    });
    
    return inAcross || inDown;
  };

  const getClueNumber = (row, col) => {
    // Numbers only at specific boxes (1-indexed to 0-indexed conversion)
    if (year === '1st') {
      if (row === 0 && col === 0) return 1; // 1x1
      if (row === 0 && col === 2) return 2; // 1x3
      if (row === 0 && col === 4) return 3; // 1x5
      if (row === 2 && col === 8) return 4; // 3x9
      if (row === 3 && col === 4) return 5; // 4x5
      if (row === 5 && col === 6) return 6; // 6x7
      if (row === 5 && col === 10) return 7; // 6x11
      if (row === 7 && col === 7) return 8; // 8x8
      if (row === 8 && col === 5) return 9; // 9x6
      if (row === 9 && col === 4) return 10; // 10x5
      if (row === 10 && col === 1) return 11; // 11x2
      if (row === 11 && col === 1) return 12; // 12x2
    } else if (year !== '1st') {
      if (row === 0 && col === 0) return 1; // 1x1
      if (row === 0 && col === 2) return 2; // 1x3 (clue 2 down starts here)
      if (row === 0 && col === 10) return 3; // 1x11 (number 3 displayed here - track to this for clue 3 down)
      if (row === 0 && col === 12) return 4; // 1x13 (clue 4 down starts here)
      if (row === 2 && col === 5) return 5; // 3x6 (clue 5 down starts here - displays 5)
      if (row === 4 && col === 7) return 6; // 5x8 (across clue 6)
      if (row === 6 && col === 2) return 7; // 7x3 (across or other)
      if (row === 7 && col === 1) return 8; // 8x2 (across clue 8)
      if (row === 8 && col === 8) return 9; // 9x9 (clue 9 down starts here)
      if (row === 9 && col === 6) return 10; // 10x7 (clue 10 down starts here)
      if (row === 10 && col === 6) return 11; // 11x7 (across clue 11)
      if (row === 12 && col === 5) return 12; // 13x6 (across clue 12)
    }
    return null;
  };

  // Helper function to get the displayed clue number for a clue based on its start position
  const getDisplayedClueNumber = (clue) => {
    const [startRow, startCol] = clue.start;
    return getClueNumber(startRow, startCol);
  };

  // Filter clues to only show those with actual questions (not placeholders) and displayed numbers 1-12
  const getValidClues = (clues) => {
    if (year === '1st') {
      // For first year: filter by displayed number and real questions
      return clues.filter(clue => {
        const displayedNum = getDisplayedClueNumber(clue);
        const hasRealQuestion = clue.clue && clue.clue.trim() !== '' && !clue.clue.includes('Placeholder clue');
        return displayedNum !== null && displayedNum >= 1 && displayedNum <= 12 && hasRealQuestion;
      }).map(clue => ({
        ...clue,
        displayedNum: getDisplayedClueNumber(clue)
      })).sort((a, b) => a.displayedNum - b.displayedNum);
    } else {
      // For second year: filter by clue.num and ensure it's a real clue
      return clues.filter(clue => {
        return clue.num >= 1 && clue.num <= 12 && isRealClue(clue);
      }).map(clue => ({
        ...clue,
        displayedNum: clue.num
      }));
    }
  };

  const handleCellClick = (row, col, skipSwitch = false) => {
    if (!isCellActive(row, col)) return;
    
    // First, check if this cell is the start of a clue (has a number)
    const clueNum = getClueNumber(row, col);
    
    // Find clues that start at this position (only real clues)
    const acrossClueAtStart = clueNum ? crosswordData.across.find(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      return row === startRow && col === startCol;
    }) : null;
    
    const downClueAtStart = clueNum ? crosswordData.down.find(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      return row === startRow && col === startCol;
    }) : null;
    
    // If this is a numbered cell, select the appropriate clue
    if (clueNum) {
      // Check if we're currently typing in a clue that contains this cell
      // If so, don't switch clues - keep the current one
      if (selectedClue && !skipSwitch) {
        const [startRow, startCol] = selectedClue.start;
        const isInCurrentClue = selectedClue.direction === 'across' 
          ? (row === startRow && col >= startCol && col < startCol + selectedClue.answer.length)
          : (col === startCol && row >= startRow && row < startRow + selectedClue.answer.length);
        
        // If this cell is part of the current clue, don't switch
        if (isInCurrentClue) {
          return; // Keep the current clue selected
        }
      }
      
      // Check which clue has this displayed number
      const acrossDisplayedNum = acrossClueAtStart ? getDisplayedClueNumber(acrossClueAtStart) : null;
      const downDisplayedNum = downClueAtStart ? getDisplayedClueNumber(downClueAtStart) : null;
      
      // If both clues start here (same number for both across and down)
      if (acrossClueAtStart && downClueAtStart) {
        // If we already have a selected clue with this number, keep its direction
        const currentDisplayedNum = selectedClue?.displayedNum || (selectedClue ? getDisplayedClueNumber(selectedClue) : null);
        if (selectedClue && currentDisplayedNum === clueNum) {
          // Keep the current direction - don't switch (respect which question was clicked)
          if (selectedClue.direction === 'across' && acrossClueAtStart) {
            setSelectedClue({ ...acrossClueAtStart, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClueAtStart) });
          } else if (selectedClue.direction === 'down' && downClueAtStart) {
            setSelectedClue({ ...downClueAtStart, direction: 'down', displayedNum: getDisplayedClueNumber(downClueAtStart) });
          }
        } else {
          // No current selection or different number - check which one has the displayed number
          // If both have the same displayed number, default to across
          if (acrossDisplayedNum === clueNum && downDisplayedNum === clueNum) {
            // Both have same number - default to across
            setSelectedClue({ ...acrossClueAtStart, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClueAtStart) });
          } else if (acrossDisplayedNum === clueNum) {
            setSelectedClue({ ...acrossClueAtStart, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClueAtStart) });
          } else if (downDisplayedNum === clueNum) {
            setSelectedClue({ ...downClueAtStart, direction: 'down', displayedNum: getDisplayedClueNumber(downClueAtStart) });
          } else {
            // Default to across if numbers don't match (shouldn't happen)
            setSelectedClue({ ...acrossClueAtStart, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClueAtStart) });
          }
        }
      } else if (acrossClueAtStart) {
        setSelectedClue({ ...acrossClueAtStart, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClueAtStart) });
      } else if (downClueAtStart) {
        setSelectedClue({ ...downClueAtStart, direction: 'down', displayedNum: getDisplayedClueNumber(downClueAtStart) });
      }
      return; // Exit early
    }
    
    // If not a numbered cell, find clues that contain this cell (only real clues)
    const acrossClue = crosswordData.across.find(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      return row === startRow && col >= startCol && col < startCol + clue.answer.length;
    });
    
    const downClue = crosswordData.down.find(clue => {
      if (!isRealClue(clue)) return false;
      const [startRow, startCol] = clue.start;
      return col === startCol && row >= startRow && row < startRow + clue.answer.length;
    });

    // If clicking on a non-numbered cell, keep the current selected clue's direction
    // Don't switch unless we have no selected clue
    if (selectedClue) {
      // Keep the current direction - don't switch
      if (selectedClue.direction === 'across' && acrossClue) {
        setSelectedClue({ ...acrossClue, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClue) });
      } else if (selectedClue.direction === 'down' && downClue) {
        setSelectedClue({ ...downClue, direction: 'down', displayedNum: getDisplayedClueNumber(downClue) });
      }
    } else {
      // No selected clue - default to across if available
      if (acrossClue) {
        setSelectedClue({ ...acrossClue, direction: 'across', displayedNum: getDisplayedClueNumber(acrossClue) });
      } else if (downClue) {
        setSelectedClue({ ...downClue, direction: 'down', displayedNum: getDisplayedClueNumber(downClue) });
      }
    }
  };

  const handleInputChange = (row, col, value) => {
    if (!isCellActive(row, col)) return;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value.toUpperCase().slice(-1);
    setGrid(newGrid);
    
    // Auto-advance to next cell when typing - ONLY within the current clue
    if (value && selectedClue) {
      const [startRow, startCol] = selectedClue.start;
      
      if (selectedClue.direction === 'across') {
        // Move right (across) - continue through intersections
        let nextCol = col + 1;
        
        // Check if next cell is still within the current clue's range
        if (nextCol < startCol + selectedClue.answer.length && nextCol < crosswordData.size) {
          // Skip blocked/inactive cells
          while (nextCol < startCol + selectedClue.answer.length && 
                 nextCol < crosswordData.size &&
                 (isBlocked(row, nextCol) || !isCellActive(row, nextCol))) {
            nextCol++;
          }
          
          // Always advance if within clue's range and cell is active
          // Don't stop at intersections - continue in the selected clue's direction
          if (nextCol < startCol + selectedClue.answer.length && 
              nextCol < crosswordData.size && 
              isCellActive(row, nextCol) && 
              !isBlocked(row, nextCol)) {
            setTimeout(() => {
              const nextInput = document.querySelector(`input[data-row="${row}"][data-col="${nextCol}"]`);
              if (nextInput) {
                nextInput.focus();
                nextInput.select(); // Select the text for easy replacement
              }
            }, 10);
          }
        }
      } else {
        // Move down - continue through intersections
        let nextRow = row + 1;
        
        // Check if next cell is still within the current clue's range
        if (nextRow < startRow + selectedClue.answer.length && nextRow < crosswordData.size) {
          // Skip blocked/inactive cells
          while (nextRow < startRow + selectedClue.answer.length && 
                 nextRow < crosswordData.size &&
                 (isBlocked(nextRow, col) || !isCellActive(nextRow, col))) {
            nextRow++;
          }
          
          // Always advance if within clue's range and cell is active
          // Don't stop at intersections - continue in the selected clue's direction
          if (nextRow < startRow + selectedClue.answer.length && 
              nextRow < crosswordData.size && 
              isCellActive(nextRow, col) && 
              !isBlocked(nextRow, col)) {
            setTimeout(() => {
              const nextInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${col}"]`);
              if (nextInput) {
                nextInput.focus();
                nextInput.select(); // Select the text for easy replacement
              }
            }, 10);
          }
        }
      }
    }
  };

  const checkAnswer = () => {
    // Always proceed when Check Answer is clicked
    // The parent component (RoundOne) will handle whether to show reward video or go back to dice
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div style={{ 
      width: '100%',
      height: '100vh',
      display: 'flex', 
      gap: '4rem', 
      padding: '2.5rem 4rem',
      margin: 0,
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      maxWidth: '100%',
      overflow: 'auto'
    }}>
      {/* Crossword Grid - Left Half (50%) */}
      <div style={{ 
        flex: '1',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        minWidth: 0
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${crosswordData.size}, 1fr)`,
          gap: '2px',
          backgroundColor: '#1a0000',
          padding: '15px',
          border: '4px solid #E6194B',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '100%',
          aspectRatio: '1',
          boxSizing: 'border-box',
          boxShadow: '0 6px 20px rgba(230, 25, 75, 0.5)',
          minHeight: '600px'
        }}>
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const blocked = isBlocked(rowIdx, colIdx);
              const active = isCellActive(rowIdx, colIdx);
              const clueNum = getClueNumber(rowIdx, colIdx);
              
              if (blocked) {
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: '#000',
                      border: 'none'
                    }}
                  />
                );
              }

              if (!active) {
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: '#000',
                      border: 'none'
                    }}
                  />
                );
              }

              const isSelected = selectedClue && (
                (selectedClue.direction === 'across' && 
                 rowIdx === selectedClue.start[0] && 
                 colIdx >= selectedClue.start[1] && 
                 colIdx < selectedClue.start[1] + selectedClue.answer.length) ||
                (selectedClue.direction === 'down' && 
                 colIdx === selectedClue.start[1] && 
                 rowIdx >= selectedClue.start[0] && 
                 rowIdx < selectedClue.start[0] + selectedClue.answer.length)
              );

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: isSelected ? 'rgba(230, 25, 75, 0.3)' : 'rgba(139, 0, 0, 0.6)',
                    border: '2px solid #E6194B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    margin: '0',
                    minWidth: '30px',
                    minHeight: '30px'
                  }}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(230, 25, 75, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(139, 0, 0, 0.6)';
                    }
                  }}
                >
                  {clueNum && (
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: '4px',
                      fontSize: '13px',
                      color: '#E6194B',
                      fontWeight: 'bold',
                      zIndex: 1,
                      lineHeight: '1',
                      fontFamily: 'Arial, sans-serif',
                      textShadow: '0 0 4px rgba(230, 25, 75, 0.8)'
                    }}>
                      {clueNum}
                    </span>
                  )}
                  <input
                    type="text"
                    maxLength="1"
                    data-row={rowIdx}
                    data-col={colIdx}
                    value={grid[rowIdx][colIdx] || ''}
                    onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
                    onFocus={() => handleCellClick(rowIdx, colIdx)}
                    onKeyDown={(e) => {
                      // Find clues at this position (only real clues)
                      const acrossClue = crosswordData.across.find(clue => {
                        if (!isRealClue(clue)) return false;
                        const [startRow, startCol] = clue.start;
                        return rowIdx === startRow && colIdx >= startCol && colIdx < startCol + clue.answer.length;
                      });
                      
                      const downClue = crosswordData.down.find(clue => {
                        if (!isRealClue(clue)) return false;
                        const [startRow, startCol] = clue.start;
                        return colIdx === startCol && rowIdx >= startRow && rowIdx < startRow + clue.answer.length;
                      });
                      
                      if (e.key === 'Backspace') {
                        e.preventDefault();
                        if (grid[rowIdx][colIdx]) {
                          // Clear current cell
                          const newGrid = grid.map(r => [...r]);
                          newGrid[rowIdx][colIdx] = '';
                          setGrid(newGrid);
                        } else if (selectedClue) {
                          // Move to previous cell and clear it
                          const [startRow, startCol] = selectedClue.start;
                          let prevRow = rowIdx;
                          let prevCol = colIdx;
                          
                          if (selectedClue.direction === 'across' && colIdx > startCol) {
                            prevCol = colIdx - 1;
                            // Skip blocked cells
                            while (prevCol >= startCol && (isBlocked(rowIdx, prevCol) || !isCellActive(rowIdx, prevCol))) {
                              prevCol--;
                            }
                            if (prevCol >= startCol && isCellActive(rowIdx, prevCol) && !isBlocked(rowIdx, prevCol)) {
                              const newGrid = grid.map(r => [...r]);
                              newGrid[rowIdx][prevCol] = '';
                              setGrid(newGrid);
                              const prevInput = document.querySelector(`input[data-row="${rowIdx}"][data-col="${prevCol}"]`);
                              if (prevInput) prevInput.focus();
                            }
                          } else if (selectedClue.direction === 'down' && rowIdx > startRow) {
                            prevRow = rowIdx - 1;
                            // Skip blocked cells
                            while (prevRow >= startRow && (isBlocked(prevRow, colIdx) || !isCellActive(prevRow, colIdx))) {
                              prevRow--;
                            }
                            if (prevRow >= startRow && isCellActive(prevRow, colIdx) && !isBlocked(prevRow, colIdx)) {
                              const newGrid = grid.map(r => [...r]);
                              newGrid[prevRow][colIdx] = '';
                              setGrid(newGrid);
                              const prevInput = document.querySelector(`input[data-row="${prevRow}"][data-col="${colIdx}"]`);
                              if (prevInput) prevInput.focus();
                            }
                          }
                        }
                      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        
                        // Only navigate in the locked direction - NO switching at intersections
                        if (selectedClue) {
                          let nextRow = rowIdx;
                          let nextCol = colIdx;
                          
                          if (selectedClue.direction === 'across') {
                            // Only allow left/right movement for across clues
                            if (e.key === 'ArrowLeft') {
                              nextCol = Math.max(selectedClue.start[1], colIdx - 1);
                              // Skip blocked cells
                              while (nextCol >= selectedClue.start[1] && (isBlocked(rowIdx, nextCol) || !isCellActive(rowIdx, nextCol))) {
                                nextCol--;
                              }
                            } else if (e.key === 'ArrowRight') {
                              nextCol = Math.min(selectedClue.start[1] + selectedClue.answer.length - 1, colIdx + 1);
                              // Skip blocked cells
                              while (nextCol < selectedClue.start[1] + selectedClue.answer.length && 
                                     (isBlocked(rowIdx, nextCol) || !isCellActive(rowIdx, nextCol))) {
                                nextCol++;
                              }
                            }
                            // Ignore up/down arrows for across clues
                          } else {
                            // Only allow up/down movement for down clues
                            if (e.key === 'ArrowUp') {
                              nextRow = Math.max(selectedClue.start[0], rowIdx - 1);
                              // Skip blocked cells
                              while (nextRow >= selectedClue.start[0] && (isBlocked(nextRow, colIdx) || !isCellActive(nextRow, colIdx))) {
                                nextRow--;
                              }
                            } else if (e.key === 'ArrowDown') {
                              nextRow = Math.min(selectedClue.start[0] + selectedClue.answer.length - 1, rowIdx + 1);
                              // Skip blocked cells
                              while (nextRow < selectedClue.start[0] + selectedClue.answer.length && 
                                     (isBlocked(nextRow, colIdx) || !isCellActive(nextRow, colIdx))) {
                                nextRow++;
                              }
                            }
                            // Ignore left/right arrows for down clues
                          }
                          
                          // Only move if we're still in the same row/col (direction locked)
                          if ((selectedClue.direction === 'across' && nextRow === rowIdx) ||
                              (selectedClue.direction === 'down' && nextCol === colIdx)) {
                            if (isCellActive(nextRow, nextCol) && !isBlocked(nextRow, nextCol)) {
                              const nextInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`);
                              if (nextInput) nextInput.focus();
                            }
                          }
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 'clamp(16px, 2vw, 24px)',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      padding: 0,
                      caretColor: '#E6194B',
                      outline: 'none',
                      fontFamily: 'Arial, sans-serif',
                      textShadow: '0 0 4px rgba(230, 25, 75, 0.6)'
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        <button
          onClick={checkAnswer}
          style={{
            marginTop: '2rem',
            padding: '1rem 3.5rem',
            backgroundColor: '#E6194B',
            color: '#fff',
            border: '2px solid #E6194B',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(230, 25, 75, 0.4)',
            textShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c8174b';
            e.currentTarget.style.borderColor = '#c8174b';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(230, 25, 75, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E6194B';
            e.currentTarget.style.borderColor = '#E6194B';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 25, 75, 0.4)';
          }}
        >
          CHECK ANSWER
        </button>
      </div>

      {/* Clues - Right Half (50%) - Side by side columns */}
      <div style={{ 
        flex: '1',
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        boxSizing: 'border-box',
        alignItems: 'flex-start',
        backgroundColor: '#1a0000',
        padding: '2rem',
        borderRadius: '4px',
        border: '3px solid #E6194B',
        boxShadow: '0 6px 20px rgba(230, 25, 75, 0.5)',
        minWidth: 0
      }}>
        {/* ACROSS Column */}
        <div style={{ flex: '1', minWidth: 0 }}>
          <h3 style={{ 
            color: '#E6194B', 
            marginBottom: '1.25rem',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: selectedClue?.direction === 'across' ? 'rgba(230, 25, 75, 0.3)' : 'rgba(230, 25, 75, 0.15)',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            border: '2px solid #E6194B',
            textShadow: '0 0 8px rgba(230, 25, 75, 0.6)',
            boxShadow: '0 2px 8px rgba(230, 25, 75, 0.3)'
          }}>
            ACROSS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {getValidClues(crosswordData.across).map(clue => (
              <div
                key={`${clue.num}-${clue.start[0]}-${clue.start[1]}`}
                onClick={() => {
                  setSelectedClue({ ...clue, direction: 'across', displayedNum: clue.displayedNum });
                  // Focus the first cell of this clue
                  setTimeout(() => {
                    const [startRow, startCol] = clue.start;
                    const firstInput = document.querySelector(`input[data-row="${startRow}"][data-col="${startCol}"]`);
                    if (firstInput) {
                      firstInput.focus();
                      firstInput.select();
                    }
                  }, 10);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: selectedClue?.displayedNum === clue.displayedNum && selectedClue?.direction === 'across' 
                    ? 'rgba(230, 25, 75, 0.35)' : 'rgba(139, 0, 0, 0.5)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedClue?.displayedNum === clue.displayedNum && selectedClue?.direction === 'across'
                    ? '2px solid #E6194B' : '1px solid rgba(230, 25, 75, 0.6)',
                  boxShadow: selectedClue?.displayedNum === clue.displayedNum && selectedClue?.direction === 'across'
                    ? '0 2px 8px rgba(230, 25, 75, 0.4)' : 'none'
                }}
              >
                <strong style={{ color: '#E6194B', fontSize: '1.05rem', marginRight: '0.5rem', fontWeight: 'bold', textShadow: '0 0 4px rgba(230, 25, 75, 0.6)' }}>{clue.displayedNum}.</strong>
                <span style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.5', textShadow: '0 0 3px rgba(230, 25, 75, 0.4)' }}>{clue.clue}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* DOWN Column */}
        <div style={{ flex: '1', minWidth: 0 }}>
          <h3 style={{ 
            color: '#E6194B', 
            marginBottom: '1.25rem',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: selectedClue?.direction === 'down' ? 'rgba(230, 25, 75, 0.3)' : 'rgba(230, 25, 75, 0.15)',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            border: '2px solid #E6194B',
            textShadow: '0 0 8px rgba(230, 25, 75, 0.6)',
            boxShadow: '0 2px 8px rgba(230, 25, 75, 0.3)'
          }}>
            DOWN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {getValidClues(crosswordData.down).map(clue => (
              <div
                key={`${clue.num}-${clue.start[0]}-${clue.start[1]}`}
                onClick={() => {
                  // Set selected clue with proper num to ensure matching
                  const selectedClueData = { 
                    ...clue, 
                    direction: 'down', 
                    displayedNum: clue.num, // Use clue.num to ensure correct matching
                    num: clue.num,
                    start: clue.start,
                    answer: clue.answer
                  };
                  setSelectedClue(selectedClueData);
                  // Use the actual start position for all clues
                  const [focusRow, focusCol] = clue.start;
                  // Focus the cell and scroll into view
                  setTimeout(() => {
                    const firstInput = document.querySelector(`input[data-row="${focusRow}"][data-col="${focusCol}"]`);
                    if (firstInput) {
                      firstInput.focus();
                      firstInput.select();
                      // Scroll the input into view
                      firstInput.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    } else {
                      // If input not found, try again after a longer delay
                      setTimeout(() => {
                        const retryInput = document.querySelector(`input[data-row="${focusRow}"][data-col="${focusCol}"]`);
                        if (retryInput) {
                          retryInput.focus();
                          retryInput.select();
                          retryInput.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                        }
                      }, 100);
                    }
                  }, 10);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: (selectedClue?.num === clue.num || selectedClue?.displayedNum === clue.num) && selectedClue?.direction === 'down' 
                    ? 'rgba(230, 25, 75, 0.35)' : 'rgba(139, 0, 0, 0.5)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: (selectedClue?.num === clue.num || selectedClue?.displayedNum === clue.num) && selectedClue?.direction === 'down'
                    ? '2px solid #E6194B' : '1px solid rgba(230, 25, 75, 0.6)',
                  boxShadow: (selectedClue?.num === clue.num || selectedClue?.displayedNum === clue.num) && selectedClue?.direction === 'down'
                    ? '0 2px 8px rgba(230, 25, 75, 0.4)' : 'none'
                }}
              >
                <strong style={{ color: '#E6194B', fontSize: '1.05rem', marginRight: '0.5rem', fontWeight: 'bold', textShadow: '0 0 4px rgba(230, 25, 75, 0.6)' }}>{clue.displayedNum}.</strong>
                <span style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.5', textShadow: '0 0 3px rgba(230, 25, 75, 0.4)' }}>{clue.clue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
