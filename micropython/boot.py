import gc
import esp
import uos
import ubinascii
from utime import sleep
from machine import UART, Pin, DEEPSLEEP, RTC, deepsleep
from ds18x20 import DS18X20
from onewire import OneWire

esp.osdebug(None)       # turn off vendor O/S debugging messages
gc.collect()


class Sigfox(object):
    def __init__(self):
        uos.dupterm(None, 1)
        self.uart = UART(0, 9600)
        self.uart.init(9600, bits=8, parity=None, stop=1)

    def wait_for(self, success, failure, timeout):
        """Wait for a response
        Args:
            success: success message
            failure: failure message
            timeout: timeout in seconds
        """
        iter_count = timeout / 0.1
        success_h = ubinascii.hexlify(success).decode('utf-8')
        failure_h = ubinascii.hexlify(failure).decode('utf-8')
        message = ""

        while (iter_count >= 0 and
                success_h not in message and
                failure_h not in message):
            if self.uart.any() > 0:
                c = self.uart.read()
                hex_str = ubinascii.hexlify(c).decode("utf-8")
                message += hex_str
            iter_count -= 1
            sleep(0.1)
        if success_h in message:
            return message
        elif failure_h in message:
            print("Failure ({})".format(message.replace('\r\n', '')))
        else:
            print("Received timeout ({})".format(message.replace('\r\n', '')))
        return ''

    def test_connection(self, timeout=3):
        print('testing connection')
        self.uart.write("AT\r")
        if self.wait_for('OK', 'ERROR', timeout):
            return 'connection ok'
        else:
            return ''

    def send_message(self, message):
        res = ''
        while not res:
            res = self.test_connection(timeout=1)
        print('connection ok, sending message')
        self.uart.write("AT$SF={}\r".format(message))
        if self.wait_for('OK', 'ERROR', 15):
            print('Message send')


class TemperatureSensor:
    def __init__(self, pin):
        """Finds address of single DS18B20 on bus specified by `pin`
        Args:
            pin: 1-Wire bus pin
        """
        self.ds = DS18X20(OneWire(Pin(pin)))
        addrs = self.ds.scan()
        if not addrs:
            raise Exception('no DS18B20 found at bus on pin %d' % pin)
        # save what should be the only address found
        self.addr = addrs.pop()

    def read_temp(self):
        """Reads temperature from a single DS18X20
        """
        self.ds.convert_temp()
        sleep(0.75)
        return self.ds.read_temp(self.addr)


def deep_sleep(msecs):
    # configure RTC.ALARM0 to be able to wake the device
    rtc = RTC()
    rtc.irq(trigger=rtc.ALARM0, wake=DEEPSLEEP)

    # set RTC.ALARM0 to fire after X milliseconds (waking the device)
    rtc.alarm(rtc.ALARM0, msecs)

    # put the device to sleep
    deepsleep()


sfx = Sigfox()
sensor = TemperatureSensor(5)
temp = sensor.read_temp()
sfx.send_message("{:.2f}".format(temp).replace(".", ""))

deep_sleep(900000)
