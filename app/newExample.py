import json
from flask import Flask, render_template, send_from_directory, request
from flask import jsonify, request, flash
import pymongo
from pymongo import MongoClient, ReturnDocument
import re
from datetime import datetime
import time

from forms import InsertForm
from updateForm import UpdateForm
from deleteForm import DeleteForm
from queryForm import QueryForm

from bson.objectid import ObjectId
from bson.json_util import dumps

import smtplib

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.Utils import COMMASPACE, formatdate


client = MongoClient('mongodb://WorkingVM:27017/')
db = client.xsdb
collection = db.xsdbCollection


app = Flask(__name__)
app.secret_key = 'development key'
def sendMailOnChanges(messageText, emailSubject, **kwargs):
    msg = MIMEMultipart()
    #send_from = "amlevin@mit.edu"
    send_from = "shawn.gregory.zaleski@cern.ch"
    msg['From'] = send_from
    send_to = ["ek7121@wayne.edu; shawn.gregory.zaleski@cern.ch; prakash.thapa@wayne.edu"]
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


@app.route("/")
def home():
    return send_from_directory("templates","home.html")

@app.route("/test", methods=['POST', 'GET'])
def test():
    form = QueryForm

    if request.method == 'POST':
        if form().validate() ==False:
            flash('All Fields are required!')
            return render_template("query.html", form = form())
        else:
            now = datetime.fromtimestamp(time.time())
            
            res = []
            myregex = re.compile(request.form["value"], re.I)
            for user in collection.find({request.form["key"]: myregex}):
        #res.append('<br/>')
        #res.append('<br/>')
                _tmp = user
                print _tmp
                print "\n"
        #        del(_tmp['_id'])
                res.append(_tmp)
                return render_template('table.html', result=res)
            print _tmp['_id'].getTimestamp()
            dummy_data = {"a1":11, "b1":222}
#            print "received this input: %s" % (user_input)
    #    collection.find().forEach(function(doc){ d = doc._id.getTimeStamp(); print(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate())})
 #           return json.dumps(str(request.data))
    #    return json.dumps({})

        
    elif request.method == 'GET':
        return render_template("query.html", form = form())

@app.route("/query")
def query():
    return send_from_directory("static", "index.html")


@app.route("/insert", methods=['POST', 'GET'])
def insert():

    form = InsertForm

    if request.method == 'POST':
        if form().validate() ==False:
            flash('All Fields are required!')
            return render_template("insert.html", form = form())
        else:
            now = datetime.fromtimestamp(time.time())
            collection.insert({'process_name':request.form['process_name'],'cross_section':request.form['cross_section'],'total_uncertainty':request.form['total_uncertainty'],'other_uncertainty':request.form['other_uncertainty'],'cuts':request.form['cuts'],'energy':request.form['energy'],'kFactor':request.form['kFactor'],'reweighting':request.form['reweighting'],'shower':request.form['shower'],'matrix_generator':request.form['matrix_generator'],'contact':request.form['contact'],'DAS':request.form['DAS'],'MCM':request.form['MCM'],'refs':request.form['refs'],'accuracy':request.form['accuracy'],'comments':request.form['comments'],'validFrom':now.strftime('%Y-%m-%d'),'validTo':"present",'isValid':"YES",'equivalent_lumi':request.form['equivalent_lumi'],'fraction_negative_weight':request.form['fraction_negative_weight']})
#'valid':request.form['valid'],'test':request.form['test']})

            '''
            writeFile = open("/home/app/newLog.txt", "a")
            writeFile.write("\n\nThis is an insert operation!")
            writeFile.write("\n\n"+now.strftime('%H:%M:%S %Y-%m-%d'))
            writeFile.write("\nprocess_name:"+request.form['process_name'])
            writeFile.write("\ncross_section:"+request.form['cross_section'])
            writeFile.write("\naccuracy:"+request.form['accuracy'])
            writeFile.write("\ntotal_uncertainty:"+request.form['total_uncertainty'])
            writeFile.write("\nother_uncertainty:"+request.form['other_uncertainty'])
            writeFile.write("\ncuts:"+request.form['cuts'])
            writeFile.write("\nkFactor:"+request.form['kFactor'])
            writeFile.write("\nreweighting:"+request.form['reweighting'])
            writeFile.write("\nshower:"+request.form['shower'])
            writeFile.write("\nmatrix_generator:"+request.form['matrix_generator'])
            writeFile.write("\ncontact:"+request.form['contact'])
            writeFile.write("\nrefs:"+request.form['refs'])
            writeFile.write("\nDAS:"+request.form['DAS'])
            writeFile.write("\nMCM:"+request.form['MCM'])
            writeFile.close()
            '''

            messageText = """Dear DB tool admin,\n\nThe following information was inserted into the DB tool by a user:\n\nProcess Name: """+request.form['process_name']+"""\nCross Section: """+request.form['cross_section']+"""\nTotal Uncertainty: """+request.form['total_uncertainty']+"""\nOther Uncertainty: """+request.form['other_uncertainty']+"""\nCuts: """+request.form['cuts']+"""\nK-Factor: """+request.form['kFactor']+"""\nReweighting: """+request.form['reweighting']+"""\nShower Tool: """+request.form['shower']+"""\nMatrix Generator: """+request.form['matrix_generator']+"""\nAccuracy: """+request.form['accuracy']+"""\nContact: """+request.form['contact']+"""\nReferences: """+request.form['refs']+"""\nDAS link: """+request.form['DAS']+"""\nMCM link: """+request.form['MCM']+"""\n\nPlease confirm the above information in the tool at your earliest convenience."""
            emailSubject = "DB Tool Insert performed"
            # sendMailOnChanges(messageText, emailSubject)

            return render_template("success.html")
        
    elif request.method == 'GET':
        return render_template("insert.html", form = form())

@app.route("/update", methods=['POST', 'GET'])
def update():
    form = UpdateForm
    if request.method == 'POST':
        if form().validate() == False:
            flash('Please fill in all Fields!')
            return render_template("update.html", form = form())
        else:
            now = datetime.fromtimestamp(time.time())
            collection.update({'_id':ObjectId(request.form['object_id'])},{'$set':{request.form['updateKey']:request.form['updateValue'], 'valid':now.strftime('%Y-%m-%d')}}, upsert=False)
            writeFile = open("/home/app/newLog.txt", "a")
            writeFile.write("\n\nThis is an update operation!")
            writeFile.write("\n\n"+now.strftime('%H:%M:%S %Y-%m-%d'))
            writeFile.write("\nObjectId:"+request.form['object_id'])
            writeFile.write("\n"+request.form['updateKey']+":"+request.form['updateValue'])
            writeFile.close()
            messageText = """Dear DB tool admin,\n\nThe following information was updated against the DB tool by a user:\n\nObject ID: """+request.form['object_id']+"""\nKey Updated: """+request.form['updateKey']+"""\nUpdated Value: """+request.form['updateValue']+"""\n\nPlease confirm the above information in the tool at your earliest convenience."""
            emailSubject = "DB Tool Update performed"
            sendMailOnChanges(messageText, emailSubject)

#            collection.update({'process_name':request.form['process_name']}, {'$set':{request.form['updateKey']:request.form['updateValue']}}, upsert=False)
            return render_template("success.html")
    elif request.method == 'GET':
        return render_template("update.html", form = form())

@app.route("/remove", methods=['POST', 'GET'])
def remove():
    form = DeleteForm
    if request.method == 'POST':
        if form().validate() == False:
            flash('Please fill in all Fields!')
            return render_template("delete.html", form = form())
        else:
            now = datetime.fromtimestamp(time.time())
            collection.delete_one({'_id':ObjectId(request.form['object_id'])})
            writeFile = open("/home/app/newLog.txt", "a")
            writeFile.write("\n\nThis is an delete operation!")
            writeFile.write("\n\n"+now.strftime('%H:%M:%S %Y-%m-%d'))
            writeFile.write("\nObjectId:"+request.form['object_id'])
            writeFile.close()
            messageText = """Dear DB tool admin,\n\nThe following entry was deleted against the DB tool by a user:\n\nObjectID: """+request.form['object_id']+"""\n\nPlease confirm the above information in the tool at your earliest convenience."""
            emailSubject = "DB Tool Delete performed"
            sendMailOnChanges(messageText, emailSubject)

#            collection.update({'process_name':request.form['process_name']}, {'$set':{request.form['updateKey']:request.form['updateValue']}}, upsert=False)
            return render_template("success.html")
    elif request.method == 'GET':
        return render_template("delete.html", form = form())


@app.route("/search/<key>/<value>", methods=['GET'])
def search(key, value):
    res = []
#    search_value = json.loads(request.data)
 #   print "##DEBUG## DATA: %s search:%s" % (request.data, search_value) 
    myregex = re.compile(value, re.I)
    for user in collection.find({key: myregex}):#search_value['value'] }):
        #res.append('<br/>')
        #res.append('<br/>')
        _tmp = user
        print _tmp
        print "\n"
        del(_tmp['_id'])
        res.append(_tmp)
#        print _tmp['process_name']

    return json.dumps(res)



    print "received this input: %s" % (request.data)


    #return json.dumps(dummy_data)
#    return json.dumps(str(request.data))


@app.route('/search1/<key>/<user_input>', methods=['GET'])#{"key":"<key>","value":"<user_input>"}', methods=['GET'])
def search1(key, user_input):
    res = []
    myregex = re.compile(user_input, re.I)
    for user in collection.find({key: myregex}):
        #res.append('<br/>')
        #res.append('<br/>')
        _tmp = user
        print _tmp
        print "\n"
#        del(_tmp['_id'])
        res.append(_tmp)
    return render_template('table.html', result=res)
    print _tmp['_id'].getTimestamp()
    dummy_data = {"a1":11, "b1":222}
    print "received this input: %s" % (user_input)
#    collection.find().forEach(function(doc){ d = doc._id.getTimeStamp(); print(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate())})
    return json.dumps(str(request.data))
#    return json.dumps({})

@app.route('/add_data', methods=['POST'])
def add_data():
    now = datetime.fromtimestamp(time.time())
    input_data=json.loads(request.data)
    input_data.update()

    collection.insert_one(input_data)
    print("##: %s##") %(input_data)
    return dumps(input_data)

@app.route('/update_data',methods=['POST'])
def update_data():
    oId = " "
    nowValid = "none"
    processName = "none"
    crossSection = "none"
    otherUncertainty = "none"
    totalUncertainty = "none"
    showerTool = "none"
    references = "none"
    cuts = "none"
    kFactor = "none"
    mcm = "none"
    das = "none"
    accuracy = "none"
    reweighting = "none"
    matrixGenerator = "none"
    contacts = "none"
    energy = "none"
    comments = "none"
    valid = "none"
    
    now = datetime.fromtimestamp(time.time())
    input_data=json.loads(request.data)
    input_data.update({'validFrom':now.strftime('%Y-%m-%d')})
    for k, v in input_data.items():
        if k == "_id":
            oId = v
        else:
            print(k, v)
    res = []
    for user in collection.find({'_id': ObjectId(oId)}):
        _tmp=user
        print _tmp
        print "\n"
        res.append(_tmp)
        if 'process_name' in user:
            processName = _tmp['process_name']
            
        if 'cross_section' in user:
            crossSection = _tmp['cross_section']

        if 'other_uncertainty' in user:
            otherUncertainty = _tmp['other_uncertainty']
        
        if 'total_uncertainty' in user:
            totalUncertainty = _tmp['total_uncertainty']

        if 'shower' in user:
            showerTool = _tmp['shower']
            

        if 'refs' in user:
            references = _tmp['refs']

        if 'cuts' in user:
            cuts = _tmp['cuts']

        if 'kFactor' in user:
            kFactor = _tmp['kFactor']

        if 'MCM' in user:
            mcm = _tmp['MCM']

        if 'DAS' in user:
            das = _tmp['DAS']
            
        if 'accuracy' in user:
            accuracy = _tmp['accuracy']

        if 'reweighting' in user:
            reweighting = _tmp['reweighting']

        if 'matrix_generator' in user:
            matrixGenerator = _tmp['matrix_generator']

        if 'energy' in user:
            energy = _tmp['energy']
            
        if 'comments' in user:
            comments = _tmp['comments']

        if 'validFrom' in user:
            valid = _tmp['validFrom']

        else:
            valid = now
            
        print("process_name is: %s and %s") %(_tmp['process_name'],processName)

        print("cross_section is: %s and %s") %(_tmp['cross_section'],crossSection)

    for k, v in input_data.items():
        if k =="_id":
            oId = v
        elif k == "process_name":
            processName = v
        elif k == "energy":
            energy = v
        elif k == "comments":
            comments = v
        elif k == "cross_section":
            crossSection = v
        elif k == "total_uncertainty":
            totalUncertainty = v
        elif k == "other_uncertainty":
            otherUncertainty = v
        elif k== "refs":
            references = v
        elif k == "shower":
            showerTool = v
        elif k == "matrix_generator":
            matrixGenerator = v
        elif k == "MCM":
            mcm = v
        elif k == "DAS":
            das = v
        elif k == "accuracy":
            accuracy = v
        elif k == "reweighting":
            reweighting = v
        elif k == "kFactor":
            kFactor = v
        elif k == "cuts":
            cuts = v
        elif k == "contact":
            contacts = v
        else:
            print(k, v)
    print("\n%s") %(processName)
    print("\n\n%s") %(oId)

    collection.update({'_id':ObjectId(oId)},{'$set':{'process_name':processName,'MCM':mcm,'DAS':das,'energy':energy,'refs':references,'other_uncertainty':otherUncertainty,'cross_section':crossSection,'total_uncertainty':totalUncertainty,'matrix_generator':matrixGenerator,'shower':showerTool,'accuracy':accuracy,'contact':contacts,'reweighting':reweighting,'cuts':cuts,'kFactor':kFactor,'comments':comments,'validFrom':now.strftime('%Y-%m-%d'),'validTo':'present'}},upsert=False)
    print("\n\n##: %s##") %(input_data)
    return dumps(input_data)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
