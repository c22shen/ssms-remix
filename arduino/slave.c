#include <XBee.h>
#include <Printers.h>
#include <AltSoftSerial.h>
#include <EmonLib.h>
#include "binary.h"
XBeeWithCallbacks xbee;

AltSoftSerial SoftSerial;
#define DebugSerial Serial
#define XBeeSerial SoftSerial

EnergyMonitor sensor;
int sensorPin = 0;

void setup() {
  // Setup debug serial output
  DebugSerial.begin(115200);
  DebugSerial.println(F("System Starting..."));

  // Setup XBee serial communication
  XBeeSerial.begin(9600);
  xbee.begin(XBeeSerial);
  delay(1);

  // Setup callbacks
  xbee.onPacketError(printErrorCb, (uintptr_t)(Print*)&DebugSerial);
  xbee.onResponse(printErrorCb, (uintptr_t)(Print*)&DebugSerial);

  sensor.current(0, 60);
}

void sendPacket() {
    // Prepare the Zigbee Transmit Request API packet
    ZBTxRequest txRequest;
    txRequest.setAddress64(0x0000000000000000);

    // Allocate 9 payload bytes: 1 type byte plus two floats of 4 bytes each
    AllocBuffer<4> packet;

    // Packet type, temperature, humidity
    packet.append<float>(sensor.calcIrms(1480));
    txRequest.setPayload(packet.head, packet.len());

    // And send it
    xbee.send(txRequest);
}

unsigned long last_send_time = 0;

void loop() {
  // Check the serial port to see if there is a new packet available
  xbee.loop();

  // Send a packet every 10 seconds
  if (millis() - last_send_time > 10000) {
    sendPacket();
    last_send_time = millis();
  }
}