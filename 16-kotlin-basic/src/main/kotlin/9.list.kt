import java.lang.Exception

fun main() {
    // 1. readonly list and iteration
    val items = listOf<Int>(10, 20, 30, 40)

    // using forEach
    items.forEach { item ->
        println("--> forEach ${item}")
    }

    // range [0,1]
    for (i in 0..1) {
        println("--> i ${i}")
    }
    // range
    for (i in 0..(items.size - 3)) {
        println("--> items[i] ${items[i]}")
    }

    // 2. mutable list
    val itemsMutable: MutableList<Int> = mutableListOf<Int>(11, 22, 33)

    itemsMutable.remove(22) // find element and remove
    itemsMutable.removeAt(0) // remove at index
    itemsMutable.add(44)
    println("--> itemsMutable ${itemsMutable}")

    // 3. array , 실질적으로는 잘 안쓰고 리스트를 사용한다.
    val itemsList = arrayOf(12, 13, 14)
    itemsList[0] = 10
    println("--> itemsList ${itemsList}")

    // 4. try catch
    try {
        println("--> itemsList ${itemsList[99]}")
    } catch (e: Exception) { // type as Exception
        println("--> e ${e}")
    }


}
