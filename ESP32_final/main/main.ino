#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include "DHT.h"

int minTemp = 18;
int maxTemp = 28;
int minMoist = 40;
int maxMoist = 75;
int minHumid = 40;
int maxHumid = 80;

#define DHTPIN 15      // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11  // DHT 11
#define LIGHT 27
#define MOISTURE 36
//#define NPK 12

#define HEATER 25
#define FAN 5
#define WATER 33
//#define LIGHTS 33
//#define HUMIDIFIER 11


#define USERNAME "user"

#define AWS_IOT_PUBLISH_TOPIC "topic_name"
#define AWS_IOT_SUBSCRIBE_TOPIC "topic_name"
#define AWS_IOT_SHUTDOWN_TOPIC "topic_name"

int count = 0;
float h, t, l, m;
int heater_state, fan_state, light_state, water_state;

DHT dht(DHTPIN, DHTTYPE);

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

void evaluateConditions() {
  if ((float)t < (float)minTemp) {
    digitalWrite(HEATER, HIGH);
    heater_state = 1;
  } else {
    digitalWrite(HEATER, LOW);
    heater_state = 0;
  }

  if ((float)t > (float)maxTemp) {
    digitalWrite(FAN, HIGH);
    fan_state = 1;
  } else {
    digitalWrite(FAN, LOW);
    fan_state = 0;
  }

  if ((float)m < (float)minMoist) {
    activateWaterPump();
    Serial.println("Water pump is pumping water");
    water_state = 1;
  } else {
    digitalWrite(WATER, LOW);
    water_state = 0;
  }

  light_state = (l == 1) ? 1 : 0;
}


void connectAWS() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(WIFI_SSID);
  Serial.print(WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");
  int c = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(5000);
    Serial.print(".");
    c = c + 1;
    if (c > 10) {
      ESP.restart();
    }
  }

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);

  // Create a message handler
  client.setCallback(messageHandler);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  client.subscribe(AWS_IOT_SHUTDOWN_TOPIC);

  Serial.println("AWS IoT Connected!");
}

void publishMessage() {
  StaticJsonDocument<200> doc;
  doc["username"] = USERNAME;
  doc["humidity"] = h;
  doc["temperature"] = t;
  doc["moisture"] = m;
  doc["light"] = l;
  doc["heater_state"] = heater_state;
  doc["fan_state"] = fan_state;
  doc["light_state"] = light_state;
  doc["water_state"] = water_state;
  // JsonArray tempRange = doc.createNestedArray("temp_range");
  // tempRange.add(minTemp);
  // tempRange.add(maxTemp);

  // JsonArray moistRange = doc.createNestedArray("moisture_range");
  // moistRange.add(minMoist);
  // moistRange.add(maxMoist);

  // JsonArray humidRange = doc.createNestedArray("humidity_range");
  // humidRange.add(minHumid);
  // humidRange.add(maxHumid);

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);  // print to client

  bool success = client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
if (success) {
  Serial.println("Message published successfully.");
} else {
  Serial.println("Message publish failed.");
}
}

void messageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("Incoming message on topic: ");
  Serial.println(topic);

  Serial.print("Payload: ");
  Serial.write(payload, length);
  Serial.println();

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    return;
  }

  if (doc.containsKey("minTemp")) {
    minTemp = doc["minTemp"].as<int>();
    Serial.print("Updated minTemp: ");
    Serial.println(minTemp);
  }

  if (doc.containsKey("maxTemp")) {
    maxTemp = doc["maxTemp"].as<int>();
    Serial.print("Updated maxTemp: ");
    Serial.println(maxTemp);
  }

  if (doc.containsKey("minMoist")) {
    minMoist = doc["minMoist"].as<int>();
    Serial.print("Updated minMoist: ");
    Serial.println(minMoist);
  }

  if (doc.containsKey("maxMoist")) {
    maxMoist = doc["maxMoist"].as<int>();
    Serial.print("Updated maxMoist: ");
    Serial.println(maxMoist);
  }

  if (doc.containsKey("minHumid")) {
    minHumid = doc["minHumid"].as<int>();
    Serial.print("Updated minHumid: ");
    Serial.println(minHumid);
  }

  if (doc.containsKey("maxHumid")) {
    maxHumid = doc["maxHumid"].as<int>();
    Serial.print("Updated maxHumid: ");
    Serial.println(maxHumid);
  }

  // Re-evaluate logic with new thresholds
  evaluateConditions();
}


void setup() {
  Serial.begin(115200);
  connectAWS();
  dht.begin();
  pinMode(FAN, OUTPUT);
  pinMode(MOISTURE, INPUT);
  pinMode(LIGHT, INPUT);
  pinMode(WATER, OUTPUT);

  digitalWrite(FAN, LOW);
  digitalWrite(WATER, LOW);
}

void activateWaterPump() {
  for (int i = 0; i < 3; i++) {  // Run for a limited time
    digitalWrite(WATER, HIGH);
    delay(750);  // ON for 600ms
    digitalWrite(WATER, LOW);
    delay(900);  // OFF for 700ms
  }
}

unsigned long lastPublish = 0;

void loop() {
  if (!client.connected()) {
    Serial.println("MQTT disconnected, reconnecting...");
    connectAWS();
  }
  client.loop();  // Keep connection alive

  // Try to publish every 30 seconds
  if (millis() - lastPublish >= 60000) {
    lastPublish = millis();

    // Sensor reading logic...
    bool validSensorData = false;
    for (int attempts = 0; attempts < 3; attempts++) {
      h = dht.readHumidity();
      t = dht.readTemperature();
      if (!isnan(h) && !isnan(t)) {
        validSensorData = true;
        break;
      }
      delay(4000);
    }

    if (!validSensorData) {
      Serial.println("DHT sensor failed after retries. Skipping this loop.");
      return;
    }

    t = t - (t > 25 ? 0.4 * t : 0.12 * t);  // Correction
    m = analogRead(MOISTURE);
    m = 100 - ceil((m * 100) / 4095);
    l = digitalRead(LIGHT);

    evaluateConditions();
    publishMessage();
  }
}
