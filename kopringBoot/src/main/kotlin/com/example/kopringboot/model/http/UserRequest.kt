package com.example.kopringboot.model.http

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.PropertyNamingStrategies
import com.fasterxml.jackson.databind.annotation.JsonNaming

//@JsonNaming(PropertyNamingStrategies.SNAKE_CASE::class)
// 위 어노테이션으로, 이름 규칙을 JsonProperty 일괄 적용
data class UserRequest(
    var name: String? = null,
    var age: Int? = null,
    var email: String? = null,
    var address: String? = null,

    @JsonProperty("phone-number")
    var phoneNumber: String? = null
)