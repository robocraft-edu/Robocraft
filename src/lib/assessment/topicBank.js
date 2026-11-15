// Ready-made Python practical programs grouped by topic. Every one of them has
// been run with its sample input, so a file built from this bank never has an
// error in it. Used when the AI is unavailable or to top a file up.
const P = (topic, title, question, algorithm, code, input = '') => ({ topic, kind: 'python', title, question, algorithm, code, input });

export const TOPIC_WORDS = {
  ifelse: /\bif\b|else|elif|condition|decision|conditional/i,
  loops: /loop|\bfor\b|while|iteration|repeat|pattern|series/i,
  strings: /string|text|word|character|palindrome|vowel/i,
  lists: /\blist|array|sort|search|matrix/i,
  functions: /function|\bdef\b|module|recursion|recursive/i,
  dicts: /dictionar|\bdict\b|key.?value/i,
};

export const TOPIC_BANK = [
  // ───────── if / elif / else ─────────
  P('ifelse', 'Even or odd number', 'Write a program to input an integer and check whether it is even or odd.',
    ['Start.', 'Input an integer n.', 'If n % 2 == 0, print "Even"; otherwise print "Odd".', 'Stop.'],
    `n = int(input("Enter a number: "))
if n % 2 == 0:
    print(n, "is an Even number")
else:
    print(n, "is an Odd number")
`, '27'),
  P('ifelse', 'Positive, negative or zero', 'Write a program to input a number and print whether it is positive, negative or zero.',
    ['Start.', 'Input a number n.', 'If n > 0 print "Positive"; else if n < 0 print "Negative"; else print "Zero".', 'Stop.'],
    `n = float(input("Enter a number: "))
if n > 0:
    print("The number is Positive")
elif n < 0:
    print("The number is Negative")
else:
    print("The number is Zero")
`, '-8.5'),
  P('ifelse', 'Largest of three numbers', 'Write a program to input three numbers and print the largest of them using if-elif-else.',
    ['Start.', 'Input a, b and c.', 'If a >= b and a >= c, largest = a; else if b >= c, largest = b; else largest = c.', 'Print largest.', 'Stop.'],
    `a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
c = int(input("Enter third number: "))
if a >= b and a >= c:
    largest = a
elif b >= c:
    largest = b
else:
    largest = c
print("The largest number is", largest)
`, '45\n78\n12'),
  P('ifelse', 'Leap year checker', 'Write a program to input a year and check whether it is a leap year. (A year is a leap year if it is divisible by 400, or divisible by 4 but not by 100.)',
    ['Start.', 'Input year.', 'If (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0), print "Leap year"; else print "Not a leap year".', 'Stop.'],
    `year = int(input("Enter a year: "))
if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
    print(year, "is a Leap Year")
else:
    print(year, "is not a Leap Year")
`, '2024'),
  P('ifelse', 'Grade from percentage', 'Write a program to input the percentage of a student and print the grade: A (90 and above), B (75–89), C (60–74), D (40–59), Fail (below 40).',
    ['Start.', 'Input percentage p.', 'Use if-elif-else to choose the grade from the ranges.', 'Print the grade.', 'Stop.'],
    `p = float(input("Enter percentage: "))
if p >= 90:
    grade = "A"
elif p >= 75:
    grade = "B"
elif p >= 60:
    grade = "C"
elif p >= 40:
    grade = "D"
else:
    grade = "Fail"
print("Percentage:", p)
print("Grade:", grade)
`, '82.5'),
  P('ifelse', 'Electricity bill', 'Write a program to input the number of units consumed and calculate the electricity bill: first 100 units at ₹5 per unit, next 100 units at ₹7 per unit, and units above 200 at ₹10 per unit.',
    ['Start.', 'Input units.', 'If units <= 100, bill = units * 5.', 'Else if units <= 200, bill = 500 + (units - 100) * 7.', 'Else bill = 500 + 700 + (units - 200) * 10.', 'Print bill.', 'Stop.'],
    `units = int(input("Enter units consumed: "))
if units <= 100:
    bill = units * 5
elif units <= 200:
    bill = 100 * 5 + (units - 100) * 7
else:
    bill = 100 * 5 + 100 * 7 + (units - 200) * 10
print("Units consumed:", units)
print("Total bill: Rs", bill)
`, '265'),
  P('ifelse', 'Type of triangle', 'Write a program to input three sides of a triangle, check whether a triangle is possible, and if so print whether it is Equilateral, Isosceles or Scalene.',
    ['Start.', 'Input sides a, b, c.', 'If a + b > c and b + c > a and a + c > b, the triangle is possible; otherwise print "Not possible" and stop.', 'If a == b == c print "Equilateral"; else if any two sides are equal print "Isosceles"; else print "Scalene".', 'Stop.'],
    `a = int(input("Enter side a: "))
b = int(input("Enter side b: "))
c = int(input("Enter side c: "))
if a + b > c and b + c > a and a + c > b:
    if a == b == c:
        print("Equilateral triangle")
    elif a == b or b == c or a == c:
        print("Isosceles triangle")
    else:
        print("Scalene triangle")
else:
    print("A triangle is not possible with these sides")
`, '7\n7\n10'),
  P('ifelse', 'Discount on shopping', 'A shop gives a discount on the bill amount: 20% above ₹5000, 10% from ₹2000 to ₹5000 and 5% below ₹2000. Write a program to input the bill amount and print the discount and the amount to pay.',
    ['Start.', 'Input amount.', 'Choose rate = 20, 10 or 5 using if-elif-else.', 'discount = amount * rate / 100; net = amount - discount.', 'Print discount and net.', 'Stop.'],
    `amount = float(input("Enter bill amount: "))
if amount > 5000:
    rate = 20
elif amount >= 2000:
    rate = 10
else:
    rate = 5
discount = amount * rate / 100
net = amount - discount
print("Discount rate:", rate, "%")
print("Discount: Rs", discount)
print("Amount to pay: Rs", net)
`, '3600'),
  P('ifelse', 'Vowel or consonant', 'Write a program to input a single letter and check whether it is a vowel or a consonant.',
    ['Start.', 'Input a character ch and convert it to lower case.', 'If ch is not a letter, print "Not an alphabet".', 'Else if ch is in "aeiou", print "Vowel"; else print "Consonant".', 'Stop.'],
    `ch = input("Enter a letter: ").lower()
if not ch.isalpha() or len(ch) != 1:
    print("Please enter a single alphabet")
elif ch in "aeiou":
    print(ch, "is a Vowel")
else:
    print(ch, "is a Consonant")
`, 'E'),
  P('ifelse', 'Simple calculator', 'Write a menu-driven program to input two numbers and an operator (+, -, *, /) and print the result. Print a suitable message for division by zero or a wrong operator.',
    ['Start.', 'Input a, b and op.', 'If op is "+" add; if "-" subtract; if "*" multiply.', 'If op is "/", check b != 0 before dividing.', 'Otherwise print "Invalid operator".', 'Stop.'],
    `a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
op = input("Enter operator (+, -, *, /): ")
if op == "+":
    print("Result =", a + b)
elif op == "-":
    print("Result =", a - b)
elif op == "*":
    print("Result =", a * b)
elif op == "/":
    if b != 0:
        print("Result =", a / b)
    else:
        print("Division by zero is not allowed")
else:
    print("Invalid operator")
`, '24\n6\n/'),
  P('ifelse', 'Eligibility to vote', 'Write a program to input the age and citizenship (Y/N) of a person and print whether the person is eligible to vote (age 18 or more and an Indian citizen).',
    ['Start.', 'Input age and citizen.', 'If age >= 18 and citizen == "Y", print "Eligible"; else print the reason.', 'Stop.'],
    `age = int(input("Enter age: "))
citizen = input("Indian citizen? (Y/N): ").upper()
if age >= 18 and citizen == "Y":
    print("Eligible to vote")
elif citizen != "Y":
    print("Not eligible: only citizens can vote")
else:
    print("Not eligible: wait", 18 - age, "more year(s)")
`, '16\nY'),
  P('ifelse', 'Robot obstacle decision', 'A robot reads its front distance sensor (in cm). Write a program to input the distance and print the action: "STOP" if below 10 cm, "SLOW DOWN" from 10 to 30 cm, otherwise "MOVE FORWARD".',
    ['Start.', 'Input distance d.', 'If d < 10 print "STOP"; else if d <= 30 print "SLOW DOWN"; else print "MOVE FORWARD".', 'Stop.'],
    `d = float(input("Enter distance from obstacle (cm): "))
if d < 10:
    action = "STOP"
elif d <= 30:
    action = "SLOW DOWN"
else:
    action = "MOVE FORWARD"
print("Distance:", d, "cm")
print("Robot action:", action)
`, '22'),

  // ───────── loops ─────────
  P('loops', 'Multiplication table', 'Write a program to input a number and print its multiplication table up to 10.',
    ['Start.', 'Input n.', 'For i from 1 to 10: print n x i = n * i.', 'Stop.'],
    `n = int(input("Enter a number: "))
for i in range(1, 11):
    print(n, "x", i, "=", n * i)
`, '7'),
  P('loops', 'Factorial of a number', 'Write a program to input a number and find its factorial using a loop.',
    ['Start.', 'Input n.', 'Set fact = 1.', 'For i from 1 to n: fact = fact * i.', 'Print fact.', 'Stop.'],
    `n = int(input("Enter a number: "))
fact = 1
for i in range(1, n + 1):
    fact = fact * i
print("Factorial of", n, "is", fact)
`, '6'),
  P('loops', 'Sum of digits', 'Write a program to input a number and find the sum of its digits using a while loop.',
    ['Start.', 'Input n; set total = 0.', 'While n > 0: total = total + n % 10; n = n // 10.', 'Print total.', 'Stop.'],
    `n = int(input("Enter a number: "))
num = n
total = 0
while n > 0:
    total = total + n % 10
    n = n // 10
print("Sum of digits of", num, "is", total)
`, '45213'),
  P('loops', 'Fibonacci series', 'Write a program to print the first n terms of the Fibonacci series.',
    ['Start.', 'Input n; set a = 0, b = 1.', 'Repeat n times: print a; then a, b = b, a + b.', 'Stop.'],
    `n = int(input("How many terms? "))
a, b = 0, 1
for i in range(n):
    print(a, end=" ")
    a, b = b, a + b
print()
`, '10'),
  P('loops', 'Prime number check', 'Write a program to input a number and check whether it is a prime number.',
    ['Start.', 'Input n.', 'If n < 2, it is not prime.', 'Otherwise count divisors from 2 to n - 1; if any divides n, it is not prime.', 'Print the result.', 'Stop.'],
    `n = int(input("Enter a number: "))
prime = n >= 2
for i in range(2, n):
    if n % i == 0:
        prime = False
        break
if prime:
    print(n, "is a Prime number")
else:
    print(n, "is not a Prime number")
`, '29'),
  P('loops', 'Reverse a number and palindrome check', 'Write a program to input a number, reverse it and check whether it is a palindrome.',
    ['Start.', 'Input n; num = n; rev = 0.', 'While n > 0: rev = rev * 10 + n % 10; n = n // 10.', 'If rev == num print "Palindrome", else "Not a palindrome".', 'Stop.'],
    `n = int(input("Enter a number: "))
num = n
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n = n // 10
print("Reversed number:", rev)
if rev == num:
    print(num, "is a Palindrome number")
else:
    print(num, "is not a Palindrome number")
`, '12321'),
  P('loops', 'Right-angled star pattern', 'Write a program to input the number of rows and print a right-angled triangle of stars.',
    ['Start.', 'Input rows.', 'For i from 1 to rows: print "*" repeated i times.', 'Stop.'],
    `rows = int(input("Enter number of rows: "))
for i in range(1, rows + 1):
    print("* " * i)
`, '5'),
  P('loops', 'Armstrong number', 'Write a program to input a number and check whether it is an Armstrong number (the sum of its digits each raised to the number of digits equals the number, e.g. 153).',
    ['Start.', 'Input n; find the number of digits d.', 'total = sum of (digit ** d) for each digit.', 'If total == n print "Armstrong", else "Not Armstrong".', 'Stop.'],
    `n = int(input("Enter a number: "))
d = len(str(n))
total = 0
temp = n
while temp > 0:
    digit = temp % 10
    total += digit ** d
    temp //= 10
if total == n:
    print(n, "is an Armstrong number")
else:
    print(n, "is not an Armstrong number")
`, '153'),

  // ───────── strings ─────────
  P('strings', 'Count vowels and consonants', 'Write a program to input a sentence and count the vowels, consonants, digits and spaces in it.',
    ['Start.', 'Input text.', 'For each character: if it is a vowel add to vowels; else if it is a letter add to consonants; else if a digit add to digits; else if a space add to spaces.', 'Print the counts.', 'Stop.'],
    `text = input("Enter a sentence: ")
vowels = consonants = digits = spaces = 0
for ch in text:
    if ch.lower() in "aeiou":
        vowels += 1
    elif ch.isalpha():
        consonants += 1
    elif ch.isdigit():
        digits += 1
    elif ch == " ":
        spaces += 1
print("Vowels:", vowels)
print("Consonants:", consonants)
print("Digits:", digits)
print("Spaces:", spaces)
`, 'Robot 2 can sort 15 boxes'),
  P('strings', 'String palindrome', 'Write a program to input a word and check whether it is a palindrome (reads the same backwards), ignoring case.',
    ['Start.', 'Input word and convert to lower case.', 'rev = word reversed using slicing [::-1].', 'If word == rev print "Palindrome", else "Not a palindrome".', 'Stop.'],
    `word = input("Enter a word: ").lower()
rev = word[::-1]
if word == rev:
    print(word, "is a Palindrome")
else:
    print(word, "is not a Palindrome")
`, 'Madam'),
  P('strings', 'Title case and word count', 'Write a program to input a sentence and print it in title case, the number of words, and the longest word.',
    ['Start.', 'Input sentence.', 'words = sentence.split().', 'Print sentence.title(), len(words) and max(words, key=len).', 'Stop.'],
    `sentence = input("Enter a sentence: ")
words = sentence.split()
print("Title case:", sentence.title())
print("Number of words:", len(words))
print("Longest word:", max(words, key=len))
`, 'robots help us in everyday life'),
  P('strings', 'Character frequency', 'Write a program to input a word and print how many times each letter occurs.',
    ['Start.', 'Input word.', 'For each distinct letter (in order of first appearance), print the letter and word.count(letter).', 'Stop.'],
    `word = input("Enter a word: ").lower()
seen = ""
for ch in word:
    if ch not in seen:
        print(ch, "->", word.count(ch))
        seen += ch
`, 'programming'),

  // ───────── lists ─────────
  P('lists', 'Sum and average of a list', 'Write a program to input n numbers into a list and print their sum, average, largest and smallest.',
    ['Start.', 'Input n and then n numbers into a list.', 'Print sum(), the average, max() and min().', 'Stop.'],
    `n = int(input("How many numbers? "))
nums = []
for i in range(n):
    nums.append(int(input("Enter number: ")))
print("List:", nums)
print("Sum =", sum(nums))
print("Average =", sum(nums) / n)
print("Largest =", max(nums), "| Smallest =", min(nums))
`, '5\n12\n45\n7\n30\n21'),
  P('lists', 'Linear search', 'Write a program to search for a number in a list using linear search and print its position.',
    ['Start.', 'Store the list; input key.', 'For each index i: if list[i] == key, print i + 1 and stop searching.', 'If not found, print "Not found".', 'Stop.'],
    `nums = [14, 27, 8, 39, 52, 6, 71]
key = int(input("Enter number to search: "))
found = False
for i in range(len(nums)):
    if nums[i] == key:
        print(key, "found at position", i + 1)
        found = True
        break
if not found:
    print(key, "not found in the list")
`, '39'),
  P('lists', 'Bubble sort', 'Write a program to sort a list of numbers in ascending order using bubble sort.',
    ['Start.', 'Store the list.', 'Repeat for each pass: compare adjacent elements and swap them if they are in the wrong order.', 'Print the sorted list.', 'Stop.'],
    `nums = [64, 25, 12, 22, 11, 90]
print("Original list:", nums)
n = len(nums)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if nums[j] > nums[j + 1]:
            nums[j], nums[j + 1] = nums[j + 1], nums[j]
print("Sorted list:", nums)
`),
  P('lists', 'Separate even and odd numbers', 'Write a program to separate the even and odd numbers of a list into two new lists.',
    ['Start.', 'Store the list; create empty lists even and odd.', 'For each number: if it is divisible by 2 append to even, else to odd.', 'Print both lists.', 'Stop.'],
    `nums = [3, 8, 15, 22, 41, 50, 67, 72]
even = []
odd = []
for x in nums:
    if x % 2 == 0:
        even.append(x)
    else:
        odd.append(x)
print("Even numbers:", even)
print("Odd numbers:", odd)
`),

  // ───────── functions ─────────
  P('functions', 'Area calculator with functions', 'Write a program using functions to calculate the area of a circle, a rectangle and a triangle.',
    ['Start.', 'Define circle(r), rectangle(l, b) and triangle(b, h) that return the areas.', 'Call each function with sample values and print the results.', 'Stop.'],
    `def circle(r):
    return 3.14 * r * r

def rectangle(l, b):
    return l * b

def triangle(b, h):
    return 0.5 * b * h

print("Area of circle (r = 7):", circle(7))
print("Area of rectangle (12 x 5):", rectangle(12, 5))
print("Area of triangle (b = 10, h = 6):", triangle(10, 6))
`),
  P('functions', 'Recursive factorial', 'Write a program to find the factorial of a number using a recursive function.',
    ['Start.', 'Define fact(n): if n <= 1 return 1, else return n * fact(n - 1).', 'Input n and print fact(n).', 'Stop.'],
    `def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

n = int(input("Enter a number: "))
print("Factorial of", n, "is", fact(n))
`, '7'),
  P('functions', 'Check prime using a function', 'Write a function is_prime(n) that returns True if n is prime, and use it to print all prime numbers between 1 and 50.',
    ['Start.', 'Define is_prime(n): return False if n < 2; return False if any i from 2 to √n divides n; else return True.', 'For n from 1 to 50: print n if is_prime(n).', 'Stop.'],
    `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print("Prime numbers from 1 to 50:")
for n in range(1, 51):
    if is_prime(n):
        print(n, end=" ")
print()
`),

  // ───────── dictionaries ─────────
  P('dicts', 'Student marks dictionary', 'Write a program to store the names and marks of 5 students in a dictionary and print the topper and the class average.',
    ['Start.', 'Create a dictionary of name: marks.', 'topper = the key with the maximum value.', 'average = sum of values / number of students.', 'Print each student, the topper and the average.', 'Stop.'],
    `marks = {"Aman": 78, "Riya": 92, "Kabir": 85, "Sara": 67, "Dev": 88}
for name in marks:
    print(name, ":", marks[name])
topper = max(marks, key=marks.get)
average = sum(marks.values()) / len(marks)
print("Topper:", topper, "with", marks[topper], "marks")
print("Class average:", average)
`),
  P('dicts', 'Word frequency counter', 'Write a program to input a sentence and count how many times each word occurs, using a dictionary.',
    ['Start.', 'Input sentence; words = sentence.lower().split().', 'For each word: freq[word] = freq.get(word, 0) + 1.', 'Print each word and its count.', 'Stop.'],
    `sentence = input("Enter a sentence: ")
freq = {}
for word in sentence.lower().split():
    freq[word] = freq.get(word, 0) + 1
for word in freq:
    print(word, ":", freq[word])
`, 'the robot saw the box and the robot moved the box'),
];

export function topicsIn(text) {
  return Object.keys(TOPIC_WORDS).filter(k => TOPIC_WORDS[k].test(text || ''));
}

/** Programs for a request: the asked-for topics first, then related ones. */
export function bankFor(text) {
  const want = topicsIn(text);
  const first = TOPIC_BANK.filter(p => want.includes(p.topic));
  const rest = TOPIC_BANK.filter(p => !want.includes(p.topic));
  return want.length ? [...first, ...rest] : [...TOPIC_BANK];
}
