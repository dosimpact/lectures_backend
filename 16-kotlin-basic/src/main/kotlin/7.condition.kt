val QPS = 10

fun main() {
    /*
        [1] when <-> if
        - when 에 마우스 호버 이후 alt+enter > if 문으로 변환
    */
    val QPSMessage1 = when {
        QPS > 10 -> {
            "QPS 10 upper"
        }
        else -> {
            "QPS 10 under"
        }
    }
    println("-->QPSMessage1 ${QPSMessage1}")

    /* [2] when / if 결과값 대입 */
    val QPSMessage2 = if (QPS > 10) {
        "QPS 10 upper"
    } else {
        "QPS 10 under"
    }
    println("-->QPSMessage2 ${QPSMessage2}")

    /* 3항 연산자 */
    val QPSMessage3 = if( QPS>10) "upper" else "under"
    println("-->QPSMessage3 ${QPSMessage3}")
}
