package com.na.manager.manager.account;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class JsonFileService {

    @Value("${app.accounts.data-directory:data}")
    private String dataDirectory;

    private final ObjectMapper objectMapper;
    private final Map<String, Object> fileCache = new ConcurrentHashMap<>();

    public JsonFileService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        try {
            Path dataPath = Paths.get(dataDirectory);
            if (!Files.exists(dataPath)) {
                Files.createDirectories(dataPath);
                log.info("Created data directory: {}", dataPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create data directory", e);
        }
    }

    public List<Account> readBoAccounts() {
        return readAccountList("bo-accounts.json");
    }

    public List<Account> readAccountsList() {
        return readAccountList("accounts-list.json");
    }

    public List<LocalClient> readSefClients() {
        return readList("sef-clients.json", new TypeReference<List<LocalClient>>() {});
    }

    public List<SefClient> readSefClientsAsSefClient() {
        return readList("sef-clients.json", new TypeReference<List<SefClient>>() {});
    }

    private List<Account> readAccountList(String fileName) {
        return readList(fileName, new TypeReference<List<Account>>() {});
    }

    @SuppressWarnings("unchecked")
    private <T> List<T> readList(String fileName, TypeReference<List<T>> typeReference) {
        try {
            File file = new File(dataDirectory, fileName);
            if (!file.exists()) {
                log.warn("File {} does not exist, returning empty list", fileName);
                return new ArrayList<>();
            }

            String cacheKey = fileName + "_" + file.lastModified();
            if (fileCache.containsKey(cacheKey)) {
                return (List<T>) fileCache.get(cacheKey);
            }

            List<T> data = objectMapper.readValue(file, typeReference);
            fileCache.put(cacheKey, data);
            
            // Clear old cache entries for this file
            fileCache.entrySet().removeIf(entry -> 
                entry.getKey().startsWith(fileName + "_") && !entry.getKey().equals(cacheKey));
            
            log.debug("Read {} items from {}", data.size(), fileName);
            return data;
        } catch (IOException e) {
            log.error("Failed to read file: {}", fileName, e);
            return new ArrayList<>();
        }
    }

    public void writeBoAccounts(List<Account> accounts) {
        writeAccountList("bo-accounts.json", accounts);
    }

    public void writeAccountsList(List<Account> accounts) {
        writeAccountList("accounts-list.json", accounts);
    }

    public void writeSefClients(List<LocalClient> clients) {
        writeList("sef-clients.json", clients);
    }

    public void writeSefClientsAsSefClient(List<SefClient> clients) {
        writeList("sef-clients.json", clients);
    }

    private void writeAccountList(String fileName, List<Account> accounts) {
        writeList(fileName, accounts);
    }

    private <T> void writeList(String fileName, List<T> data) {
        try {
            File file = new File(dataDirectory, fileName);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, data);
            
            // Update cache
            String cacheKey = fileName + "_" + file.lastModified();
            fileCache.put(cacheKey, data);
            
            // Clear old cache entries for this file
            fileCache.entrySet().removeIf(entry -> 
                entry.getKey().startsWith(fileName + "_") && !entry.getKey().equals(cacheKey));
            
            log.debug("Wrote {} items to {}", data.size(), fileName);
        } catch (IOException e) {
            log.error("Failed to write file: {}", fileName, e);
            throw new RuntimeException("Failed to write data to file: " + fileName, e);
        }
    }

    public void clearCache() {
        fileCache.clear();
        log.debug("Cleared file cache");
    }

    public void clearCacheForFile(String fileName) {
        fileCache.entrySet().removeIf(entry -> entry.getKey().startsWith(fileName + "_"));
        log.debug("Cleared cache for file: {}", fileName);
    }
}