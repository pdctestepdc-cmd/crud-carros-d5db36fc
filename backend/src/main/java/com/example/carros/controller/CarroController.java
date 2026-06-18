package com.example.carros.controller;

import com.example.carros.dto.CarroRequest;
import com.example.carros.dto.CarroResponse;
import com.example.carros.service.CarroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Carro", description = "CRUD operations for Carro")
@RestController
@RequestMapping("/api/carros")
public class CarroController {

    private final CarroService carroService;

    public CarroController(CarroService carroService) {
        this.carroService = carroService;
    }

    @Operation(summary = "List all Carro records")
    @GetMapping
    public List<CarroResponse> findAll() {
        return carroService.findAll();
    }

    @Operation(summary = "Get a Carro by id")
    @GetMapping("/{id}")
    public CarroResponse findById(@PathVariable Long id) {
        return carroService.findById(id);
    }

    @Operation(summary = "Create a new Carro")
    @PostMapping
    public ResponseEntity<CarroResponse> create(@Valid @RequestBody CarroRequest request) {
        CarroResponse created = carroService.create(request);
        return ResponseEntity
            .created(URI.create("/api/carros/" + created.id()))
            .body(created);
    }

    @Operation(summary = "Update an existing Carro")
    @PutMapping("/{id}")
    public CarroResponse update(@PathVariable Long id,
                                        @Valid @RequestBody CarroRequest request) {
        return carroService.update(id, request);
    }

    @Operation(summary = "Delete a Carro by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        carroService.delete(id);
    }
}
