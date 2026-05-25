package com.smarturl.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlRequest {

    @NotBlank(message = "URL is required")
    @URL(message = "Please provide a valid URL")
    @Size(max = 2048, message = "URL is too long")
    private String originalUrl;

    @Size(max = 50, message = "Custom alias must be less than 50 characters")
    private String customAlias;
}
