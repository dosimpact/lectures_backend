
class Box<T>(val msg:T)

fun main() {
    val b1 = Box<Int>(10)
    val b2 = Box("msg")

    println("--> b1 ${b1.msg}")
    println("--> b1 ${b2.msg}")
}
