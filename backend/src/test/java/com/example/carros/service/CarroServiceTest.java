package com.example.carros.service;

import com.example.carros.dto.CarroRequest;
import com.example.carros.dto.CarroResponse;
import com.example.carros.entity.Carro;
import com.example.carros.exception.ResourceNotFoundException;
import com.example.carros.mapper.CarroMapper;
import com.example.carros.repository.CarroRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarroServiceTest {

    @Mock private CarroRepository carroRepository;
    @Mock private CarroMapper carroMapper;

    @InjectMocks private CarroService carroService;

    @Test
    void create_persistsAndReturnsResponse() {
        CarroRequest request = new CarroRequest("sample", "sample", 1, "sample", "sample");
        Carro entity = new Carro();
        CarroResponse response = new CarroResponse(1L, "sample", "sample", 1, "sample", "sample");

        when(carroMapper.toEntity(request)).thenReturn(entity);
        when(carroRepository.save(entity)).thenReturn(entity);
        when(carroMapper.toResponse(entity)).thenReturn(response);

        CarroResponse result = carroService.create(request);

        assertThat(result).isEqualTo(response);
        verify(carroRepository).save(entity);
    }

    @Test
    void findById_whenMissing_throwsNotFound() {
        when(carroRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carroService.findById(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_whenMissing_throwsNotFound() {
        when(carroRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> carroService.delete(99L))
            .isInstanceOf(ResourceNotFoundException.class);

        verify(carroRepository, never()).deleteById(any());
    }
}
