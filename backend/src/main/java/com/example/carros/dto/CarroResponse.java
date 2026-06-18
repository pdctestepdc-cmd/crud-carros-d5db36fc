package com.example.carros.dto;

public record CarroResponse(
    Long id,
    String modelo,
    String marca,
    Integer ano,
    String cor,
    String placa
) {}
