// 1. 상속
// - 부모클래스 정의 > abstract class 는 생성에 닫혀있고 상속 가능
//  ㄴ 기본적으로 일반클래스는 상속이 불가능아다. > open 이라는 키워드를 사용해야 한다.
// - override 허용하려면 open 이라는 예약어를 걸어주자.
// - 상속시 부모클래스의 생성자를 호출해줘야 한다.


abstract class Animal2 {
    open fun move() {
        println("move")
    }
}

open class OriginalAnimal {
    open fun move() {
        println("m")
    }
}

// 2. interface
// - 인터페이스 구현은 아래처럼 한다.
interface Drawable {
    fun draw()
}

class Dog : Animal2(), Drawable {
    override fun move() {
        println("Dog move tick")
    }

    override fun draw() {
        TODO("Not yet implemented")
    }
}

class Cat : Animal2(), Drawable {
    override fun move() {
        println("Cat move tok")
    }

    override fun draw() {
        TODO("Not yet implemented")
    }
}

fun main() {
    val d1: Animal2 = Dog()
    val c1 = Cat()

    d1.move()
    c1.move()
    // 3. 타입 체크
    if (d1 is Animal2) println("--> d1 is Animal2 ${d1 is Animal2}")
    if (d1 is Dog) println("--> d1 is Dog ${d1 is Dog}")
}
