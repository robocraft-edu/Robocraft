// Class 9 · Python — textbook notes, diagrams and exam questions.
export default {
  c9_p_1: {
    sections: [
      { h: 'Program, algorithm and language', b: `• An **algorithm** is a step-by-step method to solve a problem, written in plain language or as a flowchart.
• A **program** is an algorithm written in a programming language that a computer can run.
• A **programming language** has strict rules (syntax). Python, C++, Java and JavaScript are examples.

Python programs are run by the **Python interpreter**, which reads and executes the code one line at a time. If there is an error on line 5, lines 1–4 have already run. A **compiler** (as in C++) translates the whole program first and then runs it.

[fig:flowchartSymbols]` },
      { h: 'Features of Python', b: `• **Simple, readable syntax** — looks close to English.
• **Interpreted** — no separate compile step; easy to test ideas.
• **Dynamically typed** — no need to declare variable types.
• **Free and open source**, runs on Windows, macOS, Linux and Raspberry Pi (**platform independent**).
• **Huge standard library** plus packages: NumPy, Pandas, Matplotlib, TensorFlow, OpenCV.
• **Supports many styles**: procedural, object-oriented and functional.
• **Case-sensitive** and uses **indentation** to group code blocks.` },
      { h: 'Your first programs', b: `~~~
print("Hello, RoboCraft!")
name = input("What is your name? ")
print("Welcome", name)
~~~
**print()** shows output; **input()** waits for the user to type and always returns a **string**.

A program to add two numbers typed by the user:
~~~
a = int(input("First number: "))
b = int(input("Second number: "))
print("Sum =", a + b)
~~~
Note: int() is needed because input() gives text. Without it, "2" + "3" would give "23".` },
      { h: 'Where Python is used in robotics and AI', b: `• Controlling Raspberry Pi robots (reading GPIO pins, sensors, cameras).
• **ROS** (Robot Operating System) nodes for navigation and mapping.
• Computer vision with **OpenCV**; machine learning with **scikit-learn**, **TensorFlow**, **PyTorch**.
• Data analysis of sensor logs with **Pandas** and charts with **Matplotlib**.` },
    ],
    exam: {
      short: [
        { q: 'What is an interpreter?', a: 'A program that translates and executes source code line by line (e.g. the Python interpreter).' },
        { q: 'Who developed Python and when was it released?', a: 'Guido van Rossum; first released in 1991.' },
        { q: 'What does the input() function return?', a: 'Always a string (text). It must be converted with int() or float() to use it as a number.' },
      ],
      long: [
        { q: 'List any five features of Python that make it suitable for beginners and for robotics.', a: 'Simple readable syntax; interpreted (quick testing); dynamically typed; free, open-source and cross-platform (runs on Raspberry Pi); large libraries (NumPy, OpenCV, TensorFlow); supports multiple paradigms; strong community support.' },
        { q: 'Write a Python program to accept the length and breadth of a rectangle and print its area and perimeter.', a: '~~~\nl = float(input("Length: "))\nb = float(input("Breadth: "))\narea = l * b\nperimeter = 2 * (l + b)\nprint("Area =", area)\nprint("Perimeter =", perimeter)\n~~~' },
      ],
    },
  },

  c9_p_2: {
    sections: [
      { h: 'Tokens: the smallest units of a program', b: `Python code is made of **tokens**:
• **Keywords** — reserved words with special meaning: if, else, elif, for, while, def, return, True, False, None, and, or, not, in, is, import, break, continue, pass. They cannot be used as variable names.
• **Identifiers** — names you choose for variables and functions: speed, robot_name, read_sensor.
• **Literals** — fixed values: 25, 3.14, "hello", True.
• **Operators** — symbols that act on values: + - * / == and.
• **Punctuators/delimiters** — ( ) [ ] { } , : etc.` },
      { h: 'Interactive mode vs script mode', b: `**Interactive mode** (the >>> prompt / Python shell):
• Type one statement, press Enter, see the result immediately.
• Great for testing a function or doing quick calculations.
• Work is lost when you close the shell.

**Script mode** (a .py file run in IDLE, VS Code or Thonny):
• Write a complete program, save it, run it again and again.
• Used for real projects and school practical assignments.

~~~
>>> 7 * 6
42
>>> "robo" + "craft"
'robocraft'
~~~` },
      { h: 'Common errors beginners make', b: `• **SyntaxError** — breaking the grammar rules, e.g. missing colon after if, unclosed bracket.
• **IndentationError** — inconsistent spaces inside a block.
• **NameError** — using a variable before creating it or misspelling it (Print instead of print).
• **TypeError** — mixing incompatible types, e.g. "Age: " + 15.
• **ValueError** — e.g. int("abc").
Read the last line of the error message first — it names the error and the line number.` },
      { h: 'Comments and docstrings', b: `~~~
# This is a single-line comment
speed = 100   # comment after code

"""
A multi-line string is often used
as a block comment or docstring.
"""
~~~
Comments explain **why** the code does something. Practical marking gives credit for documentation, so comment your programs.` },
    ],
    exam: {
      short: [
        { q: 'What are keywords? Give four examples.', a: 'Reserved words with a fixed meaning in Python that cannot be used as identifiers, e.g. if, while, def, return (also for, True, None, import).' },
        { q: 'Differentiate between interactive mode and script mode.', a: 'Interactive mode runs one statement at a time at the >>> prompt and shows the result immediately (good for testing); script mode runs a whole program saved in a .py file (used for real programs that can be saved and reused).' },
        { q: 'Why is indentation important in Python?', a: 'Python uses indentation (usually 4 spaces) instead of braces to mark which statements belong to a block (if, for, def). Wrong indentation causes an IndentationError or changes the logic.' },
      ],
      long: [
        { q: 'Explain the different types of tokens in Python with examples.', a: 'Keywords — reserved words (if, for, def). Identifiers — user-defined names (speed, total_marks). Literals — constant values (10, 2.5, "robot", True). Operators — perform operations (+, *, ==, and). Punctuators — structure the code ( ( ), [ ], :, , ).' },
        { q: 'Name and explain any four types of errors in Python with an example of each.', a: 'SyntaxError — "if x > 5" without a colon. IndentationError — body of an if not indented. NameError — print(totl) when the variable is total. TypeError — "Age " + 15. (Also ValueError — int("abc"); ZeroDivisionError — 5/0.)' },
      ],
    },
  },

  c9_p_3: {
    figs: ['pythonTypes'],
    sections: [
      { h: 'Mutable and immutable types', b: `• **Immutable** (cannot be changed after creation): int, float, complex, bool, str, tuple.
• **Mutable** (can be changed in place): list, dict, set.
~~~
name = "robo"
# name[0] = "R"    → TypeError: str does not support item assignment
parts = ["motor", "wheel"]
parts[0] = "servo"  # OK, lists are mutable
~~~` },
      { h: 'Implicit and explicit type conversion', b: `• **Implicit conversion** — Python converts automatically when safe: 5 + 2.0 gives 7.0 (int becomes float).
• **Explicit conversion (type casting)** — you convert using a function:
~~~
int("42")      # 42
float("3.5")   # 3.5
str(100)       # '100'
int(7.9)       # 7  (decimal part is cut off, not rounded)
bool(0)        # False ; bool(5) → True ; bool("") → False
~~~` },
      { h: 'Choosing the right type for robot data', b: `• Number of sensors → **int**
• Temperature 36.6 °C → **float**
• Robot name → **str**
• Is the motor on? → **bool**
• Ten distance readings in order → **list**
• A fixed GPS coordinate (lat, long) → **tuple**
• Settings like {"speed": 120, "mode": "auto"} → **dict**
• Unique colours seen → **set**` },
    ],
    exam: {
      short: [
        { q: 'What will type(7/2) return? Why?', a: "<class 'float'> — the / operator always gives a float (3.5)." },
        { q: 'Give two mutable and two immutable data types.', a: 'Mutable: list, dict (also set). Immutable: int, str (also float, tuple, bool).' },
        { q: 'What is the output of int(9.99) and bool("")?', a: '9 and False.' },
      ],
      long: [
        { q: 'Explain the built-in data types of Python with one example each.', a: 'int — 25; float — 3.14; complex — 2+3j; str — "robot"; bool — True; list — [1, 2, 3]; tuple — (10, 20); range — range(5); dict — {"name": "Atlas"}; set — {1, 2, 3}.' },
        { q: 'Differentiate between implicit and explicit type conversion with examples.', a: 'Implicit: Python converts automatically, e.g. 3 + 4.5 → 7.5 (int to float). Explicit: the programmer converts using a function, e.g. int("12") → 12, str(5) → "5". Explicit conversion is needed for input() values used in calculations.' },
      ],
    },
  },

  c9_p_4: {
    figs: ['pythonMemory'],
    sections: [
      { h: 'How assignment really works', b: `In Python, a variable is a **name that refers to an object** in memory. x = 10 creates an int object 10 and points the name x at it. Writing y = x makes y point to the **same** object. You can see an object's identity with id(x).

~~~
x = 10
y = x
print(id(x) == id(y))   # True
x = 20                  # x now points to a new object; y is still 10
~~~` },
      { h: 'Valid and invalid identifiers', b: `Valid: total_marks, _count, sensor2, RobotName
Invalid:
• 2sensor — starts with a digit
• robot-name — hyphen not allowed
• my name — space not allowed
• for — keyword
• @speed — special character` },
      { h: 'Swapping and multiple assignment', b: `~~~
a, b = 5, 9
a, b = b, a       # swap in one line
print(a, b)       # 9 5
x = y = z = 0     # same value to many variables
~~~` },
      { h: 'Local and global scope', b: `~~~
speed = 50          # global

def boost():
    speed = 80      # local – a new variable inside the function
    print(speed)    # 80

boost()
print(speed)        # 50 – global is unchanged
~~~
To change a global variable inside a function, declare it with the keyword **global** — but it is better to pass values as parameters and return results.` },
    ],
    exam: {
      short: [
        { q: 'State any three rules for naming a variable in Python.', a: 'Must begin with a letter or underscore; may contain only letters, digits and underscores; cannot be a keyword (also: case-sensitive, no spaces).' },
        { q: 'Which of these are invalid identifiers: total, 2nd_value, _x, my-name, while?', a: '2nd_value (starts with digit), my-name (hyphen), while (keyword).' },
        { q: 'Write one statement to swap the values of a and b.', a: 'a, b = b, a' },
      ],
      long: [
        { q: 'What is dynamic typing? Explain with an example and state one advantage and one disadvantage.', a: 'In dynamic typing the type is decided at run time from the value, and a variable can later hold a different type: x = 5 (int) then x = "five" (str). Advantage: quicker, shorter code. Disadvantage: type mistakes appear only when the program runs.' },
        { q: 'Explain local and global variables with a program.', a: 'A global variable is created outside functions and can be read anywhere; a local variable is created inside a function and exists only there. Example: speed = 50 globally; inside def boost(): speed = 80; print(speed) prints 80; after calling, print(speed) outside prints 50 because the local speed did not change the global one.' },
      ],
    },
  },

  c9_p_5: {
    figs: ['operatorPrecedence'],
    sections: [
      { h: 'Identity operators: is, is not', b: `Identity operators check whether two names refer to the **same object** in memory, not just equal values.
~~~
a = [1, 2]
b = [1, 2]
c = a
print(a == b)    # True  – same values
print(a is b)    # False – two different lists
print(a is c)    # True  – c points to the same list
print(a is not b) # True
~~~
Use == to compare values; use is mainly to check for None: if result is None:` },
      { h: 'Membership operators: in, not in', b: `~~~
"bot" in "robot"            # True
5 in [1, 3, 5]              # True
"red" not in ("green", "blue")   # True
"speed" in {"speed": 10}    # True – checks dictionary keys
~~~` },
      { h: 'Worked examples on precedence', b: `Evaluate step by step:
~~~
10 + 3 * 2 ** 2     → 10 + 3 * 4 → 10 + 12 → 22
(10 + 3) * 2        → 26
17 // 5 + 17 % 5    → 3 + 2 → 5
not 5 > 3 and 2 < 1 → not True and False → False and False → False
-7 // 2             → -4  (floor division rounds down)
~~~
Exponent ** is evaluated **right to left**: 2 ** 3 ** 2 = 2 ** 9 = 512.` },
      { h: 'Using operators in robotics code', b: `~~~
distance = 35
battery = 18
if distance > 20 and battery >= 15:
    print("Drive forward")
heading = (heading + 90) % 360    # keep angle between 0 and 359
is_even_tick = tick % 2 == 0
~~~` },
    ],
    exam: {
      short: [
        { q: 'Evaluate: 15 // 4 + 15 % 4 * 2', a: '15 // 4 = 3; 15 % 4 = 3; 3 * 2 = 6; 3 + 6 = 9.' },
        { q: 'Differentiate between == and is.', a: '== checks whether two values are equal; is checks whether two names refer to the same object in memory.' },
        { q: 'What is the output of print("I" in "AI", 2 ** 3 ** 2)?', a: 'True 512' },
      ],
      long: [
        { q: 'Explain arithmetic, relational, logical, assignment, identity and membership operators with one example each.', a: 'Arithmetic: 7 % 3 → 1. Relational: 5 >= 3 → True. Logical: True and False → False. Assignment: x += 5. Identity: a is b. Membership: "a" in "cat" → True.' },
        { q: 'Write a program that accepts a number and prints whether it is even or odd and whether it is a multiple of 5, using operators.', a: '~~~\nn = int(input("Enter a number: "))\nif n % 2 == 0:\n    print(n, "is even")\nelse:\n    print(n, "is odd")\nif n % 5 == 0:\n    print(n, "is a multiple of 5")\n~~~' },
      ],
    },
  },

  c9_p_6: {
    figs: ['ifElseFlow'],
    sections: [
      { h: 'The forms of the if statement', b: `**1. Simple if**
~~~
if temp > 30:
    print("Fan ON")
~~~
**2. if-else**
~~~
if marks >= 33:
    print("Pass")
else:
    print("Fail")
~~~
**3. if-elif-else ladder** — checks conditions in order and runs only the first True block:
~~~
if marks >= 90:
    grade = "A"
elif marks >= 75:
    grade = "B"
elif marks >= 50:
    grade = "C"
else:
    grade = "D"
~~~
**4. Nested if** — an if inside another if:
~~~
if age >= 18:
    if has_licence:
        print("Can drive")
    else:
        print("Get a licence first")
~~~
**5. Shorthand (ternary) if**
~~~
result = "Pass" if marks >= 33 else "Fail"
if speed > 100: print("Too fast")     # one-line if
~~~` },
      { h: 'Programs you should be able to write', b: `Largest of three numbers:
~~~
a, b, c = 12, 45, 30
if a >= b and a >= c:
    print("Largest:", a)
elif b >= c:
    print("Largest:", b)
else:
    print("Largest:", c)
~~~
Leap year:
~~~
y = int(input("Year: "))
if (y % 4 == 0 and y % 100 != 0) or y % 400 == 0:
    print("Leap year")
else:
    print("Not a leap year")
~~~` },
    ],
    exam: {
      short: [
        { q: 'What is the purpose of elif?', a: 'To check another condition when the previous if/elif conditions are False; it avoids writing deeply nested if-else.' },
        { q: 'Rewrite using the ternary form: if x > 0: s = "positive" else: s = "not positive"', a: 's = "positive" if x > 0 else "not positive"' },
        { q: 'What is a nested if?', a: 'An if statement placed inside the body of another if or else block, used when a second condition must be checked only after the first is true.' },
      ],
      long: [
        { q: 'Write a program to input the marks of a student and print the grade: ≥90 A, 75–89 B, 50–74 C, 33–49 D, below 33 Fail.', a: '~~~\nm = float(input("Marks: "))\nif m >= 90:\n    print("A")\nelif m >= 75:\n    print("B")\nelif m >= 50:\n    print("C")\nelif m >= 33:\n    print("D")\nelse:\n    print("Fail")\n~~~' },
        { q: 'Write a program for a robot that reads distance and battery level: if distance < 15 print "Stop", else if battery < 20 print "Return to charge", otherwise print "Move forward". Draw its flowchart.', a: '~~~\nd = int(input("Distance (cm): "))\nb = int(input("Battery (%): "))\nif d < 15:\n    print("Stop")\nelif b < 20:\n    print("Return to charge")\nelse:\n    print("Move forward")\n~~~\nFlowchart: Start → input d, b → decision d < 15? Yes → "Stop"; No → decision b < 20? Yes → "Return to charge"; No → "Move forward" → End.' },
      ],
    },
  },

  c9_p_7: {
    figs: ['loopFlow'],
    sections: [
      { h: 'for loop vs while loop', b: `• Use **for** when you know how many times to repeat, or want to go through each item of a sequence.
• Use **while** when you repeat **until a condition changes** and don't know the count in advance (e.g. until the sensor sees a wall).

~~~
for i in range(1, 6):        # 1 to 5
    print(i * i)

n = 1
while n <= 5:
    print(n * n)
    n += 1
~~~
Both print the squares 1, 4, 9, 16, 25.` },
      { h: 'break, continue and pass in action', b: `~~~
for n in range(1, 11):
    if n == 7:
        break          # stop the loop completely at 7
    if n % 2 == 0:
        continue       # skip even numbers
    print(n)           # prints 1 3 5
~~~
~~~
for sensor in ["IR", "ultrasonic"]:
    pass               # placeholder: code to be written later
~~~
**else with loops:** a for or while loop can have an else block that runs only if the loop finished **without** a break.` },
      { h: 'Nested loops and patterns', b: `~~~
for row in range(1, 4):
    for col in range(row):
        print("*", end=" ")
    print()
~~~
Output:
~~~
*
* *
* * *
~~~
Multiplication table of 7:
~~~
for i in range(1, 11):
    print(7, "x", i, "=", 7 * i)
~~~` },
      { h: 'Common loop programs for exams', b: `Sum of digits:
~~~
n = 4572
total = 0
while n > 0:
    total += n % 10
    n //= 10
print(total)    # 18
~~~
Factorial:
~~~
n = 5
fact = 1
for i in range(1, n + 1):
    fact *= i
print(fact)     # 120
~~~` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between break and continue.', a: 'break exits the loop completely; continue skips the rest of the current iteration and goes to the next one.' },
        { q: 'How many times will this run: for i in range(3, 15, 4)?', a: '3 times — i = 3, 7, 11.' },
        { q: 'What is an infinite loop? Give an example.', a: 'A loop whose condition never becomes False, e.g. while True: without a break, or a while loop that forgets to update its counter.' },
      ],
      long: [
        { q: 'Write a program to print the sum of all even numbers from 1 to 50 using (a) a for loop (b) a while loop.', a: '(a)\n~~~\ns = 0\nfor i in range(2, 51, 2):\n    s += i\nprint(s)\n~~~\n(b)\n~~~\ns, i = 0, 2\nwhile i <= 50:\n    s += i\n    i += 2\nprint(s)\n~~~\nBoth print 650.' },
        { q: 'Write a program to check whether a number is prime.', a: '~~~\nn = int(input("Number: "))\nif n < 2:\n    print("Not prime")\nelse:\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            print("Not prime")\n            break\n    else:\n        print("Prime")\n~~~\nThe else of the for loop runs only when no divisor was found (no break).' },
      ],
    },
  },

  c9_p_8: {
    figs: ['functionAnatomy'],
    sections: [
      { h: 'Built-in vs user-defined functions', b: `• **Built-in functions** come with Python: print(), input(), len(), type(), int(), float(), str(), max(), min(), sum(), abs(), round(), range().
• **User-defined functions** are written by you with **def**.
~~~
print(max(4, 9, 2), round(3.567, 2), abs(-7))   # 9 3.57 7
~~~` },
      { h: 'Types of arguments', b: `**Positional (fixed) arguments** — matched by position:
~~~
def area(l, b):
    return l * b
print(area(5, 3))      # 15
~~~
**Default arguments** — a value used when none is given (defaults must come after non-default parameters):
~~~
def move(speed=50, direction="forward"):
    print("Moving", direction, "at", speed)
move()                 # Moving forward at 50
move(80)               # Moving forward at 80
move(30, "left")
~~~
**Keyword arguments** — named in the call, any order:
~~~
move(direction="back", speed=20)
~~~
**Variable-length arguments (*args)** — accept any number of values as a tuple:
~~~
def total(*marks):
    return sum(marks)
print(total(80, 75, 92))   # 247
~~~` },
      { h: 'Return values', b: `return sends a value back and **ends** the function. A function without return gives **None**. A function can return several values (as a tuple):
~~~
def stats(nums):
    return min(nums), max(nums), sum(nums) / len(nums)
lo, hi, avg = stats([12, 18, 30])
print(lo, hi, avg)    # 12 30 20.0
~~~` },
      { h: 'Why use functions?', b: `• **Reusability** — write once, call many times.
• **Modularity** — split a big program into small, understandable pieces (move_forward, turn_left, read_distance).
• **Easier debugging and testing** — test each function separately.
• **Avoid repetition** — fewer lines, fewer mistakes.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a parameter and an argument.', a: 'A parameter is the variable in the function definition (def f(x)); an argument is the actual value passed when calling the function (f(5)).' },
        { q: 'What is a default argument? Give an example.', a: 'A parameter with a value given in the definition that is used if no argument is passed, e.g. def greet(name="Robot"):' },
        { q: 'What does a function return if it has no return statement?', a: 'None.' },
      ],
      long: [
        { q: 'Write a function to find the factorial of a number and use it to print factorials of 1 to 5.', a: '~~~\ndef factorial(n):\n    f = 1\n    for i in range(1, n + 1):\n        f *= i\n    return f\n\nfor k in range(1, 6):\n    print(k, factorial(k))\n~~~' },
        { q: 'Explain positional, default, keyword and variable-length arguments with examples.', a: 'Positional: matched in order — area(5, 3). Default: has a preset value — def move(speed=50); move() uses 50. Keyword: named in the call — move(speed=20). Variable-length: *args collects any number of values into a tuple — def total(*m): return sum(m); total(1, 2, 3) → 6.' },
      ],
    },
  },
};
