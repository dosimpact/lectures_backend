package com.example.kopringboot.controller.get

import org.springframework.web.bind.annotation.*

// 1. controller 클래스로 선언
// - Mapping은 두가지 방법으로 진행
@RestController
@RequestMapping("/api")
class GetApiController {

    // GetMapping 이용
    @GetMapping("/hello")
    fun hello(): String {
        return "hello kotlin"
    }

    // 여러 method와 path를 동시에 매핑할 수 있는 RequestMapping 이용
    @RequestMapping(method = [RequestMethod.GET], path = ["/hello2", "/world2"])
    fun hello2(): String {
        return "hello kotlin2"
    }

    // path variable
    @GetMapping("/greeting/{name}")
    fun pathVariable(@PathVariable name: String): String {
        return "greeting name : ${name}!"
    }

}