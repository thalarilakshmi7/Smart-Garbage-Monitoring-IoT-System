#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid="YOUR_WIFI";
const char* password="YOUR_PASSWORD";

#define TRIG 5
#define ECHO 18

void setup(){

Serial.begin(115200);

pinMode(TRIG,OUTPUT);
pinMode(ECHO,INPUT);

WiFi.begin(ssid,password);

while(WiFi.status()!=WL_CONNECTED){

delay(1000);
Serial.println("Connecting WiFi...");

}

Serial.println("WiFi connected");

}

float getDistance(){

digitalWrite(TRIG,LOW);
delayMicroseconds(2);

digitalWrite(TRIG,HIGH);
delayMicroseconds(10);

digitalWrite(TRIG,LOW);

long duration=pulseIn(ECHO,HIGH);

return duration*0.034/2;

}

void loop(){

if(WiFi.status()==WL_CONNECTED){

HTTPClient http;

float level=getDistance();

String json="{\"binId\":\"BIN1\",\"level\":"+String(level)+",\"lat\":12.9716,\"lng\":77.5946}";

http.begin("http://YOUR_PC_IP:3000/bins/update");

http.addHeader("Content-Type","application/json");

http.POST(json);

http.end();

}

delay(10000);

}