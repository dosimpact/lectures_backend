# Kopring Boot

## REST API contoller

### GET

- 컨트롤러 선언
- url 매핑 (+ variable = path, query )

```
package com.example.kopringboot.controller.get

import com.example.kopringboot.model.http.UserRequest
import org.springframework.web.bind.annotation.*

// 1. controller 클래스로 선언
@RestController
@RequestMapping("/api")
class GetApiController {

    // GET - GetMapping 이용
    @GetMapping("/hello")
    fun hello(): String {
        return "hello kotlin"
    }

    // GET - 여러 method와 path를 동시에 매핑할 수 있는 RequestMapping 이용
    @RequestMapping(method = [RequestMethod.GET], path = ["/hello2", "/world2"])
    fun hello2(): String {
        return "hello kotlin2"
    }

    // pathVariable
    @GetMapping("/greeting/{name}/{age}")
    fun pathVariable(@PathVariable name: String, @PathVariable(name = "age") _age: Int): String {
        return "greeting name : ${name}! (age:${_age})"
    }

    // request param
    @GetMapping("/goodbye")
    fun goodbye(@RequestParam name: String, @RequestParam(name = "age") _age: Int): String {
        return "goodbye name : ${name}! (age:${_age})"
    }

    // request param using object
    // - 단, 이 방식으로는 -(하이픈)이 들어갈 수 없다.
    @GetMapping("/goodbye-object")
    fun goodbyeObject(userRequest: UserRequest):UserRequest {
        print("goodbye name : ${userRequest.name}! (age:${userRequest.age})")
        return userRequest // object mapper 가 작동한다.
    }

    // request param using Map
    // - 이 방식은 key가 String 이므로 -(하이픈)이 들어가도 된다.
    @GetMapping("/goodbye-map")
    fun goodbyeMap(@RequestParam userRequest : Map<String,Any>):Map<String,Any> {
        print("goodbye name : ${userRequest["name"]}! (age:${userRequest["age"]})")
        val phoneNumber = userRequest["phone-number"]
        phoneNumber.run {
            println("phoneNumber $phoneNumber")
        }
        return userRequest
    }
}
```