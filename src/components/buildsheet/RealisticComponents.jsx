import React from 'react';

// Realistic SVG renderings of electronic components
// Each component renders at a fixed size with pins at real-world positions.
// Pin positions are returned via the getPinPos() helper for wire connection.

export const REALISTIC_SIZES = {
  arduino_uno: { w: 180, h: 260 },
  arduino_nano: { w: 120, h: 260 },
  esp32: { w: 140, h: 260 },
  esp8266: { w: 120, h: 260 },
  breadboard: { w: 220, h: 110 },
  led: { w: 90, h: 120 },
  rgb_led: { w: 100, h: 140 },
  resistor: { w: 100, h: 50 },
  push_button: { w: 90, h: 100 },
  buzzer: { w: 90, h: 100 },
  servo: { w: 140, h: 160 },
  dc_motor: { w: 120, h: 110 },
  stepper: { w: 140, h: 160 },
  ultrasonic: { w: 160, h: 150 },
  ir_sensor: { w: 130, h: 130 },
  ldr: { w: 90, h: 110 },
  temp_sensor: { w: 100, h: 130 },
  gas_sensor: { w: 130, h: 130 },
  lcd: { w: 200, h: 130 },
  oled: { w: 150, h: 110 },
  battery: { w: 80, h: 120 },
  power_supply: { w: 100, h: 110 },
  motor_driver: { w: 170, h: 200 },
  bluetooth: { w: 130, h: 150 },
  relay: { w: 120, h: 140 },
  joystick: { w: 130, h: 150 },
  a4988: { w: 150, h: 170 },
  mpu6050: { w: 120, h: 150 },
  nema17: { w: 130, h: 170 },
  gear_motor: { w: 160, h: 120 },
  vibration_motor: { w: 110, h: 90 },
  aa_battery: { w: 160, h: 80 },
};

// Pin positions relative to component top-left (x, y)
export const REALISTIC_PINS = {
  arduino_uno: [
    { id: 'D0', label: 'D0', type: 'digital', x: 0, y: 22 },
    { id: 'D1', label: 'D1', type: 'digital', x: 0, y: 38 },
    { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 54 },
    { id: 'D3', label: 'D3', type: 'pwm', x: 0, y: 70 },
    { id: 'D4', label: 'D4', type: 'digital', x: 0, y: 86 },
    { id: 'D5', label: 'D5', type: 'pwm', x: 0, y: 102 },
    { id: 'D6', label: 'D6', type: 'pwm', x: 0, y: 118 },
    { id: 'D7', label: 'D7', type: 'digital', x: 0, y: 134 },
    { id: 'D8', label: 'D8', type: 'digital', x: 0, y: 150 },
    { id: 'D9', label: 'D9', type: 'pwm', x: 0, y: 166 },
    { id: 'D10', label: 'D10', type: 'pwm', x: 0, y: 182 },
    { id: 'D11', label: 'D11', type: 'pwm', x: 0, y: 198 },
    { id: 'D12', label: 'D12', type: 'digital', x: 0, y: 214 },
    { id: 'D13', label: 'D13', type: 'digital', x: 0, y: 230 },
    { id: '5V', label: '5V', type: 'power', x: 180, y: 34 },
    { id: 'VIN', label: 'VIN', type: 'power', x: 180, y: 52 },
    { id: '3V3', label: '3.3V', type: 'power', x: 180, y: 70 },
    { id: 'GND', label: 'GND', type: 'ground', x: 180, y: 96 },
    { id: 'GND2', label: 'GND', type: 'ground', x: 180, y: 114 },
    { id: 'A0', label: 'A0', type: 'analog', x: 180, y: 146 },
    { id: 'A1', label: 'A1', type: 'analog', x: 180, y: 164 },
    { id: 'A2', label: 'A2', type: 'analog', x: 180, y: 182 },
    { id: 'A3', label: 'A3', type: 'analog', x: 180, y: 200 },
    { id: 'A4', label: 'A4 (SDA)', type: 'analog', x: 180, y: 218 },
    { id: 'A5', label: 'A5 (SCL)', type: 'analog', x: 180, y: 236 },
  ],
  arduino_nano: [
    { id: 'D0', label: 'D0', type: 'digital', x: 0, y: 30 },
    { id: 'D1', label: 'D1', type: 'digital', x: 0, y: 45 },
    { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 60 },
    { id: 'D3', label: 'D3', type: 'pwm', x: 0, y: 75 },
    { id: 'D4', label: 'D4', type: 'digital', x: 0, y: 90 },
    { id: 'D5', label: 'D5', type: 'pwm', x: 0, y: 105 },
    { id: 'D6', label: 'D6', type: 'pwm', x: 0, y: 120 },
    { id: 'D7', label: 'D7', type: 'digital', x: 0, y: 135 },
    { id: 'D8', label: 'D8', type: 'digital', x: 0, y: 150 },
    { id: 'D9', label: 'D9', type: 'pwm', x: 0, y: 165 },
    { id: 'D10', label: 'D10', type: 'pwm', x: 0, y: 180 },
    { id: 'D11', label: 'D11', type: 'pwm', x: 0, y: 195 },
    { id: 'D12', label: 'D12', type: 'digital', x: 0, y: 210 },
    { id: 'D13', label: 'D13', type: 'digital', x: 0, y: 225 },
    { id: '5V', label: '5V', type: 'power', x: 120, y: 40 },
    { id: 'VIN', label: 'VIN', type: 'power', x: 120, y: 58 },
    { id: 'GND', label: 'GND', type: 'ground', x: 120, y: 84 },
    { id: 'A0', label: 'A0', type: 'analog', x: 120, y: 120 },
    { id: 'A1', label: 'A1', type: 'analog', x: 120, y: 138 },
    { id: 'A2', label: 'A2', type: 'analog', x: 120, y: 156 },
    { id: 'A3', label: 'A3', type: 'analog', x: 120, y: 174 },
    { id: 'A4', label: 'A4 (SDA)', type: 'analog', x: 120, y: 192 },
    { id: 'A5', label: 'A5 (SCL)', type: 'analog', x: 120, y: 210 },
  ],
  esp32: [
    { id: 'D2', label: 'GPIO2', type: 'digital', x: 0, y: 26 },
    { id: 'D4', label: 'GPIO4', type: 'pwm', x: 0, y: 44 },
    { id: 'D5', label: 'GPIO5', type: 'pwm', x: 0, y: 62 },
    { id: 'D12', label: 'GPIO12', type: 'digital', x: 0, y: 80 },
    { id: 'D13', label: 'GPIO13', type: 'digital', x: 0, y: 98 },
    { id: 'D14', label: 'GPIO14', type: 'digital', x: 0, y: 116 },
    { id: 'D15', label: 'GPIO15', type: 'digital', x: 0, y: 134 },
    { id: 'D16', label: 'GPIO16', type: 'pwm', x: 0, y: 152 },
    { id: 'D17', label: 'GPIO17', type: 'pwm', x: 0, y: 170 },
    { id: 'D18', label: 'GPIO18', type: 'pwm', x: 0, y: 188 },
    { id: 'D19', label: 'GPIO19', type: 'pwm', x: 0, y: 206 },
    { id: 'D21', label: 'GPIO21', type: 'digital', x: 0, y: 224 },
    { id: 'D22', label: 'GPIO22', type: 'digital', x: 0, y: 242 },
    { id: '3V3', label: '3.3V', type: 'power', x: 140, y: 34 },
    { id: 'VIN', label: 'VIN (5V)', type: 'power', x: 140, y: 52 },
    { id: 'GND', label: 'GND', type: 'ground', x: 140, y: 78 },
    { id: 'D23', label: 'GPIO23', type: 'digital', x: 140, y: 110 },
    { id: 'D25', label: 'GPIO25', type: 'digital', x: 140, y: 128 },
    { id: 'D26', label: 'GPIO26', type: 'digital', x: 140, y: 146 },
    { id: 'D27', label: 'GPIO27', type: 'digital', x: 140, y: 164 },
    { id: 'D32', label: 'GPIO32', type: 'analog', x: 140, y: 182 },
    { id: 'D33', label: 'GPIO33', type: 'analog', x: 140, y: 200 },
    { id: 'D34', label: 'GPIO34', type: 'analog', x: 140, y: 218 },
    { id: 'D35', label: 'GPIO35', type: 'analog', x: 140, y: 236 },
  ],
  esp8266: [
    { id: 'D1', label: 'D1', type: 'digital', x: 0, y: 60 },
    { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 90 },
    { id: 'D5', label: 'D5', type: 'pwm', x: 0, y: 120 },
    { id: 'D6', label: 'D6', type: 'pwm', x: 0, y: 150 },
    { id: '3V3', label: '3.3V', type: 'power', x: 120, y: 60 },
    { id: 'GND', label: 'GND', type: 'ground', x: 120, y: 90 },
    { id: 'A0', label: 'A0', type: 'analog', x: 120, y: 120 },
  ],
  breadboard: [
    { id: 'plus1', label: '+', type: 'power', x: 20, y: 0 },
    { id: 'plus2', label: '+', type: 'power', x: 200, y: 0 },
    { id: 'minus1', label: '−', type: 'ground', x: 20, y: 110 },
    { id: 'minus2', label: '−', type: 'ground', x: 200, y: 110 },
  ],
  led: [
    { id: 'A', label: 'Anode (+)', type: 'power', x: 0, y: 40 },
    { id: 'C', label: 'Cathode (−)', type: 'ground', x: 0, y: 80 },
  ],
  rgb_led: [
    { id: 'R', label: 'Red', type: 'pwm', x: 0, y: 25 },
    { id: 'G', label: 'Green', type: 'pwm', x: 0, y: 55 },
    { id: 'B', label: 'Blue', type: 'pwm', x: 0, y: 85 },
    { id: 'C', label: 'Common (−)', type: 'ground', x: 0, y: 115 },
  ],
  resistor: [
    { id: 'A', label: 'Pin 1', type: 'signal', x: 0, y: 25 },
    { id: 'B', label: 'Pin 2', type: 'signal', x: 100, y: 25 },
  ],
  push_button: [
    { id: 'A', label: 'Pin A', type: 'signal', x: 0, y: 35 },
    { id: 'B', label: 'Pin B', type: 'signal', x: 0, y: 75 },
  ],
  buzzer: [
    { id: 'P', label: 'Positive (+)', type: 'signal', x: 0, y: 35 },
    { id: 'N', label: 'Negative (−)', type: 'ground', x: 0, y: 75 },
  ],
  servo: [
    { id: 'VCC', label: 'VCC (Red)', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND (Brown)', type: 'ground', x: 0, y: 70 },
    { id: 'SIG', label: 'Signal (Orange)', type: 'pwm', x: 0, y: 110 },
  ],
  dc_motor: [
    { id: 'P', label: 'Terminal (+)', type: 'power', x: 0, y: 35 },
    { id: 'N', label: 'Terminal (−)', type: 'ground', x: 0, y: 75 },
  ],
  stepper: [
    { id: 'A1', label: 'A+', type: 'signal', x: 0, y: 25 },
    { id: 'A2', label: 'A−', type: 'signal', x: 0, y: 55 },
    { id: 'B1', label: 'B+', type: 'signal', x: 0, y: 85 },
    { id: 'B2', label: 'B−', type: 'signal', x: 0, y: 115 },
  ],
  ultrasonic: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 60 },
    { id: 'TRIG', label: 'TRIG', type: 'signal', x: 0, y: 90 },
    { id: 'ECHO', label: 'ECHO', type: 'signal', x: 0, y: 120 },
  ],
  ir_sensor: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 65 },
    { id: 'OUT', label: 'OUT', type: 'signal', x: 0, y: 100 },
  ],
  ldr: [
    { id: 'A', label: 'Pin A', type: 'analog', x: 0, y: 35 },
    { id: 'C', label: 'Pin C', type: 'ground', x: 0, y: 75 },
  ],
  temp_sensor: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 65 },
    { id: 'OUT', label: 'DATA', type: 'signal', x: 0, y: 100 },
  ],
  gas_sensor: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 65 },
    { id: 'OUT', label: 'AOUT', type: 'analog', x: 0, y: 100 },
  ],
  lcd: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 50 },
    { id: 'SDA', label: 'SDA', type: 'analog', x: 0, y: 75 },
    { id: 'SCL', label: 'SCL', type: 'analog', x: 0, y: 100 },
  ],
  oled: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 50 },
    { id: 'SDA', label: 'SDA', type: 'analog', x: 0, y: 75 },
    { id: 'SCL', label: 'SCL', type: 'analog', x: 0, y: 100 },
  ],
  battery: [
    { id: 'P', label: '+', type: 'power', x: 0, y: 35 },
    { id: 'N', label: '−', type: 'ground', x: 0, y: 75 },
  ],
  power_supply: [
    { id: 'V', label: 'V+', type: 'power', x: 0, y: 35 },
    { id: 'G', label: 'V−', type: 'ground', x: 0, y: 75 },
  ],
  motor_driver: [
    { id: 'IN1', label: 'IN1', type: 'digital', x: 0, y: 32 },
    { id: 'IN2', label: 'IN2', type: 'digital', x: 0, y: 58 },
    { id: 'IN3', label: 'IN3', type: 'digital', x: 0, y: 90 },
    { id: 'IN4', label: 'IN4', type: 'digital', x: 0, y: 116 },
    { id: 'ENA', label: 'ENA', type: 'pwm', x: 0, y: 148 },
    { id: 'ENB', label: 'ENB', type: 'pwm', x: 0, y: 174 },
    { id: 'OUT1', label: 'OUT1', type: 'motor', x: 170, y: 24 },
    { id: 'OUT2', label: 'OUT2', type: 'motor', x: 170, y: 46 },
    { id: '12V', label: '12V', type: 'power', x: 170, y: 80 },
    { id: 'GND', label: 'GND', type: 'ground', x: 170, y: 104 },
    { id: '5V', label: '5V', type: 'power', x: 170, y: 128 },
    { id: 'OUT3', label: 'OUT3', type: 'motor', x: 170, y: 160 },
    { id: 'OUT4', label: 'OUT4', type: 'motor', x: 170, y: 182 },
  ],
  bluetooth: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 60 },
    { id: 'TX', label: 'TX', type: 'signal', x: 0, y: 90 },
    { id: 'RX', label: 'RX', type: 'signal', x: 0, y: 120 },
  ],
  relay: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 65 },
    { id: 'IN', label: 'IN', type: 'signal', x: 0, y: 100 },
  ],
  joystick: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 50 },
    { id: 'VRX', label: 'VRX', type: 'analog', x: 0, y: 75 },
    { id: 'VRY', label: 'VRY', type: 'analog', x: 0, y: 100 },
    { id: 'SW', label: 'SW', type: 'digital', x: 0, y: 125 },
  ],
  a4988: [
    { id: 'STEP', label: 'STEP', type: 'digital', x: 0, y: 30 },
    { id: 'DIR', label: 'DIR', type: 'digital', x: 0, y: 60 },
    { id: 'ENABLE', label: 'ENABLE', type: 'digital', x: 0, y: 90 },
    { id: 'VDD', label: 'VDD (5V)', type: 'power', x: 0, y: 120 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 150 },
    { id: 'VMOT', label: 'VMOT (12V)', type: 'power', x: 150, y: 30 },
    { id: 'MGND', label: 'GND', type: 'ground', x: 150, y: 60 },
    { id: '1A', label: '1A', type: 'power', x: 30, y: 170 },
    { id: '1B', label: '1B', type: 'power', x: 60, y: 170 },
    { id: '2A', label: '2A', type: 'power', x: 90, y: 170 },
    { id: '2B', label: '2B', type: 'power', x: 120, y: 170 },
  ],
  mpu6050: [
    { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 30 },
    { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 60 },
    { id: 'SCL', label: 'SCL', type: 'analog', x: 0, y: 90 },
    { id: 'SDA', label: 'SDA', type: 'analog', x: 0, y: 120 },
    { id: 'INT', label: 'INT', type: 'digital', x: 120, y: 30 },
  ],
  gear_motor: [
    { id: 'P', label: 'Terminal (+)', type: 'power', x: 0, y: 42 },
    { id: 'N', label: 'Terminal (−)', type: 'ground', x: 0, y: 78 },
  ],
  vibration_motor: [
    { id: 'P', label: 'Wire (+)', type: 'power', x: 0, y: 34 },
    { id: 'N', label: 'Wire (−)', type: 'ground', x: 0, y: 56 },
  ],
  aa_battery: [
    { id: 'P', label: '+', type: 'power', x: 0, y: 26 },
    { id: 'N', label: '−', type: 'ground', x: 0, y: 54 },
  ],
  nema17: [
    { id: '1A', label: '1A', type: 'power', x: 0, y: 50 },
    { id: '1B', label: '1B', type: 'power', x: 0, y: 80 },
    { id: '2A', label: '2A', type: 'power', x: 0, y: 110 },
    { id: '2B', label: '2B', type: 'power', x: 0, y: 140 },
  ],
};

/** Header pads drawn straight from the pin table, so wires always land on a pad. */
function HeaderPads({ id, labels = true }) {
  const pins = REALISTIC_PINS[id] || [];
  const w = (REALISTIC_SIZES[id] || {}).w || 0;
  return (
    <g>
      {pins.map(p => {
        const right = p.x >= w - 2;
        const inside = right ? p.x - 7 : p.x + 7;
        return (
          <g key={p.id}>
            <rect x={p.x - 5} y={p.y - 5} width="10" height="10" rx="1.5" fill="#1A1A1A" stroke="#555" strokeWidth="0.5" />
            <rect x={p.x - 3.5} y={p.y - 3.5} width="7" height="7" rx="1" fill="#C9CDD2" />
            <circle cx={p.x} cy={p.y} r="1.6" fill="#FFD700" />
            {labels && <text x={inside} y={p.y + 2.6} textAnchor={right ? 'end' : 'start'} fontSize="7" fontWeight="700"
              fill="rgba(255,255,255,0.92)" fontFamily="'Inter',sans-serif">{p.label}</text>}
          </g>
        );
      })}
    </g>
  );
}

// ── Component SVG Renderings ──
// Each renders at origin (0,0) within its bounding box size.

function ArduinoUno({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* PCB body - teal */}
      <rect width="180" height="260" rx="8" fill="#00979D" stroke="#006B6F" strokeWidth="2" />
      {/* Top silkscreen */}
      <rect x="10" y="8" width="160" height="40" rx="4" fill="#008385" />
      <text x="90" y="33" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">ARDUINO UNO</text>
      {/* USB port (top left) */}
      <rect x="5" y="48" width="35" height="30" rx="3" fill="#C0C0C0" stroke="#888" strokeWidth="1.5" />
      <rect x="8" y="53" width="26" height="20" rx="2" fill="#333" />
      {/* Power jack (top right) */}
      <rect x="142" y="50" width="30" height="26" rx="4" fill="#222" stroke="#555" strokeWidth="1" />
      <circle cx="157" cy="63" r="6" fill="#444" stroke="#666" strokeWidth="1" />
      {/* ATmega chip */}
      <rect x="55" y="95" width="70" height="70" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
      <circle cx="62" cy="102" r="2" fill="#555" />
      <HeaderPads id="arduino_uno" />
      {/* Reset button */}
      <circle cx="40" cy="195" r="8" fill="#444" stroke="#666" strokeWidth="1.5" />
      <circle cx="40" cy="195" r="4" fill="#888" />
      {/* LEDs */}
      <rect x="130" y="190" width="10" height="6" rx="1" fill="#FF4444" />
      <rect x="130" y="200" width="10" height="6" rx="1" fill="#44FF44" />
      <rect x="130" y="210" width="10" height="6" rx="1" fill="#FFAA00" />
      {/* ON LED label */}
      <text x="125" y="225" textAnchor="end" fontSize="6" fill="#fff" fontFamily="monospace">ON</text>
    </g>
  );
}

function ESP32({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="140" height="260" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
      {/* Metal can / RF module */}
      <rect x="20" y="20" width="100" height="70" rx="3" fill="#C0C0C0" stroke="#888" strokeWidth="1.5" />
      <rect x="25" y="25" width="90" height="60" rx="2" fill="#E8E8E8" />
      <text x="70" y="58" textAnchor="middle" fontSize="10" fontWeight="700" fill="#333" fontFamily="monospace">ESP32</text>
      {/* Antenna */}
      <rect x="45" y="15" width="50" height="6" rx="1" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" />
      {/* USB port */}
      <rect x="50" y="95" width="40" height="25" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      <rect x="55" y="100" width="30" height="15" rx="1" fill="#333" />
      {/* En/Boot buttons */}
      <rect x="30" y="135" width="20" height="12" rx="2" fill="#444" />
      <rect x="90" y="135" width="20" height="12" rx="2" fill="#444" />
      <HeaderPads id="esp32" />
      <text x="70" y="240" textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">DevKit</text>
    </g>
  );
}

function Breadboard({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="220" height="110" rx="4" fill="#F8F8F0" stroke="#D0D0C0" strokeWidth="1.5" />
      {/* Power rails */}
      <rect x="5" y="6" width="210" height="10" rx="1" fill="#FF6B6B" opacity="0.15" />
      <rect x="5" y="94" width="210" height="10" rx="1" fill="#6B6BFF" opacity="0.15" />
      <text x="12" y="14" fontSize="8" fill="#D00" fontWeight="700" fontFamily="monospace">+</text>
      <text x="12" y="103" fontSize="8" fill="#00D" fontWeight="700" fontFamily="monospace">−</text>
      {/* Holes */}
      {Array.from({ length: 28 }).map((_, i) => (
        <g key={i}>
          <circle cx={15 + i * 7.5} cy="6" r="1.5" fill="#CC4F4F" />
          <circle cx={15 + i * 7.5} cy="12" r="1.5" fill="#CC4F4F" />
          <circle cx={15 + i * 7.5} cy="94" r="1.5" fill="#4F4FCC" />
          <circle cx={15 + i * 7.5} cy="100" r="1.5" fill="#4F4FCC" />
        </g>
      ))}
      {/* Center gap */}
      <line x1="5" y1="55" x2="215" y2="55" stroke="#D0D0C0" strokeWidth="1" />
      {/* Main holes */}
      {Array.from({ length: 28 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <React.Fragment key={`${i}-${j}`}>
            <circle cx={15 + i * 7.5} cy={24 + j * 6} r="1.5" fill="#888" opacity="0.5" />
            <circle cx={15 + i * 7.5} cy={63 + j * 6} r="1.5" fill="#888" opacity="0.5" />
          </React.Fragment>
        ))
      )}
    </g>
  );
}

function LED({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Legs */}
      <line x1="0" y1="40" x2="35" y2="40" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="80" x2="35" y2="80" stroke="#C0C0C0" strokeWidth="2" />
      {/* Anode leg longer */}
      <line x1="35" y1="40" x2="35" y2="48" stroke="#C0C0C0" strokeWidth="2" />
      {/* Bulb */}
      <ellipse cx="45" cy="60" rx="22" ry="28" fill="#FBBF24" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="2" />
      <ellipse cx="45" cy="60" rx="22" ry="28" fill="url(#ledGlow)" />
      {/* Inner glow */}
      <ellipse cx="45" cy="58" rx="14" ry="18" fill="#FEF3C7" fillOpacity="0.5" />
      {/* Flat side (cathode) */}
      <line x1="45" y1="88" x2="53" y2="88" stroke="#92400E" strokeWidth="2" />
      <defs>
        <radialGradient id="ledGlow">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
}

function Servo({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <rect x="40" y="20" width="100" height="120" rx="6" fill="#2563EB" stroke="#1E40AF" strokeWidth="2" />
      {/* Top section */}
      <rect x="40" y="20" width="100" height="25" rx="4" fill="#1E40AF" />
      {/* Horn */}
      <circle cx="90" cy="32" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="90" cy="32" r="3" fill="#92400E" />
      {/* Mount flanges */}
      <rect x="30" y="30" width="10" height="20" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
      <rect x="140" y="30" width="10" height="20" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
      {/* Wire pigtail */}
      <path d="M 40 90 Q 20 90 0 90" fill="none" stroke="#333" strokeWidth="6" />
      {/* Label */}
      <text x="90" y="80" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">SG90</text>
      <text x="90" y="95" textAnchor="middle" fontSize="7" fill="#BFDBFE" fontFamily="monospace">SERVO</text>
    </g>
  );
}

function Ultrasonic({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Board */}
      <rect x="30" y="10" width="130" height="130" rx="4" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2" />
      {/* Label */}
      <text x="95" y="105" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="monospace">HC-SR04</text>
      {/* Two sensor cylinders */}
      <circle cx="65" cy="50" r="25" fill="#C0C0C0" stroke="#888" strokeWidth="2" />
      <circle cx="65" cy="50" r="18" fill="#E8E8E8" />
      <circle cx="65" cy="50" r="10" fill="#FF6B6B" opacity="0.4" />
      <circle cx="125" cy="50" r="25" fill="#C0C0C0" stroke="#888" strokeWidth="2" />
      <circle cx="125" cy="50" r="18" fill="#E8E8E8" />
      <circle cx="125" cy="50" r="10" fill="#6B6BFF" opacity="0.4" />
      {/* Crystal oscillator */}
      <rect x="75" y="85" width="20" height="10" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="0.5" />
    </g>
  );
}

function MotorDriver({ x, y }) {
  const block = (y0, h, n) => (
    <g>
      <rect x="128" y={y0} width="36" height={h} rx="2" fill="#1E9E4A" stroke="#15803D" strokeWidth="1" />
      {Array.from({ length: n }).map((_, i) => {
        const cy = y0 + h / (n * 2) * (2 * i + 1);
        return <g key={i}><circle cx="148" cy={cy} r="7" fill="#D1D5DB" stroke="#6B7280" strokeWidth="1" /><line x1="143" y1={cy} x2="153" y2={cy} stroke="#4B5563" strokeWidth="1.6" /></g>;
      })}
    </g>
  );
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="10" y="6" width="152" height="190" rx="4" fill="#C62828" stroke="#8E1B1B" strokeWidth="2" />
      <rect x="34" y="40" width="70" height="74" rx="2" fill="#B8BEC6" stroke="#7C8590" strokeWidth="1.5" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={38 + i * 7.4} y="40" width="3.6" height="74" fill="#9AA2AD" />
      ))}
      <rect x="22" y="136" width="60" height="26" rx="2" fill="#101418" />
      <text x="52" y="152" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E5E7EB" fontFamily="monospace">L298N</text>
      <rect x="92" y="134" width="22" height="12" rx="2" fill="#15171A" />
      <circle cx="104" cy="165" r="6" fill="#222" stroke="#555" strokeWidth="1" />
      {block(10, 46, 2)}
      {block(66, 72, 3)}
      {block(146, 46, 2)}
      <HeaderPads id="motor_driver" labels={false} />
      {[['OUT1', 24], ['OUT2', 46], ['12V', 80], ['GND', 104], ['5V', 128], ['OUT3', 160], ['OUT4', 182]].map(([t, py]) => (
        <text key={t} x="122" y={py + 2.6} textAnchor="end" fontSize="7" fontWeight="800" fill="#fff" fontFamily="'Inter',sans-serif">{t}</text>
      ))}
    </g>
  );
}

function Buzzer({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Legs */}
      <line x1="0" y1="35" x2="35" y2="35" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="75" x2="35" y2="75" stroke="#C0C0C0" strokeWidth="2" />
      {/* Body */}
      <circle cx="55" cy="55" r="32" fill="#1A1A1A" stroke="#444" strokeWidth="2" />
      <circle cx="55" cy="55" r="26" fill="#333" />
      <circle cx="55" cy="55" r="18" fill="#222" stroke="#555" strokeWidth="1" />
      {/* Sound holes */}
      <circle cx="55" cy="55" r="4" fill="#000" />
      {/* + label */}
      <text x="42" y="44" fontSize="10" fill="#888" fontFamily="monospace" fontWeight="700">+</text>
    </g>
  );
}

function DCMotor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Terminals */}
      <line x1="0" y1="35" x2="25" y2="35" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="75" x2="25" y2="75" stroke="#C0C0C0" strokeWidth="2" />
      {/* Cylindrical body */}
      <rect x="25" y="20" width="70" height="70" rx="35" fill="#C0C0C0" stroke="#888" strokeWidth="2" />
      <rect x="25" y="20" width="70" height="25" rx="35" fill="#E8E8E8" />
      {/* Shaft */}
      <rect x="95" y="50" width="20" height="10" rx="2" fill="#888" stroke="#666" strokeWidth="1" />
      {/* Label */}
      <text x="60" y="60" textAnchor="middle" fontSize="9" fontWeight="700" fill="#555" fontFamily="monospace">DC</text>
    </g>
  );
}

function IRSensor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Board */}
      <rect x="25" y="10" width="100" height="110" rx="4" fill="#7F1D1D" stroke="#991B1B" strokeWidth="2" />
      <text x="75" y="100" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">IR SENSOR</text>
      {/* IR emitter LED */}
      <circle cx="45" cy="45" r="12" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.5" />
      <circle cx="45" cy="45" r="7" fill="#60A5FA" />
      {/* IR receiver */}
      <rect x="65" y="38" width="18" height="14" rx="2" fill="#1A1A1A" stroke="#444" strokeWidth="1" />
      {/* Potentiometer */}
      <rect x="95" y="35" width="18" height="18" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
      <line x1="104" y1="38" x2="104" y2="50" stroke="#fff" strokeWidth="1.5" />
      {/* LEDs */}
      <circle cx="40" cy="85" r="4" fill="#EF4444" />
      <circle cx="55" cy="85" r="4" fill="#22C55E" />
    </g>
  );
}

function LCD({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Board */}
      <rect x="30" y="10" width="170" height="110" rx="4" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2" />
      {/* Display area */}
      <rect x="45" y="25" width="140" height="70" rx="2" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="50" y="30" width="130" height="60" rx="1" fill="#7DD3FC" opacity="0.3" />
      {/* Text lines */}
      <rect x="55" y="38" width="80" height="4" rx="1" fill="#0F172A" opacity="0.7" />
      <rect x="55" y="48" width="100" height="4" rx="1" fill="#0F172A" opacity="0.7" />
      <rect x="55" y="65" width="90" height="4" rx="1" fill="#0F172A" opacity="0.7" />
      <rect x="55" y="75" width="70" height="4" rx="1" fill="#0F172A" opacity="0.7" />
      {/* Header pins */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x="-4" y={25 + i * 25 - 4} width="10" height="8" rx="1" fill="#1A1A1A" />
          <circle cx="0" cy={25 + i * 25} r="1.5" fill="#FFD700" />
        </g>
      ))}
      {/* Potentiometer */}
      <rect x="180" y="90" width="16" height="16" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
      <line x1="188" y1="93" x2="188" y2="103" stroke="#fff" strokeWidth="1.5" />
    </g>
  );
}

function OLED({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="30" y="10" width="120" height="90" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
      {/* Display */}
      <rect x="42" y="22" width="96" height="56" rx="2" fill="#0F172A" stroke="#1E3A8A" strokeWidth="1" />
      <rect x="47" y="27" width="86" height="46" rx="1" fill="#0EA5E9" opacity="0.1" />
      {/* Pixel content */}
      <rect x="52" y="32" width="30" height="3" fill="#22C55E" opacity="0.7" />
      <rect x="52" y="40" width="50" height="3" fill="#22C55E" opacity="0.7" />
      <rect x="52" y="50" width="20" height="3" fill="#22C55E" opacity="0.7" />
      <rect x="52" y="60" width="40" height="3" fill="#22C55E" opacity="0.7" />
      {/* Header pins */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x="-4" y={25 + i * 25 - 4} width="10" height="8" rx="1" fill="#1A1A1A" />
          <circle cx="0" cy={25 + i * 25} r="1.5" fill="#FFD700" />
        </g>
      ))}
    </g>
  );
}

function Relay({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="25" y="10" width="100" height="120" rx="4" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2" />
      <text x="75" y="110" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">RELAY</text>
      {/* Relay box (black) */}
      <rect x="40" y="30" width="70" height="50" rx="2" fill="#1A1A1A" stroke="#444" strokeWidth="1.5" />
      <text x="75" y="58" textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">SRD-5V</text>
      {/* Terminal screws */}
      <circle cx="50" cy="100" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      <circle cx="75" cy="100" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      <circle cx="100" cy="100" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      {/* Status LED */}
      <circle cx="55" cy="25" r="3" fill="#22C55E" />
    </g>
  );
}

function Bluetooth({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="25" y="10" width="100" height="130" rx="4" fill="#2563EB" stroke="#1E40AF" strokeWidth="2" />
      <text x="75" y="120" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">HC-05</text>
      {/* Metal can */}
      <rect x="45" y="25" width="60" height="40" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1.5" />
      <text x="75" y="48" textAnchor="middle" fontSize="8" fill="#333" fontFamily="monospace" fontWeight="700">BT</text>
      {/* Bluetooth symbol */}
      <path d="M 72 68 L 78 72 L 72 76 L 72 64 L 78 68 L 72 72" fill="none" stroke="#fff" strokeWidth="1.5" />
      {/* LED */}
      <circle cx="55" cy="80" r="3" fill="#3B82F6" />
      {/* Button */}
      <rect x="70" y="88" width="20" height="10" rx="2" fill="#1A1A1A" />
    </g>
  );
}

function Battery({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="25" y="10" width="50" height="100" rx="4" fill="#1A1A1A" stroke="#444" strokeWidth="2" />
      {/* Terminal cap */}
      <rect x="40" y="5" width="20" height="8" rx="2" fill="#888" />
      {/* Label */}
      <rect x="30" y="40" width="40" height="35" rx="2" fill="#F59E0B" />
      <text x="50" y="57" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="monospace">9V</text>
      {/* + / - marks */}
      <text x="50" y="22" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">+</text>
      <text x="50" y="100" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">−</text>
    </g>
  );
}

function Resistor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="25" x2="20" y2="25" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="80" y1="25" x2="100" y2="25" stroke="#C0C0C0" strokeWidth="2" />
      {/* Body */}
      <rect x="20" y="15" width="60" height="20" rx="4" fill="#D4A574" stroke="#A06030" strokeWidth="1" />
      {/* Color bands */}
      <rect x="28" y="15" width="5" height="20" fill="#92400E" />
      <rect x="38" y="15" width="5" height="20" fill="#1A1A1A" />
      <rect x="48" y="15" width="5" height="20" fill="#EF4444" />
      <rect x="68" y="15" width="5" height="20" fill="#FBBF24" />
    </g>
  );
}

function PushButton({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="35" x2="20" y2="35" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="75" x2="20" y2="75" stroke="#C0C0C0" strokeWidth="2" />
      {/* Base */}
      <rect x="20" y="15" width="50" height="80" rx="4" fill="#1A1A1A" stroke="#444" strokeWidth="1.5" />
      {/* Button cap */}
      <circle cx="45" cy="55" r="22" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2" />
      <circle cx="45" cy="55" r="14" fill="#C4B5FD" />
      <circle cx="45" cy="55" r="6" fill="#7C3AED" />
    </g>
  );
}

function Stepper({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Square body */}
      <rect x="35" y="20" width="90" height="100" rx="4" fill="#1A1A1A" stroke="#444" strokeWidth="2" />
      {/* Shaft */}
      <rect x="125" y="60" width="15" height="10" rx="2" fill="#888" stroke="#666" strokeWidth="1" />
      {/* Label */}
      <circle cx="80" cy="70" r="25" fill="#333" stroke="#555" strokeWidth="1.5" />
      <text x="80" y="74" textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">STEP</text>
    </g>
  );
}

function LDR({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="35" x2="25" y2="35" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="75" x2="25" y2="75" stroke="#C0C0C0" strokeWidth="2" />
      {/* Disc body */}
      <circle cx="55" cy="55" r="28" fill="#92400E" stroke="#7C2D12" strokeWidth="2" />
      {/* Light-sensitive surface */}
      <circle cx="55" cy="55" r="20" fill="#F59E0B" opacity="0.5" />
      <circle cx="55" cy="55" r="16" fill="#FBBF24" opacity="0.4" />
      {/* Zigzag pattern */}
      <path d="M 45 50 L 50 60 L 55 50 L 60 60 L 65 50" fill="none" stroke="#92400E" strokeWidth="1.5" />
    </g>
  );
}

function TempSensor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="30" x2="25" y2="30" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="65" x2="25" y2="65" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="100" x2="25" y2="100" stroke="#C0C0C0" strokeWidth="2" />
      {/* TO-92 body */}
      <rect x="25" y="15" width="70" height="100" rx="35" fill="#1A1A1A" stroke="#444" strokeWidth="1.5" />
      <rect x="25" y="15" width="70" height="40" rx="35" fill="#333" />
      <text x="60" y="75" textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">DHT11</text>
    </g>
  );
}

function GasSensor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="25" y="10" width="100" height="110" rx="4" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2" />
      <text x="75" y="100" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">MQ-2</text>
      {/* Sensor mesh */}
      <circle cx="75" cy="55" r="28" fill="#1A1A1A" stroke="#555" strokeWidth="2" />
      <circle cx="75" cy="55" r="20" fill="#333" stroke="#666" strokeWidth="1" />
      {/* Mesh holes */}
      {Array.from({ length: 5 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={62 + i * 6.5} cy={42 + j * 6.5} r="1.5" fill="#000" />
        ))
      )}
    </g>
  );
}

function Joystick({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="25" y="10" width="100" height="130" rx="4" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2" />
      <text x="75" y="120" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">JOYSTICK</text>
      {/* Stick base */}
      <circle cx="75" cy="65" r="28" fill="#1A1A1A" stroke="#444" strokeWidth="1.5" />
      {/* Stick shaft */}
      <rect x="70" y="25" width="10" height="40" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      {/* Knob */}
      <circle cx="75" cy="22" r="12" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
    </g>
  );
}

function ArduinoNano({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="120" height="260" rx="4" fill="#00979D" stroke="#006B6F" strokeWidth="2" />
      <text x="60" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="monospace">NANO</text>
      {/* USB */}
      <rect x="40" y="45" width="40" height="25" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      <rect x="45" y="50" width="30" height="15" rx="1" fill="#333" />
      {/* Chip */}
      <rect x="35" y="85" width="50" height="50" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
      <HeaderPads id="arduino_nano" />
    </g>
  );
}

function ESP8266({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="120" height="260" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
      <text x="60" y="28" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">NodeMCU</text>
      {/* Module */}
      <rect x="25" y="40" width="70" height="50" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1.5" />
      <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#333" fontFamily="monospace">ESP8266</text>
      {/* USB */}
      <rect x="40" y="100" width="40" height="25" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="1" />
      <rect x="45" y="105" width="30" height="15" rx="1" fill="#333" />
      {/* Left pins */}
      {[60, 90, 120, 150].map((py, i) => (
        <g key={i}>
          <rect x="-4" y={py - 4} width="10" height="8" rx="1" fill="#222" />
          <circle cx="0" cy={py} r="1.5" fill="#FFD700" />
        </g>
      ))}
      {/* Right pins */}
      {[60, 90, 120, 150].map((py, i) => (
        <g key={i}>
          <rect x="114" y={py - 4} width="10" height="8" rx="1" fill="#222" />
          <circle cx="120" cy={py} r="1.5" fill="#FFD700" />
        </g>
      ))}
    </g>
  );
}

function PowerSupply({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="35" x2="25" y2="35" stroke="#C0C0C0" strokeWidth="2" />
      <line x1="0" y1="75" x2="25" y2="75" stroke="#C0C0C0" strokeWidth="2" />
      <rect x="25" y="15" width="65" height="80" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      <text x="57" y="60" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">PSU</text>
      <text x="57" y="75" textAnchor="middle" fontSize="7" fill="#FEF3C7" fontFamily="monospace">5V/12V</text>
    </g>
  );
}

function RGBLed({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[
        { py: 25, c: '#EF4444' }, { py: 55, c: '#22C55E' },
        { py: 85, c: '#3B82F6' }, { py: 115, c: '#C0C0C0' },
      ].map((leg, i) => (
        <line key={i} x1="0" y1={leg.py} x2="35" y2={leg.py} stroke="#C0C0C0" strokeWidth="2" />
      ))}
      {/* Bulb */}
      <ellipse cx="60" cy="60" rx="28" ry="32" fill="#EC4899" fillOpacity="0.4" stroke="#9333EA" strokeWidth="2" />
      <ellipse cx="60" cy="58" rx="18" ry="20" fill="#fff" fillOpacity="0.3" />
    </g>
  );
}

function A4988({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* shadow */}
      <rect x="3" y="4" width="150" height="170" rx="6" fill="#000" opacity="0.1" />
      {/* PCB body - red */}
      <rect width="150" height="170" rx="6" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
      <rect x="3" y="3" width="144" height="164" rx="4" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.5" />
      {/* Heatsink / chip */}
      <rect x="45" y="55" width="60" height="55" rx="3" fill="#1F2937" stroke="#000" strokeWidth="1" />
      <rect x="50" y="60" width="50" height="45" rx="2" fill="#374151" />
      <text x="75" y="85" textAnchor="middle" fontSize="9" fontWeight="800" fill="#9CA3AF" fontFamily="'Inter',sans-serif">A4988</text>
      {/* Trimpot */}
      <rect x="115" y="115" width="20" height="12" rx="2" fill="#1F2937" />
      <circle cx="125" cy="121" r="3" fill="#6B7280" />
      {/* Left header pins (STEP, DIR, ENABLE, VDD, GND) */}
      {[30, 60, 90, 120, 150].map((py, i) => (
        <g key={i}>
          <rect x="-4" y={py - 4} width="10" height="8" rx="1" fill="#1A1A1A" />
          <circle cx="0" cy={py} r="1.5" fill="#FFD700" />
        </g>
      ))}
      {/* Right header pins (VMOT, MGND) */}
      {[30, 60].map((py, i) => (
        <g key={`r${i}`}>
          <rect x="144" y={py - 4} width="10" height="8" rx="1" fill="#1A1A1A" />
          <circle cx="150" cy={py} r="1.5" fill="#FFD700" />
        </g>
      ))}
      {/* Bottom motor output terminal (green screw block) */}
      <rect x="20" y="148" width="110" height="20" rx="2" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
      {[30, 60, 90, 120].map((px, i) => (
        <circle key={i} cx={px} cy="160" r="3" fill="#1A1A1A" />
      ))}
      {/* Labels */}
      <text x="10" y="22" fontSize="7" fontWeight="700" fill="#fff" fontFamily="'Inter',sans-serif">A4988</text>
    </g>
  );
}

function MPU6050({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="3" y="4" width="120" height="150" rx="6" fill="#000" opacity="0.1" />
      {/* PCB body - blue */}
      <rect width="120" height="150" rx="6" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="2" />
      <rect x="3" y="3" width="114" height="144" rx="4" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
      {/* IMU chip */}
      <rect x="35" y="55" width="50" height="50" rx="3" fill="#0F172A" stroke="#000" strokeWidth="1" />
      <text x="60" y="83" textAnchor="middle" fontSize="8" fontWeight="800" fill="#94A3B8" fontFamily="'Inter',sans-serif">MPU</text>
      <text x="60" y="93" textAnchor="middle" fontSize="7" fontWeight="700" fill="#94A3B8" fontFamily="'Inter',sans-serif">6050</text>
      {/* Left header pins */}
      {[30, 60, 90, 120].map((py, i) => (
        <g key={i}>
          <rect x="-4" y={py - 4} width="10" height="8" rx="1" fill="#1A1A1A" />
          <circle cx="0" cy={py} r="1.5" fill="#FFD700" />
        </g>
      ))}
      {/* Right INT pin */}
      <rect x="114" y="26" width="10" height="8" rx="1" fill="#1A1A1A" />
      <circle cx="120" cy="30" r="1.5" fill="#FFD700" />
      <text x="10" y="22" fontSize="7" fontWeight="700" fill="#fff" fontFamily="'Inter',sans-serif">MPU6050</text>
    </g>
  );
}

function NEMA17({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Mounting face (square) */}
      <rect x="20" y="10" width="110" height="110" rx="4" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
      {/* Body */}
      <rect x="30" y="35" width="90" height="80" rx="3" fill="#6B7280" stroke="#374151" strokeWidth="1.5" />
      {/* Shaft */}
      <rect x="68" y="0" width="14" height="22" rx="2" fill="#D1D5DB" stroke="#6B7280" strokeWidth="1" />
      <rect x="71" y="-4" width="8" height="8" rx="1" fill="#9CA3AF" />
      {/* Coil / hub detail */}
      <circle cx="75" cy="75" r="22" fill="#4B5563" stroke="#1F2937" strokeWidth="1.5" />
      <circle cx="75" cy="75" r="6" fill="#1F2937" />
      {/* Mounting holes */}
      {[[35, 25], [115, 25], [35, 105], [115, 105]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#1F2937" />
      ))}
      {/* Wire leads (left) */}
      {[50, 80, 110, 140].map((py, i) => (
        <line key={i} x1="0" y1={py} x2="28" y2={py} stroke="#374151" strokeWidth="2" />
      ))}
      <text x="65" y="138" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0F172A" fontFamily="'Inter',sans-serif">NEMA 17</text>
    </g>
  );
}


function GearMotor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0 42 H34" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M0 78 H34" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      <rect x="34" y="32" width="44" height="56" rx="22" fill="#C2C8D0" stroke="#7C8590" strokeWidth="1.5" />
      <rect x="34" y="32" width="44" height="18" rx="9" fill="#E5E8EC" opacity="0.8" />
      <rect x="78" y="22" width="44" height="76" rx="4" fill="#F5C518" stroke="#C99A0A" strokeWidth="1.8" />
      <circle cx="89" cy="33" r="2.6" fill="#B07F00" /><circle cx="111" cy="33" r="2.6" fill="#B07F00" />
      <circle cx="89" cy="87" r="2.6" fill="#B07F00" /><circle cx="111" cy="87" r="2.6" fill="#B07F00" />
      <circle cx="100" cy="60" r="9" fill="#FDE68A" stroke="#B07F00" strokeWidth="1.2" />
      <rect x="122" y="48" width="14" height="24" rx="3" fill="#F5C518" stroke="#C99A0A" strokeWidth="1.2" />
      <circle cx="136" cy="60" r="19" fill="#1B1D21" stroke="#0A0B0D" strokeWidth="2" />
      <circle cx="136" cy="60" r="8" fill="#F5C518" stroke="#C99A0A" strokeWidth="1" />
      <circle cx="136" cy="60" r="2.4" fill="#555" />
    </g>
  );
}

function VibrationMotor({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0 34 H40" stroke="#DC2626" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M0 56 H40" stroke="#1F2937" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="62" cy="45" r="22" fill="#C2C8D0" stroke="#7C8590" strokeWidth="1.8" />
      <circle cx="62" cy="45" r="15" fill="#D9DDE2" stroke="#9AA2AD" strokeWidth="1" />
      <circle cx="62" cy="45" r="4" fill="#4B5563" />
      <path d="M92 28 q6 8 0 17 q-6 9 0 17" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 32 q5 6 0 13 q-5 7 0 13" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function AABattery({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0 26 H30" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M0 54 H30" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      <rect x="30" y="8" width="126" height="64" rx="6" fill="#1F2937" stroke="#0F172A" strokeWidth="2" />
      <rect x="40" y="18" width="98" height="44" rx="22" fill="#14B8A6" stroke="#0F766E" strokeWidth="1.5" />
      <rect x="138" y="32" width="8" height="16" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
      <text x="88" y="46" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="'Inter',sans-serif">AA 1.5V</text>
      <text x="46" y="14" fontSize="9" fontWeight="800" fill="#9CA3AF" fontFamily="monospace">−</text>
      <text x="130" y="14" fontSize="9" fontWeight="800" fill="#FCA5A5" fontFamily="monospace">+</text>
    </g>
  );
}

const RENDERERS = {
  arduino_uno: ArduinoUno,
  arduino_nano: ArduinoNano,
  esp32: ESP32,
  esp8266: ESP8266,
  breadboard: Breadboard,
  led: LED,
  rgb_led: RGBLed,
  resistor: Resistor,
  push_button: PushButton,
  buzzer: Buzzer,
  servo: Servo,
  dc_motor: DCMotor,
  stepper: Stepper,
  ultrasonic: Ultrasonic,
  ir_sensor: IRSensor,
  ldr: LDR,
  temp_sensor: TempSensor,
  gas_sensor: GasSensor,
  lcd: LCD,
  oled: OLED,
  battery: Battery,
  power_supply: PowerSupply,
  motor_driver: MotorDriver,
  bluetooth: Bluetooth,
  relay: Relay,
  joystick: Joystick,
  a4988: A4988,
  mpu6050: MPU6050,
  nema17: NEMA17,
  gear_motor: GearMotor,
  vibration_motor: VibrationMotor,
  aa_battery: AABattery,
};

export function RealisticComponent({ componentId, x, y, onComponentClick, selected }) {
  const Renderer = RENDERERS[componentId];
  if (!Renderer) return null;
  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={onComponentClick ? (e) => { e.stopPropagation(); onComponentClick(componentId); } : undefined}
      style={onComponentClick ? { cursor: 'pointer' } : undefined}
    >
      <Renderer x={0} y={0} />
      {selected && (
        <rect x="-2" y="-2" width={REALISTIC_SIZES[componentId].w + 4} height={REALISTIC_SIZES[componentId].h + 4} rx="10"
          fill="none" stroke="#0EA5E9" strokeWidth="3" strokeDasharray="4 2" opacity="0.8" />
      )}
    </g>
  );
}

// Get absolute pin position given component position
export function getPinPosition(componentId, pinId, compX, compY) {
  const pins = REALISTIC_PINS[componentId];
  if (!pins) return null;
  const pin = pins.find(p => p.id === pinId);
  if (!pin) return null;
  return { x: compX + pin.x, y: compY + pin.y };
}

// Component info for tooltips/tap
export const COMPONENT_INFO = {
  arduino_uno: { name: 'Arduino Uno', description: '8-bit microcontroller board based on ATmega328P. Runs at 16MHz with 14 digital pins and 6 analog pins. Perfect for beginners.' },
  arduino_nano: { name: 'Arduino Nano', description: 'Compact version of Arduino Uno with USB connectivity. Same ATmega328P chip in a smaller form factor.' },
  esp32: { name: 'ESP32', description: 'Dual-core 32-bit microcontroller with built-in WiFi and Bluetooth. 30 pins, great for IoT projects.' },
  esp8266: { name: 'ESP8266 (NodeMCU)', description: 'WiFi-enabled microcontroller board. Popular for IoT and smart home projects.' },
  breadboard: { name: 'Breadboard', description: 'Solderless prototyping board. Components plug in directly — no soldering needed. Perfect for testing circuits.' },
  led: { name: 'LED (Light Emitting Diode)', description: 'Lights up when current flows through it (anode to cathode). Always use a 220Ω resistor to limit current!' },
  rgb_led: { name: 'RGB LED', description: 'LED that can produce any color by mixing Red, Green, and Blue. Has 4 pins: R, G, B, and common.' },
  resistor: { name: 'Resistor', description: 'Limits current flow. Used with LEDs to prevent burnout. Color bands indicate resistance value (Ohms).' },
  push_button: { name: 'Push Button', description: 'Momentary switch that closes the circuit when pressed. Used for user input.' },
  buzzer: { name: 'Piezo Buzzer', description: 'Makes sound when voltage is applied. Can play different tones using the tone() function.' },
  servo: { name: 'Servo Motor (SG90)', description: 'Motor that rotates to a precise angle (0° to 180°). Used in robot arms, grippers, and RC steering.' },
  dc_motor: { name: 'DC Motor', description: 'Spins continuously when powered. Direction changes with polarity. Needs a motor driver for control.' },
  stepper: { name: 'Stepper Motor', description: 'Motor that moves in precise steps. Great for 3D printers, CNC machines, and precise positioning.' },
  ultrasonic: { name: 'Ultrasonic Sensor (HC-SR04)', description: 'Measures distance using sound waves. Sends TRIG pulse, reads ECHO time. Range: 2cm to 400cm.' },
  ir_sensor: { name: 'IR Sensor', description: 'Detects infrared light. Used in line followers and obstacle detectors. Outputs LOW when detecting.' },
  ldr: { name: 'LDR (Light Dependent Resistor)', description: 'Resistance changes with light. Low resistance in bright light, high in dark. Used for automatic lights.' },
  temp_sensor: { name: 'Temperature Sensor (DHT11)', description: 'Measures temperature (0-50°C) and humidity (20-90%). Digital output, easy to interface.' },
  gas_sensor: { name: 'Gas Sensor (MQ-2)', description: 'Detects smoke, LPG, CO, and alcohol. Analog output varies with gas concentration.' },
  lcd: { name: 'LCD 16×2 Display', description: 'Shows 16 characters across 2 lines. Uses I2C (SDA/SCL) for communication — only 4 wires needed.' },
  oled: { name: 'OLED Display', description: 'Self-illuminating display, no backlight needed. Crisp graphics using I2C interface.' },
  battery: { name: '9V Battery', description: 'Portable power source. Common for Arduino projects. Connect + to Vin and − to GND.' },
  power_supply: { name: 'Power Supply Module', description: 'Provides regulated 5V or 12V from battery or wall adapter.' },
  motor_driver: { name: 'Motor Driver (L298N)', description: 'Controls motor speed and direction. IN pins set direction, ENA/ENB control speed via PWM.' },
  bluetooth: { name: 'Bluetooth Module (HC-05)', description: 'Wireless communication. Pair with phone to send/receive data. TX→RX, RX→TX crossover.' },
  relay: { name: 'Relay Module', description: 'Electrically operated switch. Lets Arduino control high-voltage devices (lights, fans) safely.' },
  joystick: { name: 'Joystick Module', description: 'Analog joystick with 2 axes (VRX, VRY) and a push button (SW). Great for game controllers.' },
  a4988: { name: 'A4988 Stepper Driver', description: 'Drives one bipolar stepper motor. STEP + DIR pins control motion; VMOT powers the motor (8–35V), VDD is logic (5V).' },
  mpu6050: { name: 'MPU6050 IMU', description: '6-axis accelerometer + gyroscope. Communicates over I2C (SDA/SCL). Used for balance, tilt, and motion sensing.' },
  gear_motor: { name: 'TT Gear Motor + Wheel', description: 'Yellow geared DC motor that drives a robot wheel. Swap its two wires to spin the other way; always power it through a motor driver.' },
  vibration_motor: { name: 'Vibration Motor', description: 'Tiny DC motor with an off-centre weight that makes a phone-style buzz. Driven like any DC motor.' },
  aa_battery: { name: 'AA Battery Holder (1.5V)', description: 'Holds AA cells. Red wire is +, black wire is −.' },
  nema17: { name: 'NEMA 17 Stepper Motor', description: 'Bipolar stepper motor with 200 steps/rev (1.8°). Driven by an A4988 via its 4 coil wires (1A, 1B, 2A, 2B).' },
};