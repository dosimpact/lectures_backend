class ThreadEx5 {
	static long startTime = 0;

	public static void main(String args[]) {
		ThreadEx5_1 th1 = new ThreadEx5_1();
		th1.start();
		startTime = System.currentTimeMillis();

		for(int i=0; i < 300; i++) {
			System.out.print("-");
		}

		System.out.print("duration time 1:" + (System.currentTimeMillis() - ThreadEx5.startTime));
	}
}

class ThreadEx5_1 extends Thread {
	public void run() {
		for(int i=0; i < 300; i++) {
			System.out.print("|");
		}

		System.out.print("duration time 2:" + (System.currentTimeMillis() - ThreadEx5.startTime));
	}
}
// 다른 스레드의 화변 출력을 대기한다. 그래서 싱글 스레드보다 시간이 오래 걸린다.
// 하나의 자원(console)을 두고 경젱한다.
