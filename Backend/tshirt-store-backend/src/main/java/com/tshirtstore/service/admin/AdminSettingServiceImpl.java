package com.tshirtstore.service.admin;

import com.tshirtstore.entity.StoreSetting;
import com.tshirtstore.repository.StoreSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminSettingServiceImpl implements AdminSettingService {

    private final StoreSettingRepository storeSettingRepository;

    public AdminSettingServiceImpl(StoreSettingRepository storeSettingRepository) {
        this.storeSettingRepository = storeSettingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getAllSettings() {
        List<StoreSetting> settings = storeSettingRepository.findAll();
        Map<String, String> map = settings.stream().collect(Collectors.toMap(StoreSetting::getKey, StoreSetting::getValue));
        
        // Defaults
        map.putIfAbsent("store_name", "KRISHNA T-SHIRTS");
        map.putIfAbsent("store_email", "support@tshirtstore.com");
        map.putIfAbsent("currency", "INR");
        map.putIfAbsent("timezone", "Asia/Kolkata");
        map.putIfAbsent("low_stock_threshold", "5");
        map.putIfAbsent("return_window_days", "7");
        map.putIfAbsent("maintenance_mode", "false");
        return map;
    }

    @Override
    public Map<String, String> updateSettings(Map<String, String> settings) {
        if (settings != null) {
            for (Map.Entry<String, String> entry : settings.entrySet()) {
                storeSettingRepository.save(new StoreSetting(entry.getKey(), entry.getValue()));
            }
        }
        return getAllSettings();
    }
}
