#include <Adafruit_MQTT.h> 
#include <Adafruit_MQTT_Client.h> 
#include <SPI.h> 
#include <Ethernet.h>
#include <XBee.h> 
#include <Printers.h> 
#include <AltSoftSerial.h> 
#include "binary.h"

XBeeWithCallbacks xbee;
uint8_t mqtt_response;

AltSoftSerial SoftSerial;
#define DebugSerial Serial
#define XBeeSerial SoftSerial

byte mac[] = { 0x90, 0xA2, 0xDA, 0x0D, 0x88, 0x5E }; // change by your arduino mac address
EthernetClient internetClient;

const char MQTT_CLIENTID[] PROGMEM = "";
const char MQTT_USERNAME[] PROGMEM = "afkibthd"; // use your DIoTY user id (=email address)
const char MQTT_PASSWORD[] PROGMEM = "sAgz1qpRVNd4"; // use your DIoTY password
const char MQTT_SERVER[] PROGMEM = "m12.cloudmqtt.com";
const int MQTT_PORT = 10818;
unsigned long last_send_time = 0;

Adafruit_MQTT_Client mqttClient( & internetClient, MQTT_SERVER, MQTT_PORT, MQTT_CLIENTID,
    MQTT_USERNAME, MQTT_PASSWORD);

void publish(const __FlashStringHelper * resource, float value) {

    String data;
    data += value;

    // Publish data and try to reconnect when publishing data fails
    if (!mqttClient.publish(resource, data.c_str())) {
        DebugSerial.println(F("Failed to publish, trying reconnect..."));
        mqttConnect();
    }
}

void halt(Print & p,
    const __FlashStringHelper * s) {
    p.println(s);
    while (true);
}

void internetConnect() {
    if (Ethernet.begin(mac) == 0) {
        halt(DebugSerial, F("Ethernet failed to init"));
    };
    DebugSerial.println(F("Obtained IP Address:"));
    DebugSerial.println(Ethernet.localIP());
}

void mqttConnect() {
    internetClient.stop(); // Ensure any old connection is closed
    mqtt_response = mqttClient.connect();
    //  DebugSerial.println(F("MQTT connecting"));
    if (mqtt_response == 0) {
        //    DebugSerial.println(F("MQTT connected"));
        publish(F("mqttConnection"), 0);
    } else {
        DebugSerial.print(F("MQTT connection Failed: "));
        DebugSerial.println(mqttClient.connectErrorString(mqtt_response));
    }
}

void setup() {
    // Setup debug serial output
    DebugSerial.begin(115200);
    DebugSerial.println(F("Coordinator Starting..."));

    // Setup XBee serial communication
    XBeeSerial.begin(9600);
    xbee.begin(XBeeSerial);
    delay(1);
    internetConnect();
    delay(500);
    mqttConnect();

    // Setup callbacks
    xbee.onPacketError(printErrorCb, (uintptr_t)(Print * ) & DebugSerial);
    xbee.onResponse(printErrorCb, (uintptr_t)(Print * ) & DebugSerial);
    xbee.onZBRxResponse(processRxPacket);
}

void processRxPacket(ZBRxResponse & rx, uintptr_t) {
    DebugSerial.println(F("Message received"));
    Buffer b(rx.getData(), rx.getDataLength());
    XBeeAddress64 addr = rx.getRemoteAddress64();
//    DebugSerial.println(addr,HEX);
    if (b.len() == 4 ) {
      if (addr == 0x0013A20041629B6C) {
//        DebugSerial.println(F("0013A20041629B6C"));
        publish(F("0013A20041629B6C"), b.remove < float > ());
        return;        
      } else if (addr == 0x0013A20041629B76) {
//        DebugSerial.println(F("0013A20041629B76"));
        publish(F("0013A20041629B76"), b.remove < float > ());
        return;
      }else if (addr == 0x0013A20040D7B896) {
//        DebugSerial.println(F("0013A20040D7B896"));
        publish(F("0013A20040D7B896"), b.remove < float > ());
        return;
      }else if (addr == 0x0013A20041629B72) {
//        DebugSerial.println(F("0013A20041629B72"));
        publish(F("0013A20041629B72"), b.remove < float > ());
        return;
      }else if (addr == 0x0013A20041629B77) {
//        DebugSerial.println(F("0013A20041629B77"));
        publish(F("0013A20041629B77"), b.remove < float > ());
        return;
      } else if (addr == 0x0013A20041629B6A) {
//        DebugSerial.println(F("0013A20041629B6A"));
        publish(F("0013A20041629B6A"), b.remove < float > ());
        return;
      } else if (addr == 0x0013A20040D7B872) {
//        DebugSerial.println(F("0013A20040D7B872"));
        publish(F("0013A20040D7B872"), b.remove < float > ());
        return;
      } else if (addr == 0x0013A20040B09A44) {
//        DebugSerial.println(F("0013A20040B09A44"));
        publish(F("0013A20040B09A44"), b.remove < float > ());
        return;        
      }    
      
//      
//      else if (addr == 0x0013A20040D7B885) {
//        DebugSerial.println(F("0013A20040D7B885"));
//        publish(F("0013A20040D7B885"), b.remove < float > ());
//        return;
//      }
      
        //      DebugSerial.println(b.remove<float>());
        
    }

    
    //  this should get extended for all the xbee's

    DebugSerial.println(F("Unknown or invalid packet"));
    printResponse(rx, DebugSerial);
}

void loop() {
    // Check the serial port to see if there is a new packet available
    xbee.loop();
    Ethernet.maintain();

    if (millis() - last_send_time > 10000) {
        if (mqtt_response != 0) { // connect will return 0 for connected
            mqttClient.disconnect();
            mqttConnect();
        }
        last_send_time = millis();
    }
}
