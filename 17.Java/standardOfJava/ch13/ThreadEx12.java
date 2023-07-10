class ThreadEx12 {
	public static void main(String args[]) {
		ThreadEx12_1 th1 = new ThreadEx12_1();
		ThreadEx12_2 th2 = new ThreadEx12_2();

		th1.start();
		th2.start();

		try {
			th1.sleep(2000); // Thread.sleep
			// Thread.sleep(2000); 처럼 작성해야 한다. sleep은 항상 현재 실행중인 쓰레드에 영향
		} catch(InterruptedException e) {}

		System.out.print("<<main Stop>>");
	} // main
}

class ThreadEx12_1 extends Thread {
	public void run() {
		for(int i=0; i < 300; i++) {
			System.out.print("-");
		}
		System.out.print("<<th1 Stop>>");
	} // run()
}

class ThreadEx12_2 extends Thread {
	public void run() {
		for(int i=0; i < 300; i++) {
			System.out.print("|");
		}
		System.out.print("<<th2 Stop>>");
	} // run()
}