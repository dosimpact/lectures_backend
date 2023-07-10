class ThreadEx2 {
	public static void main(String args[]) throws Exception {
		ThreadEx2_1 t1 = new ThreadEx2_1();
		t1.start();
	}
}

class ThreadEx2_1 extends Thread {
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
// printStackTrace
// java.lang.Exception
//         at ThreadEx2_1.throwException(ThreadEx2.java:15)
//         at ThreadEx2_1.run(ThreadEx2.java:10) // 첫번째 콜스택 = run 매서드
// main 쓰레드는 이미 종료되었다.