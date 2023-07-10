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
  - [interrupt](#interrupt)
  - [suspend, resume, stop](#suspend-resume-stop)
  - [yield](#yield)
  - [join](#join)
- [9. 쓰레드의 동기화 / 767](#9-쓰레드의-동기화--767)
  - [9.1 synchronized를 이용한 동기화](#91-synchronized를-이용한-동기화)
    - [eg) ThreadEx21](#eg-threadex21)
    - [eg) ThreadEx22](#eg-threadex22)
  - [9.2 wait()과 notify() / 771](#92-wait과-notify--771)
    - [eg) ThreadWaitEx1](#eg-threadwaitex1)
    - [eg) ThreadWaitEx2](#eg-threadwaitex2)
    - [eg) ThreadWaitEx3](#eg-threadwaitex3)
  - [9.3 Lock과 Condition을 이용한 동기화](#93-lock과-condition을-이용한-동기화)
    - [eg) ThreadWaitEx4](#eg-threadwaitex4)
  - [9.4 volatile](#94-volatile)
    - [멀티 코어 프로세스 별도의 캐시](#멀티-코어-프로세스-별도의-캐시)
    - [JVM 4Byte 단위 처리](#jvm-4byte-단위-처리)
  - [9.5 fork & join 프레임웍](#95-fork--join-프레임웍)
    - [compute 구현 - 작업을 어떻게 나눌것인가?](#compute-구현---작업을-어떻게-나눌것인가)
    - [eg) ThreadWaitEx1](#eg-threadwaitex1-1)

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
- Thread.sleep(2000); 처럼 작성해야 한다. sleep은 항상 현재 실행중인 쓰레드에 영향

## interrupt 
쓰레드의 작업을 취소한다.

## suspend, resume, stop
suspend: 쓰레드를 일시정지 시킨다. 
resume: suspend에 의해 정지된 쓰레드를 다시 실행
stop: 쓰레드 종료

## yield
yield: 다른쓰레드에게 양보

## join
join: 다른 쓰레드의 작업을 기다린다.



# 9. 쓰레드의 동기화 / 767

쓰레드간에 shared memory 영역을 critical section 이라고 한다.  
이 부분에서 쓰레드간 동기화가 없다면 의도하지 않은 변수값이 들어갈 수 있다.  

critical section을 잠그는 것이 lock 이다.  

쓰레드 동기화 : 한 쓰레드가 진행 중인 작업을 다른 쓰레드가 간섭하지 못하도록 막는 것

다양한 쓰레드 동기화를 지원하고 있다.  

--- 

## 9.1 synchronized를 이용한 동기화

매서드에 synchronized 붙이기 - 매서드 전체를 critical section 지정  
특정 스코프에 synchronized 붙이기 - 특정 영역을 critical section 지정  

### eg) ThreadEx21
- fail case -  not synchronized critical section  
### eg) ThreadEx22
- success case - synchronized critical section   

--- 

## 9.2 wait()과 notify() / 771  

특정 쓰레드가 락을 오래동안 가져도 문제가 된다.
수동으로 wait - 락 반납 대기, notify - 락 반납 필요성이 있다.  

notify : 임의의 하나의 쓰레드에게 통지
- 하지만 오래 기다린 쓰레드가 락을 먼저 받는다는 보장이 없다.  
- waiting pool에서 임의의 통지를 기다린다.  

notifyAll : 전체 쓰레드에게 통지
- 모든 쓰레드가 통지를 받고, race condition에 들어간다. 

waiting pool은 Object 클래스에 정의 되어 있다. 
- 특정 객체의 waiting pool에서 대기중인 쓰레드만
- notify, notifyAll 영향을 받는다.


### eg) ThreadWaitEx1
- fail case -  not synchronized critical section  
- 예외1) Cook 쓰레드가 테이블에 음식을 놓는 중에, Customer 쓰레드가 음식을 가져가려함
- 예외2) Customer1 쓰레드가 음식을 가져가는 도중에, Customer2가 가져가려함


### eg) ThreadWaitEx2
- success case - synchronized critical section  
- new fail case - 테이블 객체에 락을 걸어 CS를 보호하지만, 락을 반납하지 않아 음식이 만들어 지지 않는다.


### eg) ThreadWaitEx3
- 객체에 wait, notify를 추가해서 대기상태의 쓰레드를 깨운다.

starvation: 기아 현상, notify는 임의이 한 쓰레드에게 통지하므로 계속 기다리는 쓰레드가 발생 가능  
notifyAll : 모든 쓰레드에게 통지 하도록 한다. 
race condition : 하지만 불필요한 쓰레드까지 통지를 받아, lock을 얻기 위한 경쟁상태가 된다.

Lock, Condition을 이용해서 요리사/손님 쓰레드를 구별해서 통지할 수 있다.


?? java.util.ConcurrentModificationException  


--- 

## 9.3 Lock과 Condition을 이용한 동기화 

ReentrantLock : 재진입할 수 있는 락
- 지금까지 봤던 락과 일치하다. 특정조건에서 lock풀고 lock얻어서 작업 수행

ReentrantReadWriteLock : 읽기를 위한 lock, 쓰기를 위한 lock 제공   
- readlock : 다른 쓰레드가 중복해서 readlock을 걸고 동시에 읽어간다.
- 하지만 readlock 걸린 상태에서 쓰기는 불가능 하다.
- writlock : 중복해서 write lock 거는것은 허용되지 않는다. 

StampedLock : ReentrantReadWriteLock에 optimistic reading lock이 추가된것
- readlock과 다르게, optimistic read lock은 write lock에 의해 바로 풀린다.
- 쓰기가 끝난 후에 읽기 lock을 거는 것이다.

lock(): lock을 얻을때까지 블락킹이 된다.
unlock():
isLocked(): 
tryLock : lock을 일정 시간동안만 기다린다. 

Condition : waiting pool에 손님쓰레드와 요리사 쓰레드를 분리해서 기다리도록 한다.


### eg) ThreadWaitEx4

?? java.util.ConcurrentModificationException 왜 발생하는지  

## 9.4 volatile   

### 멀티 코어 프로세스 별도의 캐시

멀티 코어 프로세스는 코어마다 별도의 캐시를 가지고 있다.  
멀티 스레드 환경에서는 코어의 캐시를 먼저 읽고 없다면 메모리를 읽는다.  
다른 스레드가 메모리 값을 바꿔버리면 불일치가 발생하고   
volatile 키워드를 통해서, 메모리 값을 읽도록 선언한다.  
혹은 synchronized 블록을 사용한다.  

### JVM 4Byte 단위 처리  

8바이트인 long, double 형은 데이터를 읽는동안 다른 스레드가 끼어들 틈이 있다.  
이때 volatile을 변수선언에 붙인다. 읽기/쓰기가 원자화 된다.  

```java
volatile long balance; // 변수의 원자화

// 잔고조회 함수에, synchronized가 없다면 withdraw 도중 값을 읽어갈 수 있다.
synchronized int getBalance(){
    return balance; 
}

// 함수의 원자화  
synchronized void withdraw(int money) { 
    if(balance >= money) {
        balance -= money;
    }
}
```


## 9.5 fork & join 프레임웍 

JDK 1.7 부터 fork & join 프레임웍이 추가되어, 하나의 작업을 여러 스레드로 동시처리를 쉽게 한다.  

- Recursive Action 반환값이 없는 작업을 구현할 때 사용   
- Recursive Task 반환값이 있는 작업을 구현할 때 사용   
- 두 함수 compute 추상 매서드를 구현하면 된다.

ForkJoinPool : 이 쓰레드풀을 사용하면, 지정된 쓰레드를 미리 만들고 재활용 가능, 많은 스레드로 성능저하 방지  
- 기본적으로 코어의 수만큼 생성  

### compute 구현 - 작업을 어떻게 나눌것인가?

분할 정복 재귀함수 처럼 구현하면 된다.  
- 이 과정에서 work strealing이 발생, 작업큐가 비어있는 스레드가 다른 쓰레드의 작업을 가져옴.  

fork : 작업을 쓰레드풀의 작업 큐에 넣는 것, 더 이상 나눌 수 없을때까지 들어간다. - 비동기 매서드    
join : 해당 작업의 수행이 끝나는것을 기다려서 결과를 대기. - 동기 메서드  

### eg) ThreadWaitEx1
더하기를 for문 구현과 fork&join 쓰레드풀을 이용해서 구현을 비교
- 결과 : forloop가 더 적게 걸린다. 재귀함수의 분할 및 작업을 합치는 과정이 더 오래 걸린다.  
- 멀티스레드 재귀함수는 테스트를 통해 이득이 있을때만 구현할 것.

