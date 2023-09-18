import cv2
import imutils
import numpy as np
import pytesseract
import glob
import os
import sys
import re
import requests
# pytesseract.pytesseract.tesseract_cmd = r'tesseract.exe'

#message sending api file
from twilio.rest import Client

#for date matching
from datetime import datetime


img = cv2.imread("images/img5.jpg")
img = cv2.resize(img, (600,400) )

# cv2.imshow("Input image", img)
# cv2.waitKey(0)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
gray = cv2.bilateralFilter(gray, 13, 15, 15) 



edged = cv2.Canny(gray, 30, 200) 
contours = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = imutils.grab_contours(contours)
contours = sorted(contours, key = cv2.contourArea, reverse = True)[:10]
screenCnt = 0

for c in contours:
    
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.018 * peri, True)

    if len(approx) == 4:
        screenCnt = approx
        break

if screenCnt is None:
    detected = 0
    print ("No contour detected")
else:
    detected = 1

# if detected == 1:
#     cv2.drawContours(img, [screenCnt], -1, (0, 0, 255), 3)

mask = np.zeros(gray.shape,np.uint8)
new_image = cv2.drawContours(mask,[screenCnt],0,255,-1,)
new_image = cv2.bitwise_and(img,img,mask=mask)

# cv2.imshow("Detected license plate region", new_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

(x, y) = np.where(mask == 255)
(topx, topy) = (np.min(x), np.min(y))
(bottomx, bottomy) = (np.max(x), np.max(y))
Cropped = gray[topx:bottomx+1, topy:bottomy+1]

text = pytesseract.image_to_string(Cropped, config='--psm 11')
print("Detected license plate Number is:",text)
img = cv2.resize(img,(500,300))
Cropped = cv2.resize(Cropped,(400,200))



#Credentials for sending sms message
sid="ACc9445d66d2ccac1c4eff914aef47b890"
auth_token="ae2eec5bc097ed490ea0dbde76237ba3"
client=Client(sid,auth_token)

  
# API - Usage
URL = "http://localhost:3000/getDetails/vehicleno/"
text=text.replace(" ","")
text=text[0:10]

vehicleno=text
r = requests.get('http://localhost:3000/getDetails/vehicleno/'+text)  
data = r.json()

date_format = "%Y-%m-%d"
present = datetime.now()

diff=present-present

ins_end_date=data[0]['ins_end_date'][0:10]
puc_end_date=data[0]['puc_end_date'][0:10]
if data[0]['notified_date'] != None :
    notified_date=data[0]['notified_date'][0:10] 
    notified_date = datetime.strptime(notified_date, date_format)
    diff=present - notified_date

ins_end_date = datetime.strptime(ins_end_date, date_format)
puc_end_date = datetime.strptime(puc_end_date, date_format)


#Receiving phone number of owner with the help of vehicle number
r1 = requests.get('http://localhost:3000/getPhno/vehicleno/'+text)  
data1 = r1.json()
ph_no='+91'+data1[0]['phno'][0:10] 
flag=0


# print(data[0]['notified_date'],diff.days)

if data[0]['notified_date']==None :
    if ins_end_date.date() < present.date() and puc_end_date.date() < present.date():
        message = client.messages \
            .create(
                    body=f"Insurance and PUC for your vehicle, numbered:{vehicleno} has expired. Please renew it immediately.",
                    from_='+19033205153',
                    to=ph_no
                )
        print(message.sid)
        flag=1

    elif ins_end_date.date() < present.date():
        message = client.messages \
            .create(
                    body=f"Insurance for your vehicle, numbered:{vehicleno} has expired. Please renew it immediately.",
                    from_='+19033205153',
                    to=ph_no
                )
        print(message.sid)
        flag=1

    elif puc_end_date.date() < present.date():
        message = client.messages \
            .create(
                    body=f"PUC for your vehicle, numbered:{vehicleno} has expired. Please renew it immediately.",
                    from_='+19033205153',
                    to=ph_no
                )
        print(message.sid)
        flag=1

elif data[0]['notified_date']!=None and diff.days>7:
    if ins_end_date.date() < present.date() or puc_end_date.date() < present.date():
        message = client.messages \
            .create(
                    body=f"Documents of the vehicle, numbered: {vehicleno} has expired. Owner has not renewed it. Owner number: {ph_no}",
                    from_='+19033205153',
                    to="+918867345957"
                )
        print(message.sid)
        
if data[0]['notified_date']!=None and ins_end_date.date() > present.date() and puc_end_date.date() > present.date():
    resp=requests.post('http://localhost:3000/addNotifiedDate/'+'null'+'/vehicleno/'+text)
    print(resp.text)

if flag==1:
    resp=requests.post('http://localhost:3000/addNotifiedDate/'+present.strftime('%Y-%m-%d')+'/vehicleno/'+text)
    print(resp.text)
    flag=0
    
 



