import javax.swing.JOptionPane;

// 카운트 다운 스레드가 interrupt에 의해 종료된다.
class ThreadEx13_1 {
	public static void main(String[] args) throws Exception 	{
		ThreadEx13_2 th1 = new ThreadEx13_2();
		th1.start();

		String input = JOptionPane.showInputDialog("enter."); 
		System.out.println("user input " + input + ".");

		th1.interrupt();   // interrupt() called
		System.out.println("isInterrupted():"+ th1.isInterrupted()); // true
	}
}

class ThreadEx13_2 extends Thread {
	public void run() {
		int i = 100;

		while(i!=0 && !isInterrupted()) {
			System.out.println(i--);
			for(long x=0;x<2500000000L;x++); // time delayed
		}

		System.out.println("count end.");
	} // main
}