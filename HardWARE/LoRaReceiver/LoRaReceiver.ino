#include <SPI.h>
#include <LoRa.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  Serial.println("LoRa Receiver");

  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
}
int counter=1;
void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // received a packet
    

    // read packet
    if(LoRa.available()) {
      if(LoRa.read())
      {
        Serial.print("button was pressed ");
        Serial.print(counter);
        Serial.println(" times");
        counter++;
      }
    }
  }
}
