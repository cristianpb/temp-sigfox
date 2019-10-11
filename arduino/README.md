# Configure ESP8266 

* Install ESP8266 in Arduino IDE following [this instructions](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/).

* Enter [package_esp8266com_index.json](http://arduino.esp8266.com/stable/package_esp8266com_index.json) into the "Additional Boards Manager URLs" field as shown in the figure below. Then, click the “OK” button.

# Configure Software Serial library 

The last library from Software Serial has some incompatibility problems. It's
recommended to use version 3.4.1 from the following repository
`https://github.com/plerup/espsoftwareserial`.
