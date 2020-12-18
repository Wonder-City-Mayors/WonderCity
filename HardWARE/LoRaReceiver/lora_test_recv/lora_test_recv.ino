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
  pinMode(3, OUTPUT);
  digitalWrite(3, 0);
}

void loop() {
  
  if(LoRa.parsePacket())
  {
     Serial.println(LoRa.parsePacket());
    while (LoRa.available()) {
      message=LoRa.parseInt();
    }
    
    Serial.println(message);
    if(id==message)
    {
      //delay(3000);
      Serial.println("i send");
      LoRa.beginPacket();
      LoRa.print(value*(rand()%7));
      LoRa.endPacket();
      message=0;
      digitalWrite(3,1);
    }
    else
    {
      message=0;
    }
  }
}
