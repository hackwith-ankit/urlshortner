package com.smarturl.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUrlRequest {

    @NotEmpty(message = "At least one URL is required")
    @Size(max = 50, message = "Maximum 50 URLs allowed per batch")
    private List<@Valid CreateUrlRequest> urls;
}
