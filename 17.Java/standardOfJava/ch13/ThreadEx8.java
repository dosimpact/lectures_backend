class ThreadEx8 {
	public static void main(String args[]) {
		ThreadEx8_1 th1 = new ThreadEx8_1();
		ThreadEx8_2 th2 = new ThreadEx8_2();

		th2.setPriority(7);

		System.out.println("Priority of th1(-) : " + th1.getPriority() );
		System.out.println("Priority of th2(|) : " + th2.getPriority() );
		th1.start();
		th2.start();
	}
}

class ThreadEx8_1 extends Thread {
	public void run() {
		for(int i=0; i < 300; i++) {
			System.out.print("-");
			for(int x=0; x < 10000000; x++);
		}
	}
}

class ThreadEx8_2 extends Thread {
	public void run() {
		for(int i=0; i < 300; i++) {
			System.out.print("|");
			for(int x=0; x < 10000000; x++);
		}
	}
}

// Priority of th1(-) : 5
// Priority of th2(|) : 5
// -|-|--------------------------------------------------------------|||||||||-------||||--||||||||||||||||||||||||||||||----------|||||||---------||||||----||||||||||||||------||||||------------|---------||||||||||------||||--------||||------||||||||--------|||||||------||||||||||||||||||||||||||||||---------|||||||||||||||||||---------|||||||||||||||||-------------||||||||||-----||||||||-----------||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||---------|||||||||||||||||||||-------------------|||||||||||||-----------||||||||||------------------------------------------------------%        

// OS, JVM 마다 다른 방식으로 스케쥴링하므로, 스레드 우선순위는 스펙 및 테스트가 필요하다.