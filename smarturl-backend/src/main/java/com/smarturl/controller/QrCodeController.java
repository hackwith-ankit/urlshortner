package com.smarturl.controller;

import com.smarturl.service.QrCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@Tag(name = "QR Code", description = "QR code generation endpoints")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @Value("${app.base-url}")
    private String baseUrl;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping(value = "/{shortCode}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Get QR code image for a short URL")
    public ResponseEntity<byte[]> getQrCode(
            @PathVariable String shortCode,
            @RequestParam(defaultValue = "300") int size) {
        String shortUrl = baseUrl + "/s/" + shortCode;
        byte[] qrImage = qrCodeService.generateQrCode(shortUrl, size, size);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header("Content-Disposition", "inline; filename=\"qr-" + shortCode + ".png\"")
                .body(qrImage);
    }
}
