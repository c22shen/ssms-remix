int sensorValue = 0 ;
int sensorPin = A0;
int outputPin = 9;
int r0, r1, r2, u0, u1, u2, v;
int counter = 0;
float AMS;
int Arms;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  r2 = r1;
  r1 = r0;
  r0 = analogRead(A0);
  u2 = u1;
  u1 = u0;
  // 0.5Hz to 200Hz Band Pass Filter
  u0 = 0.2929*(r0-r2) + 1.411*u1 -0.4142*u2;
  v = u0;
  // Calculate Mean-Square Current (Amps)
  AMS = 0.99*AMS +0.01*v*v;
  // Calculate Root-Mean-Square (Amps)
  Arms = sqrt(AMS);
  
  if (counter == 5000){
  
    if (Arms> 168){
      Arms = 168;
    }
//  Serial.println(Arms);
    analogWrite(outputPin,Arms);  
    counter = 0;
  }
  counter++;
}