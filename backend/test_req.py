import urllib.request
import urllib.error
import json
import random

email = f'john_{random.randint(1000,9999)}@example.com'
data = json.dumps({
    'fullName':'john doe',
    'email': email,
    'phone':'9999999999',
    'course':'BTech',
    'year':'2',
    'rollNumber':'90',
    'password':'password123'
}).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:8000/auth/register/student', data=data, headers={'Content-Type': 'application/json', 'Origin': 'http://localhost:3000'})
try:
    response = urllib.request.urlopen(req)
    print("SUCCESS", response.status)
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("EXCEPTION", str(e))
