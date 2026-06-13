import urllib.request
import json

url = "https://awwrasdjitrbkbyyrhzz.supabase.co/rest/v1/teachers"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3d3Jhc2RqaXRyYmtieXlyaHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDg2NTgsImV4cCI6MjA5NjYyNDY1OH0.5ZtKWN7PU3aHT8koUvUXLPSY0QgaMlJYnuGx48PLt7A",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3d3Jhc2RqaXRyYmtieXlyaHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDg2NTgsImV4cCI6MjA5NjYyNDY1OH0.5ZtKWN7PU3aHT8koUvUXLPSY0QgaMlJYnuGx48PLt7A"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read()
        data = json.loads(html.decode('utf-8'))
        print("TEACHERS IN DB:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error fetching teachers:", e)

url_students = "https://awwrasdjitrbkbyyrhzz.supabase.co/rest/v1/students"
req_stud = urllib.request.Request(url_students, headers=headers)
try:
    with urllib.request.urlopen(req_stud) as response:
        html = response.read()
        data = json.loads(html.decode('utf-8'))
        print("STUDENTS IN DB:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error fetching students:", e)
