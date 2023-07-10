- [index](#index)
- [1. 프로세스와 쓰레드](#1-프로세스와-쓰레드)
- [2. 쓰레드의 구현과 실행](#2-쓰레드의-구현과-실행)
  - [구현 방법](#구현-방법)
    - [eg) ThreadEx1](#eg-threadex1)
- [3. start()와 run()](#3-start와-run)
    - [eg) ThreadEx2](#eg-threadex2)
    - [eg) ThreadEx3](#eg-threadex3)
- [4. 싱글쓰레드와 멀티쓰레드](#4-싱글쓰레드와-멀티쓰레드)
    - [eg) ThreadEx4, ThreadEx5](#eg-threadex4-threadex5)
    - [eg) ThreadEx6, ThreadEx7](#eg-threadex6-threadex7)
- [5. 쓰레드의 우선순위](#5-쓰레드의-우선순위)
    - [eg) ThreadEx8](#eg-threadex8)
- [6. 쓰레드 그룹(thread group)](#6-쓰레드-그룹thread-group)
- [7. 데몬 쓰레드(daemon thread)](#7-데몬-쓰레드daemon-thread)
- [8. 쓰레드의 실행제어](#8-쓰레드의-실행제어)
  - [쓰레드 실행 관련 메서드](#쓰레드-실행-관련-메서드)
  - [쓰레드의 상태](#쓰레드의-상태)
  - [라이프 싸이클](#라이프-싸이클)
    - [eg) ThreadEx12](#eg-threadex12)

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

단순하게 CPU작업만 한다면 싱글쓰레드가 더 효율적이다.
- 병행 작업 concurrent : 여러 쓰레드가 여러 작업 동시에
- 병렬 작업 parallel : 하나의 작업을 여러 쓰레드가

하지만 사용자 입력을 받는 스레드, 프린트 출력해주는 스레드를 별로도 일하게 하면 더 효율적


### eg) ThreadEx4, ThreadEx5
### eg) ThreadEx6, ThreadEx7

# 5. 쓰레드의 우선순위 

쓰레드 마다 우선순위가 존재한다. 그래서 작업의 중요도에 따라 쓰레드 점유 시간을 다르게 갖도록 할 수 있다.
- 1~10 까지 할당, main은 기본 5 할당

eg) 메신저 : 채팅내용 쓰레드 (주기능) > 파일 다운로드 쓰레드(부기능)

### eg) ThreadEx8

# 6. 쓰레드 그룹(thread group) 

관련된 쓰레드를 그룹으로 묶어서, 관리하고자 한다.
- 하위 쓰레드는 상위 쓰레드의 그룹을 변경할 수 없다.
- 기본적으로 자신을 생성한 쓰레드와 같은 그룹에 속하게 된다.
- JVM은 main, system 쓰레드 그룹을 만들고 관리 
- (GC 는 system thread group / 사용자가 만든건 main thread group)

관리를 위한 여러 메서드를 제공
- ThreadGroup : 그룹 생성
- destory 하위 그룹을 포함한 모든 쓰레드 그룹을 삭제
- list : 쓰레드 리스트 정보 출력


# 7. 데몬 쓰레드(daemon thread)

데몬 쓰레드 : 일반 쓰레드 작업을 돕는 보조역할의 쓰레드
- 일반 쓰레드가 종료되면 , 데몬 쓰레드는 자동 종료
- 예) GC, 워드프로세서 자동 저장, 화면 자동 갱신
- 무한루프+조건문을 이용해서 대기하고 있다가 특정 조건이 만족되면 작업 시작
- start 호출전에 setDeamon 을 실행시켜야 한다.

# 8. 쓰레드의 실행제어 

쓰레드 프로그래밍이 어려운 이유
- 동기화 
- 스케쥴링 : 정교한 스케쥴링 작업으로 주어진 자원을 최대한 활용 

## 쓰레드 실행 관련 메서드 

sleep : ms 동안 일시정지  

join : thread 에서 다른 thread 호출 후 완료까지 대기상태 진입
interrupt : sleep, join > 실행대기상태로 만든다.
yield : 다른 쓰레드에게 양보 후 자기는 실행 대기상태가 된다.

쓰레드 교착상태를 쉽게 만들어 deprecated 됨
- suspend : 일시정지 * 
- stop : 즉시 종료 * 
- resume : 일시정지 > 실행대기상태 *

## 쓰레드의 상태

NEW : 쓰레드 생성되고 아직 start 호출 전
RUNNABLE : 실행중, 실행가능한 상태
BLOCKED : 동기화 블럭에 의해 일시정지(lock 풀리는걸 대기)
WAITING(TIMED_WAITING) : 작업 남아있고 일시정지 상태 (TIMED_ 는 ms동안 일시정지된 경우)
TERMINATED : 작업 종료

## 라이프 싸이클

1. 쓰레드를 생성하면 NEW 가 되고, start 호출하여 RUNNABLE Queue 에 들어간다.
2. 큐에서 자기 차례가 되면 실행 된다.
3. 주어진 실행시간이 다 되면 || yield를 만나면 일시정지 상태 (BLOCKED / WAITING)
4. 혹은 suspend, sleep, wait, join, I/O block에 의해 일시정지 상태 가능
5. time-out, notify, resume, interrupt 가 호출 : 일시정지 --> RUNNABLE Queue
6. 실행 || stop --> TERMINATED


### eg) ThreadEx12


--- 
1. 쓰레드의 동기화 / 767
9.1 synchronized를 이용한 동기화 / 767  
9.2 wait()과 notify() / 771  
9.3 Lock과 Condition을 이용한 동기화 / 779 
9.4 volatile / 786   
9.5 fork & join 프레임웍 / 788  