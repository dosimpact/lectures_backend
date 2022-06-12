package com.hellokt.springkt1

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SpringKt1Application

fun main(args: Array<String>) {
	println("hello wolrd") 
	runApplication<SpringKt1Application>(*args)
}
