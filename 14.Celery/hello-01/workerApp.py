from celery import Celery

app = Celery('my_first_celery')        #// 이름을 지정합니다
app.config_from_object('celeryWorkerConfig') #// 설정정보를 가져옵니다

@app.task
def multiple(x, y):
    return x * y
