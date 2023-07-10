import java.util.concurrent.*;

class ForkJoinEx1 {
	static final ForkJoinPool pool = new ForkJoinPool();  // 쓰레드 풀 생성

	public static void main(String[] args) {
		long from = 1L;
		long to   = 100_000_000L;

		SumTask task = new SumTask(from, to);

		long start = System.currentTimeMillis(); // 시작시간

		// case1. fork&join :325
		Long result = pool.invoke(task);

		System.out.println("Elapsed time(4 Core):"+(System.currentTimeMillis()-start));
		System.out.printf("sum of %d~%d=%d%n", from, to, result);
		System.out.println();

		result = 0L;
		start = System.currentTimeMillis(); // 시작시간 초기화

		// case2. forloop :224
		for(long i=from;i<=to;i++)
			result += i;

		System.out.println("Elapsed time(1 Core):"+(System.currentTimeMillis()-start));
		System.out.printf("sum of %d~%d=%d%n", from, to, result);
	} //
}

class SumTask extends RecursiveTask<Long> {
	long from;
	long to;

	SumTask(long from, long to) {
		this.from = from;
		this.to    = to;
	}
	// compute 재귀함수로 구현
	public Long compute() {
		long size = to - from;

		if(size <= 5) return sum(); 

		long half = (from+to)/2;

		SumTask leftSum  = new SumTask(from, half);
		SumTask rightSum = new SumTask(half+1, to);

		leftSum.fork(); // left 작업만 스레드풀 큐에 넣고, 리턴한다.

		return rightSum.compute() + leftSum.join();
	}

	long sum() { 
		long tmp = 0L; 

		for(long i=from;i<=to;i++)
			tmp += i;

		return tmp;
	}
}