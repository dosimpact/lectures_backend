import javax.swing.JOptionPane;

class ThreadEx14_1 {
	public static void main(String[] args) throws Exception 	{
		ThreadEx14_2 th1 = new ThreadEx14_2();
		th1.start();


		String input = JOptionPane.showInputDialog("enter."); 
		System.out.println("user input " + input + ".");

		th1.interrupt();   // interrupt() called
		System.out.println("isInterrupted():"+ th1.isInterrupted()); // true
	}
}

class ThreadEx14_2 extends Thread {
	public void run() {
		int i = 10;

		while(i!=0 && !isInterrupted()) {
			System.out.println(i--);

			try {
				Thread.sleep(1000);  // 1�� ����
			} catch(InterruptedException e) {}
		}

		System.out.println("count end.");
	} // main
}