// 15. callback
// - 출력이 없으면 void 가 아니라 Unit 이다.
fun callbackFunc(cb: () -> Unit) {
    println("--> callbackFunc is done")
    cb()
}
fun callbackFunc2(num:Int,cb: () -> Unit = {}) {
    println("--> num ${num} callbackFunc is done")
    cb()
}

fun main() {
    // 전달하는 인자가 함수 하나라면 다음처럼 쓸 수 있다.
    callbackFunc {
        println("callbackFunc success")
    }
    // 콜백함수가 마지막에 있다면, 인자와 같이 다음 처럼 쓸 수 있다.
    callbackFunc2(2){
        println("callbackFunc2 success")
    }
    // 콜백함수가 optional 이라면 안써도 된다.
    callbackFunc2(10)
}
