package com.example.money_mate_server.service;

import com.example.money_mate_server.dto.TravelerDto;
import com.example.money_mate_server.mapper.TravelerMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TravelerService 단위 테스트")
class TravelerServiceTest {

    @Mock
    private TravelerMapper travelerMapper;

    @InjectMocks
    private TravelerService travelerService;

    @Test
    @DisplayName("saveTravelerName은 매퍼 saveName 호출 후 이름 반환")
    void saveTravelerName_callsMapperAndReturnsName() {
        String name = "홍길동";
        String category = "jeju";
        doNothing().when(travelerMapper).saveName(eq(name), eq(category));

        String result = travelerService.saveTravelerName(name, category);

        assertThat(result).isEqualTo(name);
        verify(travelerMapper, times(1)).saveName(name, category);
    }

    @Test
    @DisplayName("getTravelerNamesByCategory는 매퍼 결과를 그대로 반환")
    void getTravelerNamesByCategory_returnsMapperResult() {
        String category = "jeju";
        TravelerDto dto1 = new TravelerDto(1L, "홍길동");
        TravelerDto dto2 = new TravelerDto(2L, "김철수");
        List<TravelerDto> expected = Arrays.asList(dto1, dto2);
        when(travelerMapper.findNamesByCategory(category)).thenReturn(expected);

        List<TravelerDto> result = travelerService.getTravelerNamesByCategory(category);

        assertThat(result).isEqualTo(expected);
        verify(travelerMapper, times(1)).findNamesByCategory(category);
    }
}
