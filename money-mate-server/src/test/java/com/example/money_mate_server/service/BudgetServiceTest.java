package com.example.money_mate_server.service;

import com.example.money_mate_server.mapper.BudgetMapper;
import com.example.money_mate_server.model.Budget;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BudgetService 단위 테스트")
class BudgetServiceTest {

    @Mock
    private BudgetMapper budgetMapper;

    @InjectMocks
    private BudgetService budgetService;

    private Budget sampleBudget;

    @BeforeEach
    void setUp() {
        sampleBudget = new Budget();
        sampleBudget.setId(1L);
        sampleBudget.setCategory("jeju");
        sampleBudget.setTotalAmount(500000);
        sampleBudget.setStartDate(LocalDate.of(2025, 3, 1));
        sampleBudget.setEndDate(LocalDate.of(2025, 3, 5));
    }

    @Test
    @DisplayName("getBudgetByCategory는 매퍼 결과를 그대로 반환한다")
    void getBudgetByCategory_returnsMapperResult() {
        when(budgetMapper.getBudgetByCategory("jeju")).thenReturn(sampleBudget);

        Budget result = budgetService.getBudgetByCategory("jeju");

        assertThat(result).isEqualTo(sampleBudget);
        verify(budgetMapper, times(1)).getBudgetByCategory("jeju");
    }

    @Test
    @DisplayName("getBudgetByCategory는 없으면 null을 반환한다")
    void getBudgetByCategory_returnsNullWhenNotFound() {
        when(budgetMapper.getBudgetByCategory("unknown")).thenReturn(null);

        Budget result = budgetService.getBudgetByCategory("unknown");

        assertThat(result).isNull();
    }

    @Test
    @DisplayName("saveBudget - 기존 예산이 있으면 update 후 반환")
    void saveBudget_whenExisting_updatesAndReturns() {
        Budget newBudget = new Budget();
        newBudget.setCategory("jeju");
        newBudget.setTotalAmount(600000);
        newBudget.setStartDate(LocalDate.of(2025, 3, 1));
        newBudget.setEndDate(LocalDate.of(2025, 3, 7));
        when(budgetMapper.getBudgetByCategory("jeju")).thenReturn(sampleBudget);
        doNothing().when(budgetMapper).updateBudget(any(Budget.class));

        Budget result = budgetService.saveBudget(newBudget);

        assertThat(result).isNotNull();
        assertThat(result.getTotalAmount()).isEqualTo(600000);
        verify(budgetMapper, times(1)).getBudgetByCategory("jeju");
        verify(budgetMapper, times(1)).updateBudget(any(Budget.class));
        verify(budgetMapper, never()).insertBudget(any(Budget.class));
    }

    @Test
    @DisplayName("saveBudget - 기존 예산이 없으면 insert 후 반환")
    void saveBudget_whenNotExisting_insertsAndReturns() {
        Budget newBudget = new Budget();
        newBudget.setCategory("seoul");
        newBudget.setTotalAmount(300000);
        when(budgetMapper.getBudgetByCategory("seoul")).thenReturn(null);
        doNothing().when(budgetMapper).insertBudget(any(Budget.class));

        Budget result = budgetService.saveBudget(newBudget);

        assertThat(result).isSameAs(newBudget);
        verify(budgetMapper, times(1)).getBudgetByCategory("seoul");
        verify(budgetMapper, times(1)).insertBudget(newBudget);
        verify(budgetMapper, never()).updateBudget(any(Budget.class));
    }
}
