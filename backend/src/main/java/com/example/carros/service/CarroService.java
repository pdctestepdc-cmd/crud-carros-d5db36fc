package com.example.carros.service;

import com.example.carros.dto.CarroRequest;
import com.example.carros.dto.CarroResponse;
import com.example.carros.entity.Carro;
import com.example.carros.exception.ResourceNotFoundException;
import com.example.carros.mapper.CarroMapper;
import com.example.carros.repository.CarroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarroService {

    private final CarroRepository carroRepository;
    private final CarroMapper carroMapper;

    public CarroService(CarroRepository carroRepository,
                                CarroMapper carroMapper) {
        this.carroRepository = carroRepository;
        this.carroMapper = carroMapper;
    }

    @Transactional(readOnly = true)
    public List<CarroResponse> findAll() {
        return carroRepository.findAll().stream()
            .map(carroMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CarroResponse findById(Long id) {
        Carro entity = carroRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Carro not found: " + id));
        return carroMapper.toResponse(entity);
    }

    @Transactional
    public CarroResponse create(CarroRequest request) {
        Carro entity = carroMapper.toEntity(request);
        Carro saved = carroRepository.save(entity);
        return carroMapper.toResponse(saved);
    }

    @Transactional
    public CarroResponse update(Long id, CarroRequest request) {
        Carro entity = carroRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Carro not found: " + id));
        carroMapper.updateEntity(entity, request);
        return carroMapper.toResponse(entity);
    }

    @Transactional
    public void delete(Long id) {
        if (!carroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Carro not found: " + id);
        }
        carroRepository.deleteById(id);
    }
}
