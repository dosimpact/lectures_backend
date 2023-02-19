import java.lang.Exception

fun main() {
    var nullableName: String? = null
    var notNullName: String = "dodo"

    // 1. String? 과 String은 다른 타입으로 취급 된다.
    // The value 'notNullName' assigned to 'var nullableName: String? defined in main' is never used
    // nullableName = notNullName

    // - 1.1 null 체크를 통해 String? 을 String에 대입 가능
    if (nullableName != null) notNullName = nullableName

    try {
        // - 1.2  !!(null이 아님을 단언)을 통해 String? 을 String에 대입 가능
        notNullName = nullableName!!
    } catch (e: Exception) {
        println("-->e ${e}")
    }
    // - 1.3 let 등 이용
    nullableName?.let { it ->
        notNullName = it
    }

    print("-->notNullName ${notNullName}")
}
