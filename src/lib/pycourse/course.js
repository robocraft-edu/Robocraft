// "Learn Python" course: beginner → advanced.
// Every lesson: a short explanation, a runnable example, a Hindi video from
// CodeWithHarry's free "100 Days of Code" playlist (each ID checked against
// YouTube), flash cards, a quiz and a coding task that the app checks by
// running the student's code. Each level ends with projects.
//
// task.expect: every string must appear in the program's output.
// task.solution: shown only when the student asks for it.

const V = (id, title) => ({ id, title, url: `https://www.youtube.com/watch?v=${id}` });
const Q = (q, options, answer, why) => ({ q, options, answer, why });
const F = (front, back) => ({ front, back });

export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg';

export const LEVELS = [
  { id: 'beginner', name: 'Beginner', emoji: '🌱', color: '#10b981', blurb: 'Print, variables, input, strings, if-else and loops.' },
  { id: 'intermediate', name: 'Intermediate', emoji: '🚀', color: '#3b82f6', blurb: 'Functions, lists, tuples, sets, dictionaries, errors and lambdas.' },
  { id: 'advanced', name: 'Advanced', emoji: '🧠', color: '#a855f7', blurb: 'Classes and objects, inheritance, decorators, generators, regex and files.' },
];

export const LESSONS = [
  // ═════════════ BEGINNER ═════════════
  {
    id: 'intro', level: 'beginner', title: 'What is Python? Your first program',
    video: V('7wnove7K-ZQ', 'Introduction to Programming & Python (Day 1)'),
    extraVideo: V('7IWOYhfAcVg', 'Our First Python Program (Day 4)'),
    explain: [
      'A program is a list of instructions for the computer. Python is a programming language that reads almost like English, which is why it is used for AI, robots, websites, data science and school projects.',
      'print() shows something on the screen. Text must be inside quotes, either "double" or \'single\'. Python runs your lines from top to bottom.',
    ],
    example: `print("Hello, World!")
print("I am learning Python")
print(5 + 3)`,
    cards: [
      F('What does print() do?', 'It shows (outputs) text or values on the screen.'),
      F('Is Python compiled or interpreted?', 'Interpreted: it runs your code line by line.'),
      F('How do you write text in Python?', 'Inside quotes: "hello" or \'hello\' (this is called a string).'),
      F('print(5 + 3) shows…', '8, because Python calculates the sum before printing.'),
    ],
    quiz: [
      Q('Which line prints Hello?', ['print(Hello)', 'print("Hello")', 'echo "Hello"', 'Print["Hello"]'], 1, 'Text needs quotes, and the function is print() in lower case.'),
      Q('What is the output of print(2 * 4)?', ['2 * 4', '8', '24', 'Error'], 1, 'Without quotes, Python works out 2 × 4 = 8.'),
      Q('Python runs a program…', ['From the last line up', 'Randomly', 'From top to bottom', 'Only the first line'], 2, 'Lines run in order, top to bottom.'),
      Q('Which of these is NOT a use of Python?', ['AI and machine learning', 'Websites', 'Controlling robots', 'None, Python is used for all of these'], 3, 'Python is used for all of them.'),
    ],
    task: {
      prompt: 'Print your name on the first line and "I love Python" on the second line.',
      starter: '# write two print statements\n',
      expect: ['I love Python'],
      solution: 'print("Aarav")\nprint("I love Python")\n',
    },
  },
  {
    id: 'print', level: 'beginner', title: 'Comments, escape sequences and print',
    video: V('qxPMmW93eDs', 'Comments, Escape Sequences & Print Statement (Day 5)'),
    explain: [
      'A comment starts with # and is ignored by Python. Use comments to explain your code to humans.',
      'Escape sequences put special characters inside a string: \\n starts a new line, \\t adds a tab, \\" prints a quote.',
      'print() can take several values separated by commas. sep= changes what goes between them, and end= changes what comes at the end (a new line by default).',
    ],
    example: `# This is a comment: Python skips it
print("Line one\\nLine two")
print("Name:\\tRiya")
print("Robot", "Arm", "Kit", sep="-")
print("No new line", end=" ")
print("after this")`,
    cards: [
      F('How do you write a comment?', 'Start the line with #. Python ignores it.'),
      F('What does \\n do?', 'Starts a new line inside a string.'),
      F('What does sep="-" do in print?', 'Puts "-" between the values instead of a space.'),
      F('What does end=" " do in print?', 'Ends with a space instead of a new line, so the next print continues on the same line.'),
    ],
    quiz: [
      Q('Output of print("A", "B", sep="*")?', ['A B', 'A*B', 'AB*', '*A*B'], 1, 'sep goes between the values.'),
      Q('Which escape sequence adds a tab?', ['\\n', '\\t', '\\b', '\\s'], 1, '\\t is a tab.'),
      Q('What happens to a line starting with #?', ['It is printed', 'It causes an error', 'Python ignores it', 'It runs twice'], 2, 'It is a comment.'),
      Q('print("Hi", end="!") prints…', ['Hi!', 'Hi !', 'Hi\\n!', '!Hi'], 0, 'end replaces the new line with "!".'),
    ],
    task: {
      prompt: 'Using ONE print statement and \\n, print "Roses are red" and "Python is cool" on two lines.',
      starter: 'print("")\n',
      expect: ['Roses are red\nPython is cool'],
      solution: 'print("Roses are red\\nPython is cool")\n',
    },
  },
  {
    id: 'variables', level: 'beginner', title: 'Variables and data types',
    video: V('ORCuz7s5cCY', 'Variables and Data Types (Day 6)'),
    explain: [
      'A variable is a name that stores a value: age = 15. The = sign means "store", not "equals".',
      'Main data types: int (whole numbers like 15), float (decimals like 9.8), str (text like "Riya"), bool (True or False). type(x) tells you the type.',
      'Variable names can use letters, digits and _, but cannot start with a digit and cannot be keywords like if or for.',
    ],
    example: `name = "Riya"
age = 15
height = 5.4
is_student = True
print(name, age, height, is_student)
print(type(age), type(height), type(name), type(is_student))`,
    cards: [
      F('What is a variable?', 'A named box that stores a value, e.g. score = 10.'),
      F('Data type of 3.14?', 'float'),
      F('Data type of "15"?', 'str, because it is in quotes.'),
      F('Is 2nd_place a valid variable name?', 'No, a name cannot start with a digit.'),
    ],
    quiz: [
      Q('type(True) is…', ['str', 'int', 'bool', 'float'], 2, 'True and False are booleans.'),
      Q('Which is a valid variable name?', ['my-score', 'my score', 'my_score', '1score'], 2, 'Only letters, digits and _ are allowed, and no leading digit.'),
      Q('After x = 5 then x = 9, x is…', ['5', '9', '14', 'Error'], 1, 'The new value replaces the old one.'),
      Q('Data type of 7?', ['int', 'float', 'str', 'bool'], 0, 'A whole number is an int.'),
    ],
    task: {
      prompt: 'Make variables city = "Delhi" and temperature = 31.5, then print: Delhi 31.5',
      starter: 'city = \ntemperature = \nprint(city, temperature)\n',
      expect: ['Delhi 31.5'],
      solution: 'city = "Delhi"\ntemperature = 31.5\nprint(city, temperature)\n',
    },
  },
  {
    id: 'operators', level: 'beginner', title: 'Operators: a calculator',
    video: V('FLVqcxnJP_E', 'Exercise 1: Calculator using Python (Day 7)'),
    extraVideo: V('dohaSBCKCr0', 'Exercise 1 Solution (Day 8)'),
    explain: [
      'Arithmetic: + add, - subtract, * multiply, / divide (always gives a float), // floor division (drops the decimal), % remainder, ** power.',
      'Comparison operators give True/False: == equal, != not equal, <, >, <=, >=.',
      'Logical operators join conditions: and (both true), or (at least one true), not (flips True/False).',
    ],
    example: `a = 17
b = 5
print("a + b =", a + b)
print("a / b =", a / b)
print("a // b =", a // b)
print("a % b =", a % b)
print("a ** 2 =", a ** 2)
print(a > b and b > 2)`,
    cards: [
      F('17 // 5 = ?', '3 (floor division drops the decimal).'),
      F('17 % 5 = ?', '2 (the remainder).'),
      F('2 ** 3 = ?', '8 (2 to the power 3).'),
      F('Difference between = and ==', '= stores a value; == compares two values.'),
    ],
    quiz: [
      Q('10 / 4 gives…', ['2', '2.5', '2.0', '3'], 1, '/ always gives a float: 2.5.'),
      Q('Which operator gives the remainder?', ['/', '//', '%', '**'], 2, '% is modulus (remainder).'),
      Q('True and False is…', ['True', 'False', 'Error', 'None'], 1, 'and needs both sides True.'),
      Q('5 != 5 is…', ['True', 'False', '0', 'Error'], 1, '5 is equal to 5, so "not equal" is False.'),
    ],
    task: {
      prompt: 'With x = 23 and y = 4, print the sum, the remainder of x divided by y, and x to the power y on three lines. Expected: 27, 3, 279841',
      starter: 'x = 23\ny = 4\n',
      expect: ['27', '3', '279841'],
      solution: 'x = 23\ny = 4\nprint(x + y)\nprint(x % y)\nprint(x ** y)\n',
    },
  },
  {
    id: 'typecasting', level: 'beginner', title: 'Type casting',
    video: V('Pu5bqySSSS0', 'Typecasting in Python (Day 9)'),
    explain: [
      'Type casting converts a value from one type to another: int("25") → 25, float("2.5") → 2.5, str(10) → "10".',
      'This matters because "5" + "5" joins text to give "55", while 5 + 5 gives 10.',
      'int() cuts off the decimal part: int(9.99) is 9.',
    ],
    example: `a = "5"
b = "5"
print(a + b)            # joins text
print(int(a) + int(b))  # adds numbers
print(int(9.99))
print(str(42) + " is the answer")`,
    cards: [
      F('int("12") + 3 = ?', '15'),
      F('"12" + "3" = ?', '"123" (strings are joined).'),
      F('int(7.9) = ?', '7 (decimal part is cut off, not rounded).'),
      F('How do you turn 10 into text?', 'str(10) → "10"'),
    ],
    quiz: [
      Q('float("3") gives…', ['3', '3.0', '"3.0"', 'Error'], 1, 'It becomes the float 3.0.'),
      Q('int("abc") gives…', ['0', 'abc', 'A ValueError', '"abc"'], 2, 'Text that is not a number cannot become an int.'),
      Q('str(5) + str(5) is…', ['10', '55', '"5 5"', 'Error'], 1, 'Two strings are joined: "55".'),
      Q('int(4.999) is…', ['5', '4', '4.999', 'Error'], 1, 'int() truncates toward zero.'),
    ],
    task: {
      prompt: 'price = "120" and qty = "3" are strings. Convert them and print the total cost: 360',
      starter: 'price = "120"\nqty = "3"\n',
      expect: ['360'],
      solution: 'price = "120"\nqty = "3"\nprint(int(price) * int(qty))\n',
    },
  },
  {
    id: 'input', level: 'beginner', title: 'Taking user input',
    video: V('WvG-R-xXouA', 'Taking User Input in Python (Day 10)'),
    explain: [
      'input("message") shows the message and waits for the user to type. It ALWAYS returns a string.',
      'To do maths with what the user types, convert it: n = int(input("Enter a number: ")).',
      'In this app, type the answers in the "Input" box before pressing Run, one answer per line.',
    ],
    example: `name = input("What is your name? ")
age = int(input("How old are you? "))
print("Hello", name)
print("Next year you will be", age + 1)`,
    exampleInput: 'Kabir\n14',
    cards: [
      F('What type does input() return?', 'Always a string (str).'),
      F('How to read a whole number?', 'int(input("Enter: "))'),
      F('How to read a decimal number?', 'float(input("Enter: "))'),
      F('Why does "5" + 1 fail?', 'You cannot add a string and an int; convert first.'),
    ],
    quiz: [
      Q('x = input() and the user types 7. type(x) is…', ['int', 'str', 'float', 'bool'], 1, 'input() always gives a string.'),
      Q('Which reads a float?', ['float(input())', 'input(float)', 'input().float', 'float input()'], 0, 'Wrap input() in float().'),
      Q('The text inside input("...") is…', ['Stored in the variable', 'Shown to the user as a prompt', 'Ignored', 'An error'], 1, 'It is the prompt message.'),
      Q('n = int(input()); user types 4. n * 2 is…', ['44', '8', '"8"', 'Error'], 1, 'n is the int 4, so 8.'),
    ],
    task: {
      prompt: 'Read two numbers with input() and print their sum. Test input: 12 and 30 → output 42',
      starter: 'a = int(input("First: "))\n',
      input: '12\n30',
      expect: ['42'],
      solution: 'a = int(input("First: "))\nb = int(input("Second: "))\nprint(a + b)\n',
    },
  },
  {
    id: 'strings', level: 'beginner', title: 'Strings and slicing',
    video: V('kMNFQYArrLg', 'Strings in Python (Day 11)'),
    extraVideo: V('8jW7lpT8HW8', 'String Slicing and Operations (Day 12)'),
    explain: [
      'A string is text. Each character has a position (index) starting at 0. Negative indexes count from the end: s[-1] is the last character.',
      'Slicing takes a part: s[start:end] gives characters from start up to (but not including) end. s[::-1] reverses a string.',
      'len(s) gives the number of characters. You can loop through a string character by character.',
    ],
    example: `s = "PYTHON"
print(s[0], s[-1])
print(s[0:3])
print(s[2:])
print(s[::-1])
print(len(s))`,
    cards: [
      F('Index of the first character?', '0'),
      F('"PYTHON"[1:4] = ?', '"YTH" (index 1, 2 and 3).'),
      F('How do you reverse a string s?', 's[::-1]'),
      F('len("robot") = ?', '5'),
    ],
    quiz: [
      Q('"HELLO"[-1] is…', ['H', 'O', 'L', 'Error'], 1, '-1 is the last character.'),
      Q('"COMPUTER"[0:4] is…', ['COMP', 'COMPU', 'OMPU', 'C'], 0, 'Index 0 to 3.'),
      Q('"abc" * 2 is…', ['abcabc', 'aabbcc', 'abc2', 'Error'], 0, '* repeats a string.'),
      Q('len("AI Lab") is…', ['5', '6', '4', '7'], 1, 'The space counts: A, I, space, L, a, b.'),
    ],
    task: {
      prompt: 'word = "ROBOTICS". Print its first 5 letters, then the word reversed. Expected: ROBOT and SCITOBOR',
      starter: 'word = "ROBOTICS"\n',
      expect: ['ROBOT', 'SCITOBOR'],
      solution: 'word = "ROBOTICS"\nprint(word[:5])\nprint(word[::-1])\n',
    },
  },
  {
    id: 'strmethods', level: 'beginner', title: 'String methods',
    video: V('0INvoK_T0cE', 'String Methods in Python (Day 13)'),
    explain: [
      'Methods are functions attached to a string: s.upper(), s.lower(), s.title(), s.strip() (removes spaces at the ends), s.replace("a", "b"), s.count("x"), s.find("x"), s.split().',
      'Strings cannot be changed in place; a method returns a NEW string. Store it: s = s.upper().',
    ],
    example: `s = "  robots are fun  "
print(s.strip())
print(s.upper())
print(s.strip().title())
print(s.replace("fun", "awesome"))
print(s.count("o"))
print("a,b,c".split(","))`,
    cards: [
      F('"hi".upper() = ?', '"HI"'),
      F('What does strip() do?', 'Removes spaces from the start and end.'),
      F('"banana".count("a") = ?', '3'),
      F('"a b c".split() = ?', "['a', 'b', 'c']"),
    ],
    quiz: [
      Q('"python".title() is…', ['PYTHON', 'Python', 'python', 'pYTHON'], 1, 'title() capitalises each word.'),
      Q('"hello".find("l") is…', ['1', '2', '3', '-1'], 1, 'The first l is at index 2.'),
      Q('"cat".replace("c", "b") is…', ['cat', 'bat', 'cbt', 'Error'], 1, 'c is replaced by b.'),
      Q('After s = "hi"; s.upper(), s is…', ['"HI"', '"hi"', 'None', 'Error'], 1, 'Methods return a new string; s itself is unchanged.'),
    ],
    task: {
      prompt: 'msg = "  i love coding  ". Print it with spaces removed and in Title Case: I Love Coding',
      starter: 'msg = "  i love coding  "\n',
      expect: ['I Love Coding'],
      solution: 'msg = "  i love coding  "\nprint(msg.strip().title())\n',
    },
  },
  {
    id: 'ifelse', level: 'beginner', title: 'If, elif and else',
    video: V('ceiuLR2ysas', 'If Else Conditional Statements (Day 14)'),
    extraVideo: V('d7ng_aV4qdI', 'Exercise 2: Good Morning Sir (Day 15)'),
    explain: [
      'if runs a block only when its condition is True. elif checks another condition when the ones before were False. else runs when nothing above was True.',
      'The block under if/elif/else must be indented (4 spaces). The line ends with a colon :.',
      'Only the FIRST True branch runs; the rest are skipped.',
    ],
    example: `marks = 78
if marks >= 90:
    print("Grade A")
elif marks >= 75:
    print("Grade B")
elif marks >= 40:
    print("Grade C")
else:
    print("Fail")`,
    cards: [
      F('What ends an if line?', 'A colon :'),
      F('What must the block under if be?', 'Indented (usually 4 spaces).'),
      F('When does else run?', 'When none of the if/elif conditions were True.'),
      F('If two elif conditions are True, which runs?', 'Only the first one.'),
    ],
    quiz: [
      Q('x = 5. if x > 3: print("A") else: print("B") prints…', ['A', 'B', 'A and B', 'Nothing'], 0, '5 > 3 is True.'),
      Q('Missing indentation under if gives…', ['A warning', 'IndentationError', 'Nothing', 'It runs twice'], 1, 'Python needs the block indented.'),
      Q('How many else blocks can one if have?', ['None', 'At most one', 'Two', 'Unlimited'], 1, 'One else at the end at most.'),
      Q('n = 0 → if n > 0: "pos" elif n < 0: "neg" else: "zero" prints…', ['pos', 'neg', 'zero', 'Error'], 2, 'Neither condition is True.'),
    ],
    task: {
      prompt: 'Read a number and print "Even" or "Odd". Test input: 17 → Odd',
      starter: 'n = int(input("Number: "))\n',
      input: '17',
      expect: ['Odd'],
      solution: 'n = int(input("Number: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")\n',
    },
  },
  {
    id: 'match', level: 'beginner', title: 'Match case',
    video: V('bthQCK1QAmQ', 'Match Case Statements (Day 16)'),
    explain: [
      'match compares one value against several patterns, like a cleaner if-elif chain. Each pattern is written as case value:.',
      'case _: is the default, used when nothing else matches. You can match several values in one case with |.',
    ],
    example: `day = 6
match day:
    case 1 | 2 | 3 | 4 | 5:
        print("School day")
    case 6 | 7:
        print("Weekend!")
    case _:
        print("Not a valid day")`,
    cards: [
      F('What does case _ mean?', 'The default case: matches anything not matched above.'),
      F('How to match 6 or 7 in one case?', 'case 6 | 7:'),
      F('Which Python version added match?', 'Python 3.10'),
      F('match is similar to…', 'A long if-elif-else chain.'),
    ],
    quiz: [
      Q('Keyword for each pattern?', ['when', 'case', 'if', 'switch'], 1, 'Each branch is a case.'),
      Q('If no case matches and there is no case _ …', ['Error', 'Nothing runs', 'The first case runs', 'It loops'], 1, 'Nothing happens.'),
      Q('case "a" | "e": matches…', ['Only "a"', 'Only "e"', '"a" or "e"', '"ae"'], 2, '| means "or".'),
      Q('match works best when…', ['Comparing one value to many options', 'Looping', 'Reading files', 'Defining classes'], 0, 'It picks one of many fixed options.'),
    ],
    task: {
      prompt: 'Given colour = "green", use match to print "Go" for green, "Stop" for red, "Wait" for yellow and "Unknown" otherwise.',
      starter: 'colour = "green"\n',
      expect: ['Go'],
      solution: 'colour = "green"\nmatch colour:\n    case "green":\n        print("Go")\n    case "red":\n        print("Stop")\n    case "yellow":\n        print("Wait")\n    case _:\n        print("Unknown")\n',
    },
  },
  {
    id: 'forloop', level: 'beginner', title: 'For loops',
    video: V('fIYVzKp0q5w', 'For Loops in Python (Day 17)'),
    explain: [
      'A for loop repeats a block for every item in a sequence: a string, a list or a range.',
      'range(5) gives 0,1,2,3,4. range(1, 6) gives 1 to 5. range(0, 10, 2) gives 0,2,4,6,8 (step 2).',
    ],
    example: `for i in range(1, 6):
    print(i, "x 7 =", i * 7)

for ch in "AI":
    print(ch)`,
    cards: [
      F('range(4) gives…', '0, 1, 2, 3'),
      F('range(2, 10, 3) gives…', '2, 5, 8'),
      F('Can a for loop go through a string?', 'Yes, one character at a time.'),
      F('How do you count down from 5 to 1?', 'range(5, 0, -1)'),
    ],
    quiz: [
      Q('How many times does for i in range(3) run?', ['2', '3', '4', 'Forever'], 1, '0, 1, 2: three times.'),
      Q('Last value in range(1, 10)?', ['10', '9', '1', '11'], 1, 'The end is not included.'),
      Q('for i in range(10, 0, -2) starts at…', ['0', '10', '8', '-2'], 1, 'It starts at 10 and steps by -2.'),
      Q('sum = 0; for i in range(1, 4): sum += i. sum is…', ['3', '6', '10', '4'], 1, '1 + 2 + 3 = 6.'),
    ],
    task: {
      prompt: 'Use a for loop to find the sum of numbers from 1 to 100 and print it. Expected: 5050',
      starter: 'total = 0\n',
      expect: ['5050'],
      solution: 'total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)\n',
    },
  },
  {
    id: 'whileloop', level: 'beginner', title: 'While loops',
    video: V('-tCFyIyKVx0', 'While Loops in Python (Day 18)'),
    explain: [
      'A while loop repeats AS LONG AS its condition is True. Use it when you do not know in advance how many times to repeat.',
      'Something inside the loop must change, or the loop never ends (an infinite loop).',
    ],
    example: `n = 1
while n <= 5:
    print("Count", n)
    n += 1

num = 4721
digits = 0
while num > 0:
    num //= 10
    digits += 1
print("Digits:", digits)`,
    cards: [
      F('When does a while loop stop?', 'When its condition becomes False.'),
      F('What is an infinite loop?', 'A loop whose condition never becomes False.'),
      F('n += 1 means…', 'n = n + 1'),
      F('Use while instead of for when…', 'You do not know how many repeats are needed.'),
    ],
    quiz: [
      Q('i = 0; while i < 3: i += 1. Final i?', ['2', '3', '4', '0'], 1, 'It stops when i becomes 3.'),
      Q('while True: without break…', ['Runs once', 'Never runs', 'Runs forever', 'Errors'], 2, 'The condition is always True.'),
      Q('Which loop suits "keep asking until correct password"?', ['for', 'while', 'Neither', 'match'], 1, 'The number of tries is unknown.'),
      Q('x = 10; while x > 0: x -= 3. Final x?', ['0', '-2', '1', '-3'], 1, '10, 7, 4, 1, -2: stops at -2.'),
    ],
    task: {
      prompt: 'Using a while loop, print the reverse of 12345. Expected: 54321',
      starter: 'n = 12345\nrev = 0\n',
      expect: ['54321'],
      solution: 'n = 12345\nrev = 0\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(rev)\n',
    },
  },
  {
    id: 'breakcontinue', level: 'beginner', title: 'break and continue',
    video: V('RkwJnjdrm70', 'break and continue (Day 19)'),
    explain: [
      'break stops the loop immediately. continue skips the rest of this round and goes to the next one.',
      'A for loop can have an else block, which runs only if the loop finished WITHOUT break.',
    ],
    example: `for i in range(1, 10):
    if i == 7:
        break
    if i % 2 == 0:
        continue
    print(i)`,
    cards: [
      F('break does…', 'Exits the loop immediately.'),
      F('continue does…', 'Skips to the next round of the loop.'),
      F('for…else: when does else run?', 'Only if the loop ended without break.'),
      F('Can break be used outside a loop?', 'No, it gives a SyntaxError.'),
    ],
    quiz: [
      Q('for i in range(5): if i == 2: break; print(i) prints…', ['0 1', '0 1 2', '2 3 4', '0 1 3 4'], 0, 'It stops when i is 2.'),
      Q('for i in range(5): if i == 2: continue; print(i) prints…', ['0 1', '0 1 3 4', '2', '0 1 2 3 4'], 1, 'Only 2 is skipped.'),
      Q('Which keyword skips one round?', ['pass', 'break', 'continue', 'skip'], 2, 'continue.'),
      Q('A loop with break that never triggers: its else block…', ['Runs', 'Does not run', 'Errors', 'Runs twice'], 0, 'No break happened, so else runs.'),
    ],
    task: {
      prompt: 'Print the first multiple of 7 that is greater than 50, using a loop and break. Expected: 56',
      starter: 'for n in range(51, 100):\n',
      expect: ['56'],
      solution: 'for n in range(51, 100):\n    if n % 7 == 0:\n        print(n)\n        break\n',
    },
  },

  // ═════════════ INTERMEDIATE ═════════════
  {
    id: 'functions', level: 'intermediate', title: 'Functions and arguments',
    video: V('dyvxxJSGUsE', 'Functions in Python (Day 20)'),
    extraVideo: V('0d6b6fFuCkE', 'Function Arguments (Day 21)'),
    explain: [
      'A function is a named, reusable block of code. Define it with def name(parameters): and call it with name(values).',
      'return sends a value back. A function without return gives None.',
      'Default arguments: def greet(name="friend"). Keyword arguments: greet(name="Riya"). *args collects any number of values.',
    ],
    example: `def area(l, b=1):
    return l * b

def total(*nums):
    return sum(nums)

print(area(5, 4))
print(area(7))
print(total(1, 2, 3, 4))`,
    cards: [
      F('Keyword to define a function?', 'def'),
      F('What does return do?', 'Sends a value back to where the function was called.'),
      F('What does a function return without return?', 'None'),
      F('def f(*args): args is a…', 'tuple of all the values passed.'),
    ],
    quiz: [
      Q('def sq(x): return x * x. sq(6) is…', ['12', '36', '6', 'None'], 1, '6 × 6 = 36.'),
      Q('def hi(name="you"): print("Hi", name). hi() prints…', ['Hi', 'Hi you', 'Error', 'Hi name'], 1, 'The default is used.'),
      Q('Code inside a function runs when…', ['It is defined', 'It is called', 'The file is saved', 'Never'], 1, 'Only when called.'),
      Q('def f(): print("x"). y = f(). y is…', ['"x"', 'None', '0', 'Error'], 1, 'There is no return, so None.'),
    ],
    task: {
      prompt: 'Write a function is_even(n) that returns True or False. Print is_even(10) and is_even(7). Expected: True then False',
      starter: 'def is_even(n):\n    pass\n\n',
      expect: ['True', 'False'],
      solution: 'def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(10))\nprint(is_even(7))\n',
    },
  },
  {
    id: 'lists', level: 'intermediate', title: 'Lists and list methods',
    video: V('eF6nK5bSlmg', 'Introduction to Lists (Day 22)'),
    extraVideo: V('scWc3F8LbOo', 'List Methods (Day 23)'),
    explain: [
      'A list stores many values in order: marks = [78, 92, 85]. Lists can be changed (they are mutable).',
      'Useful methods: append(x) adds at the end, insert(i, x), remove(x), pop(), sort(), reverse(), index(x), count(x). Functions: len(), sum(), max(), min().',
      'List comprehension builds a list in one line: [x * x for x in range(5)].',
    ],
    example: `marks = [78, 92, 85]
marks.append(66)
marks.sort()
print(marks)
print("Highest:", max(marks), "Average:", sum(marks) / len(marks))
squares = [x * x for x in range(1, 6)]
print(squares)`,
    cards: [
      F('Add 5 to the end of list L?', 'L.append(5)'),
      F('Are lists mutable?', 'Yes, you can change their items.'),
      F('[x * 2 for x in [1, 2, 3]] = ?', '[2, 4, 6]'),
      F('L.pop() does…', 'Removes and returns the last item.'),
    ],
    quiz: [
      Q('L = [3, 1, 2]; L.sort(); L is…', ['[3, 1, 2]', '[1, 2, 3]', '[3, 2, 1]', 'None'], 1, 'sort() arranges in ascending order.'),
      Q('len([4, 5, 6, 7]) is…', ['3', '4', '7', '22'], 1, 'Four items.'),
      Q('L = [10, 20, 30]; L[1] is…', ['10', '20', '30', 'Error'], 1, 'Indexes start at 0.'),
      Q('Which removes the item "a" from a list?', ['L.pop("a")', 'L.remove("a")', 'L.delete("a")', 'del "a"'], 1, 'remove() removes by value.'),
    ],
    task: {
      prompt: 'nums = [4, 9, 2, 7, 5]. Print the largest number and the list sorted in descending order. Expected: 9 and [9, 7, 5, 4, 2]',
      starter: 'nums = [4, 9, 2, 7, 5]\n',
      expect: ['9', '[9, 7, 5, 4, 2]'],
      solution: 'nums = [4, 9, 2, 7, 5]\nprint(max(nums))\nnums.sort(reverse=True)\nprint(nums)\n',
    },
  },
  {
    id: 'tuples', level: 'intermediate', title: 'Tuples',
    video: V('PipsOUDKrVk', 'Tuples in Python (Day 24)'),
    extraVideo: V('XblLSduioJI', 'Operations on Tuples (Day 25)'),
    explain: [
      'A tuple is like a list but cannot be changed (immutable): point = (3, 4). Use tuples for fixed data like coordinates or RGB colours.',
      'A one-item tuple needs a comma: (5,). Tuples can be unpacked: x, y = point.',
    ],
    example: `point = (3, 4)
x, y = point
print(x, y)
colours = ("red", "green", "blue", "green")
print(colours.count("green"), colours.index("blue"))
print(len(colours))`,
    cards: [
      F('Tuple vs list?', 'A tuple cannot be changed after it is made; a list can.'),
      F('How to make a tuple with one item?', '(5,) with a comma.'),
      F('a, b = (1, 2) is called…', 'Tuple unpacking.'),
      F('t[0] = 9 on a tuple gives…', 'A TypeError (tuples are immutable).'),
    ],
    quiz: [
      Q('Which is a tuple?', ['[1, 2]', '(1, 2)', '{1, 2}', '"1, 2"'], 1, 'Round brackets make a tuple.'),
      Q('type((5)) is…', ['tuple', 'int', 'list', 'str'], 1, 'Without a comma, (5) is just 5.'),
      Q('t = (1, 2, 3); t[-1] is…', ['1', '3', '-1', 'Error'], 1, 'The last item.'),
      Q('Can you append to a tuple?', ['Yes', 'No'], 1, 'Tuples are immutable.'),
    ],
    task: {
      prompt: 'student = ("Riya", 15, "X-B"). Unpack it into name, age, section and print: Riya is 15 in X-B',
      starter: 'student = ("Riya", 15, "X-B")\n',
      expect: ['Riya is 15 in X-B'],
      solution: 'student = ("Riya", 15, "X-B")\nname, age, section = student\nprint(name, "is", age, "in", section)\n',
    },
  },
  {
    id: 'fstrings', level: 'intermediate', title: 'f-strings and docstrings',
    video: V('ixmxgUf8yIg', 'f-strings in Python (Day 28)'),
    extraVideo: V('SJzsNd7SM0g', 'Docstrings in Python (Day 29)'),
    explain: [
      'An f-string puts values straight into text: f"Hello {name}". Format numbers: {price:.2f} shows 2 decimals.',
      'A docstring is a string on the first line of a function that explains what it does. help(func) or func.__doc__ shows it.',
    ],
    example: `name = "Kabir"
score = 87.456
print(f"{name} scored {score:.1f}%")
print(f"5 + 3 = {5 + 3}")

def square(n):
    """Return n multiplied by itself."""
    return n * n
print(square.__doc__)`,
    cards: [
      F('f"{2 * 3}" = ?', '"6"'),
      F('How to show 2 decimals?', 'f"{x:.2f}"'),
      F('What is a docstring?', 'A string right under def that describes the function.'),
      F('Show a function\'s docstring', 'func.__doc__ or help(func)'),
    ],
    quiz: [
      Q('x = 3.14159. f"{x:.2f}" is…', ['3.14159', '3.14', '3.1', '3'], 1, '.2f means 2 decimal places.'),
      Q('An f-string starts with…', ['f before the quote', '$', '#', '%'], 0, 'f"..."'),
      Q('Docstrings are written with…', ['# comments', 'Triple quotes', 'print()', 'Square brackets'], 1, 'Usually """triple quotes""".'),
      Q('a = 4; f"{a}{a}" is…', ['8', '44', '"a a"', 'Error'], 1, 'Two 4s side by side.'),
    ],
    task: {
      prompt: 'item = "Pen" and price = 12.5. Print using an f-string: Pen costs Rs 12.50',
      starter: 'item = "Pen"\nprice = 12.5\n',
      expect: ['Pen costs Rs 12.50'],
      solution: 'item = "Pen"\nprice = 12.5\nprint(f"{item} costs Rs {price:.2f}")\n',
    },
  },
  {
    id: 'recursion', level: 'intermediate', title: 'Recursion',
    video: V('XYwJKFB8DUk', 'Recursion in Python (Day 30)'),
    explain: [
      'A recursive function calls itself on a smaller problem. It needs a BASE CASE that stops the calls.',
      'factorial(5) = 5 × factorial(4) = … = 5 × 4 × 3 × 2 × 1.',
    ],
    example: `def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)

def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(factorial(5))
print([fib(i) for i in range(8)])`,
    cards: [
      F('What is recursion?', 'A function calling itself.'),
      F('Why is a base case needed?', 'To stop the calls; otherwise you get a RecursionError.'),
      F('factorial(4) = ?', '24'),
      F('fib(6) = ?', '8 (0, 1, 1, 2, 3, 5, 8)'),
    ],
    quiz: [
      Q('A recursive function without a base case…', ['Returns 0', 'Runs until RecursionError', 'Returns None', 'Is faster'], 1, 'It never stops calling itself.'),
      Q('def f(n): return 0 if n == 0 else n + f(n - 1). f(4) is…', ['4', '10', '24', '0'], 1, '4 + 3 + 2 + 1 + 0.'),
      Q('Recursion is a good fit for…', ['Problems made of smaller copies of themselves', 'Printing one line', 'Reading input', 'Comments'], 0, 'e.g. factorial, trees.'),
      Q('factorial(1) returns…', ['0', '1', 'Error', 'None'], 1, 'The base case.'),
    ],
    task: {
      prompt: 'Write a recursive function power(b, e) that returns b to the power e (without **). Print power(2, 10). Expected: 1024',
      starter: 'def power(b, e):\n    pass\n\n',
      expect: ['1024'],
      solution: 'def power(b, e):\n    if e == 0:\n        return 1\n    return b * power(b, e - 1)\n\nprint(power(2, 10))\n',
    },
  },
  {
    id: 'sets', level: 'intermediate', title: 'Sets',
    video: V('l3kCO8cVA6o', 'Sets in Python (Day 31)'),
    extraVideo: V('HOrutCnp2zo', 'Set Methods (Day 32)'),
    explain: [
      'A set is an unordered collection with NO duplicates: {1, 2, 3}. set([1, 1, 2]) gives {1, 2}.',
      'Set maths: a | b union, a & b intersection, a - b difference. Use add() and remove() to change a set.',
      'An empty set is set(), because {} is an empty dictionary.',
    ],
    example: `a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b)
print(a & b)
print(a - b)
print(len(set([1, 1, 2, 2, 3])))`,
    cards: [
      F('Can a set hold duplicates?', 'No.'),
      F('{1, 2} & {2, 3} = ?', '{2}'),
      F('How do you make an empty set?', 'set() (not {}).'),
      F('Remove duplicates from list L', 'list(set(L))'),
    ],
    quiz: [
      Q('len({5, 5, 5}) is…', ['3', '1', '5', '0'], 1, 'Duplicates are dropped.'),
      Q('{1, 2} | {2, 3} is…', ['{2}', '{1, 2, 3}', '{1, 3}', '{1, 2, 2, 3}'], 1, 'Union has everything once.'),
      Q('type({}) is…', ['set', 'dict', 'list', 'tuple'], 1, '{} is an empty dictionary.'),
      Q('Sets keep items in a fixed order.', ['True', 'False'], 1, 'Sets are unordered.'),
    ],
    task: {
      prompt: 'Class A likes {"cricket", "chess", "football"} and class B likes {"chess", "kabaddi", "football"}. Print the number of games BOTH classes like. Expected: 2',
      starter: 'a = {"cricket", "chess", "football"}\nb = {"chess", "kabaddi", "football"}\n',
      expect: ['2'],
      solution: 'a = {"cricket", "chess", "football"}\nb = {"chess", "kabaddi", "football"}\nprint(len(a & b))\n',
    },
  },
  {
    id: 'dicts', level: 'intermediate', title: 'Dictionaries',
    video: V('j2G68uQtOwM', 'Dictionaries in Python (Day 33)'),
    extraVideo: V('LmbFwaLjT9k', 'Dictionary Methods (Day 34)'),
    explain: [
      'A dictionary stores key: value pairs: marks = {"Riya": 92, "Aman": 78}. Look up by key: marks["Riya"].',
      'd.get(key, default) avoids an error if the key is missing. d.keys(), d.values() and d.items() let you loop.',
      'Add or change: d["Dev"] = 88. Delete: del d["Aman"].',
    ],
    example: `marks = {"Riya": 92, "Aman": 78}
marks["Dev"] = 88
for name, m in marks.items():
    print(name, "->", m)
print(marks.get("Sara", "not found"))
print(max(marks, key=marks.get))`,
    cards: [
      F('Get the value of key "a" safely', 'd.get("a") or d.get("a", default)'),
      F('Loop over keys and values', 'for k, v in d.items():'),
      F('Can dictionary keys repeat?', 'No, each key is unique.'),
      F('Add a new pair', 'd["new_key"] = value'),
    ],
    quiz: [
      Q('d = {"x": 1}; d["y"] gives…', ['None', '0', 'KeyError', '"y"'], 2, 'The key does not exist.'),
      Q('len({"a": 1, "b": 2}) is…', ['1', '2', '4', '3'], 1, 'Two pairs.'),
      Q('d.get("z", 0) when z is missing is…', ['None', '0', 'Error', '"z"'], 1, 'The default is returned.'),
      Q('d = {"a": 1}; d["a"] = 5. d is…', ['{"a": 1}', '{"a": 5}', '{"a": 1, "a": 5}', 'Error'], 1, 'The value is replaced.'),
    ],
    task: {
      prompt: 'Count how many times each letter appears in "banana" using a dictionary, and print the dictionary. Expected: {\'b\': 1, \'a\': 3, \'n\': 2}',
      starter: 'word = "banana"\ncount = {}\n',
      expect: ["{'b': 1, 'a': 3, 'n': 2}"],
      solution: 'word = "banana"\ncount = {}\nfor ch in word:\n    count[ch] = count.get(ch, 0) + 1\nprint(count)\n',
    },
  },
  {
    id: 'exceptions', level: 'intermediate', title: 'Exception handling',
    video: V('4LKo6dlku7M', 'Exception Handling (Day 36)'),
    extraVideo: V('r_iuC-IDpPM', 'Finally keyword (Day 37)'),
    explain: [
      'Errors that happen while a program runs are exceptions (ZeroDivisionError, ValueError…). try/except catches them so the program does not crash.',
      'else runs if no error happened. finally ALWAYS runs. raise creates your own error.',
    ],
    example: `def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    else:
        return result
    finally:
        print("division attempted")

print(safe_divide(10, 2))
print(safe_divide(5, 0))`,
    cards: [
      F('What does try/except do?', 'Catches errors so the program keeps running.'),
      F('When does finally run?', 'Always, error or not.'),
      F('int("abc") raises…', 'ValueError'),
      F('How to create your own error?', 'raise ValueError("message")'),
    ],
    quiz: [
      Q('10 / 0 raises…', ['ValueError', 'ZeroDivisionError', 'TypeError', 'Nothing'], 1, 'Division by zero.'),
      Q('The else block of try runs when…', ['An error happened', 'No error happened', 'Always', 'Never'], 1, 'Only when try succeeded.'),
      Q('"5" + 5 raises…', ['TypeError', 'ValueError', 'KeyError', 'IndexError'], 0, 'You cannot add str and int.'),
      Q('[1, 2][5] raises…', ['KeyError', 'IndexError', 'ValueError', 'None'], 1, 'The index is out of range.'),
    ],
    task: {
      prompt: 'Read a value; if it is not a number, print "Please enter a number" instead of crashing. Test input: abc',
      starter: 'text = input("Number: ")\n',
      input: 'abc',
      expect: ['Please enter a number'],
      solution: 'text = input("Number: ")\ntry:\n    n = int(text)\n    print("Double is", n * 2)\nexcept ValueError:\n    print("Please enter a number")\n',
    },
  },
  {
    id: 'shorthand', level: 'intermediate', title: 'One-line if, enumerate and scope',
    video: V('Qqx_zNmQVGI', 'Short hand if else (Day 41)'),
    extraVideo: V('kGnYc_h1geM', 'Enumerate Function (Day 42)'),
    explain: [
      'One-line if: result = "Pass" if marks >= 40 else "Fail".',
      'enumerate() gives the index and the item together: for i, item in enumerate(list, start=1).',
      'Variables made inside a function are LOCAL to it. To change a variable from outside, declare it global (use sparingly).',
    ],
    example: `marks = 35
print("Pass" if marks >= 40 else "Fail")

fruits = ["apple", "mango", "kiwi"]
for i, f in enumerate(fruits, start=1):
    print(i, f)

count = 0
def bump():
    global count
    count += 1
bump(); bump()
print(count)`,
    cards: [
      F('One-line if syntax', 'a if condition else b'),
      F('enumerate(["a", "b"]) gives…', '(0, "a"), (1, "b")'),
      F('Local variable', 'A variable created inside a function; only visible there.'),
      F('Why avoid global?', 'It makes code harder to follow; prefer return values.'),
    ],
    quiz: [
      Q('x = 7; "big" if x > 5 else "small" is…', ['big', 'small', 'True', 'Error'], 0, '7 > 5.'),
      Q('enumerate(list, start=1) starts counting at…', ['0', '1', '-1', 'The first item'], 1, 'start sets the first index.'),
      Q('A variable made inside a function is…', ['Global', 'Local', 'Constant', 'Shared'], 1, 'It is local.'),
      Q('Which keyword changes an outside variable inside a function?', ['local', 'global', 'outer', 'self'], 1, 'global.'),
    ],
    task: {
      prompt: 'Print each subject with its number, starting at 1, using enumerate: 1 Maths, 2 Physics, 3 Robotics',
      starter: 'subjects = ["Maths", "Physics", "Robotics"]\n',
      expect: ['1 Maths', '2 Physics', '3 Robotics'],
      solution: 'subjects = ["Maths", "Physics", "Robotics"]\nfor i, s in enumerate(subjects, start=1):\n    print(i, s)\n',
    },
  },
  {
    id: 'lambda', level: 'intermediate', title: 'Lambda, map, filter and reduce',
    video: V('UfFWf-PXUqE', 'Lambda functions (Day 52)'),
    extraVideo: V('OErhjT4f5Cs', 'Map, Filter and Reduce (Day 53)'),
    explain: [
      'A lambda is a small one-line function: square = lambda x: x * x.',
      'map(f, list) applies f to every item. filter(f, list) keeps items where f is True. reduce(f, list) (from functools) combines items into one value.',
    ],
    example: `from functools import reduce
nums = [1, 2, 3, 4, 5, 6]
print(list(map(lambda x: x * x, nums)))
print(list(filter(lambda x: x % 2 == 0, nums)))
print(reduce(lambda a, b: a + b, nums))
print(sorted(["kiwi", "fig", "banana"], key=lambda w: len(w)))`,
    cards: [
      F('lambda x: x + 1 is…', 'A one-line function that adds 1.'),
      F('map() does…', 'Applies a function to every item.'),
      F('filter() does…', 'Keeps only items where the function returns True.'),
      F('Where is reduce()?', 'In the functools module.'),
    ],
    quiz: [
      Q('list(map(lambda x: x * 2, [1, 2])) is…', ['[1, 2]', '[2, 4]', '[1, 2, 1, 2]', '4'], 1, 'Each item doubled.'),
      Q('list(filter(lambda x: x > 2, [1, 3, 5])) is…', ['[1]', '[3, 5]', '[1, 3]', '[]'], 1, 'Keeps items above 2.'),
      Q('A lambda can contain…', ['Many statements', 'One expression', 'A loop block', 'A class'], 1, 'Only one expression.'),
      Q('reduce(lambda a, b: a * b, [1, 2, 3, 4]) is…', ['10', '24', '4', '1'], 1, '1 × 2 × 3 × 4.'),
    ],
    task: {
      prompt: 'From temps = [32, 41, 28, 45, 39], use filter with a lambda to print the list of temperatures above 35. Expected: [41, 45, 39]',
      starter: 'temps = [32, 41, 28, 45, 39]\n',
      expect: ['[41, 45, 39]'],
      solution: 'temps = [32, 41, 28, 45, 39]\nprint(list(filter(lambda t: t > 35, temps)))\n',
    },
  },

  // ═════════════ ADVANCED ═════════════
  {
    id: 'classes', level: 'advanced', title: 'Classes and objects',
    video: V('HQnoYzxOHMw', 'Introduction to OOPs (Day 56)'),
    extraVideo: V('a7baAGCBA9U', 'Classes and Objects (Day 57)'),
    explain: [
      'Object-oriented programming (OOP) models real things. A class is a blueprint, and an object is one thing made from it.',
      'Attributes store data about the object; methods are functions inside the class. self means "this object".',
    ],
    example: `class Robot:
    wheels = 4                 # class attribute

    def greet(self):
        print("Beep! I have", self.wheels, "wheels")

r1 = Robot()
r1.name = "Chitti"
r1.greet()
print(r1.name)`,
    cards: [
      F('Class vs object', 'A class is the blueprint; an object is one instance made from it.'),
      F('What is self?', 'The object the method is being called on.'),
      F('Method', 'A function defined inside a class.'),
      F('Make an object of class Car', 'c = Car()'),
    ],
    quiz: [
      Q('Keyword to make a class?', ['def', 'class', 'object', 'new'], 1, 'class Name:'),
      Q('The first parameter of a method is usually…', ['this', 'self', 'me', 'obj'], 1, 'self.'),
      Q('Objects made from the same class…', ['Must have the same data', 'Can have different data', 'Are the same object', 'Cannot exist'], 1, 'Each object has its own data.'),
      Q('OOP stands for…', ['Object-Oriented Programming', 'Open Online Python', 'Ordered Output Process', 'None'], 0, 'Object-Oriented Programming.'),
    ],
    task: {
      prompt: 'Make a class Dog with a method bark() that prints "Woof!". Create an object and call bark().',
      starter: 'class Dog:\n    pass\n\n',
      expect: ['Woof!'],
      solution: 'class Dog:\n    def bark(self):\n        print("Woof!")\n\nd = Dog()\nd.bark()\n',
    },
  },
  {
    id: 'constructors', level: 'advanced', title: 'Constructors (__init__)',
    video: V('12HRkYld22c', 'Constructors in Python (Day 58)'),
    explain: [
      '__init__ is the constructor: it runs automatically when an object is created and sets up its attributes.',
      'Instance variables (self.name) belong to one object; class variables are shared by all objects.',
    ],
    example: `class Student:
    school = "City High"        # shared by all students

    def __init__(self, name, marks):
        self.name = name        # belongs to this student
        self.marks = marks

    def report(self):
        print(f"{self.name} from {self.school}: {self.marks}")

a = Student("Riya", 92)
b = Student("Aman", 78)
a.report(); b.report()`,
    cards: [
      F('What is __init__?', 'The constructor: runs when an object is created.'),
      F('Instance variable', 'self.x: different for each object.'),
      F('Class variable', 'Defined in the class body: shared by all objects.'),
      F('Student("Riya", 92) calls…', '__init__(self, "Riya", 92)'),
    ],
    quiz: [
      Q('__init__ runs when…', ['A method is called', 'An object is created', 'The program ends', 'Never'], 1, 'At object creation.'),
      Q('self.marks is a(n)…', ['Class variable', 'Instance variable', 'Global', 'Constant'], 1, 'It belongs to the object.'),
      Q('Changing a class variable through the class affects…', ['One object', 'All objects that have not overridden it', 'None', 'Only new objects'], 1, 'It is shared.'),
      Q('How many underscores before and after init?', ['1', '2', '3', '0'], 1, '__init__ has two each side.'),
    ],
    task: {
      prompt: 'Make a class Rectangle with __init__(self, l, b) and a method area(). Print Rectangle(6, 4).area(). Expected: 24',
      starter: 'class Rectangle:\n    pass\n\n',
      expect: ['24'],
      solution: 'class Rectangle:\n    def __init__(self, l, b):\n        self.l = l\n        self.b = b\n\n    def area(self):\n        return self.l * self.b\n\nprint(Rectangle(6, 4).area())\n',
    },
  },
  {
    id: 'inheritance', level: 'advanced', title: 'Inheritance and super()',
    video: V('-KsfUaQEY9Y', 'Inheritance in Python (Day 61)'),
    extraVideo: V('P648reefNh0', 'super keyword (Day 72)'),
    explain: [
      'Inheritance lets a child class reuse a parent class: class Car(Vehicle). The child gets all the parent\'s methods and can add or override them.',
      'super() calls the parent\'s version, e.g. super().__init__(...) inside the child\'s constructor.',
    ],
    example: `class Vehicle:
    def __init__(self, name):
        self.name = name
    def move(self):
        print(self.name, "is moving")

class Drone(Vehicle):
    def __init__(self, name, height):
        super().__init__(name)
        self.height = height
    def move(self):                     # overriding
        print(self.name, "flies at", self.height, "m")

Vehicle("Bus").move()
Drone("D1", 120).move()`,
    cards: [
      F('Syntax for inheritance', 'class Child(Parent):'),
      F('What does super() do?', 'Calls a method of the parent class.'),
      F('Method overriding', 'A child class redefines a parent method.'),
      F('Multiple inheritance', 'class C(A, B): inherits from two parents.'),
    ],
    quiz: [
      Q('class B(A): B is the…', ['Parent', 'Child', 'Object', 'Module'], 1, 'B inherits from A.'),
      Q('A child class can…', ['Only use parent methods', 'Add and override methods', 'Not have __init__', 'Not be instantiated'], 1, 'It can do both.'),
      Q('super().__init__(x) calls…', ["The child's __init__", "The parent's __init__", 'A new object', 'Nothing'], 1, 'The parent constructor.'),
      Q('Inheritance mainly helps to…', ['Reuse code', 'Slow down code', 'Hide errors', 'Print faster'], 0, 'Reuse and organise code.'),
    ],
    task: {
      prompt: 'Make class Animal with speak() printing "..." and class Cat(Animal) that overrides speak() to print "Meow". Call Cat().speak(). Expected: Meow',
      starter: 'class Animal:\n    def speak(self):\n        print("...")\n\n',
      expect: ['Meow'],
      solution: 'class Animal:\n    def speak(self):\n        print("...")\n\nclass Cat(Animal):\n    def speak(self):\n        print("Meow")\n\nCat().speak()\n',
    },
  },
  {
    id: 'staticclass', level: 'advanced', title: 'Static methods, class methods and getters',
    video: V('GcSVYNSsJxo', 'Static Methods (Day 65)'),
    extraVideo: V('9ynmDLc5FYo', 'Class Methods (Day 69)'),
    explain: [
      '@staticmethod: a function inside a class that needs neither self nor the class, like a helper.',
      '@classmethod receives the class (cls) and is often used as an alternative constructor.',
      '@property makes a method readable like an attribute (a getter); @x.setter controls how it is changed.',
    ],
    example: `class Temperature:
    def __init__(self, celsius):
        self._c = celsius

    @property
    def fahrenheit(self):
        return self._c * 9 / 5 + 32

    @staticmethod
    def is_freezing(c):
        return c <= 0

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)

t = Temperature(25)
print(t.fahrenheit)
print(Temperature.is_freezing(-3))
print(Temperature.from_fahrenheit(212)._c)`,
    cards: [
      F('@staticmethod gets…', 'Neither self nor cls.'),
      F('@classmethod first parameter', 'cls (the class itself).'),
      F('@property does…', 'Lets you read a method like an attribute: obj.value'),
      F('Common use of a class method', 'An alternative constructor, e.g. from_string().'),
    ],
    quiz: [
      Q('Which decorator gives a getter?', ['@static', '@property', '@getter', '@classmethod'], 1, '@property.'),
      Q('cls inside a classmethod refers to…', ['The object', 'The class', 'The module', 'Nothing'], 1, 'The class.'),
      Q('A static method can be called as…', ['ClassName.method()', 'Only object.method()', 'It cannot be called', 'method.ClassName()'], 0, 'Without making an object.'),
      Q('t.fahrenheit (with @property) is called…', ['With brackets', 'Without brackets', 'Only once', 'With self'], 1, 'Like an attribute.'),
    ],
    task: {
      prompt: 'Make class MathTool with a @staticmethod cube(n). Print MathTool.cube(3). Expected: 27',
      starter: 'class MathTool:\n    pass\n\n',
      expect: ['27'],
      solution: 'class MathTool:\n    @staticmethod\n    def cube(n):\n        return n ** 3\n\nprint(MathTool.cube(3))\n',
    },
  },
  {
    id: 'dunder', level: 'advanced', title: 'Dunder methods and operator overloading',
    video: V('DmgQVJXhuLQ', 'Magic/Dunder Methods (Day 73)'),
    extraVideo: V('D67-b2t-y4k', 'Operator Overloading (Day 77)'),
    explain: [
      'Dunder ("double underscore") methods let your objects work with Python\'s built-in features: __str__ for print(), __len__ for len(), __add__ for +, __eq__ for ==.',
      'Defining __add__ is called operator overloading: you decide what + means for your objects.',
    ],
    example: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    def __len__(self):
        return 2

v = Vector(2, 3) + Vector(4, 1)
print(v)
print(len(v))`,
    cards: [
      F('__str__ is used by…', 'print() and str()'),
      F('__add__ is used by…', 'The + operator.'),
      F('Operator overloading', 'Giving an operator a meaning for your own class.'),
      F('__eq__ is used by…', 'The == operator.'),
    ],
    quiz: [
      Q('Which method controls what print(obj) shows?', ['__init__', '__str__', '__print__', '__show__'], 1, '__str__.'),
      Q('a * b on objects calls…', ['__mul__', '__times__', '__star__', '__mult__'], 0, '__mul__.'),
      Q('len(obj) calls…', ['__size__', '__count__', '__len__', '__length__'], 2, '__len__.'),
      Q('Why "dunder"?', ['Double underscore', 'Dynamic under', 'Default under', 'No reason'], 0, 'Double UNDERscore.'),
    ],
    task: {
      prompt: 'Make class Money(amount) with __add__ that adds amounts and __str__ that returns "Rs <amount>". Print Money(50) + Money(70). Expected: Rs 120',
      starter: 'class Money:\n    pass\n\n',
      expect: ['Rs 120'],
      solution: 'class Money:\n    def __init__(self, amount):\n        self.amount = amount\n    def __add__(self, other):\n        return Money(self.amount + other.amount)\n    def __str__(self):\n        return f"Rs {self.amount}"\n\nprint(Money(50) + Money(70))\n',
    },
  },
  {
    id: 'decorators', level: 'advanced', title: 'Decorators',
    video: V('PTBZ674EsvI', 'Decorators in Python (Day 59)'),
    explain: [
      'A decorator is a function that wraps another function to add behaviour (logging, timing, checking) without changing its code.',
      '@my_decorator above a def is shorthand for func = my_decorator(func).',
    ],
    example: `def announce(func):
    def wrapper(*args):
        print("Starting", func.__name__)
        result = func(*args)
        print("Finished", func.__name__)
        return result
    return wrapper

@announce
def add(a, b):
    return a + b

print(add(3, 4))`,
    cards: [
      F('What is a decorator?', 'A function that wraps another function to add behaviour.'),
      F('@d above def f is the same as…', 'f = d(f)'),
      F('Why does wrapper use *args?', 'So it can pass any arguments on to the real function.'),
      F('Built-in decorators you know', '@property, @staticmethod, @classmethod'),
    ],
    quiz: [
      Q('A decorator takes a function and returns…', ['A number', 'A function', 'None', 'A class only'], 1, 'Usually a new (wrapper) function.'),
      Q('The @ symbol is used to…', ['Comment', 'Apply a decorator', 'Multiply', 'Import'], 1, 'Apply a decorator.'),
      Q('Decorators are useful for…', ['Logging and timing', 'Only printing', 'Making lists', 'Comments'], 0, 'Adding behaviour around functions.'),
      Q('Inside the wrapper, func(*args) calls…', ['The decorator', 'The original function', 'print', 'Nothing'], 1, 'The original function.'),
    ],
    task: {
      prompt: 'Write a decorator shout that prints the function\'s returned text in UPPER CASE. Decorate greet() which returns "hello". Calling greet() should print HELLO',
      starter: 'def shout(func):\n    pass\n\n',
      expect: ['HELLO'],
      solution: 'def shout(func):\n    def wrapper():\n        print(func().upper())\n    return wrapper\n\n@shout\ndef greet():\n    return "hello"\n\ngreet()\n',
    },
  },
  {
    id: 'generators', level: 'advanced', title: 'Generators and caching',
    video: V('ixd-u3pmsUc', 'Generators in Python (Day 91)'),
    extraVideo: V('K8gjSwc3Rlo', 'Function Caching (Day 92)'),
    explain: [
      'A generator uses yield to produce values one at a time, only when asked. It saves memory for long sequences.',
      'next(gen) gets the next value; a for loop gets them all.',
      'functools.lru_cache remembers results of a function, so slow recursive functions become fast.',
    ],
    example: `from functools import lru_cache

def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(50))`,
    cards: [
      F('Keyword that makes a generator', 'yield'),
      F('Get the next value of generator g', 'next(g)'),
      F('Why use generators?', 'They make values lazily, saving memory.'),
      F('lru_cache does…', 'Remembers results so repeated calls are instant.'),
    ],
    quiz: [
      Q('A function with yield returns…', ['A list', 'A generator', 'None', 'An int'], 1, 'A generator object.'),
      Q('After a generator has no more values, next() raises…', ['ValueError', 'StopIteration', 'KeyError', 'Nothing'], 1, 'StopIteration.'),
      Q('lru_cache is in…', ['math', 'functools', 'os', 'random'], 1, 'functools.'),
      Q('Generators are good for…', ['Huge or endless sequences', 'Tiny lists only', 'Printing once', 'Classes'], 0, 'They do not store everything at once.'),
    ],
    task: {
      prompt: 'Write a generator evens(limit) that yields even numbers from 0 up to limit. Print list(evens(10)). Expected: [0, 2, 4, 6, 8, 10]',
      starter: 'def evens(limit):\n    pass\n\n',
      expect: ['[0, 2, 4, 6, 8, 10]'],
      solution: 'def evens(limit):\n    for n in range(0, limit + 1, 2):\n        yield n\n\nprint(list(evens(10)))\n',
    },
  },
  {
    id: 'regex', level: 'advanced', title: 'Regular expressions',
    video: V('TCWOwavqFrw', 'Regular Expressions in Python (Day 95)'),
    explain: [
      'A regular expression (regex) is a pattern for finding text. Python\'s re module uses them.',
      'Common pieces: \\d a digit, \\w a letter/digit/_, + one or more, * zero or more, [A-Z] any capital letter.',
      're.findall(pattern, text) returns all matches; re.search finds the first; re.sub replaces.',
    ],
    example: `import re
text = "Call 98765-43210 or 91234-56789. Email: robo@school.in"
print(re.findall(r"\\d{5}-\\d{5}", text))
print(re.search(r"[\\w.]+@[\\w.]+", text).group())
print(re.sub(r"\\d", "#", "PIN 4821"))`,
    cards: [
      F('\\d matches…', 'Any digit 0-9.'),
      F('+ in a regex means…', 'One or more of the previous thing.'),
      F('re.findall returns…', 'A list of all matches.'),
      F('Why use r"..." for patterns?', 'A raw string keeps backslashes as written.'),
    ],
    quiz: [
      Q('re.findall(r"\\d+", "a12b345") is…', ["['12', '345']", "['1', '2']", '[12, 345]', "['a', 'b']"], 0, 'Runs of digits.'),
      Q('Which module provides regex?', ['regex', 're', 'reg', 'string'], 1, 'import re.'),
      Q('[aeiou] matches…', ['The word aeiou', 'Any one vowel', 'Five letters', 'Nothing'], 1, 'Any single character in the brackets.'),
      Q('re.sub(r"a", "o", "banana") is…', ['bonono', 'banana', 'bonana', 'oooooo'], 0, 'Every a becomes o.'),
    ],
    task: {
      prompt: 'Find all the 4-digit years in "Born 2009, joined 2021, graduates 2027" using re.findall and print the list. Expected: [\'2009\', \'2021\', \'2027\']',
      starter: 'import re\ntext = "Born 2009, joined 2021, graduates 2027"\n',
      expect: ["['2009', '2021', '2027']"],
      solution: 'import re\ntext = "Born 2009, joined 2021, graduates 2027"\nprint(re.findall(r"\\d{4}", text))\n',
    },
  },
  {
    id: 'files', level: 'advanced', title: 'Working with files',
    video: V('eDBPlcWYses', 'File IO in Python (Day 49)'),
    extraVideo: V('l1FsnQxET9U', 'read(), readlines() and other methods (Day 50)'),
    explain: [
      'open(name, mode) opens a file. Modes: "r" read, "w" write (replaces), "a" append. Use with open(...) as f: so the file closes itself.',
      'f.write(text) writes. f.read() reads everything; f.readlines() gives a list of lines.',
      'In this app the file lives in a temporary in-browser folder, so it is gone after the run.',
    ],
    example: `with open("notes.txt", "w") as f:
    f.write("Line 1: motors\\n")
    f.write("Line 2: sensors\\n")

with open("notes.txt", "a") as f:
    f.write("Line 3: code\\n")

with open("notes.txt") as f:
    for line in f.readlines():
        print(line.strip())`,
    cards: [
      F('Mode to add to the end of a file', '"a" (append)'),
      F('Why use with open(...)?', 'The file is closed automatically.'),
      F('"w" mode on an existing file…', 'Erases it and writes fresh.'),
      F('f.readlines() returns…', 'A list of lines.'),
    ],
    quiz: [
      Q('Default mode of open()?', ['"w"', '"r"', '"a"', '"x"'], 1, 'Read mode.'),
      Q('Which mode keeps old content and adds new?', ['"r"', '"w"', '"a"', '"rb"'], 2, 'Append.'),
      Q('Opening a missing file in "r" mode raises…', ['FileNotFoundError', 'KeyError', 'Nothing', 'ValueError'], 0, 'The file does not exist.'),
      Q('f.write() needs…', ['A number', 'A string', 'A list', 'Nothing'], 1, 'Text (str).'),
    ],
    task: {
      prompt: 'Write three names to "class.txt" (one per line), then read the file and print how many lines it has. Expected: 3',
      starter: 'names = ["Riya", "Aman", "Dev"]\n',
      expect: ['3'],
      solution: 'names = ["Riya", "Aman", "Dev"]\nwith open("class.txt", "w") as f:\n    for n in names:\n        f.write(n + "\\n")\nwith open("class.txt") as f:\n    print(len(f.readlines()))\n',
    },
  },
];

// ── Projects: bigger builds at the end of each level ──
export const PROJECTS = [
  {
    id: 'calc', level: 'beginner', title: 'Menu calculator', video: V('dohaSBCKCr0', 'Exercise 1: Calculator (Solution, Day 8)'),
    brief: 'Ask for two numbers and an operator (+, -, *, /) and print the answer. Handle division by zero and an unknown operator.',
    steps: ['Read two numbers with float(input()).', 'Read the operator.', 'Use if/elif/else to pick the operation.', 'Check for division by zero.', 'Print the result.'],
    starter: 'a = float(input("First number: "))\nb = float(input("Second number: "))\nop = input("Operator (+ - * /): ")\n',
    input: '12\n4\n*', expect: ['48'],
    solution: 'a = float(input("First number: "))\nb = float(input("Second number: "))\nop = input("Operator (+ - * /): ")\nif op == "+":\n    print("Answer:", a + b)\nelif op == "-":\n    print("Answer:", a - b)\nelif op == "*":\n    print("Answer:", a * b)\nelif op == "/":\n    if b == 0:\n        print("Cannot divide by zero")\n    else:\n        print("Answer:", a / b)\nelse:\n    print("Unknown operator")\n',
  },
  {
    id: 'greet', level: 'beginner', title: 'Good Morning Sir (time-based greeting)', video: V('d7ng_aV4qdI', 'Exercise 2: Good Morning Sir (Day 15)'),
    brief: 'Read the hour (0-23) and greet: Good Morning (5-11), Good Afternoon (12-16), Good Evening (17-20), Good Night otherwise.',
    steps: ['Read the hour as an int.', 'Use if/elif ranges to choose the greeting.', 'Print the greeting.'],
    starter: 'hour = int(input("Hour (0-23): "))\n', input: '18', expect: ['Good Evening'],
    solution: 'hour = int(input("Hour (0-23): "))\nif 5 <= hour <= 11:\n    print("Good Morning Sir")\nelif 12 <= hour <= 16:\n    print("Good Afternoon Sir")\nelif 17 <= hour <= 20:\n    print("Good Evening Sir")\nelse:\n    print("Good Night Sir")\n',
  },
  {
    id: 'guess', level: 'beginner', title: 'Number guessing game',
    brief: 'The secret number is 37. Keep reading guesses and say "Too low" or "Too high" until the player gets it, then print the number of tries.',
    steps: ['Set secret = 37 and tries = 0.', 'Use a while loop to read guesses.', 'Compare and print hints.', 'break when correct and print the tries.'],
    starter: 'secret = 37\ntries = 0\n', input: '50\n25\n37', expect: ['Too high', 'Too low', '3 tries'],
    solution: 'secret = 37\ntries = 0\nwhile True:\n    guess = int(input("Guess: "))\n    tries += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print(f"Correct in {tries} tries")\n        break\n',
  },
  {
    id: 'kbc', level: 'intermediate', title: 'Kaun Banega Crorepati quiz', video: V('Vs1Z7K70Mvw', 'Exercise 3: KBC (Day 27)'),
    brief: 'Store questions, options and answers in lists. Ask each one, add prize money for correct answers and stop at the first wrong answer.',
    steps: ['Make a list of questions, each with options and the correct option number.', 'Loop through them with enumerate.', 'Read the answer; if wrong, break.', 'Print the money won.'],
    starter: 'questions = [\n    ["Capital of India?", ["Mumbai", "Delhi", "Pune", "Agra"], 2],\n    ["5 x 6 = ?", ["30", "11", "56", "25"], 1],\n    ["Python is a…", ["Snake only", "Language", "Car", "Game"], 2],\n]\nprizes = [1000, 5000, 10000]\n',
    input: '2\n1\n3', expect: ['You won Rs 6000'],
    solution: 'questions = [\n    ["Capital of India?", ["Mumbai", "Delhi", "Pune", "Agra"], 2],\n    ["5 x 6 = ?", ["30", "11", "56", "25"], 1],\n    ["Python is a…", ["Snake only", "Language", "Car", "Game"], 2],\n]\nprizes = [1000, 5000, 10000]\nwon = 0\nfor i, (q, opts, ans) in enumerate(questions):\n    print(f"Q{i + 1}. {q}")\n    for n, o in enumerate(opts, start=1):\n        print(f"  {n}. {o}")\n    choice = int(input("Your answer: "))\n    if choice == ans:\n        won += prizes[i]\n        print("Correct!")\n    else:\n        print("Wrong answer")\n        break\nprint(f"You won Rs {won}")\n',
  },
  {
    id: 'snake', level: 'intermediate', title: 'Snake, Water, Gun', video: V('dDsh7FT6-0I', 'Exercise 5: Snake Water Gun (Day 55)'),
    brief: 'Play 3 rounds against the computer. Snake drinks water, water drowns gun, gun shoots snake. Keep score with a dictionary.',
    steps: ['Use random.seed(1) and random.choice for the computer.', 'Write a function winner(you, comp).', 'Play 3 rounds and update a score dictionary.', 'Print the final score.'],
    starter: 'import random\nrandom.seed(1)\n', input: 's\nw\ng', expect: ['Final score'],
    solution: 'import random\nrandom.seed(1)\nbeats = {"s": "w", "w": "g", "g": "s"}\nnames = {"s": "Snake", "w": "Water", "g": "Gun"}\nscore = {"you": 0, "computer": 0}\n\ndef winner(you, comp):\n    if you == comp:\n        return "draw"\n    return "you" if beats[you] == comp else "computer"\n\nfor r in range(3):\n    you = input("s / w / g: ").lower()\n    comp = random.choice("swg")\n    w = winner(you, comp)\n    print(f"You: {names[you]}  Computer: {names[comp]}  -> {w}")\n    if w != "draw":\n        score[w] += 1\nprint("Final score:", score)\n',
  },
  {
    id: 'library', level: 'advanced', title: 'Library management system', video: V('mlDZTSH2FFc', 'Exercise 6: Library Management (Day 64)'),
    brief: 'Build a Library class that can add books, lend a book and show available books. Lending a book that is not available prints a message.',
    steps: ['class Library with __init__ storing a list of books.', 'add(book), lend(book), show() methods.', 'Use a Book class or just strings.', 'Test it with a few calls.'],
    starter: 'class Library:\n    def __init__(self):\n        self.books = []\n\n',
    expect: ['Python 101 lent', 'not available', 'Available: Robots for Kids'],
    solution: 'class Library:\n    def __init__(self):\n        self.books = []\n\n    def add(self, title):\n        self.books.append(title)\n\n    def lend(self, title):\n        if title in self.books:\n            self.books.remove(title)\n            print(f"{title} lent")\n        else:\n            print(f"{title} is not available")\n\n    def show(self):\n        print("Available:", ", ".join(self.books))\n\nlib = Library()\nlib.add("Python 101")\nlib.add("Robots for Kids")\nlib.lend("Python 101")\nlib.lend("Python 101")\nlib.show()\n',
  },
  {
    id: 'bank', level: 'advanced', title: 'Bank account with inheritance',
    brief: 'Make an Account class (deposit, withdraw with a balance check) and a SavingsAccount child that adds interest. Use __str__ to print the balance.',
    steps: ['class Account with __init__(owner, balance=0).', 'deposit() and withdraw() (refuse if not enough money).', 'class SavingsAccount(Account) with add_interest(rate).', '__str__ returns "Owner: Rs balance".'],
    starter: 'class Account:\n    pass\n\n',
    expect: ['Insufficient balance', 'Riya: Rs 1050.0'],
    solution: 'class Account:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print("Insufficient balance")\n        else:\n            self.balance -= amount\n\n    def __str__(self):\n        return f"{self.owner}: Rs {self.balance}"\n\nclass SavingsAccount(Account):\n    def add_interest(self, rate):\n        self.balance += self.balance * rate / 100\n\nacc = SavingsAccount("Riya")\nacc.deposit(1000)\nacc.withdraw(5000)\nacc.add_interest(5)\nprint(acc)\n',
  },
];

export const lessonsFor = (level) => LESSONS.filter(l => l.level === level);
export const projectsFor = (level) => PROJECTS.filter(p => p.level === level);
