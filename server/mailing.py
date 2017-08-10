import smtplib
import logger

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.Utils import COMMASPACE, formatdate
from config import CONFIG

def send_mail(body, subject, recipients, **kwargs):
    sender = CONFIG.MAIL_SEND_FROM

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = COMMASPACE.join(recipients)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    logger.debug(msg)
    logger.debug(recipients)

    try:
        msg.attach(MIMEText(body))
        smtpObj = smtplib.SMTP()
        smtpObj.connect()
        smtpObj.sendmail(sender, recipients, msg.as_string())
        smtpObj.close()
    except Exception as e:
        print "Error: unable to send email", e.__class__, e.message