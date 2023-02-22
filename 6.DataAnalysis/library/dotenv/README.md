
- [install](#install)
- [usage](#usage)
  - [make .env file](#make-env-file)
  - [code](#code)


# install

```
pip install dotenv
```

# usage


## make .env file

.env
```
benchmark=KQ11 
redis_host=host
redis_port=port
redis_password=pw
```
## code 

```py
from dotenv import load_dotenv

load_dotenv(verbose=True)

# .env
env = dict({
    # fdr : KS11 , yfinance : ^KS11 ,   # 코스피 KS11, 코스닥 KQ11
    "benchmark": os.getenv('benchmark'),
    "redis_host": os.getenv('redis_host'),
    "redis_port": os.getenv('redis_port'),
    "redis_password": os.getenv('redis_password'),
})
```