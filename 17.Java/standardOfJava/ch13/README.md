- [index](#index)
- [1. 프로세스와 쓰레드](#1-프로세스와-쓰레드)
- [2. 쓰레드의 구현과 실행](#2-쓰레드의-구현과-실행)
  - [구현 방법](#구현-방법)
    - [eg) ThreadEx1](#eg-threadex1)
- [3. start()와 run()](#3-start와-run)
    - [eg) ThreadEx2](#eg-threadex2)
    - [eg) ThreadEx3](#eg-threadex3)
- [4. 싱글쓰레드와 멀티쓰레드](#4-싱글쓰레드와-멀티쓰레드)

# index

Chapter 13 쓰레드(Thread)
1. 프로세스와 쓰레드 / 722
2. 쓰레드의 구현과 실행 / 724
3. start()와 run() / 728
4. 싱글쓰레드와 멀티쓰레드 / 732
5. 쓰레드의 우선순위 / 738
6. 쓰레드 그룹(thread group) / 741
7. 데몬 쓰레드(daemon thread) / 744
8. 쓰레드의 실행제어 / 748
9. 쓰레드의 동기화 / 767
9.1 synchronized를 이용한 동기화 / 767  
9.2 wait()과 notify() / 771  
9.3 Lock과 Condition을 이용한 동기화 / 779 
9.4 volatile / 786   
9.5 fork & join 프레임웍 / 788  

# 1. 프로세스와 쓰레드

멀티테스킹 : 여러 프로세스 동시에
멀티쓰레드 : 여러 쓰레드 동시에
- 하나의 프로세스에는 여러개의 쓰레드가 존재한다.
- 할당받은 메모리 양에 비례하는 쓰레드를 만들 수 있다.

공유받은 자원에서 작업을 하여, 동기화 문제, 교착상태 문제들이 있다.

# 2. 쓰레드의 구현과 실행 

## 구현 방법
1. Thread 클래스 상속  
2. Runnable interface 구현 (더 객체지향적)

### eg) ThreadEx1


# 3. start()와 run() 

start : 쓰레드별 호출스택위에 run 함수를 스텍에 올린다. 
run : run함수 자체로 그냥 부르면, main 함수의 콜스택위에 올려진다.

- 프로그램 스케쥴러가, 쓰레드별 콜스택에서 상단의 함수들을 적절히 가져와 실행.
- 실행중인 쓰레드가 없다면 프로그램이 종료된다.

### eg) ThreadEx2
### eg) ThreadEx3



# 4. 싱글쓰레드와 멀티쓰레드





---
1. 쓰레드의 우선순위 / 738
2. 쓰레드 그룹(thread group) / 741
3. 데몬 쓰레드(daemon thread) / 744
4. 쓰레드의 실행제어 / 748
5. 쓰레드의 동기화 / 767
9.1 synchronized를 이용한 동기화 / 767  
9.2 wait()과 notify() / 771  
9.3 Lock과 Condition을 이용한 동기화 / 779 
9.4 volatile / 786   
9.5 fork & join 프레임웍 / 788  