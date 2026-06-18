package com.example.carros.controller;

import com.example.carros.dto.CarroRequest;
import com.example.carros.dto.CarroResponse;
import com.example.carros.exception.ResourceNotFoundException;
import com.example.carros.service.CarroService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CarroController.class)
class CarroControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private CarroService carroService;

    @Test
    void create_returns201() throws Exception {
        CarroRequest request = new CarroRequest("sample", "sample", 1, "sample", "sample");
        CarroResponse response = new CarroResponse(1L, "sample", "sample", 1, "sample", "sample");

        when(carroService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/carros")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void findById_whenMissing_returns404() throws Exception {
        when(carroService.findById(eq(99L)))
            .thenThrow(new ResourceNotFoundException("not found"));

        mockMvc.perform(get("/api/carros/99"))
            .andExpect(status().isNotFound());
    }
}
