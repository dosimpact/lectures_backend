// 1. 클래스 정의
// - 1.1 클래스의 선언과 동시에 생성자를 정의한다.
// - 1.2 수정가능한 프로퍼티는 var로 선언한다. (public)
class Person(
    private val id: Int, // getter x
    val name: String, // getter o
    var age: Int // getter/setter o
) {
    // 1.3 equals와 hashCode 는 같이 정의한다.
    // equals만 재정의 하면, hash 값을 사용하는 Collection(HashSet, HashMap, HashTable)을 사용할 때 문제가 발생.
    // IDE 기능 지원 : command + N -> override 함수 제너레이팅 가능
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Person

        if (id != other.id) return false
        if (name != other.name) return false
        if (age != other.age) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + name.hashCode()
        result = 31 * result + age
        return result
    }

    override fun toString(): String {
        return super.toString()
    }
}

// 2. 데이터 클래스
// - 위에서  equals, hashCode 처럼 프로퍼티만으로 구분을 할꺼면 데이터 클래스로 정의하자.
data class Animal(
    val name: String,
    var age: Int
) {
    // 2.1 private 맴버변수이며, getter를 정의, 단 this대신 field로 접근해야 한다.
    var hobby = "ball paly"
        private set
        get() = "hobby is ${field}"

    // 2.2 생성자 이후 실행되는 함수
    init {
        print("[info] animal is created")
    }
}

fun main() {
    val john = Person(1, "john", 10)
    john.age = 20
    println("-->john ${john.name} ${john.age}")

    val john2 = Person(1, "john", 20)
    println("-->john ${john}")
    println("-->john2 ${john2}")
    println("-->john == john2 ${john == john2}")
    println("--------")

    val ani1 = Animal("ani1", 10)
    val ani2 = Animal("ani1", 10)
    println("--> ani1 ${ani1}")
    println("--> ani2 ${ani2}")
    println("--> ani1==ani2 ${ani1 == ani2}")
    println("--> ${ani1.hobby}")
}
