#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>

#define RxNodePin 13
#define TxNodePin 15
#define oneWireBus 5 // GPIO where the DS18B20 is connected to
#define DEBUG 1

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

// Setup UART Communication
SoftwareSerial Sigfox =  SoftwareSerial(RxNodePin, TxNodePin);

String readWireTemperature() {
  sensors.requestTemperatures(); 

  float temperatureC = sensors.getTempCByIndex(0);

  if (isnan(temperatureC)) {
    #if DEBUG == 1
      Serial.println("Failed to read Temperature");
    #endif
    return ".....";
  } else {
    #if DEBUG == 1
      Serial.println("Temp : " + String(temperatureC));
    #endif
    return String(temperatureC);
  }
}

String sendMessage(String sigfoxMsg, int bufferSize) {
  String status = "";
  char sigfoxBuffer;

  // Send AT$SF=xx to WISOL to send XX (payload data of size 1 to 12 bytes)
  Sigfox.print("AT$SF=");
  for (int i = 0; i < bufferSize; i++) {
    if (sigfoxMsg.substring(i, i + 1) != ".") {
      Sigfox.print(sigfoxMsg.substring(i, i + 1));
    }
  }
  Sigfox.print("\r");

  while (!Sigfox.available()) {
    delay(10);
  }

  while (Sigfox.available()) {
    sigfoxBuffer = (char)Sigfox.read();
    status += sigfoxBuffer;
    delay(10);
  }

  return status;
}

void setup() {
  
  #if DEBUG == 1
    // Serial port for debugging purposes
    Serial.begin(115200);
    Serial.setTimeout(2000);
    // Wait for serial to initialize.
    while (!Serial) { }
    Serial.println("\n***** START *****");
  #endif

  pinMode(RxNodePin, INPUT);
  pinMode(TxNodePin, OUTPUT);
  Sigfox.begin(9600);
  delay(100);

  String temperature = readWireTemperature();
  String response = sendMessage(temperature, 5);
  #if DEBUG == 1
    Serial.println("Send message: " + response);
  #endif

  // Deep sleep mode for 800 seconds, the ESP8266 wakes up by itself when GPIO 16 (D0 in NodeMCU board) is connected to the RESET pin
  #if DEBUG == 0
    ESP.deepSleep(800e6);
  #endif
}

void loop() {
  #if DEBUG == 1
    String temperatureC = readWireTemperature();
    delay(5000);
  #endif
}
