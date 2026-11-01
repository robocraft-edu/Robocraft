// Ready-made Python projects, used when the AI helper is unavailable and as a
// tested fallback if its code does not run. Every one of these was run with its
// sample input before being added, and none needs the internet or a library.
export const PY_TEMPLATES = [
  {
    "id": "calculator",
    "re": "calculat|arithmetic|maths? tool|add.*subtract|operator",
    "title": "Pocket Calculator",
    "summary": "Asks for two numbers and shows what every arithmetic operator does to them.",
    "code": "# Pocket Calculator: one program that shows every arithmetic operator\na = float(input(\"Enter the first number: \"))\nb = float(input(\"Enter the second number: \"))\n\nprint(\"--- Results ---\")\nprint(\"Addition       a + b  =\", a + b)\nprint(\"Subtraction    a - b  =\", a - b)\nprint(\"Multiplication a * b  =\", a * b)\n\nif b != 0:\n    print(\"Division       a / b  =\", a / b)\n    print(\"Floor division a // b =\", a // b)\n    print(\"Remainder      a % b  =\", a % b)\nelse:\n    print(\"Cannot divide by zero!\")\n\nprint(\"Power          a ** 2 =\", a ** 2)\nprint(\"Is a bigger than b?\", a > b)\n",
    "sample": "12\n5\n",
    "concepts": [
      {
        "name": "Variables",
        "explain": "a and b are names that store the numbers the user typed."
      },
      {
        "name": "Type conversion",
        "explain": "input() gives text, so float() turns it into a number we can calculate with."
      },
      {
        "name": "Operators",
        "explain": "Each of + - * / // % ** is a different calculation. Run the program with different numbers to watch them change."
      },
      {
        "name": "Conditions",
        "explain": "The if/else stops the program from dividing by zero, which would crash it."
      }
    ],
    "next": [
      "Add a menu: let the user choose which operation to run.",
      "Show the average of a and b.",
      "Ask for a third number and print the biggest of the three."
    ],
    "real": "Every calculator, spreadsheet and game score counter is built from these same operators."
  },
  {
    "id": "marks",
    "re": "marks|grade|result|report card|percent|average|student|score card",
    "title": "Marks and Grade Calculator",
    "summary": "Adds up subject marks, finds the percentage and gives a grade.",
    "code": "# Marks and Grade Calculator (5 subjects, 100 marks each)\nsubjects = [\"English\", \"Maths\", \"Science\", \"Social Studies\", \"Computer\"]\nmarks = []\n\nfor name in subjects:\n    m = int(input(\"Marks in \" + name + \": \"))\n    marks.append(m)\n\ntotal = sum(marks)\npercentage = total / (len(subjects) * 100) * 100\n\nprint(\"Total marks:\", total, \"out of\", len(subjects) * 100)\nprint(\"Percentage:\", round(percentage, 2), \"%\")\nprint(\"Highest:\", max(marks), \" Lowest:\", min(marks))\n\nif percentage >= 90:\n    grade = \"A+\"\nelif percentage >= 75:\n    grade = \"A\"\nelif percentage >= 60:\n    grade = \"B\"\nelif percentage >= 40:\n    grade = \"C\"\nelse:\n    grade = \"Needs improvement\"\n\nprint(\"Grade:\", grade)\nif percentage >= 40 and min(marks) >= 33:\n    print(\"Result: PASS\")\nelse:\n    print(\"Result: FAIL\")\n",
    "sample": "78\n85\n64\n91\n70\n",
    "concepts": [
      {
        "name": "Lists",
        "explain": "subjects holds the names; marks starts empty and grows with append()."
      },
      {
        "name": "for loop",
        "explain": "Repeats the question once per subject, so we do not write five copies of the same lines."
      },
      {
        "name": "if / elif / else",
        "explain": "Checks the percentage from the highest grade downwards and stops at the first one that is True."
      },
      {
        "name": "Logical and",
        "explain": "PASS needs BOTH conditions to be True: enough percentage AND no subject below 33."
      }
    ],
    "next": [
      "Show which subject has the highest marks by name.",
      "Ask how many subjects there are instead of fixing it at five.",
      "Add a weighted total where Maths counts double."
    ],
    "real": "School software, online exam portals and fitness trackers all turn raw numbers into a grade or a level like this."
  },
  {
    "id": "guess",
    "re": "guess|number game|game|lucky|dice|random",
    "title": "Number Guessing Game",
    "summary": "The computer picks a secret number and gives hints until you find it.",
    "code": "# Number Guessing Game\nimport random\n\nrandom.seed(4)                       # fixes the \"random\" number so every run is the same\nsecret = random.randint(1, 100)      # the computer's secret number\ntries = 0\nfound = False\n\nprint(\"I am thinking of a number from 1 to 100.\")\n\nwhile not found:\n    guess = int(input(\"Your guess: \"))\n    tries += 1\n    if guess < secret:\n        print(\"Too low, go higher.\")\n    elif guess > secret:\n        print(\"Too high, go lower.\")\n    else:\n        found = True\n        print(\"Correct! You got it in\", tries, \"tries.\")\n\nif tries <= 7:\n    print(\"Brilliant: halving the range each time wins quickly.\")\n",
    "sample": "50\n25\n37\n31\n",
    "concepts": [
      {
        "name": "The random module",
        "explain": "randint(1, 100) picks a whole number between 1 and 100. seed() makes it repeatable so you can study the program."
      },
      {
        "name": "while loop",
        "explain": "Keeps asking until found becomes True. The loop condition is checked before every round."
      },
      {
        "name": "Counters",
        "explain": "tries += 1 adds one every round: a counter is just a variable you keep increasing."
      },
      {
        "name": "Binary search idea",
        "explain": "Guessing the middle each time halves the possibilities. That is how computers search fast."
      }
    ],
    "next": [
      "Let the user choose the range.",
      "Stop after 7 tries and reveal the number.",
      "Remove random.seed(4) and play a different game every time."
    ],
    "real": "Games, lotteries and simulations all need random numbers; searching by halving is used in databases and phone contacts."
  },
  {
    "id": "temperature",
    "re": "temperature|celsius|fahrenheit|convert|unit|currency|conversion|table",
    "title": "Temperature Converter Table",
    "summary": "Converts Celsius to Fahrenheit and Kelvin and prints a neat table.",
    "code": "# Temperature Converter Table\n# Formulas: F = C * 9/5 + 32      K = C + 273.15\nprint(\"  Celsius | Fahrenheit | Kelvin\")\nprint(\"-\" * 32)\n\nfor c in range(0, 101, 20):\n    f = c * 9 / 5 + 32\n    k = c + 273.15\n    print(f\"{c:9} | {f:10.1f} | {k:6.2f}\")\n\nprint()\nboiling = 100\nif boiling > 99:\n    print(\"Water boils at\", boiling, \"C =\", boiling * 9 / 5 + 32, \"F\")\n",
    "sample": "",
    "concepts": [
      {
        "name": "Formulas as code",
        "explain": "The physics formula F = C x 9/5 + 32 is written almost exactly the same way in Python."
      },
      {
        "name": "range(start, stop, step)",
        "explain": "range(0, 101, 20) counts 0, 20, 40 ... 100: it stops before 101."
      },
      {
        "name": "f-strings",
        "explain": "The f before the quote lets { } hold a variable; :10.1f means \"10 characters wide, 1 decimal place\"."
      },
      {
        "name": "String repetition",
        "explain": "\"-\" * 32 repeats the dash 32 times to draw a line."
      }
    ],
    "next": [
      "Ask the user for the start, stop and step.",
      "Add a column for Rankine (R = K x 9/5).",
      "Convert kilometres to miles with a second table."
    ],
    "real": "Weather apps, thermostats and lab sensors constantly convert between units with formulas like these."
  },
  {
    "id": "quiz",
    "re": "quiz|question|trivia|mcq|test|exam",
    "title": "Quiz Game",
    "summary": "Asks questions from a list, checks the answers and keeps score.",
    "code": "# Quiz Game with a score\nquestions = [\n    {\"q\": \"What is the capital of France?\", \"a\": \"paris\"},\n    {\"q\": \"What is 2 + 2?\", \"a\": \"4\"},\n    {\"q\": \"Which animal is the king of the jungle?\", \"a\": \"lion\"},\n]\nscore = 0\n\nfor item in questions:\n    answer = input(item[\"q\"] + \" \").strip().lower()\n    if answer == item[\"a\"]:\n        print(\"Correct!\")\n        score += 1\n    else:\n        print(\"Not quite. The answer is\", item[\"a\"])\n\nprint(\"You scored\", score, \"out of\", len(questions))\npercent = score / len(questions) * 100\nprint(\"That is\", round(percent), \"%\")\n",
    "sample": "paris\n4\nlion\n",
    "concepts": [
      {
        "name": "Dictionaries",
        "explain": "Each question is a dictionary: item[\"q\"] looks up the question, item[\"a\"] the answer."
      },
      {
        "name": "List of dictionaries",
        "explain": "A list of similar records is how most real data is stored."
      },
      {
        "name": "String methods",
        "explain": "strip() removes spaces and lower() makes letters small, so \"Paris \" still matches \"paris\"."
      },
      {
        "name": "== versus =",
        "explain": "== compares two values (True/False). A single = only stores a value."
      }
    ],
    "next": [
      "Add five more questions about your favourite subject.",
      "Give 2 points for a correct answer and -1 for a wrong one.",
      "Shuffle the questions with random.shuffle(questions)."
    ],
    "real": "Online exams, Duolingo-style apps and school portals all store questions as records and mark answers like this."
  },
  {
    "id": "bank",
    "re": "bank|atm|account|wallet|money|deposit|balance|savings",
    "title": "Bank Account Simulator",
    "summary": "A BankAccount class with deposit, withdraw and a balance that can never go wrong.",
    "code": "# Bank Account Simulator using a class\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount > 0:\n            self.balance += amount\n            print(\"Deposited\", amount, \"-> balance\", self.balance)\n        else:\n            print(\"Deposit must be positive.\")\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print(\"Not enough money! Balance is only\", self.balance)\n        else:\n            self.balance -= amount\n            print(\"Withdrew\", amount, \"-> balance\", self.balance)\n\n    def add_interest(self, rate):\n        interest = self.balance * rate / 100\n        self.balance += interest\n        print(\"Interest of\", interest, \"added -> balance\", self.balance)\n\naccount = BankAccount(\"Asha\", 1000)\naccount.deposit(500)\naccount.withdraw(200)\naccount.withdraw(5000)\naccount.add_interest(4)\nprint(account.owner, \"has\", account.balance)\n",
    "sample": "",
    "concepts": [
      {
        "name": "Classes and objects",
        "explain": "BankAccount is a blueprint; account is one real account made from it."
      },
      {
        "name": "__init__ and self",
        "explain": "__init__ sets up a new account. self means \"this particular account\"."
      },
      {
        "name": "Methods",
        "explain": "deposit, withdraw and add_interest are functions that belong to the class and change self.balance."
      },
      {
        "name": "Protecting data with if",
        "explain": "The checks stop negative deposits and overdrawn withdrawals."
      }
    ],
    "next": [
      "Add a transfer(other_account, amount) method.",
      "Keep a list of every transaction and print a statement.",
      "Make a SavingsAccount that cannot be overdrawn at all."
    ],
    "real": "Banking, wallets and game inventories all model things as objects with data and rules."
  },
  {
    "id": "prime",
    "re": "prime|even|odd|factor|fibonacci|series|pattern|number",
    "title": "Prime Number Finder",
    "summary": "Finds all prime numbers up to a limit, and tells you which numbers are even or odd.",
    "code": "# Prime Number Finder\nlimit = int(input(\"Find primes up to: \"))\nprimes = []\n\nfor n in range(2, limit + 1):\n    is_prime = True\n    for d in range(2, n):\n        if n % d == 0:          # divides exactly, so n is not prime\n            is_prime = False\n            break\n    if is_prime:\n        primes.append(n)\n\nprint(\"Primes up to\", limit, \":\", primes)\nprint(\"There are\", len(primes), \"of them.\")\n\nevens = 0\nfor n in range(1, limit + 1):\n    if n % 2 == 0:\n        evens += 1\nprint(\"Even numbers:\", evens, \" Odd numbers:\", limit - evens)\n",
    "sample": "30\n",
    "concepts": [
      {
        "name": "Modulus %",
        "explain": "n % d == 0 means d divides n exactly with nothing left over: the key test for primes and for even numbers."
      },
      {
        "name": "Nested loops",
        "explain": "The inner loop tries every divisor for each number in the outer loop."
      },
      {
        "name": "Flag variables",
        "explain": "is_prime starts True and flips to False the moment a divisor is found."
      },
      {
        "name": "break",
        "explain": "Stops the inner loop early because one divisor is enough to prove a number is not prime."
      }
    ],
    "next": [
      "Make it faster: only test divisors up to the square root (use ** 0.5).",
      "Print the first 10 Fibonacci numbers.",
      "Find perfect numbers (equal to the sum of their divisors)."
    ],
    "real": "Prime numbers protect online payments: RSA encryption depends on them being hard to find in huge numbers."
  },
  {
    "id": "robot",
    "re": "robot|sensor|arduino|obstacle|distance|drive|car|line",
    "title": "Robot Obstacle Simulator",
    "summary": "Simulates the readings of a distance sensor and decides how a robot should move.",
    "code": "# Robot Obstacle Simulator\n# Each number is a distance (in cm) measured by an ultrasonic sensor.\nreadings = [120, 85, 60, 35, 18, 12, 40, 90, 150]\nposition = 0\nturns = 0\n\nfor distance in readings:\n    if distance < 15:\n        action = \"STOP and reverse\"\n    elif distance < 30:\n        action = \"TURN away\"\n        turns += 1\n    elif distance >= 100:\n        action = \"SPEED UP\"\n        position += 2\n    else:\n        action = \"GO forward\"\n        position += 1\n    print(f\"Distance {distance:3} cm -> {action}\")\n\nprint(\"Distance travelled (units):\", position)\nprint(\"Turns made:\", turns)\n\nclosest = min(readings)\nprint(\"Closest obstacle:\", closest, \"cm\")\nif closest < 15 and turns > 0:\n    print(\"The robot needed both a turn and a stop.\")\n",
    "sample": "",
    "concepts": [
      {
        "name": "Sensor readings in a list",
        "explain": "A list is how we store a stream of measurements."
      },
      {
        "name": "Decision making",
        "explain": "if / elif / else is exactly how a real robot sketch chooses its action from a sensor value."
      },
      {
        "name": "Comparison operators",
        "explain": "<, >= and == turn a measurement into True or False so the robot can choose."
      },
      {
        "name": "Accumulators",
        "explain": "position += 1 and turns += 1 keep a running total as the loop goes round."
      }
    ],
    "next": [
      "Make the thresholds variables so they are easy to tune.",
      "Use random.randint(5, 150) to create 20 readings.",
      "Draw the readings as a chart with matplotlib."
    ],
    "real": "The same if/elif ladder is inside every line-follower and obstacle-avoiding robot (Arduino C++ uses almost identical logic)."
  },
  {
    "id": "bill",
    "re": "bill|shop|billing|invoice|gst|tax|store|cart|market|price|cashier",
    "title": "Shop Bill with GST",
    "summary": "Adds up the price of items, applies a discount and GST and prints a bill.",
    "code": "# Shop Bill with discount and GST\nitems = [(\"Notebook\", 3, 45), (\"Pen\", 5, 10), (\"Geometry box\", 1, 120), (\"Marker\", 2, 35)]\nGST_RATE = 18            # percent\nsubtotal = 0\n\nprint(\"Item            Qty   Price   Amount\")\nprint(\"-\" * 38)\nfor name, qty, price in items:\n    amount = qty * price\n    subtotal += amount\n    print(f\"{name:14} {qty:4} {price:7} {amount:8}\")\n\ndiscount = 0\nif subtotal > 300:\n    discount = subtotal * 10 / 100       # 10% off big bills\n\ntaxable = subtotal - discount\ngst = taxable * GST_RATE / 100\ntotal = taxable + gst\n\nprint(\"-\" * 38)\nprint(\"Subtotal :\", subtotal)\nprint(\"Discount :\", discount)\nprint(\"GST 18%  :\", round(gst, 2))\nprint(\"TOTAL    :\", round(total, 2))\n",
    "sample": "",
    "concepts": [
      {
        "name": "Tuples in a list",
        "explain": "Each item is (name, quantity, price). The for loop unpacks the three parts into name, qty, price."
      },
      {
        "name": "Constants",
        "explain": "GST_RATE is written in capitals by convention: a value that should never change."
      },
      {
        "name": "Percentages",
        "explain": "x * rate / 100 is how every discount, tax and interest is worked out."
      },
      {
        "name": "Accumulating",
        "explain": "subtotal += amount adds each line to a running total."
      }
    ],
    "next": [
      "Ask the user to type in the items instead.",
      "Use different GST rates for different items.",
      "Print the bill into a neat table with a total line."
    ],
    "real": "Every shop, canteen and e-commerce checkout does exactly this: quantity x price, discount, tax, total."
  },
  {
    "id": "chatbot",
    "re": "chat|bot|assistant|talk|reply|greet|hello|conversation",
    "title": "Simple Chatbot",
    "summary": "A chatbot that recognises keywords in what you type and replies.",
    "code": "# Simple Chatbot: replies by looking for keywords\nprint(\"RoboBuddy: Hi! Ask me about robots or Python. Type bye to leave.\")\nchatting = True\n\nwhile chatting:\n    text = input(\"You: \").lower()\n    if \"bye\" in text:\n        print(\"RoboBuddy: Goodbye! Keep building.\")\n        chatting = False\n    elif \"hello\" in text or \"hi\" in text:\n        print(\"RoboBuddy: Hello there!\")\n    elif \"python\" in text:\n        print(\"RoboBuddy: Python is a friendly language used for AI, games and robots.\")\n    elif \"robot\" in text:\n        print(\"RoboBuddy: A robot senses, thinks and acts.\")\n    elif \"thanks\" in text:\n        print(\"RoboBuddy: You are welcome!\")\n    else:\n        print(\"RoboBuddy: I do not know that yet. Try asking about robots.\")\n",
    "sample": "hello\nwhat is python\nthanks\nbye\n",
    "concepts": [
      {
        "name": "Membership operator in",
        "explain": "\"bye\" in text is True when the word appears anywhere inside what the user typed."
      },
      {
        "name": "or",
        "explain": "hello or hi: either one is enough to trigger the greeting."
      },
      {
        "name": "Loop with a flag",
        "explain": "chatting stays True until the user says bye."
      },
      {
        "name": "lower()",
        "explain": "Converts the text to small letters so \"Hello\" and \"hello\" are treated the same."
      }
    ],
    "next": [
      "Teach it five more keywords.",
      "Store replies in a dictionary instead of a long if/elif.",
      "Make it remember your name."
    ],
    "real": "Customer-support bots started exactly like this: keyword matching, long before large language models."
  },
  {
    "id": "todo",
    "re": "todo|to-do|task|list|planner|schedule|homework|reminder|manager",
    "title": "To-Do List Manager",
    "summary": "Add, show and finish tasks with a simple menu.",
    "code": "# To-Do List Manager with a menu\ntasks = []\nrunning = True\n\nwhile running:\n    print()\n    print(\"1 Add   2 Show   3 Finish   4 Quit\")\n    choice = input(\"Choose: \")\n\n    if choice == \"1\":\n        title = input(\"New task: \")\n        tasks.append(title)\n        print(\"Added:\", title)\n    elif choice == \"2\":\n        if len(tasks) == 0:\n            print(\"Nothing to do!\")\n        for i, t in enumerate(tasks, start=1):\n            print(i, \"-\", t)\n    elif choice == \"3\":\n        number = int(input(\"Which number is done? \"))\n        if 1 <= number <= len(tasks):\n            done = tasks.pop(number - 1)\n            print(\"Finished:\", done)\n        else:\n            print(\"No such task.\")\n    elif choice == \"4\":\n        running = False\n        print(\"Bye! You still have\", len(tasks), \"task(s).\")\n    else:\n        print(\"Please choose 1 to 4.\")\n",
    "sample": "1\nFinish maths homework\n1\nBuild robot\n2\n3\n1\n2\n4\n",
    "concepts": [
      {
        "name": "Menu loop",
        "explain": "while running repeats the menu until the user picks Quit."
      },
      {
        "name": "List methods",
        "explain": "append() adds a task, pop() removes the one at a position."
      },
      {
        "name": "enumerate",
        "explain": "Gives the number and the task together while looping."
      },
      {
        "name": "Chained comparison",
        "explain": "1 <= number <= len(tasks) checks the number is in range in one go."
      }
    ],
    "next": [
      "Save the tasks to a file so they survive a restart.",
      "Add priorities: high, medium, low.",
      "Show only tasks that contain a search word."
    ],
    "real": "Task managers, shopping lists and kanban boards all store items and add/remove them from a list in this way."
  }
].map(t => ({ ...t, re: new RegExp(t.re, 'i') }));
