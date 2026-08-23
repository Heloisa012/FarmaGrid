package com.example.projetoIntegrador.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class GooglePlacesService {
    @Value("${google.places.api-key:}") private String apiKey;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newHttpClient();

    public List<Map<String, Object>> buscarFarmacias(String endereco) throws Exception {
        if (apiKey == null || apiKey.isBlank())
            throw new IllegalStateException("GOOGLE_PLACES_API_KEY não configurada na API.");
        String body = mapper.writeValueAsString(Map.of(
            "textQuery", "farmácias próximas de " + endereco,
            "includedType", "pharmacy", "languageCode", "pt-BR", "maxResultCount", 15
        ));
        HttpRequest request = HttpRequest.newBuilder(URI.create("https://places.googleapis.com/v1/places:searchText"))
            .header("Content-Type", "application/json").header("X-Goog-Api-Key", apiKey)
            .header("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours,places.googleMapsUri")
            .POST(HttpRequest.BodyPublishers.ofString(body)).build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() / 100 != 2) throw new IllegalStateException("Google Places: " + response.body());
        JsonNode places = mapper.readTree(response.body()).path("places");
        List<Map<String, Object>> result = new ArrayList<>();
        for (JsonNode p : places) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", p.path("id").asText()); item.put("nome", p.path("displayName").path("text").asText());
            item.put("endereco", p.path("formattedAddress").asText());
            item.put("latitude", p.path("location").path("latitude").asDouble());
            item.put("longitude", p.path("location").path("longitude").asDouble());
            item.put("aberto", p.path("currentOpeningHours").path("openNow").isMissingNode() ? null : p.path("currentOpeningHours").path("openNow").asBoolean());
            item.put("googleMapsUri", p.path("googleMapsUri").asText()); result.add(item);
        }
        return result;
    }
}
