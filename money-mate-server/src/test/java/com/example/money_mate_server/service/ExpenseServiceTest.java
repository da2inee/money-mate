package com.example.money_mate_server.service;

import com.example.money_mate_server.mapper.ExpenseMapper;
import com.example.money_mate_server.model.Expense;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ExpenseService 단위 테스트")
class ExpenseServiceTest {

    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense sampleExpense;

    @BeforeEach
    void setUp() {
        sampleExpense = new Expense();
        sampleExpense.setId(1L);
        sampleExpense.setCategory("jeju");
        sampleExpense.setTitle("맛집");
        sampleExpense.setAmount(35000);
        sampleExpense.setPayer("홍길동");
    }

    @Test
    @DisplayName("getAllExpenses는 매퍼 결과를 그대로 반환한다")
    void getAllExpenses_returnsMapperResult() {
        List<Expense> expected = Arrays.asList(sampleExpense);
        when(expenseMapper.getAllExpenses()).thenReturn(expected);

        List<Expense> result = expenseService.getAllExpenses();

        assertThat(result).isEqualTo(expected);
        verify(expenseMapper, times(1)).getAllExpenses();
    }

    @Test
    @DisplayName("getExpensesByCategory는 카테고리로 매퍼를 호출한다")
    void getExpensesByCategory_callsMapperWithCategory() {
        String category = "jeju";
        List<Expense> expected = Arrays.asList(sampleExpense);
        when(expenseMapper.getExpensesByCategory(category)).thenReturn(expected);

        List<Expense> result = expenseService.getExpensesByCategory(category);

        assertThat(result).isEqualTo(expected);
        verify(expenseMapper, times(1)).getExpensesByCategory(category);
    }

    @Test
    @DisplayName("saveExpense는 insert 후 동일 객체를 반환한다")
    void saveExpense_insertsAndReturnsExpense() {
        Expense toSave = new Expense();
        toSave.setCategory("jeju");
        toSave.setTitle("교통비");
        toSave.setAmount(25000);
        toSave.setPayer("김철수");
        doNothing().when(expenseMapper).insertExpense(any(Expense.class));

        Expense result = expenseService.saveExpense(toSave);

        assertThat(result).isSameAs(toSave);
        verify(expenseMapper, times(1)).insertExpense(toSave);
    }

    @Test
    @DisplayName("updateExpense는 update 후 동일 객체를 반환한다")
    void updateExpense_updatesAndReturnsExpense() {
        doNothing().when(expenseMapper).updateExpense(any(Expense.class));

        Expense result = expenseService.updateExpense(sampleExpense);

        assertThat(result).isSameAs(sampleExpense);
        verify(expenseMapper, times(1)).updateExpense(sampleExpense);
    }

    @Test
    @DisplayName("deleteExpense는 매퍼 deleteExpense를 호출한다")
    void deleteExpense_callsMapperDelete() {
        int id = 1;
        doNothing().when(expenseMapper).deleteExpense(id);

        expenseService.deleteExpense(id);

        verify(expenseMapper, times(1)).deleteExpense(id);
    }

    @Test
    @DisplayName("deleteName은 매퍼 deleteName을 호출한다")
    void deleteName_callsMapperDeleteName() {
        int id = 1;
        doNothing().when(expenseMapper).deleteName(id);

        expenseService.deleteName(id);

        verify(expenseMapper, times(1)).deleteName(id);
    }
}
