Indian-ANPR 🚗🔍
Overview

Indian-ANPR (Automatic Number Plate Recognition) is a computer vision–based vehicle details checking system designed to provide an efficient and automated way to identify and track vehicles. The system captures license plates using cameras, extracts the plate numbers using an image-processing algorithm, and cross-references them with a vehicle registration database.

This project demonstrates the integration of computer vision, databases, and intelligent communication systems, which can be extended to applications in traffic management, tolling systems, and urban safety monitoring.

Key Features

📸 Automatic Plate Recognition: Uses image-processing techniques to detect and extract vehicle number plates.

🔎 Database Cross-Verification: Matches extracted details with a database of registered vehicles (make, model, owner, and registration status).

⚠️ Document Validity Alerts: Automatically flags invalid or expired vehicle documentation.

📲 Twilio Integration: Connected with the Twilio API to send SMS notifications to users. This feature enables checking which users have their vehicles properly registered and which do not, providing real-time communication for compliance.

🛡 Traffic & Security Applications: Supports automated verification for security checkpoints and smart traffic systems.

Technical Details

Languages & Tools: Python, JavaScript, HTML, CSS, MySQL, Twilio API.

Core Components:

Image preprocessing and recognition pipeline for plate detection.

Database integration for real-time vehicle validation.

Twilio-powered SMS alerts to inform users about registration/document status.

Web-based front-end for user interaction and monitoring.

Deployment: Runs locally with MySQL backend. Accessible at http://localhost:3000/admin.
