package com.tshirtstore.service.admin;

import java.util.Map;

public interface AdminSettingService {
    Map<String, String> getAllSettings();
    Map<String, String> updateSettings(Map<String, String> settings);
}
