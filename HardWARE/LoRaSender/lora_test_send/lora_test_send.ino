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
  
  if (!fl&&Serial.available())
  {
    while(Serial.available())
      id=id*10+Serial.read()-'0';
    LoRa.beginPacket();
    LoRa.print(id);
    LoRa.endPacket();
    //Serial.println(id);
    fl=true;
    timer=millis();
    LoRa.end();
    LoRa.begin(433E6);
  }
  if(fl&&LoRa.parsePacket()>0)
  {
    while(LoRa.available())
      message=message*10+LoRa.read()-'0';
  }
  if(fl&&message!=0)
  {
    Serial.print(message);
    Serial.print("#");
    message=0;
    id=0;
    fl=false;
  }
  else if(fl&&millis()-timer>=7500)
  {
    Serial.print("error#");
    message=0;
    id=0;
    fl=false;
    timer=millis();
  }
}
