
- [install](#install)
- [명령어](#명령어)
    - [kubectl version](#kubectl-version)
    - [kubectl cluster-info](#kubectl-cluster-info)
    - [kubectl get nodes](#kubectl-get-nodes)
- [](#)
- [Dashboard UI 배포](#dashboard-ui-배포)
  - [설치 및 실행](#설치-및-실행)
  - [샘플 사용자 만들기](#샘플-사용자-만들기)

# install

# 명령어

### kubectl version

kubectl 의 버전 확인

```
>kubectl version
Client Version: version.Info{Major:"1", Minor:"22", GitVersion:"v1.22.4", GitCommit:"b695d79d4f967c403a96986f1750a35eb75e75f1", GitTreeState:"clean", BuildDate:"2021-11-17T15:48:33Z", GoVersion:"go1.16.10", Compiler:"gc", Platform:"darwin/amd64"}

Server Version: version.Info{Major:"1", Minor:"22", GitVersion:"v1.22.4", GitCommit:"b695d79d4f967c403a96986f1750a35eb75e75f1", GitTreeState:"clean", BuildDate:"2021-11-17T15:42:41Z", GoVersion:"go1.16.10", Compiler:"gc", Platform:"linux/amd64"}
```

### kubectl cluster-info

클러스터 정보 확인 
k8s의 컨트롤 패널의 정보를 가져올 수 있는 endpoint를 알려줍니다. 
kubernetes.docker.internal 은 k8s 설치시 hosts 파일에 자동으로 등록된 정보입니다. 127.0.0.1 kubernetes.docker.internal

```
>kubectl cluster-info
Kubernetes control plane is running at https://kubernetes.docker.internal:6443
CoreDNS is running at https://kubernetes.docker.internal:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```
### kubectl get nodes

```
NAME             STATUS   ROLES                  AGE    VERSION
docker-desktop   Ready    control-plane,master   2d9h   v1.22.4 
```

# 
https://gurumee92.tistory.com/300


---

# Dashboard UI 배포

https://judekim.tistory.com/119
https://kubernetes.io/ko/docs/tasks/access-application-cluster/web-ui-dashboard/

## 설치 및 실행

```
대시보드 UI는 기본으로 배포되지 않는다. 배포하려면 다음 커맨드를 실행한다.
>kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.6.1/aio/deploy/recommended.yaml

kubectl 커맨드라인 도구를 이용해 다음 커맨드를 실행함으로써 대시보드로의 접속을 활성화할 수 있다.
>kubectl proxy

kubectl은 http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/를 통해 대시보드에 접속할 수 있게 해줄 것이다.

```

## 샘플 사용자 만들기

https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

Goal
- Service Account 생성
- ClusterRoleBinding 생성

요약
```

1. 아무곳에서 파일 생성 : dashboard-adminuser.yaml

----
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
----

>kubectl apply -f dashboard-adminuser.yaml
serviceaccount/admin-user created

2. 아무곳에서 파일 생성 : cluster-role-binding.yaml

----
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
----

>kubectl apply -f cluster-role-binding.yaml
clusterrolebinding.rbac.authorization.k8s.io/admin-user created

3. 다음 명령어로 토큰 획득하기

> kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"

eyJhbGciOiJSUzI1NiIsImtpZCI6IjcyOVV2czIzdExuRVEtbmRTZjZFTjdFSG1Qa2s4TTVmdWY0TEVtcDhVd1kifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWRycnA1Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJlMTE5ZGNlOS0wMjJkLTQ2ZWEtYjgwMy0zMmJjM2NmNTAxMDYiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.wJpU6UkD-HNjLhATebXYZMBtwEXPMHsjV0HKICpp6-SPd-Ux5mbfrwKR_y8t4s24s77rXZhFWRHLJGRrDVQtubyWr-V7k7Tcq2I3ohlxmFSTxnf2pIHRcF7o3LT_DUvOTs6NUobr2zoJlA4ZWYFs8eW1sE3VXXjrHSEoVhUFad7-smVLUzR2xtq0ty3Id1sL89a6ksc5GtRRrqf_1QIrlbNrAGMb6vwZ1No8IuU3D3RyDF1h-eUjieU3CYIIjAnzUbCUpNQP04G2LVBehCk6JxBukzFwqazioIROLWtn0WXJBXmkskLGPsh9pWRf71HcuruKDan5Nq1fZKeKkZ6kVg

4. 위 토큰으로 대시보드 접속

```
