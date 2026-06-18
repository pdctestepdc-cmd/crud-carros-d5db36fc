package com.example.carros.mapper;

import com.example.carros.dto.CarroRequest;
import com.example.carros.dto.CarroResponse;
import com.example.carros.entity.Carro;
import org.springframework.stereotype.Component;

@Component
public class CarroMapper {

    public Carro toEntity(CarroRequest request) {
        Carro entity = new Carro();
        entity.setModelo(request.modelo());
        entity.setMarca(request.marca());
        entity.setAno(request.ano());
        entity.setCor(request.cor());
        entity.setPlaca(request.placa());
        return entity;
    }

    public CarroResponse toResponse(Carro entity) {
        return new CarroResponse(
            entity.getId(),
            entity.getModelo(),
            entity.getMarca(),
            entity.getAno(),
            entity.getCor(),
            entity.getPlaca()
        );
    }

    public void updateEntity(Carro entity, CarroRequest request) {
        entity.setModelo(request.modelo());
        entity.setMarca(request.marca());
        entity.setAno(request.ano());
        entity.setCor(request.cor());
        entity.setPlaca(request.placa());
    }
}
