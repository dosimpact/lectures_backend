package com.example.kopringboot.model.http

import com.fasterxml.jackson.annotation.JsonProperty

data class UserResponse(
    var result: Result? = null,
    var description: String? = null,

    @JsonProperty("user")
    var userRequest: List<UserRequest>? = null
)

data class Result(
    var resultCode: String? = null,
    var resultMessage: String? = null
)