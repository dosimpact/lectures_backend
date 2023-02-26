package com.example.kopringboot.controller.put

import com.example.kopringboot.model.http.Result
import com.example.kopringboot.model.http.UserRequest
import com.example.kopringboot.model.http.UserResponse
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class PutApiController {

    @PutMapping("/put-1")
    fun put1(@RequestBody userRequest: UserRequest): UserResponse {

        return UserResponse().apply {
            this.description = "description"
            this.result = Result().apply {
                this.resultCode = "200"
                this.resultMessage = "success"
            }
            val userList = mutableListOf<UserRequest>()
            userList.add(UserRequest())
            userList.add(UserRequest().apply {
                this.age = userRequest.age
                this.email = userRequest.email
                this.phoneNumber = userRequest.phoneNumber
                this.name = userRequest.name
                this.address = userRequest.address
            })
            userList.add(UserRequest().apply {
                this.age = 999
            })

            this.userRequest = userList
        }
    }
}