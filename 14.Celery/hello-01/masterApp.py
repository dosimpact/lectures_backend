from workerApp import multiple

for i in range(1000+1):
    result = multiple.delay(2, i).get(timeout=3)
print(result) #// 2000

# python masterApp.py