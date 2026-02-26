package com.example.money_mate_server.controller;

import com.example.money_mate_server.model.Expense;
import com.example.money_mate_server.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
@DisplayName("ExpenseController API 테스트")
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExpenseService expenseService;

    @Test
    @DisplayName("GET /expenses?category=jeju - 카테고리별 지출 목록 반환")
    void getExpenses_byCategory_returnsList() throws Exception {
        Expense expense = new Expense(1L, "jeju", "맛집", 35000, "홍길동");
        List<Expense> list = Arrays.asList(expense);
        when(expenseService.getExpensesByCategory("jeju")).thenReturn(list);

        mockMvc.perform(get("/expenses").param("category", "jeju"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].category").value("jeju"))
                .andExpect(jsonPath("$[0].title").value("맛집"))
                .andExpect(jsonPath("$[0].amount").value(35000))
                .andExpect(jsonPath("$[0].payer").value("홍길동"));

        verify(expenseService, times(1)).getExpensesByCategory("jeju");
    }

    @Test
    @DisplayName("GET /expenses - category 없으면 전체 조회")
    void getExpenses_noParam_returnsAll() throws Exception {
        when(expenseService.getAllExpenses()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/expenses"))
                .andExpect(status().isOk());

        verify(expenseService, times(1)).getAllExpenses();
    }

    @Test
    @DisplayName("POST /expenses - 지출 추가")
    void createExpense_returnsSaved() throws Exception {
        Expense request = new Expense();
        request.setCategory("jeju");
        request.setTitle("교통비");
        request.setAmount(25000);
        request.setPayer("김철수");
        when(expenseService.saveExpense(any(Expense.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category").value("jeju"))
                .andExpect(jsonPath("$.title").value("교통비"))
                .andExpect(jsonPath("$.amount").value(25000))
                .andExpect(jsonPath("$.payer").value("김철수"));

        verify(expenseService, times(1)).saveExpense(any(Expense.class));
    }

    @Test
    @DisplayName("DELETE /expenses/1 - 지출 삭제 204")
    void deleteExpense_returns204() throws Exception {
        doNothing().when(expenseService).deleteExpense(1);

        mockMvc.perform(delete("/expenses/1"))
                .andExpect(status().isNoContent());

        verify(expenseService, times(1)).deleteExpense(1);
    }
}
