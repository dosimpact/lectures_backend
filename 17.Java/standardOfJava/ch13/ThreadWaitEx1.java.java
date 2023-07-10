import java.util.ArrayList;

class ThreadWaitEx1 {
	public static void main(String[] args) throws Exception {
		Table table = new Table(); // critical section

		new Thread(new Cook(table), "COOK1").start();
		new Thread(new Customer(table, "donut"),  "CUST1").start();
		new Thread(new Customer(table, "burger"), "CUST2").start();
	
		Thread.sleep(100);
		System.exit(0);
	}
}

class Customer implements Runnable {
	private Table table;
	private String food;

	Customer(Table table, String food) {
		this.table = table;  
		this.food  = food;
	}

	public void run() {
		while(true) {
			try { Thread.sleep(10);} catch(InterruptedException e) {}
			String name = Thread.currentThread().getName();
			
			if(eatFood())
				System.out.println(name + " ate a " + food);
			else 
				System.out.println(name + " failed to eat. :(");
		} // while
	}

	boolean eatFood() { return table.remove(food); }
}

class Cook implements Runnable {
	private Table table;
	
	Cook(Table table) {	this.table = table; }

	public void run() {
		while(true) {
			// 임의의 요리 후 테이블에 추가
			int idx = (int)(Math.random()*table.dishNum());
			// Exception in thread "COOK1" java.util.ConcurrentModificationException
			table.add(table.dishNames[idx]);
			try { Thread.sleep(1);} catch(InterruptedException e) {}
		} // while
	}
}

class Table {
	String[] dishNames = { "donut","donut","burger" }; // donut 이 더 자주 나옴.
	final int MAX_FOOD = 6; 
	private ArrayList<String> dishes = new ArrayList<>();

	public void add(String dish) {
		// 테이블에 음식을 채운다.
		if(dishes.size() >= MAX_FOOD) return;
		dishes.add(dish);
		System.out.println("Dishes:" + dishes.toString());
	}

	public boolean remove(String dishName) {
		// 요리 제거
		for(int i=0; i<dishes.size();i++)
			if(dishName.equals(dishes.get(i))) {
				//Exception in thread "CUST2" java.lang.IndexOutOfBoundsException: Index 1 out of bounds for length 1
				dishes.remove(i);
				return true;
			}

		return false;
	}

	public int dishNum() { return dishNames.length; }
}