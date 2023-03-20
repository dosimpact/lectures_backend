
# [Python] Jupyter Notebook에 가상환경(Virtualenv) 연결, 삭제하기

https://code.visualstudio.com/docs/datascience/jupyter-notebooks 


1. 가상 환경 만들기 

```
//생성
virtualenv pip_env --python=python3.9
// 활성화
source pip_env/bin/activate
// 비활성화
deactivate

```

2. 커널 추가하기 

vs code > CMD + shift + P > Select interpreter > enter interpreter path > 위에서 생성한 가상환경 경로 입력

3. 커널 연결하기

vs code > CMD + shift + P > Select interpreter > 위에서 추가한 가상환경 선택