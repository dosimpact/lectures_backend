// 3.상수 - 컴파일 타임 상수 ,top level 상수 이며 main보다 먼저 컴파일 된다.
// - Java의 final 같은
val TOP_LEVEL_NUM = 20

fun main() {
    // 1. 변수 var 사용, 재대입 가능
    // - 타입추론 및 타입지정
    var i: Int = 10
    var name: String = "do"
    var score: Double = 3.3

    // 2. 상수 val 사용, 재대입 불가능
    val count = 10
    // count = 11 //  val cannot be reassigned
    print("---end---")
}
