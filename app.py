import requests
from bs4 import BeautifulSoup

from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings

disable_warnings(InsecureRequestWarning)


base_url = 'http://appl101.lsu.edu/booklet2.nsf/Selector2?OpenForm'
post_url = 'http://appl101.lsu.edu/booklet2.nsf/f5e6e50d1d1d05c4862584410071cd2e?CreateDocument'


soup = BeautifulSoup(requests.get(base_url).content, 'lxml')

semesters = []
for s in soup.select('[name="SemesterDesc"] [value]'):
    semesters.append(s['value'])

departments = []
for d in soup.select('[name="Department"] option'):
    departments.append(d.get_text(strip=True))


#for s in semesters:
    
    #for d in departments:
    #    data = {
     #       '%%Surrogate_SemesterDesc':1,
      #      'SemesterDesc':s,
       #     '%%Surrogate_Department': 1,
        #    'Department':d
        #}
        #r = requests.post(post_url, data=data)
        #print('{:<30} {:<30} {}'.format(s, d, r.url))


import os
from flask import Flask
from flask import *

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/info")
def info():
    return render_template("page2.html")

#from app import app

@app.route('/func', methods=['GET','POST'])
def func():
    dataGet = '' if not request.get_json(force=True) else request.get_json(force=True)

    disable_warnings(InsecureRequestWarning)

    s = dataGet["semester"]
    d = dataGet["department"]
    print(s, d)
    data = {
            '%%Surrogate_SemesterDesc':1,
            'SemesterDesc':s,
            '%%Surrogate_Department': 1,
            'Department':d
            }   

    print("555555555555555555")
    r = requests.post(post_url, data=data, verify=False)
    getUrl = r.url
    print(getUrl)
    if (getUrl == "https://appl101.lsu.edu/booklet2.nsf/NoCourseDept?readform"):
        return jsonify({
            "classes": "notFound"
        })
    print("66666666666666666")
    soup = BeautifulSoup(requests.get(getUrl, verify=False).content, 'html.parser')
    print("777777777777777777")
    itemsHTML = soup.find('pre').get_text(strip=True)
    print("78888888777")
    print(itemsHTML)
    return jsonify({"classes": "found",
                    "String": itemsHTML
                    })

if __name__ == "__main__":
    app.run(debug=True)