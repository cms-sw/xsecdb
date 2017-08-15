"""
    Logger functions and handlers
"""
import logging
import logging.handlers

maxBytes = 100000
backupCount = 50

file_error = "logs/error.log"
file_access = "logs/access.log"

logger_error = logging.getLogger("error")
logger_access = logging.getLogger("werkzeug")

formatter = logging.Formatter(fmt='[%(asctime)s][%(levelname)s] %(message)s',
                              datefmt='%d/%b/%Y:%H:%M:%S')

# Error logger
handler = logging.handlers.RotatingFileHandler(file_error, 'a', maxBytes, backupCount)
handler.setFormatter(formatter)
logger_error.addHandler(handler)
logger_error.setLevel(10)

# Access logger 
handler = logging.handlers.RotatingFileHandler(file_access, 'a', maxBytes, backupCount)
handler.setFormatter(formatter)
logger_access.addHandler(handler)

def error(message):
    logger_error.error(message)

def debug(message):
    logger_error.debug(message)