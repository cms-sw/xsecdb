import smtplib

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.Utils import COMMASPACE, formatdate

def sendMailOnChanges(messageText, emailSubject, **kwargs):
    msg = MIMEMultipart()
    #send_from = "amlevin@mit.edu"
    send_from = "shawn.gregory.zaleski@cern.ch"
    msg['From'] = send_from
    send_to = ["ek7121@wayne.edu"]
    #send_to = ["shawn.gregory.zaleski@cern.ch"]
    msg['To'] = COMMASPACE.join(send_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = emailSubject
    try:
        msg.attach(MIMEText(messageText))
        smtpObj = smtplib.SMTP()
        smtpObj.connect()
        smtpObj.sendmail(send_from, send_to, msg.as_string())
        smtpObj.close()
    except Excetprion as e:
        print "Error: unable to send email", e.__class__

messageText = """A simple text\n--\nand how to format it in new lines\n"""
emailSubject = "normal email subject"
sendMailOnChanges(messageText, emailSubject)
