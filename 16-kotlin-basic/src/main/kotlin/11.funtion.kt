// 1. top level function , 파일의 어느곳에서든 사용이 가능하다.
fun topLevelFun(a: Int, b: Int): Long = (a + b).toLong() // 한줄 작성

// 2. method overload , by default params
// - 디폴트 파라미터를 정의해주어, c 인자값을 줘도 되고 안줘도 된다.
// - 파라미터를 명시해서 함수를 호출 할 수 있다.
fun topLevelFun2(a: Int, b: Int, c: Int = 0): Long {
    return (a + b + c).toLong()
}


fun main() {
    println("--> topLevelFun(1,2) ${topLevelFun(1, 2)}")
    println("--> topLevelFun2(b = 20,  a=10) ${topLevelFun2(b = 20, a = 10)}")
}
