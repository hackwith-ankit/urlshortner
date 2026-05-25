package com.smarturl.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUrlRequest {

    @Size(max = 2048, message = "URL is too long")
    private String originalUrl;

    @Size(max = 50, message = "Custom alias must be less than 50 characters")
    private String customAlias;

    private Boolean isActive;
}
