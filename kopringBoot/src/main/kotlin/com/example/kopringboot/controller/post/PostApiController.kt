package com.example.kopringboot.controller.post

import com.example.kopringboot.model.http.UserRequest
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class PostApiController {

    // POST -
    @PostMapping("post-1")
    fun post1(@RequestBody userRequest: UserRequest):UserRequest {
        println("-->userRequest $userRequest")
        return userRequest
    }
}