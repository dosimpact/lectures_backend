import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlin.system.measureTimeMillis

/*
https://jsonobject.tistory.com/606
build.gradle.kts : 프로젝트 루트의 build.gradle.kts에 아래 내용을 추가한다.

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0")
    runtimeOnly("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.6.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:1.6.0")
}
*/

// 1. suspend 함수의 정의
// - 일반적으로 부를 수 없다. suspend 함수 안에서 부룰 수 있다.
// - 그렇다고 main 함수를 suspend 함수로 만들지 않는다.
// - 코루틴 스코프를 만들어서, 별도의 스레드로 실행시킨다.
//  ㄴ 안드로이드는 lifecycleScope 안에서 실행

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 대충 개 쩌는 일을 하는 중
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 대충 개 쩌는 일을 하는 중
    return 29
}

fun main() {
    // [1] 현재 쓰레드에서 코루틴을 실행할 수 있는 상태로 전환
    runBlocking {
        val time = measureTimeMillis {
            val result = doSomethingUsefulOne() + doSomethingUsefulTwo()
            println("13 + 29 는 $result 입니다")
        }
        println("Completed in $time ms")
        // 블록 내에서는 여전히 현재 쓰레드 사용
        // [2] 0개 이상의 코루틴 블록 작성
    }
    // [3] 앞의 runBlocking의 코루틴을 포함한 블록 내 모든 로직이 종료된 후 현재 쓰레드 재개
}

