#include <SPI.h>
#include <LoRa.h>

const int id=5;
int message;
bool fl;
int value=1000;
void setup() {
  Serial.begin(9600);
  if (!LoRa.begin(433E6)) {
    Serial.println("something went wrong");
    while (1);
  }
}

void loop() {
  int packetSize = LoRa.parsePacket();
  Serial.println(packetSize);
  if(packetSize)
  {
    while (LoRa.available()) {
      message=LoRa.parseInt();
    }
    
    Serial.println(message);
    
  }
  else if(message!=0)
  {
    if(id==5)
    {
      LoRa.beginPacket();
      LoRa.print("0012");
      LoRa.endPacket();
      fl=false;
      message=0;
    }
    else
    {
      fl=false;
      message=0;
    }
  }

}
