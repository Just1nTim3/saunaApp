
//Temps
#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 4

//Secrets

#include <MySecrets.h>
#define wifiName WIFI_NAME
#define wifiPassword WIFI_PASSWORD

//Web

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
// String servicePath = "http://192.168.0.115:8080/test";
String servicePath = "http://192.168.0.115:8080/saunaApp/addTemp";
String tempData = "";
String payload = "";
int responseCode = 200;

void setup() {
  Serial.begin(9600);
  sensors.begin();

  WiFi.begin(wifiName, wifiPassword);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  sensors.requestTemperatures();
  Serial.print("Temp: ");
  Serial.println(sensors.getTempCByIndex(0));

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    tempData = "{\"temp\":\"" + String(sensors.getTempCByIndex(0)) + "\"}";

    http.begin(client, servicePath);
    http.addHeader("Content-Type", "application/json");
    //int responseCode = http.GET();
    responseCode = http.POST(tempData);
    if (responseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(responseCode);
      payload = http.getString();
      Serial.println(payload);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(responseCode);
    }
    // Free resources
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }

//TODO: get rid of delay and switch to milis loop
  delay(20000);
}
