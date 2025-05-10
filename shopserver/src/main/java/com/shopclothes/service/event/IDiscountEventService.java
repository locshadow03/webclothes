package com.shopclothes.service.event;

import com.shopclothes.dto.event.DiscountAndPercentage;
import com.shopclothes.dto.event.DiscountEventDto;

import java.util.List;

public interface IDiscountEventService {
    DiscountEventDto createDiscountEvent(DiscountEventDto dto);

    DiscountEventDto updateDiscountEvent(Long id, DiscountEventDto dto);

    DiscountEventDto getDiscountEventById(Long id);

    void deleteDiscountEvent(Long id);

    List<DiscountEventDto> getAllDiscountEvents();

    DiscountAndPercentage getDisCountProductNowByProductId(Long product_id);
}
