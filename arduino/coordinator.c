#include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_Client.h>
#include <SPI.h>
#include <Ethernet.h>
#include <XBee.h>
#include <Printers.h>
#include <AltSoftSerial.h>
#include "binary.h"
XBeeWithCallbacks xbee;

AltSoftSerial SoftSerial;
#define DebugSerial Serial
#define XBeeSerial SoftSerial



byte mac[]= {0x90, 0xA2, 0xDA, 0x0D, 0x88, 0x5E} ; // change by your arduino mac address
EthernetClient internetClient; 

const char MQTT_CLIENTID[] PROGMEM  = "";
const char MQTT_USERNAME[] PROGMEM = "afkibthd"; // use your DIoTY user id (=email address)
const char MQTT_PASSWORD[] PROGMEM = "sAgz1qpRVNd4";  // use your DIoTY password
const char MQTT_SERVER[] PROGMEM = "m12.cloudmqtt.com";
const int MQTT_PORT = 10818;
const char topic[] PROGMEM = "/ssms"; 

Adafruit_MQTT_Client mqttClient(&internetClient, MQTT_SERVER, MQTT_PORT, MQTT_CLIENTID,
                          MQTT_USERNAME, MQTT_PASSWORD);


void publish(const __FlashStringHelper *resource, float value) {
  // Use JSON to wrap the data, so Beebotte will remember the data
  // (instead of just publishing it to whoever is currently listening).
  String data;
  data += "{\"data\": ";
  data += value;
  data += ", \"write\": true}";

  DebugSerial.print(F("Publishing "));
  DebugSerial.print(data);
  DebugSerial.print(F( " to "));
  DebugSerial.println(resource);


  // Publish data and try to reconnect when publishing data fails
  if (!mqttClient.publish(resource, data.c_str())) {

    DebugSerial.println(F("Failed to publish, trying reconnect..."));
    mqttConnect();

    if (!mqttClient.publish(resource, data.c_str()))
      DebugSerial.println(F("Still failed to publish data"));
  }
}


void processRxPacket(ZBRxResponse& rx, uintptr_t) {
  Buffer b(rx.getData(), rx.getDataLength());
  XBeeAddress64 addr = rx.getRemoteAddress64();
  publish(F("/ssms"), b.remove<float>());
}

void halt(Print& p, const __FlashStringHelper *s) {
  p.println(s);
  while(true);
}


void internetConnect(){
  if (Ethernet.begin(mac) == 0) {
   halt(DebugSerial, F("Ethernet failed to init"));
  };  
  DebugSerial.println(F("Obtained IP Address:"));
  DebugSerial.println(Ethernet.localIP());
}

void mqttConnect() {
  internetClient.stop(); // Ensure any old connection is closed
  uint8_t ret = mqttClient.connect();
  if (ret == 0)
    DebugSerial.println(F("MQTT connected"));
  else
    DebugSerial.println(mqttClient.connectErrorString(ret));
}


void setup() {  

  DebugSerial.begin(115200);
  DebugSerial.println(F(" System Starting..."));

  XBeeSerial.begin(9600); 
  xbee.begin(XBeeSerial);
  delay(1);

  internetConnect();
  mqttConnect();
  xbee.onZBRxResponse(processRxPacket);
  xbee.onPacketError(printErrorCb, (uintptr_t)(Print*)&Serial);

}

void loop(void) {
  xbee.loop();
  Ethernet.maintain(); 
}
