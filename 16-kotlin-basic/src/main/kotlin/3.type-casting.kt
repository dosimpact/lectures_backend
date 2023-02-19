fun main() {
    // 형변환 , int, long, string 명시적으로 변환 가능
    val num1: Int = 10
    println("--> num1.toLong() ${num1.toLong()}")

    val num2: Double = 3.33
    println("--> num2.toInt() ${num2.toInt()}")

    val num3: String = "10"
    println("--> num3.toInt() ${num3.toInt()}")

    println("---end---")
}
