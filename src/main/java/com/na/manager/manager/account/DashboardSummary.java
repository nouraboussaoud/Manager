package com.na.manager.manager.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    
    // User Statistics
    private long totalUsers;
    private long activeUsers;
    private long pendingUsers;
    private long blockedUsers;
    
    // Account Statistics
    private long totalAccounts;
    private long activeAccounts;
    private long disabledAccounts;
    private long closedAccounts;
    private long accountsWithTrade;
    private long accountsWithTradeQB;
}