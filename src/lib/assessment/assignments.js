// Practical-file assignment bank in the standard school format:
// Question → Algorithm → Program → Variable Description Table → Output.
// Python programs run in the in-app Python; Arduino sketches run in the simulator.

const A = (o) => ({ marks: 10, input: '', ...o });

export const ASSIGNMENTS = [
  // ───────────── Class 9 · Python ─────────────
  A({
    id: 'p9_temp', classes: ['class_9'], kind: 'python', topic: 'Input, operators, if-else',
    title: 'Temperature converter and comfort check',
    question: 'Write a program to input a temperature in degrees Celsius, convert it to Fahrenheit using F = C × 9/5 + 32, and print whether the room is "Cold" (below 18 °C), "Comfortable" (18–27 °C) or "Hot" (above 27 °C).',
    algorithm: ['Start.', 'Input temperature c in Celsius.', 'Compute f = c * 9 / 5 + 32.', 'If c < 18, status = "Cold"; else if c <= 27, status = "Comfortable"; else status = "Hot".', 'Print f and status.', 'Stop.'],
    code: `c = float(input("Enter temperature in Celsius: "))
f = c * 9 / 5 + 32
if c < 18:
    status = "Cold"
elif c <= 27:
    status = "Comfortable"
else:
    status = "Hot"
print("Temperature in Fahrenheit:", round(f, 1))
print("Room is:", status)
`,
    input: '31.5',
  }),
  A({
    id: 'p9_grade', classes: ['class_9'], kind: 'python', topic: 'Lists, loops',
    title: 'Marks analyser',
    question: 'Write a program to input the marks of 5 subjects into a list. Print the total, the percentage, the highest and lowest marks, and the grade (A ≥ 90, B ≥ 75, C ≥ 60, D ≥ 40, otherwise E).',
    algorithm: ['Start.', 'Create an empty list marks.', 'Repeat 5 times: input a mark and append it to marks.', 'total = sum of marks; pct = total / 5.', 'Find the highest and lowest using max() and min().', 'Decide the grade from pct using if-elif.', 'Print the results.', 'Stop.'],
    code: `marks = []
for i in range(5):
    m = int(input("Marks in subject " + str(i + 1) + ": "))
    marks.append(m)
total = sum(marks)
pct = total / 5
if pct >= 90:
    grade = "A"
elif pct >= 75:
    grade = "B"
elif pct >= 60:
    grade = "C"
elif pct >= 40:
    grade = "D"
else:
    grade = "E"
print("Marks:", marks)
print("Total =", total, "| Percentage =", pct)
print("Highest =", max(marks), "| Lowest =", min(marks))
print("Grade =", grade)
`,
    input: '88\n92\n79\n95\n84',
  }),
  A({
    id: 'p9_sensor', classes: ['class_9'], kind: 'python', topic: 'Lists, data → information',
    title: 'Ultrasonic sensor log',
    question: 'An ultrasonic sensor recorded these distances (cm): 120, 85, 40, 22, 15, 60, 9, 140. Write a program to print every reading with the message "OBSTACLE" if it is less than 25 cm, then print how many obstacles were detected and the average distance.',
    algorithm: ['Start.', 'Store the readings in a list.', 'Set count = 0.', 'For each reading d: if d < 25 print d and "OBSTACLE" and add 1 to count, else print d and "clear".', 'Compute the average = sum / number of readings.', 'Print count and average.', 'Stop.'],
    code: `readings = [120, 85, 40, 22, 15, 60, 9, 140]
count = 0
for d in readings:
    if d < 25:
        print(d, "cm -> OBSTACLE")
        count += 1
    else:
        print(d, "cm -> clear")
avg = sum(readings) / len(readings)
print("Obstacles detected:", count)
print("Average distance:", round(avg, 2), "cm")
`,
  }),
  A({
    id: 'p9_string', classes: ['class_9'], kind: 'python', topic: 'Strings',
    title: 'Robot command decoder',
    question: 'A robot receives a command string such as "FFRFFLB" where F = forward 10 cm, B = back 10 cm, L = turn left, R = turn right. Write a program to input a command string and print the number of each command and the net forward distance travelled.',
    algorithm: ['Start.', 'Input cmd and convert it to upper case.', 'Count F, B, L and R using count().', 'net = (F − B) × 10.', 'Print the counts and net distance.', 'Stop.'],
    code: `cmd = input("Enter command string: ").upper()
f = cmd.count("F")
b = cmd.count("B")
l = cmd.count("L")
r = cmd.count("R")
net = (f - b) * 10
print("Forward:", f, "Back:", b, "Left:", l, "Right:", r)
print("Net forward distance:", net, "cm")
if len(cmd) != f + b + l + r:
    print("Warning: unknown commands were ignored")
`,
    input: 'FFRFFLBF',
  }),
  A({
    id: 'p9_pattern', classes: ['class_9'], kind: 'python', topic: 'Nested loops',
    title: 'LED matrix pattern',
    question: 'An 5 × 5 LED matrix shows a diagonal cross. Write a program using nested loops to print the pattern, using "*" for an ON LED and "." for an OFF LED.',
    algorithm: ['Start.', 'For row = 0 to 4:', '  For col = 0 to 4: if row == col or row + col == 4 print "*" else print "."', '  Move to a new line.', 'Stop.'],
    code: `n = 5
for row in range(n):
    line = ""
    for col in range(n):
        if row == col or row + col == n - 1:
            line += "* "
        else:
            line += ". "
    print(line)
`,
  }),
  // ───────────── Class 10 · Python ─────────────
  A({
    id: 'p10_func', classes: ['class_10'], kind: 'python', topic: 'Functions',
    title: 'Speed of a wheeled robot',
    question: 'Write a function speed(rpm, diameter_cm) that returns the linear speed of a robot in cm/s using v = π × d × rpm / 60. Use it to print a table of speeds for 60, 100, 150 and 200 rpm with a 6.5 cm wheel.',
    algorithm: ['Start.', 'Define speed(rpm, d) returning 3.1416 × d × rpm / 60.', 'For each rpm in [60, 100, 150, 200]: call speed(rpm, 6.5) and print rpm and the result.', 'Stop.'],
    code: `import math

def speed(rpm, diameter_cm):
    return math.pi * diameter_cm * rpm / 60

wheel = 6.5
print("RPM   Speed (cm/s)")
for rpm in [60, 100, 150, 200]:
    v = speed(rpm, wheel)
    print(rpm, "  ", round(v, 2))
`,
  }),
  A({
    id: 'p10_dict', classes: ['class_10'], kind: 'python', topic: 'Dictionaries',
    title: 'Component inventory',
    question: 'A robotics lab stores its components in a dictionary {name: quantity}. Write a program that adds a new component, updates the quantity of an existing one, prints components whose quantity is less than 5 as "Reorder", and prints the total number of items.',
    algorithm: ['Start.', 'Create the dictionary stock.', 'Add a new key and update an existing key.', 'For each key, value in stock: if value < 5 print "Reorder".', 'Print the sum of all values.', 'Stop.'],
    code: `stock = {"Arduino Uno": 12, "IR sensor": 4, "Servo SG90": 9, "L298N": 3}
stock["Ultrasonic"] = 6
stock["IR sensor"] = stock["IR sensor"] + 10
for item, qty in stock.items():
    flag = "Reorder" if qty < 5 else "OK"
    print(item.ljust(12), qty, flag)
print("Total items:", sum(stock.values()))
`,
  }),
  A({
    id: 'p10_search', classes: ['class_10'], kind: 'python', topic: 'Searching',
    title: 'Linear and binary search on sensor IDs',
    question: 'Write a program to search for a sensor ID in a sorted list using binary search. Also count the number of comparisons and compare it with linear search.',
    algorithm: ['Start.', 'Input key.', 'Linear search: compare key with each element, counting comparisons.', 'Binary search: low = 0, high = n − 1; while low ≤ high, mid = (low + high) // 2, compare, move low or high; count comparisons.', 'Print both results and counts.', 'Stop.'],
    code: `ids = [101, 105, 110, 118, 123, 131, 142, 157, 166, 178, 190]
key = int(input("Sensor ID to find: "))

lin = 0
pos_lin = -1
for i in range(len(ids)):
    lin += 1
    if ids[i] == key:
        pos_lin = i
        break

low, high, bin_c, pos_bin = 0, len(ids) - 1, 0, -1
while low <= high:
    mid = (low + high) // 2
    bin_c += 1
    if ids[mid] == key:
        pos_bin = mid
        break
    elif ids[mid] < key:
        low = mid + 1
    else:
        high = mid - 1

print("Linear search: position", pos_lin, "after", lin, "comparisons")
print("Binary search: position", pos_bin, "after", bin_c, "comparisons")
`,
    input: '166',
  }),
  A({
    id: 'p10_sort', classes: ['class_10'], kind: 'python', topic: 'Sorting',
    title: 'Bubble sort of battery voltages',
    question: 'Write a program to sort a list of battery voltages in ascending order using bubble sort (without sort()). Print the list after each pass.',
    algorithm: ['Start.', 'Store voltages in list v; n = length.', 'For i = 0 to n − 2: for j = 0 to n − i − 2: if v[j] > v[j+1] swap them.', 'Print v after each pass.', 'Stop.'],
    code: `v = [7.4, 3.7, 9.0, 5.0, 6.0, 1.5]
n = len(v)
for i in range(n - 1):
    for j in range(n - i - 1):
        if v[j] > v[j + 1]:
            v[j], v[j + 1] = v[j + 1], v[j]
    print("Pass", i + 1, ":", v)
print("Sorted:", v)
`,
  }),
  A({
    id: 'p10_ai', classes: ['class_10', 'class_11'], kind: 'ai', topic: 'AI — rule-based vs learning',
    title: 'Nearest-neighbour fruit classifier',
    question: 'Write a program that classifies a fruit as apple or orange from its weight (g) and texture (0 = smooth, 1 = bumpy) using the 1-nearest-neighbour method on a small training set. Input a new fruit and print the prediction.',
    algorithm: ['Start.', 'Store training samples [weight, texture, label].', 'Input weight w and texture t.', 'For each sample find the distance √((w − sw)² + (100·(t − st))²).', 'The label of the nearest sample is the prediction.', 'Print the prediction.', 'Stop.'],
    code: `import math
train = [[140, 0, "apple"], [130, 0, "apple"], [150, 1, "orange"], [170, 1, "orange"], [125, 0, "apple"], [160, 1, "orange"]]
w = float(input("Weight in grams: "))
t = int(input("Texture (0 smooth, 1 bumpy): "))
best, label = None, ""
for sw, st, sl in train:
    d = math.sqrt((w - sw) ** 2 + (100 * (t - st)) ** 2)
    print("distance to", sl, sw, "g =", round(d, 1))
    if best is None or d < best:
        best, label = d, sl
print("Prediction:", label)
`,
    input: '155\n1',
  }),
  // ───────────── Class 11 · Python ─────────────
  A({
    id: 'p11_fk', classes: ['class_11'], kind: 'python', topic: 'Kinematics',
    title: 'Forward and inverse kinematics of a 2R arm',
    question: 'For a planar 2-link arm with L1 = 10 cm and L2 = 7 cm, write functions fk(t1, t2) and ik(x, y). Input joint angles in degrees, print the end-effector position, then verify by feeding it back into ik().',
    algorithm: ['Start.', 'fk: x = L1 cos t1 + L2 cos(t1 + t2); y = L1 sin t1 + L2 sin(t1 + t2).', 'ik: D = (x² + y² − L1² − L2²) / (2 L1 L2); t2 = acos D; t1 = atan2(y, x) − atan2(L2 sin t2, L1 + L2 cos t2).', 'Input t1, t2 (degrees), convert to radians.', 'Print fk result and ik of that result in degrees.', 'Stop.'],
    code: `import math
L1, L2 = 10, 7

def fk(t1, t2):
    x = L1 * math.cos(t1) + L2 * math.cos(t1 + t2)
    y = L1 * math.sin(t1) + L2 * math.sin(t1 + t2)
    return x, y

def ik(x, y):
    D = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2)
    if abs(D) > 1:
        return None
    t2 = math.acos(D)
    t1 = math.atan2(y, x) - math.atan2(L2 * math.sin(t2), L1 + L2 * math.cos(t2))
    return t1, t2

a1 = float(input("theta1 (deg): "))
a2 = float(input("theta2 (deg): "))
x, y = fk(math.radians(a1), math.radians(a2))
print("End effector: x =", round(x, 3), "y =", round(y, 3))
sol = ik(x, y)
print("IK gives theta1 =", round(math.degrees(sol[0]), 2), "theta2 =", round(math.degrees(sol[1]), 2))
`,
    input: '30\n45',
  }),
  A({
    id: 'p11_pid', classes: ['class_11'], kind: 'python', topic: 'Control systems',
    title: 'PID speed controller simulation',
    question: 'Simulate a DC motor whose speed changes as speed += (u − speed) × 0.1 every step. Write a PID controller (Kp = 0.8, Ki = 0.15, Kd = 0.05) to reach a set-point of 100 rpm. Print the speed every 5 steps and the overshoot.',
    algorithm: ['Start.', 'Set speed = 0, integral = 0, prev_error = 0.', 'Repeat 60 times: error = setpoint − speed; integral += error; derivative = error − prev_error; u = Kp·error + Ki·integral + Kd·derivative; speed += (u − speed) × 0.1; prev_error = error; track max speed.', 'Print readings and overshoot = max − setpoint.', 'Stop.'],
    code: `kp, ki, kd = 0.8, 0.15, 0.05
setpoint = 100
speed, integral, prev = 0.0, 0.0, 0.0
peak = 0
for step in range(1, 61):
    error = setpoint - speed
    integral += error
    derivative = error - prev
    u = kp * error + ki * integral + kd * derivative
    speed += (u - speed) * 0.1
    prev = error
    peak = max(peak, speed)
    if step % 5 == 0:
        print("step", step, "speed", round(speed, 1))
print("Overshoot:", round(max(0, peak - setpoint), 1), "rpm")
`,
  }),
  A({
    id: 'p11_matrix', classes: ['class_11'], kind: 'python', topic: 'Matrices & transformations',
    title: 'Homogeneous transformation of a point',
    question: 'Write a program that builds a 3 × 3 homogeneous transformation matrix for a rotation θ followed by a translation (tx, ty) and applies it to the corners of a square robot footprint. Use nested lists (no NumPy).',
    algorithm: ['Start.', 'Input θ (degrees), tx, ty.', 'T = [[cosθ, −sinθ, tx], [sinθ, cosθ, ty], [0, 0, 1]].', 'For each corner (x, y), form [x, y, 1] and multiply T × p.', 'Print the transformed corners.', 'Stop.'],
    code: `import math

def matmul(T, p):
    return [sum(T[i][k] * p[k] for k in range(3)) for i in range(3)]

th = math.radians(float(input("Rotation (deg): ")))
tx = float(input("tx: "))
ty = float(input("ty: "))
T = [[math.cos(th), -math.sin(th), tx],
     [math.sin(th),  math.cos(th), ty],
     [0, 0, 1]]
corners = [(0, 0), (4, 0), (4, 4), (0, 4)]
for x, y in corners:
    q = matmul(T, [x, y, 1])
    print((x, y), "->", (round(q[0], 2), round(q[1], 2)))
`,
    input: '90\n10\n5',
  }),
  A({
    id: 'p11_regress', classes: ['class_11'], kind: 'ai', topic: 'Machine learning',
    title: 'Linear regression from scratch',
    question: 'An IR distance sensor gives these analog readings for known distances. Fit y = m·x + c by least squares without libraries and predict the distance for a reading of 450.',
    algorithm: ['Start.', 'Store x (readings) and y (distances).', 'Compute means x̄, ȳ.', 'm = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²; c = ȳ − m·x̄.', 'Print m, c and the prediction for 450; print R².', 'Stop.'],
    code: `x = [620, 540, 480, 410, 350, 300]
y = [10, 15, 20, 25, 30, 35]
n = len(x)
mx, my = sum(x) / n, sum(y) / n
num = sum((x[i] - mx) * (y[i] - my) for i in range(n))
den = sum((x[i] - mx) ** 2 for i in range(n))
m = num / den
c = my - m * mx
pred = [m * xi + c for xi in x]
ss_res = sum((y[i] - pred[i]) ** 2 for i in range(n))
ss_tot = sum((yi - my) ** 2 for yi in y)
print("m =", round(m, 4), " c =", round(c, 2))
print("Distance for reading 450 =", round(m * 450 + c, 2), "cm")
print("R squared =", round(1 - ss_res / ss_tot, 4))
`,
  }),
  A({
    id: 'p11_bfs', classes: ['class_11'], kind: 'ai', topic: 'Search / path planning',
    title: 'Shortest path in a grid (BFS)',
    question: 'A warehouse robot moves on a grid where "#" is a wall. Write a program that uses breadth-first search to find the length of the shortest path from S to G and prints the path drawn on the grid.',
    algorithm: ['Start.', 'Read the grid; locate S and G.', 'Put S in a queue; mark visited; store parent of each cell.', 'While queue not empty: take a cell; if it is G stop; else add its unvisited open neighbours to the queue with their parent.', 'Trace parents back from G to S and mark the path with "*".', 'Print the length and grid.', 'Stop.'],
    code: `from collections import deque
grid = ["S..#....",
        ".#.#.##.",
        ".#...#..",
        ".####.#.",
        "......#G"]
R, C = len(grid), len(grid[0])
for r in range(R):
    for c in range(C):
        if grid[r][c] == "S": start = (r, c)
        if grid[r][c] == "G": goal = (r, c)
q = deque([start])
parent = {start: None}
while q:
    cell = q.popleft()
    if cell == goal:
        break
    r, c = cell
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != "#" and (nr, nc) not in parent:
            parent[(nr, nc)] = cell
            q.append((nr, nc))
path = []
cell = goal
while cell:
    path.append(cell)
    cell = parent[cell]
rows = [list(row) for row in grid]
for r, c in path[1:-1]:
    rows[r][c] = "*"
print("Shortest path length:", len(path) - 1)
for row in rows:
    print("".join(row))
`,
  }),
  // ───────────── Arduino (all classes) ─────────────
  A({
    id: 'a_traffic', classes: ['class_9', 'class_10'], kind: 'arduino', topic: 'Digital output, delay',
    title: 'Traffic light controller',
    question: 'Build a traffic light with red (D11), yellow (D12) and green (D13) LEDs. Green stays on for 5 s, yellow for 2 s and red for 5 s, repeating forever. Print the current light to the Serial Monitor.',
    algorithm: ['Start.', 'Set pins 11, 12, 13 as OUTPUT; begin Serial.', 'Loop: green ON, others OFF, print "GREEN", wait 5 s.', 'Yellow ON, others OFF, print "YELLOW", wait 2 s.', 'Red ON, others OFF, print "RED", wait 5 s.', 'Repeat.'],
    code: `#define RED 11
#define YELLOW 12
#define GREEN 13

void show(int r, int y, int g, const char *name, int ms) {
  digitalWrite(RED, r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN, g);
  Serial.println(name);
  delay(ms);
}

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  show(LOW, LOW, HIGH, "GREEN", 5000);
  show(LOW, HIGH, LOW, "YELLOW", 2000);
  show(HIGH, LOW, LOW, "RED", 5000);
}
`,
  }),
  A({
    id: 'a_bin', classes: ['class_9', 'class_10'], kind: 'arduino', topic: 'Ultrasonic sensor, servo',
    title: 'Smart dustbin',
    question: 'Use an HC-SR04 (TRIG D9, ECHO D10) and a servo (D11) to open the lid of a dustbin when a hand is closer than 20 cm, keep it open for 3 s and then close it. Print the distance.',
    algorithm: ['Start.', 'Attach servo to D11; set TRIG as OUTPUT, ECHO as INPUT.', 'Loop: send a 10 µs pulse on TRIG; duration = pulseIn(ECHO); distance = duration × 0.034 / 2.', 'If distance < 20: servo to 90° (open), wait 3 s, servo to 0° (close).', 'Print distance; wait 200 ms; repeat.'],
    code: `#include <Servo.h>
#define TRIG 9
#define ECHO 10
Servo lid;

long readCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  return t * 0.034 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  lid.attach(11);
  lid.write(0);
  Serial.begin(9600);
}

void loop() {
  long d = readCm();
  Serial.print("Distance: "); Serial.println(d);
  if (d > 0 && d < 20) {
    lid.write(90);
    delay(3000);
    lid.write(0);
  }
  delay(200);
}
`,
  }),
  A({
    id: 'a_line', classes: ['class_10', 'class_11'], kind: 'arduino', topic: 'IR sensors, motor driver',
    title: 'Line-following robot',
    question: 'Program a two-wheeled robot with two IR sensors (left D2, right D3; HIGH on black) and an L298N driver (ENA 5, IN1 4, IN2 7, ENB 6, IN3 8, IN4 12) to follow a black line.',
    algorithm: ['Start.', 'Set IR pins as INPUT and motor pins as OUTPUT.', 'Loop: read both sensors.', 'Both white → forward; left black → turn left; right black → turn right; both black → stop.', 'Repeat.'],
    code: `#define IR_LEFT 2
#define IR_RIGHT 3
#define ENA 5
#define IN1 4
#define IN2 7
#define ENB 6
#define IN3 8
#define IN4 12

void motors(int left, int right) {
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));  analogWrite(ENB, abs(right));
}

void setup() {
  pinMode(IR_LEFT, INPUT); pinMode(IR_RIGHT, INPUT);
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  int l = digitalRead(IR_LEFT);
  int r = digitalRead(IR_RIGHT);
  if (l == LOW && r == LOW) motors(170, 170);
  else if (l == HIGH && r == LOW) motors(-60, 190);
  else if (l == LOW && r == HIGH) motors(190, -60);
  else motors(0, 0);
}
`,
    arena: 'line',
  }),
  A({
    id: 'a_obstacle', classes: ['class_10', 'class_11'], kind: 'arduino', topic: 'Ultrasonic sensor, decisions',
    title: 'Obstacle-avoiding robot',
    question: 'Program a robot with an HC-SR04 (TRIG 9, ECHO 10) and L298N driver to drive forward and, when an obstacle is closer than 25 cm, reverse briefly and turn right until the path is clear.',
    algorithm: ['Start.', 'Configure pins.', 'Loop: measure distance.', 'If distance < 25: reverse 300 ms, then spin right until distance ≥ 40.', 'Else drive forward.', 'Repeat.'],
    code: `#define TRIG 9
#define ECHO 10
#define ENA 5
#define IN1 4
#define IN2 7
#define ENB 6
#define IN3 8
#define IN4 12

void motors(int left, int right) {
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));  analogWrite(ENB, abs(right));
}

long readCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  if (t == 0) return 400;
  return t * 0.034 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  if (readCm() < 25) {
    motors(-160, -160); delay(300);
    while (readCm() < 40) { motors(170, -170); delay(60); }
  } else {
    motors(200, 200);
  }
  delay(30);
}
`,
    arena: 'obstacle',
  }),
  A({
    id: 'a_pot', classes: ['class_9', 'class_10', 'class_11'], kind: 'arduino', topic: 'Analog input, PWM, map()',
    title: 'Potentiometer-controlled servo',
    question: 'Read a potentiometer on A0 and use map() to set a servo (D9) angle between 0° and 180°. Print the raw value and the angle every 100 ms.',
    algorithm: ['Start.', 'Attach the servo to D9; begin Serial.', 'Loop: raw = analogRead(A0); angle = map(raw, 0, 1023, 0, 180).', 'Write angle to the servo; print raw and angle; wait 100 ms.', 'Repeat.'],
    code: `#include <Servo.h>
Servo arm;

void setup() {
  arm.attach(9);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  int angle = map(raw, 0, 1023, 0, 180);
  arm.write(angle);
  Serial.print("Raw: "); Serial.print(raw);
  Serial.print("  Angle: "); Serial.println(angle);
  delay(100);
}
`,
  }),
];

export const KIND_LABEL = { python: 'Python', arduino: 'Arduino', ai: 'AI / ML' };

export function assignmentsFor(classId) { return ASSIGNMENTS.filter(a => a.classes.includes(classId)); }
