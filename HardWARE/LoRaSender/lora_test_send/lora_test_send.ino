#include <SPI.h>
#include <LoRa.h>



void setup() {
  Serial.begin(9600);
  if (!LoRa.begin(433E6)) {
    Serial.println("something went wrong");
    while (1);
  }

}
int id;
int message;
unsigned long long timer;
bool fl;
void loop() {
  
  if (Serial.available())
  {
    id=Serial.parseInt();
    LoRa.beginPacket();
    LoRa.print(id);
    LoRa.endPacket();
    //Serial.println(id);
    fl=true;
    timer=millis();
  }
  if(LoRa.parsePacket())
  {
    while(LoRa.available())
      message=LoRa.parseInt();
  }
  if(message!=0)
  {
    Serial.println(message);
    message=0;
    id=0;
    fl=false;
  }
  else if(fl&&millis()-timer>=5000)
  {
    Serial.println("error");
    message=0;
    id=0;
    fl=false;
    timer=millis();
  }
}
