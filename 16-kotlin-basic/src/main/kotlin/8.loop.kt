fun main() {
    // 1. list and iteration
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
    for( i in 0..(items.size - 3)){
        println("--> items[i] ${items[i]}")
    }

}
