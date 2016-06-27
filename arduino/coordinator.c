
#include <SPI.h>
#include <PubSubClient.h>
#include <Ethernet.h>

#define DEBUG
#ifdef DEBUG
  #define DEBUG_PRINT(x)  Serial.println (x)
#else
  #define DEBUG_PRINT(x)
#endif

byte mac[]= {0x90, 0xA2, 0xDA, 0x0D, 0x88, 0x5E} ; // change by your arduino mac address
char userId[] = "afkibthd"; // use your DIoTY user id (=email address)
char passwd[] = "sAgz1qpRVNd4";  // use your DIoTY password
char server[] = "m12.cloudmqtt.com";
unsigned int port = 10818;


char topic[] = "/ssms"; // topic where to publish; must be under your root topic
EthernetClient client; 
PubSubClient arduinoClient(server, port, 0, client) ; //no callback function is specified as we only publish


void setup() {                
  Serial.begin(9600); 
   while (!Serial) {
    // wait serial port initialization
  }


  DEBUG_PRINT(F("Initialisation"));
  beginConnection();
}

void beginConnection(){
  DEBUG_PRINT(F("Entering beginConnection"));
  if (Ethernet.begin(mac) == 0) {
    Serial.println(F("Failed to configure Ethernet using DHCP"));
    exit(-1);
  };
  DEBUG_PRINT(F("Obtained IP Address:"));
  DEBUG_PRINT(Ethernet.localIP());
  if (arduinoClient.connect(NULL,userId,passwd)) {
    DEBUG_PRINT(F("Connected to MQTT Server..."));
  } else {
    Serial.println(F("Failed to connect to the MQTT Server"));
    exit(-1);
  }
}

// reconnect after network hiccup      
void reConnect(){
  DEBUG_PRINT(F("Entering reConnect"));
  
  if (arduinoClient.connected()){
    DEBUG_PRINT(F("arduinoClient is connected"));
  } else {
    DEBUG_PRINT(F("arduinoClient is not connected"));
      if (Ethernet.begin(mac) == 0) {
        Serial.println(F("Failed to configure Ethernet using DHCP"));
      };
      DEBUG_PRINT(Ethernet.localIP());
      if (arduinoClient.connect(NULL,userId,passwd)) {
        DEBUG_PRINT(F("Reconnected to MQTT Server..."));
      } else {
        Serial.println(F("Failed to connect to the MQTT Server"));
      }
  };
}
  

unsigned int analogValue;
unsigned char xbeeData[20];
String sendData;


void loop(void) {
  if (Serial.available() >= 21 && Serial.read() == 0x7E) {
    Serial.readBytes(xbeeData, 20);
    sendData = String(xbeeData[11], HEX) + ":" + String(xbeeData[12], HEX) + ":" + String(xbeeData[18], HEX) + ":" + String(xbeeData[19], HEX);
    Serial.println(sendData);
    
    char sendDataCharBuf[sendData.length()+1];
    sendData.toCharArray(sendDataCharBuf, sendData.length()+1);   
    
//    rootJson["add"] = String(xbeeData[11], HEX) + String(xbeeData[12], HEX);
//    rootJson["val"] = String(xbeeData[18], HEX) + String(xbeeData[19], HEX);
//    analogValue = xbeeData[19]  + (xbeeData[18] *256); 



    if (!arduinoClient.loop()) {
        DEBUG_PRINT(F("Arduino Client loop nok"));
      if (arduinoClient.connect(NULL,userId,passwd)) {
        DEBUG_PRINT(F("mqtt reconnected."));
      } else {
        DEBUG_PRINT(F("mqtt reconnection FAILED :(."));
      }
    } else {
        DEBUG_PRINT(F("Arduino Client loop ok"));
      arduinoClient.publish(topic, (uint8_t*) sendDataCharBuf, strlen(sendDataCharBuf), 1);  
    }
  } 
}
