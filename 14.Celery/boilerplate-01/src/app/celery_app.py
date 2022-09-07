import os
from celery import Celery


celery_app = Celery(
    broker=os.environ.get('CELERY_BROKER_URL'),
    backend=os.environ.get('CELERY_RESULT_BACKEND'),
)

# Example task
@celery_app.task
def example_task(example_input):
    print("task income",example_input)
    return "This is an example"+example_input