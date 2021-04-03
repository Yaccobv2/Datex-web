#!/usr/bin/env python
import json
from sense_emu import SenseHat
print("IN");
sense = SenseHat();
filename = "/home/pi/server_examples/webapp/data/leddata.json";
f=open(filename, 'r');
ledDisplayArray=json.load(f);
f.close();        
for led in ledDisplayArray:
    # schemat led: y x R G B
    sense.set_pixel(int(led[1]), int(led[0]), int(led[2]), int(led[3]), int(led[4]));
    print("1");