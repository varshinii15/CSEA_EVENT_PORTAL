import React, { useState, useEffect } from 'react';
import JoyceWall from './JoyceWall';
import { wordList } from './wordList';

const RoundTwo = ({ loggedInYear, fragments: parentFragments = [], setFragments, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState({ visible: [], hiddenPassed: 0, hiddenDetails: [], ran: false, details: [] });
  const [runOutput, setRunOutput] = useState('');
  const [compilerError, setCompilerError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [fragments, setFragmentsLocal] = useState(parentFragments);
  const [error, setError] = useState('');
  const [puzzleCompleted, setPuzzleCompleted] = useState(new Set());
  const [showJoyceWall, setShowJoyceWall] = useState(false);
  const [triggerWord, setTriggerWord] = useState('');

  // Sync with parent fragments
  useEffect(() => {
    if (parentFragments.length > 0 && fragments.length === 0) {
      setFragmentsLocal(parentFragments);
    }
  }, [parentFragments, fragments.length]);

  const language = loggedInYear === '1st' ? 'Python' : 'C';
  
  // Python puzzles for 1st years
  const pythonPuzzles = [
    {
      id: 1,
      language: "Python",
      code: `def find_portal(n):
    portl = []
    for i in range(n):
        if i % 2 == 0:
            portal.append(i)
    return portal`,
      fixedCode: `def find_portal(n):
    portal = []
    for i in range(n):
        if i % 2 == 0:
            portal.append(i)
    return portal`,
      hint: "Fix the variable name typos (portl → portal)",
      fragment: "FRAGMENT1"
    },
    {
      id: 2,
      language: "Python",
      code: `def count_dimensions(arr):
    count = 0
    for x in arr:
        if x > 0
            count += 1
    return count`,
      fixedCode: `def count_dimensions(arr):
    count = 0
    for x in arr:
        if x > 0:
            count += 1
    return count`,
      hint: "Missing colon after the if statement",
      fragment: "FRAGMENT2"
    },
    {
      id: 3,
      language: "Python",
      code: `def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = result + s[i]
    return result`,
      fixedCode: `def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = s[i] + result
    return result`,
      hint: "Check the string concatenation order to reverse",
      fragment: "FRAGMENT3"
    },
    {
      id: 4,
      language: "Python",
      code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return True
    return False`,
      fixedCode: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True`,
      hint: "Check the return values - they are swapped",
      fragment: "FRAGMENT4"
    },
    {
      id: 5,
      language: "Python",
      code: `def factorial(n):
    if n == 0:
        return 0
    result = 1
    for i in range(1, n):
        result *= i
    return result`,
      fixedCode: `def factorial(n):
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result`,
      hint: "Check the base case and the range for the loop",
      fragment: "FRAGMENT5"
    }
  ];

  // C puzzles for 2nd years
  const cPuzzles = [
    {
      id: 1,
      language: "C",
      code: `int count_dimensions(int* array, int size) {
    int count = 0;
    for(int i = 0; i < size; i++) {
        if(array[i] > 0);
            count++;
    }
    return count;
}`,
      fixedCode: `int count_dimensions(int* array, int size) {
    int count = 0;
    for(int i = 0; i < size; i++) {
        if(array[i] > 0)
            count++;
    }
    return count;
}`,
      hint: "Remove the semicolon after the if statement",
      fragment: "FRAGMENT1"
    },
    {
      id: 2,
      language: "C",
      code: `int find_max(int arr[], int n) {
    int max = arr[0];
    for(int i = 1; i <= n; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
      fixedCode: `int find_max(int arr[], int n) {
    int max = arr[0];
    for(int i = 1; i < n; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
      hint: "Check the loop condition - array bounds",
      fragment: "FRAGMENT2"
    },
    {
      id: 3,
      language: "C",
      code: `int sum_array(int* arr, int size) {
    int sum = 0;
    for(int i = 0; i < size; i++;) {
        sum += arr[i];
    }
    return sum;
}`,
      fixedCode: `int sum_array(int* arr, int size) {
    int sum = 0;
    for(int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}`,
      hint: "Check the for loop syntax carefully",
      fragment: "FRAGMENT3"
    },
    {
      id: 4,
      language: "C",
      code: `int find_min(int arr[], int n) {
    int min = arr[0];
    for(int i = 0; i < n; i++) {
        if(arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}`,
      fixedCode: `int find_min(int arr[], int n) {
    int min = arr[0];
    for(int i = 1; i < n; i++) {
        if(arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}`,
      hint: "Check the loop starting index - should start from 1",
      fragment: "FRAGMENT4"
    },
    {
      id: 5,
      language: "C",
      code: `int is_even(int num) {
    if(num % 2 = 0) {
        return 1;
    }
    return 0;
}`,
      fixedCode: `int is_even(int num) {
    if(num % 2 == 0) {
        return 1;
    }
    return 0;
}`,
      hint: "Check the comparison operator in the if condition",
      fragment: "FRAGMENT5"
    }
  ];

  const puzzles = loggedInYear === '1st' ? pythonPuzzles : cPuzzles;
  const currentPuzzleData = puzzles[currentPuzzle];
  
  // Helpers to find next/prev incomplete puzzle indices
  const getNextIncompleteIndex = (start) => {
    for (let i = start; i < puzzles.length; i += 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  const getPrevIncompleteIndex = (start) => {
    for (let i = start; i >= 0; i -= 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  // Initialize code editor with the buggy code to debug in place
  useEffect(() => {
    setCode(currentPuzzleData.code || '');
  }, [currentPuzzle]);

  // No local runtimes; we use Piston API for real execution

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCompilerError('');
    setTestResults({ visible: [], hiddenPassed: 0, hiddenDetails: [], ran: false, details: [] });
    setRunOutput('');
    setIsRunning(true);

    // Normalize code comparison (remove whitespace differences)
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    const userCode = normalize(code);
    const fixedCode = normalize(currentPuzzleData.fixedCode);

    // Build visible tests list (labels only for UI)
    const visibleTests = [
      { name: 'Function exists' },
      { name: 'Basic input case' },
      { name: 'Edge case 1' },
      { name: 'Edge case 2' },
      { name: 'Edge case 3' }
    ];

    // Heuristic checks to discourage trivial if-else spam and enforce signature
    const requires = {
      python: (sig) => new RegExp(`def\\s+${sig}\\s*\\(`),
      c: (sig) => new RegExp(`${sig}\\s*\\(`)
    };
    const puzzleSig = (() => {
      if (currentPuzzleData.fixedCode.includes('def find_portal')) return 'find_portal';
      if (currentPuzzleData.fixedCode.includes('def count_dimensions')) return 'count_dimensions';
      if (currentPuzzleData.fixedCode.includes('def reverse_string')) return 'reverse_string';
      if (currentPuzzleData.fixedCode.includes('def is_prime')) return 'is_prime';
      if (currentPuzzleData.fixedCode.includes('def factorial')) return 'factorial';
      if (currentPuzzleData.fixedCode.includes('int count_dimensions')) return 'count_dimensions';
      if (currentPuzzleData.fixedCode.includes('int find_max')) return 'find_max';
      if (currentPuzzleData.fixedCode.includes('int sum_array')) return 'sum_array';
      if (currentPuzzleData.fixedCode.includes('int find_min')) return 'find_min';
      if (currentPuzzleData.fixedCode.includes('int is_even')) return 'is_even';
      return '';
    })();

    const langKey = language === 'Python' ? 'python' : 'c';
    const hasSignature = puzzleSig ? requires[langKey](puzzleSig).test(code) : true;
    const ifCount = (code.match(/\bif\b/g) || []).length;
    const excessiveIfs = ifCount > 5; // crude anti-spam heuristic

    const visiblePass = [
      hasSignature,
      !excessiveIfs,
      userCode.length >= fixedCode.length * 0.6, // not too short
      userCode.indexOf('TODO') === -1,
      userCode.indexOf('pass') === -1 || language !== 'Python'
    ];

    // Real execution via Piston API
    try {
      const buildPythonProgram = () => {
        if (currentPuzzleData.fixedCode.includes('def find_portal')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(find_portal))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=[0,2,4]\n    act2=find_portal(6)\n    results.append(act2==exp2)\n    cases.append({'expected':json.dumps(exp2),'actual':json.dumps(act2),'passed':bool(act2==exp2)})\n\n    exp3=[0]\n    act3=find_portal(1)\n    results.append(act3==exp3)\n    cases.append({'expected':json.dumps(exp3),'actual':json.dumps(act3),'passed':bool(act3==exp3)})\n\n    exp4=[]\n    act4=find_portal(0)\n    results.append(act4==exp4)\n    cases.append({'expected':json.dumps(exp4),'actual':json.dumps(act4),'passed':bool(act4==exp4)})\n\n    exp5=[0,2,4,6]\n    act5=find_portal(7)\n    results.append(act5==exp5)\n    cases.append({'expected':json.dumps(exp5),'actual':json.dumps(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if find_portal(2)==[0] else 0\n    hidden += 1 if find_portal(10)==[0,2,4,6,8] else 0\n    hidden += 1 if find_portal(3)==[0,2] else 0\n    hidden += 1 if find_portal(8)==[0,2,4,6] else 0\n    hidden += 1 if isinstance(find_portal(5), list) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def count_dimensions')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(count_dimensions))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=2\n    act2=count_dimensions([1,-1,0,5])\n    results.append(act2==exp2)\n    cases.append({'expected':str(exp2),'actual':str(act2),'passed':bool(act2==exp2)})\n\n    exp3=0\n    act3=count_dimensions([])\n    results.append(act3==exp3)\n    cases.append({'expected':str(exp3),'actual':str(act3),'passed':bool(act3==exp3)})\n\n    exp4=0\n    act4=count_dimensions([-1,-2,-3])\n    results.append(act4==exp4)\n    cases.append({'expected':str(exp4),'actual':str(act4),'passed':bool(act4==exp4)})\n\n    exp5=3\n    act5=count_dimensions([10,20,30])\n    results.append(act5==exp5)\n    cases.append({'expected':str(exp5),'actual':str(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if count_dimensions([0,0,1])==1 else 0\n    hidden += 1 if count_dimensions([1,1,1,1])==4 else 0\n    hidden += 1 if count_dimensions([-5,5])==1 else 0\n    hidden += 1 if count_dimensions([99])==1 else 0\n    hidden += 1 if isinstance(count_dimensions([1,2]), int) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def reverse_string')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(reverse_string))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2='cba'\n    act2=reverse_string('abc')\n    results.append(act2==exp2)\n    cases.append({'expected':exp2,'actual':act2,'passed':bool(act2==exp2)})\n\n    exp3=''\n    act3=reverse_string('')\n    results.append(act3==exp3)\n    cases.append({'expected':exp3,'actual':act3,'passed':bool(act3==exp3)})\n\n    exp4='a'\n    act4=reverse_string('a')\n    results.append(act4==exp4)\n    cases.append({'expected':exp4,'actual':act4,'passed':bool(act4==exp4)})\n\n    exp5='ts'\n    act5=reverse_string('st')\n    results.append(act5==exp5)\n    cases.append({'expected':exp5,'actual':act5,'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if reverse_string('hello')=='olleh' else 0\n    hidden += 1 if reverse_string('racecar')=='racecar' else 0\n    hidden += 1 if reverse_string('Python')=='nohtyP' else 0\n    hidden += 1 if reverse_string('12')=='21' else 0\n    hidden += 1 if isinstance(reverse_string('x'), str) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def is_prime')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(is_prime))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=True\n    act2=is_prime(7)\n    results.append(act2==exp2)\n    cases.append({'expected':str(exp2),'actual':str(act2),'passed':bool(act2==exp2)})\n\n    exp3=False\n    act3=is_prime(4)\n    results.append(act3==exp3)\n    cases.append({'expected':str(exp3),'actual':str(act3),'passed':bool(act3==exp3)})\n\n    exp4=False\n    act4=is_prime(1)\n    results.append(act4==exp4)\n    cases.append({'expected':str(exp4),'actual':str(act4),'passed':bool(act4==exp4)})\n\n    exp5=True\n    act5=is_prime(2)\n    results.append(act5==exp5)\n    cases.append({'expected':str(exp5),'actual':str(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if is_prime(11)==True else 0\n    hidden += 1 if is_prime(15)==False else 0\n    hidden += 1 if is_prime(17)==True else 0\n    hidden += 1 if is_prime(0)==False else 0\n    hidden += 1 if isinstance(is_prime(5), bool) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        if (currentPuzzleData.fixedCode.includes('def factorial')) {
          return `${code}\n\nimport json\n\nresults=[]\ncases=[]\ntry:\n    exp1=True\n    act1=bool(callable(factorial))\n    results.append(act1==exp1)\n    cases.append({'expected':str(exp1),'actual':str(act1),'passed':bool(act1==exp1)})\n\n    exp2=120\n    act2=factorial(5)\n    results.append(act2==exp2)\n    cases.append({'expected':str(exp2),'actual':str(act2),'passed':bool(act2==exp2)})\n\n    exp3=1\n    act3=factorial(0)\n    results.append(act3==exp3)\n    cases.append({'expected':str(exp3),'actual':str(act3),'passed':bool(act3==exp3)})\n\n    exp4=1\n    act4=factorial(1)\n    results.append(act4==exp4)\n    cases.append({'expected':str(exp4),'actual':str(act4),'passed':bool(act4==exp4)})\n\n    exp5=24\n    act5=factorial(4)\n    results.append(act5==exp5)\n    cases.append({'expected':str(exp5),'actual':str(act5),'passed':bool(act5==exp5)})\n\n    hidden=0\n    hidden += 1 if factorial(3)==6 else 0\n    hidden += 1 if factorial(6)==720 else 0\n    hidden += 1 if factorial(2)==2 else 0\n    hidden += 1 if factorial(7)==5040 else 0\n    hidden += 1 if isinstance(factorial(4), int) else 0\nexcept Exception as e:\n    print('ERROR:', e)\n    results=[False,False,False,False,False]\n    cases=[{'expected':'True','actual':'Exception','passed':False}]+[{'expected':'','actual':'','passed':False} for _ in range(4)]\n    hidden=0\nprint(json.dumps({'visible':results,'hidden':hidden,'cases':cases}))`;
        }
        return code;
      };

      const buildCProgram = () => {
        // We wrap user function code together with a main that prints JSON-ish results lines
        const header = '#include <stdio.h>\n#include <stdbool.h>\n';
        if (currentPuzzleData.fixedCode.includes('int count_dimensions')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;/* signature assumed */\n  int e2=2; int o2=count_dimensions((int[]){1,-1,0,5},4); bool v2 = o2==e2;\n  int e3=0; int o3=count_dimensions((int[]){},0); bool v3 = o3==e3;\n  int e4=0; int o4=count_dimensions((int[]){-1,-2,-3},3); bool v4 = o4==e4;\n  int e5=3; int o5=count_dimensions((int[]){10,20,30},3); bool v5 = o5==e5;\n  int h=0;\n  h += count_dimensions((int[]){0,0,1},3)==1;\n  h += count_dimensions((int[]){1,1,1,1},4)==4;\n  h += count_dimensions((int[]){-5,5},2)==1;\n  h += count_dimensions((int[]){99},1)==1;\n  h += (count_dimensions((int[]){1,2},2)>=0);\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int find_max')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int a1[]={1,5,3}; int e2=5; int o2 = find_max(a1,3); bool v2 = o2==e2;\n  int a2[]={-5,-2,-9}; int e3=-2; int o3 = find_max(a2,3); bool v3 = o3==e3;\n  int a3[]={7}; int e4=7; int o4 = find_max(a3,1); bool v4 = o4==e4;\n  int a4[]={2,2,2}; int e5=2; int o5 = find_max(a4,3); bool v5 = o5==e5;\n  int h=0; int a5[]={0,-1}; h += find_max(a5,2)==0;\n  int a6[]={100,200,50}; h += find_max(a6,3)==200;\n  int a7[]={-3,-1,-2}; h += find_max(a7,3)==-1;\n  int a8[]={9,8,10,7}; h += find_max(a8,4)==10;\n  int a9[]={42}; h += find_max(a9,1)==42;\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int sum_array')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int a1[]={1,2,3}; int e2=6; int o2=sum_array(a1,3); bool v2 = o2==e2;\n  int a2[]={}; int e3=0; int o3=sum_array(a2,0); bool v3 = o3==e3;\n  int a3[]={-1,1}; int e4=0; int o4=sum_array(a3,2); bool v4 = o4==e4;\n  int a4[]={5}; int e5=5; int o5=sum_array(a4,1); bool v5 = o5==e5;\n  int h=0; int a5[]={10,10}; h += sum_array(a5,2)==20;\n  int a6[]={-5,-5}; h += sum_array(a6,2)==-10;\n  int a7[]={100}; h += sum_array(a7,1)==100;\n  int a8[]={1,1,1,1,1}; h += sum_array(a8,5)==5;\n  int a9[]={3,4}; h += sum_array(a9,2)==7;\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int find_min')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int a1[]={5,2,8}; int e2=2; int o2=find_min(a1,3); bool v2 = o2==e2;\n  int a2[]={-5,-2,-9}; int e3=-9; int o3=find_min(a2,3); bool v3 = o3==e3;\n  int a3[]={7}; int e4=7; int o4=find_min(a3,1); bool v4 = o4==e4;\n  int a4[]={3,3,3}; int e5=3; int o5=find_min(a4,3); bool v5 = o5==e5;\n  int h=0; int a5[]={0,-1}; h += find_min(a5,2)==-1;\n  int a6[]={100,50,200}; h += find_min(a6,3)==50;\n  int a7[]={-3,-1,-2}; h += find_min(a7,3)==-3;\n  int a8[]={9,8,10,7}; h += find_min(a8,4)==7;\n  int a9[]={42}; h += find_min(a9,1)==42;\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        if (currentPuzzleData.fixedCode.includes('int is_even')) {
          return `${header}${code}\n\nint main(){\n  bool v1=true;\n  int e2=1; int o2=is_even(4); bool v2 = o2==e2;\n  int e3=0; int o3=is_even(5); bool v3 = o3==e3;\n  int e4=1; int o4=is_even(0); bool v4 = o4==e4;\n  int e5=0; int o5=is_even(7); bool v5 = o5==e5;\n  int h=0; h += is_even(2)==1;\n  h += is_even(10)==1;\n  h += is_even(3)==0;\n  h += is_even(1)==0;\n  h += (is_even(6)==1 || is_even(6)==0);\n  printf("VIS:%d %d %d %d %d\\n", v1, v2, v3, v4, v5);\n  printf("CASE:1 EXP:%d OUT:%d OK:%d\\n", 1, 1, v1?1:0);\n  printf("CASE:2 EXP:%d OUT:%d OK:%d\\n", e2, o2, v2?1:0);\n  printf("CASE:3 EXP:%d OUT:%d OK:%d\\n", e3, o3, v3?1:0);\n  printf("CASE:4 EXP:%d OUT:%d OK:%d\\n", e4, o4, v4?1:0);\n  printf("CASE:5 EXP:%d OUT:%d OK:%d\\n", e5, o5, v5?1:0);\n  printf("HID:%d\\n", h);\n  return 0;\n}`;
        }
        return `${header}${code}\nint main(){printf("VIS:0 0 0 0 0\\nHID:0\\n");return 0;}`;
      };

      const isPy = language === '1st' || language === 'Python';
      const lang = isPy ? 'python' : 'c';
      const version = isPy ? '3.10.0' : '10.2.0';
      const program = isPy ? buildPythonProgram() : buildCProgram();

      const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, version, files: [{ name: isPy ? 'main.py' : 'main.c', content: program }] })
      });
      const data = await resp.json();
      const stdout = (data?.run?.stdout || '').trim();
      const stderr = (data?.run?.stderr || '').trim();
      const compileOutput = (data?.compile?.stderr || data?.compile?.stdout || '').trim();
      setRunOutput(stdout + (stderr ? ('\n' + stderr) : ''));
      
      // Set compiler error if compilation failed
      if (compileOutput && (data?.compile?.code !== 0 || compileOutput.includes('error'))) {
        setCompilerError(compileOutput || stderr);
      } else if (stderr && !stdout.includes('VIS:') && !stdout.includes('{')) {
        // If there's stderr and no expected output format, it's likely a runtime/compile error
        setCompilerError(stderr);
      } else {
        setCompilerError('');
      }

      let visible = [false, false, false, false, false];
      let hiddenPassed = 0;
      let hiddenDetails = [];
      let details = [];
      
      if (isPy) {
        // Python prints JSON on stdout last line
        try {
          const lastLine = stdout.split('\n').filter(Boolean).pop() || '{}';
          const parsed = JSON.parse(lastLine);
          visible = Array.isArray(parsed.visible) ? parsed.visible : visible;
          hiddenPassed = Number(parsed.hidden) || 0;
          
          // Parse visible test cases
          if (Array.isArray(parsed.cases)) {
            const labels = ['Testcase 1', 'Testcase 2', 'Testcase 3', 'Testcase 4', 'Testcase 5'];
            details = parsed.cases.map((c, i) => ({
              name: labels[i] || `Testcase ${i+1}`,
              expected: String(c.expected ?? ''),
              actual: String(c.actual ?? ''),
              passed: Boolean(c.passed)
            }));
          }
          
          // Generate hidden test case details (5 hidden tests)
          const totalHidden = 5;
          hiddenDetails = Array.from({ length: totalHidden }, (_, i) => ({
            name: `Hidden Testcase ${i + 1}`,
            passed: i < hiddenPassed
          }));
        } catch (e) {
          // If parsing fails, check if it's a syntax error
          if (stderr || compileOutput) {
            setCompilerError(stderr || compileOutput || 'Could not parse program output.');
          }
        }
      } else {
        // C prints VIS: and HID: lines
        const visLine = (stdout.split('\n').find(l => l.startsWith('VIS:')) || 'VIS:').replace('VIS:', '').trim();
        const parts = visLine.split(/\s+/).filter(Boolean);
        if (parts.length >= 5) {
          visible = parts.slice(0,5).map(v => v === '1');
        }
        const hidLine = (stdout.split('\n').find(l => l.startsWith('HID:')) || 'HID:0').replace('HID:', '').trim();
        hiddenPassed = parseInt(hidLine, 10) || 0;

        // Parse detailed CASE lines: CASE:i EXP:x OUT:y OK:0/1
        const labels = ['Testcase 1', 'Testcase 2', 'Testcase 3', 'Testcase 4', 'Testcase 5'];
        details = stdout.split('\n').filter(l => l.startsWith('CASE:')).map((line) => {
          const m = line.match(/CASE:(\d+)\s+EXP:([^\s]+)\s+OUT:([^\s]+)\s+OK:(\d+)/);
          const idx = m ? parseInt(m[1], 10) - 1 : 0;
          return {
            name: labels[idx] || `Testcase ${idx+1}`,
            expected: m ? m[2] : '',
            actual: m ? m[3] : '',
            passed: m ? m[4] === '1' : false
          };
        });
        
        // Generate hidden test case details (5 hidden tests)
        const totalHidden = 5;
        hiddenDetails = Array.from({ length: totalHidden }, (_, i) => ({
          name: `Hidden Testcase ${i + 1}`,
          passed: i < hiddenPassed
        }));
      }

      setTestResults({ visible, hiddenPassed, hiddenDetails, ran: true, details });
      setIsRunning(false);
      
      const allPassed = visible.every(Boolean) && hiddenPassed === 5;
      
      // Check if code matches fixed code (exact match)
      if (userCode === fixedCode && allPassed) {
        // Add fragment if not already collected
        if (!fragments.includes(currentPuzzleData.fragment)) {
          const newFragments = [...fragments, currentPuzzleData.fragment];
          setFragmentsLocal(newFragments);
          // Update parent state if setFragments is provided
          if (setFragments) {
            setFragments(newFragments);
          }
        }

        const newCompleted = new Set(puzzleCompleted);
        newCompleted.add(currentPuzzle);
        setPuzzleCompleted(newCompleted);
        
        setError('Correct! All tests passed. Fragment collected.');
        setTimeout(() => setError(''), 1200);
        setCode('');

        // Auto-advance to the next incomplete puzzle
        // Joyce Wall will be triggered via useEffect when all puzzles are completed
        const nextIdx = getNextIncompleteIndex(currentPuzzle + 1);
        if (nextIdx !== -1) {
          setCurrentPuzzle(nextIdx);
        }
      } else if (!allPassed && !compilerError) {
        setError('Some tests failed. Fix issues and try again.');
      }
    } catch (ex) {
      console.error(ex);
      setError('Execution service error. Please try again.');
      setIsRunning(false);
      setCompilerError('Failed to execute code. Please check your connection and try again.');
    }
  };

  const nextPuzzle = () => {
    // Find next uncompleted puzzle
    const nextIdx = getNextIncompleteIndex(currentPuzzle + 1);
    if (nextIdx !== -1) {
      setCurrentPuzzle(nextIdx);
      setCode('');
      setError('');
      setCompilerError('');
      setTestResults({ visible: [], hiddenPassed: 0, hiddenDetails: [], ran: false, details: [] });
    }
  };

  const prevPuzzle = () => {
    // Find previous uncompleted puzzle
    const prevIdx = getPrevIncompleteIndex(currentPuzzle - 1);
    if (prevIdx !== -1) {
      setCurrentPuzzle(prevIdx);
      setCode('');
      setError('');
      setCompilerError('');
      setTestResults({ visible: [], hiddenPassed: 0, hiddenDetails: [], ran: false, details: [] });
    }
  };
  
  // Check if there are uncompleted puzzles ahead
  const hasNextUncompleted = getNextIncompleteIndex(currentPuzzle + 1) !== -1;
  
  // Check if there are uncompleted puzzles behind
  const hasPrevUncompleted = getPrevIncompleteIndex(currentPuzzle - 1) !== -1;

  const allPuzzlesCompleted = puzzleCompleted.size === puzzles.length;

  // Trigger Joyce Wall when all puzzles are completed
  useEffect(() => {
    if (allPuzzlesCompleted && !showJoyceWall && puzzleCompleted.size === puzzles.length) {
      // Small delay to ensure UI is ready
      setTimeout(() => {
        // Pick a random word and jumble it
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const jumbled = word.split('').sort(() => Math.random() - 0.5).join('');
        setTriggerWord(jumbled);
        setShowJoyceWall(true);
      }, 500);
    }
  }, [allPuzzlesCompleted, showJoyceWall, puzzleCompleted.size, puzzles.length]);

  // Ensure we start with the first uncompleted puzzle on mount
  useEffect(() => {
    const firstIncomplete = getNextIncompleteIndex(0);
    if (firstIncomplete !== -1 && firstIncomplete !== currentPuzzle && puzzleCompleted.size === 0) {
      setCurrentPuzzle(firstIncomplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Joyce Wall completion
  const handleJoyceWallComplete = () => {
    setShowJoyceWall(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Show Joyce Wall if all puzzles completed
  if (showJoyceWall) {
    return (
      <JoyceWall 
        triggerWord={triggerWord} 
        onComplete={handleJoyceWallComplete}
        fragments={fragments}
        loggedInYear={loggedInYear}
      />
    );
  }

  return (
    <div className="round-two-fixed" style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      {/* Top bar - centered title and right challenge info */}
      <div style={{ flex: '0 0 auto', padding: '0.9rem 1.25rem', borderBottom: '2px solid rgba(230,25,75,0.35)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', position: 'relative' }}>
        <div />
        <h2 className="round-title" style={{ margin: 0, textAlign: 'center', letterSpacing: '2px' }}>ROUND 2: THE GLITCH BETWEEN WORLDS</h2>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }} />
        {/* Top-left absolute navigation buttons */}
        <div style={{ position: 'absolute', top: 8, left: 12, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={prevPuzzle} disabled={!hasPrevUncompleted} className="nav-button-small">← PREV</button>
            <button onClick={nextPuzzle} disabled={!hasNextUncompleted} className="nav-button-small">NEXT →</button>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            PUZZLE {currentPuzzle + 1} OF {puzzles.length} ({puzzleCompleted.size} COMPLETED)
          </span>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '1rem' }}>
        {/* Left: Editor only */}
        <div className="editor-pane" style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '0.75rem', overflow: 'hidden', paddingRight: '0.5rem' }}>
          <div className="panel hover-glow" style={{ flex: 1, padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="panel-title">Editor</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0, flex: 1 }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Fix the ${language} code here...`}
              className="code-input"
              style={{ flex: 1, resize: 'none' }}
              required
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="submit-button" disabled={isRunning}>
                {isRunning ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="spinner-red" /> Running...</span>) : 'Run & Submit'}
              </button>
            </div>
            </form>
            {error && (
              <div className={`message ${error.includes('Correct') ? 'success' : 'error'}`}>{error}</div>
            )}
          </div>
        </div>

        {/* Right: Tests */}
        <div className="tests-pane" style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '0.75rem', overflow: 'hidden', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(230,25,75,0.25)' }}>
          {/* Compiler Message Section */}
          {compilerError && (
            <div className="panel compiler-message-panel" style={{ padding: '0.85rem 1rem', flex: '0 0 auto' }}>
              <h3 className="panel-title" style={{ margin: 0, marginBottom: '0.75rem' }}>Compiler Message</h3>
              <div className="compiler-error-content" style={{ 
                background: 'rgba(20, 20, 20, 0.9)', 
                border: '1px solid rgba(230,25,75,0.3)',
                borderRadius: '6px',
                padding: '0.75rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '0.9rem',
                color: '#ffffff',
                maxHeight: '150px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {compilerError}
              </div>
            </div>
          )}

          {/* Sample Testcase Section - Expanded to full height */}
          <div className="panel" style={{ padding: '0.85rem 1rem', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h3 className="panel-title" style={{ margin: 0, marginBottom: '0.75rem' }}>Sample Testcase</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {testResults.ran && testResults.details.length > 0 ? (
                testResults.details.map((testCase, idx) => (
                  <div key={idx} className="testcase-container" style={{
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(230,25,75,0.25)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      background: testCase.passed ? 'rgba(41, 204, 106, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }}>
                      {testCase.name} - {testCase.passed ? 'Passed' : 'Failed'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '0.9rem' }}>Expected Output</div>
                        <div className="output-panel" style={{
                          background: 'rgba(10, 10, 10, 0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '0.6rem',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          minHeight: '60px',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {testCase.expected || '(empty)'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '0.9rem' }}>Output</div>
                        <div className="output-panel" style={{
                          background: 'rgba(10, 10, 10, 0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '0.6rem',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          minHeight: '60px',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {testCase.actual || '(empty)'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                  {testResults.ran ? 'No test cases to display' : 'Run your code to see test results'}
                </div>
              )}

              {/* Hidden Test Cases */}
              {testResults.ran && testResults.hiddenDetails && testResults.hiddenDetails.length > 0 && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    Hidden Testcases
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {testResults.hiddenDetails.map((hidden, idx) => (
                      <div key={idx} style={{
                        padding: '0.5rem 0.75rem',
                        background: hidden.passed ? 'rgba(41, 204, 106, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '0.9rem'
                      }}>
                        {hidden.name} - {hidden.passed ? 'Passed' : 'Failed'}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(20, 20, 20, 0.5)', borderRadius: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    Hidden tests passed: {testResults.hiddenPassed} / {testResults.hiddenDetails.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTwo;
