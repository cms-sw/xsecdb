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

# Error loggger
handler = logging.handlers.RotatingFileHandler(file_error, 'a', maxBytes, backupCount)
handler.setFormatter(formatter)
logger_error.addHandler(handler)
logger_error.setLevel(10)

# Access logger (?)
handler = logging.handlers.RotatingFileHandler(file_access, 'a', maxBytes, backupCount)
handler.setFormatter(formatter)
logger_access.addHandler(handler)
logger_access.setLevel(10)

def error(message):
    logger_error.error(message)

def insert(message):
    logger_error.debug("INSERT: " + str(message))

def update(message):
    logger_error.debug("UPDATE: " + str(message))

def delete(message):
    logger_error.debug("DELETE: " + str(message))

def get(message):
    logger_error.debug("GET: " + str(message))

def search(message):
    logger_error.debug("SEARCH " + str(message))

def debug(message):
    logger_error.debug(message)