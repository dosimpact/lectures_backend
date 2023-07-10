class ThreadEx22 {
	public static void main(String args[]) {
		Runnable r = new RunnableEx22();
		new Thread(r).start(); // ThreadGroup 에 참조되므로 gc대상이 아니다.
		new Thread(r).start(); // ThreadGroup 에 참조되므로 gc대상이 아니다.
}

class Account {
	private int balance = 1000; // private 으로해야 동기화가 의미, 
	// 다른 매서드가 변경못하도록.

	public  int getBalance() {
		return balance;
	}

	public synchronized void withdraw(int money){ // synchronized
		if(balance >= money) {
			try { Thread.sleep(1000);} catch(InterruptedException e) {}
			balance -= money;
		}
	} // withdraw
}

class RunnableEx22 implements Runnable {
	Account acc = new Account();

	public void run() {
		while(acc.getBalance() > 0) {
			// 100, 200, 300���� �� ���� ������ �����ؼ� ���(withdraw)
			int money = (int)(Math.random() * 3 + 1) * 100;
			acc.withdraw(money);
			System.out.println("balance:"+acc.getBalance());
		}
	} // run()
}