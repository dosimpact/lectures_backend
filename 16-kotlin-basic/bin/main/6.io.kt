import java.util.*

fun main() {
    val consoleReader = Scanner(System.`in`)

    println("--> enter : ")
    val userInputInt = consoleReader.nextInt()
    println("-->userInputInt ${userInputInt}")

    println("--> enter : ")
    val userInputString = consoleReader.next()
    println("-->userInputString ${userInputString}")
}
