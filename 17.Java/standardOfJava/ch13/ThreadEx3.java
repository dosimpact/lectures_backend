public class ThreadEx3 {
	public static void main(String args[]) throws Exception {
		ThreadEx3_1 t1 = new ThreadEx3_1();
		t1.run();
	}
}

class ThreadEx3_1 extends Thread {
	public void run() {
		throwException();
	}

	public void throwException() {
		try {
			throw new Exception();		
		} catch(Exception e) {
			e.printStackTrace();	
		}
	}
}

// java.lang.Exception
//         at ThreadEx3_1.throwException(ThreadEx3.java:15)
//         at ThreadEx3_1.run(ThreadEx3.java:10)
//         at ThreadEx3.main(ThreadEx3.java:4)
// start가 아닌 run으로 메서드를 직접호출하여, 콜스텍에 main이 보인다.