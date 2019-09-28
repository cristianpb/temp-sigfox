import gc
import esp
import uos
import dht
from utime import sleep
from machine import UART, Pin, DEEPSLEEP, RTC, deepsleep

esp.osdebug(None)       # turn off vendor O/S debugging messages
gc.collect()
sensor = dht.DHT22(Pin(5))


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
        message = ""

        while (iter_count >= 0 and success not in message and failure not in message):
            if self.uart.any() > 0:
                c = self.uart.read()
                message += c.decode("utf-8")
            iter_count -= 1
            sleep(0.1)
        if success in message:
            return message
        elif failure in message:
            print("Failure ({})".format(message.replace('\r\n', '')))
        else:
            print("Received timeout ({})".format(message.replace('\r\n', '')))
        return ''

    def test_connection(self):
        print("Testing connection")
        self.uart.write(b"AT\r")
        if self.wait_for('OK', 'ERROR', 3):
            print("connection ok")

    def send_message(self, message):
        self.test_connection()
        print("Sending message")
        self.uart.write(b"AT$SF={}\r".format(message))
        if self.wait_for('OK', 'ERROR', 15):
            print("Message send")


def temp_humidity(captor):
    captor.measure()
    temp = captor.temperature()
    humidity = captor.humidity()
    return temp, humidity


def deep_sleep(msecs):
    # configure RTC.ALARM0 to be able to wake the device
    rtc = RTC()
    rtc.irq(trigger=rtc.ALARM0, wake=DEEPSLEEP)

    # set RTC.ALARM0 to fire after X milliseconds (waking the device)
    rtc.alarm(rtc.ALARM0, msecs)

    # put the device to sleep
    deepsleep()


temp, humidity = temp_humidity(sensor)
sfx = Sigfox()
sfx.send_message("{:.2f}{:.2f}".format(temp, humidity).replace(".", ""))

# sleep for 10 seconds (10000 milliseconds)
deep_sleep(900000)
