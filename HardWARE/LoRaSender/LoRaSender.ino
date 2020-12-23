#include <SPI.h>
#include <LoRa.h>

int counter = 0;

void setup() {
  //Serial.begin(9600);
 //////////////while (!Serial);

  //Serial.println("LoRa Sender");

  if (!LoRa.begin(433E6)) {
   // Serial.println("Starting LoRa failed!");
    while (1);
  }
  pinMode(6, INPUT_PULLUP);
  pinMode(3, OUTPUT);
}

void loop() {
  // send packet
  if(!digitalRead(6))
  {
    LoRa.beginPacket();
    LoRa.print(true);
    LoRa.endPacket();
    delay(100);
    //digitalWrite(3, HIGH);
  }
  /*LoRa.beginPacket();
    LoRa.print(true);
    LoRa.endPacket();
    delay(500);*/
}
