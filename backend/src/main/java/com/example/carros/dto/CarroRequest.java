package com.example.carros.dto;

import jakarta.validation.constraints.*;

public record CarroRequest(
    @NotBlank @Size(max = 80)
    String modelo,
    @NotBlank @Size(max = 50)
    String marca,
    @NotNull
    Integer ano,
    @NotBlank @Size(max = 30)
    String cor,
    @NotBlank @Size(max = 10)
    String placa
) {}
