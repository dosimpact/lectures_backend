class ThreadEx21 {
	public static void main(String args[]) {
		Runnable r = new RunnableEx21();
		new Thread(r).start(); // ThreadGroup 에 참조되므로 gc대상이 아니다.
		new Thread(r).start(); // ThreadGroup 에 참조되므로 gc대상이 아니다.
	}
}


class Account {
	private int balance = 1000;

	public  int getBalance() {
		return balance;
	}

	public void withdraw(int money){
		if(balance >= money) {
			// 이 코드까지 와서 다른 쓰레드가 실행권을 가져가게 된다.
			// 그래서 잔고를 확인하는 블럭까지 모두 critical section으로 감싸야 한다.
			try { Thread.sleep(1000);} catch(InterruptedException e) {}
			balance -= money;
		}
	} // withdraw
}

class RunnableEx21 implements Runnable {
	Account acc = new Account();

	public void run() {
		while(acc.getBalance() > 0) {
			// 100, 200, 300 random (withdraw)
			int money = (int)(Math.random() * 3 + 1) * 100;
			acc.withdraw(money);
			System.out.println("balance:"+acc.getBalance());
		}
	} // run()
}