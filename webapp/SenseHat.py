#!/usr/bin/python3

import json
import sys
import getopt
import linecache
import time

from sense_emu import SenseHat, ACTION_PRESSED, ACTION_HELD, ACTION_RELEASED

sense = SenseHat()

x = 0
y = 0
z = 0

class EnvData_tph :
       def __init__ (self , temp , press, humi ):
               self.temp = temp
               self.press = press
               self.humi = humi
               
class EnvData_joy :
       def __init__ (self , x, y, z):
               self.x = x
               self.y = y
               self.z = z
               
class EnvData_rpy :
       def __init__ (self , roll , pitch, yaw):
               self.roll = roll
               self.pitch = pitch
               self.yaw = yaw


def pushed_up(event):
    global y
    if event.action != ACTION_RELEASED:
        y = y + 1

def pushed_down(event):
    global y
    if event.action != ACTION_RELEASED:
        y = y - 1

def pushed_left(event):
    global x
    if event.action != ACTION_RELEASED:
        x = x - 1

def pushed_right(event):
    global x
    if event.action != ACTION_RELEASED:
        x = x + 1
        
def pushed_middle(event):
    global z
    if event.action != ACTION_RELEASED:
        z = z + 1

def save_joy():

    with open('data/joy.json', 'w+') as outfile:
        obj_data = EnvData_joy(x, y, z)
        result = json.dumps(obj_data.__dict__)
        outfile.write(result)

def save_tph():

    with open('data/tph.json', 'w+') as outfile:
        obj_data = EnvData_tph(round(temp,2), round(press,2), round(humi,2))
        result = json.dumps(obj_data.__dict__)
        outfile.write(result)

def save_rpy():

    with open('data/rpy.json', 'w+') as outfile:
        obj_data = EnvData_rpy(round(roll,2), round(pitch,2), round(yaw,2))
        result = json.dumps(obj_data.__dict__)
        outfile.write(result)

while True:

    sense.stick.direction_up = pushed_up
    sense.stick.direction_down = pushed_down
    sense.stick.direction_left = pushed_left
    sense.stick.direction_right = pushed_right
    sense.stick.direction_middle = pushed_middle
    sense.stick.direction_any = save_joy
    save_joy()
    
    temp = sense.get_temperature()
    press = sense.get_pressure()
    humi = sense.get_humidity()
    save_tph()
    
    orientation_degrees = sense.get_orientation_degrees()
    
    roll=orientation_degrees["roll"]
    pitch=orientation_degrees["pitch"]
    yaw=orientation_degrees["yaw"]
    save_rpy()
    
    time.sleep(0.1)
