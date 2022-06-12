package ktdocs.function


// return null === Unit
fun printMessage(message:String):Unit{
    println(message)
}
fun logMessage(msg:String,prefix:String = "Info"){
    println("[$prefix] $msg")
}
fun sum(x:Int,y:Int):Int {
    return x+y
}
fun multiply(x:Int,y:Int) = x*y

// test functions 
fun main(){
    printMessage("Hello")
    logMessage("Hello")
    logMessage(""+sum(1,2))
    logMessage(""+multiply(3,5))
}