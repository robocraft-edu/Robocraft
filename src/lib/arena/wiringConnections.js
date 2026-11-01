// Turns an Arena robot into the connection list the wiring diagram draws.
// The standard kit is an Arduino Uno + L298N + four gear motors + a battery
// pack; a student-designed robot adds its chosen parts on top.
import { ROBOT_PINS, ARM_PINS } from './world';

const pinName = (n) => (n >= 14 ? `A${n - 14}` : `D${n}`);
const colorOf = (pin) => (pin === '5V' ? 'red' : pin === 'GND' ? 'black' : /^A/.test(pin) ? 'green' : 'blue');
const row = (component, controllerPin, componentPin, wireColor) => ({
  component, controllerPin, componentPin, wireColor: wireColor || colorOf(controllerPin), controllerId: 'arduino_uno',
});

const DRIVER = 'L298N Motor Driver';
const LINE_ARRAY = 'Analog line sensor array';

function baseKit() {
  const p = ROBOT_PINS;
  return [
    row(DRIVER, pinName(p.ENA), 'ENA', 'orange'), row(DRIVER, pinName(p.IN1), 'IN1'), row(DRIVER, pinName(p.IN2), 'IN2'),
    row(DRIVER, pinName(p.ENB), 'ENB', 'orange'), row(DRIVER, pinName(p.IN3), 'IN3'), row(DRIVER, pinName(p.IN4), 'IN4'),
    row(DRIVER, 'GND', 'GND'),
    ...[1, 2, 3, 4].map(n => row(`TT Gear Motor ${n}`, '—', `to L298N OUT${n <= 2 ? '1 / OUT2' : '3 / OUT4'}`, 'red')),
    row(DRIVER, '—', '+12V from battery pack', 'red'),
  ];
}

/** Wiring of the standard kit used by the built-in Arena tasks. */
export function standardKitConnections(taskId) {
  const p = ROBOT_PINS;
  const rows = baseKit();
  rows.push(
    row('IR Sensor Left', pinName(p.IR_LEFT), 'OUT'), row('IR Sensor Left', '5V', 'VCC'), row('IR Sensor Left', 'GND', 'GND'),
    row('IR Sensor Right', pinName(p.IR_RIGHT), 'OUT'), row('IR Sensor Right', '5V', 'VCC'), row('IR Sensor Right', 'GND', 'GND'),
    row('HC-SR04 Ultrasonic Sensor', pinName(p.TRIG), 'TRIG', 'yellow'), row('HC-SR04 Ultrasonic Sensor', pinName(p.ECHO), 'ECHO', 'yellow'),
    row('HC-SR04 Ultrasonic Sensor', '5V', 'VCC'), row('HC-SR04 Ultrasonic Sensor', 'GND', 'GND'),
  );
  if (taskId === 'pid') {
    [['Left', p.LINE_L], ['Centre', p.LINE_C], ['Right', p.LINE_R]].forEach(([n, pin]) => rows.push(row(LINE_ARRAY, pinName(pin), n)));
    rows.push(row(LINE_ARRAY, '5V', 'VCC'), row(LINE_ARRAY, 'GND', 'GND'));
  }
  return rows;
}

/** Wiring of a student-designed robot: the kit plus every part they chose. */
export function customRobotConnections(wiring) {
  const rows = baseKit();
  (wiring || []).forEach(w => {
    const component = /analog IR array/i.test(w.part) ? LINE_ARRAY : /\bLED\b/.test(w.part) ? 'Red LED' : String(w.part).replace(/^2 × /, '');
    const to = String(w.to || '').toUpperCase();
    rows.push(row(component, to, String(w.pin || '').replace(/\s*\(.*\)$/, ''), /PWM/.test(w.pin || '') ? 'orange' : undefined));
  });
  return rows;
}

/** Wiring of the robotic arm: four servo signals and the sonar, with the servos on their own 5 V supply. */
export function armKitConnections() {
  const p = ARM_PINS;
  const rows = [
    row('Base Servo', pinName(p.BASE), 'Signal', 'orange'), row('Shoulder Servo', pinName(p.SHOULDER), 'Signal', 'orange'),
    row('Elbow Servo', pinName(p.ELBOW), 'Signal', 'orange'), row('Gripper Servo', pinName(p.GRIP), 'Signal', 'orange'),
    row('HC-SR04 Ultrasonic Sensor', pinName(p.TRIG), 'TRIG', 'yellow'), row('HC-SR04 Ultrasonic Sensor', pinName(p.ECHO), 'ECHO', 'yellow'),
    row('HC-SR04 Ultrasonic Sensor', '5V', 'VCC'), row('HC-SR04 Ultrasonic Sensor', 'GND', 'GND'),
    row('Red LED', pinName(p.LED), 'Anode'), row('Red LED', 'GND', 'Cathode'),
    row('Piezo Buzzer', pinName(p.BUZZER), '+'), row('Piezo Buzzer', 'GND', '−'),
    row('Power Supply 5V 3A', '—', 'to all four servos (+ and −)', 'red'),
  ];
  return rows;
}
