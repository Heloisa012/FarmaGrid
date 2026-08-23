package com.example.projetoIntegrador.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
        if (apiKey == null || apiKey.isBlank()) return buscarOpenStreetMap(endereco);
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

    private List<Map<String, Object>> buscarOpenStreetMap(String endereco) throws Exception {
        String q = URLEncoder.encode(endereco, StandardCharsets.UTF_8);
        HttpRequest geoReq = HttpRequest.newBuilder(URI.create("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=" + q))
            .header("User-Agent", "FarmaGrid/1.0 contato@farmagrid.app").GET().build();
        JsonNode geo = mapper.readTree(client.send(geoReq, HttpResponse.BodyHandlers.ofString()).body());
        if (!geo.isArray() || geo.isEmpty()) throw new IllegalStateException("Endereço não localizado. Confira cidade e CEP nas configurações.");
        double lat = geo.get(0).path("lat").asDouble(), lon = geo.get(0).path("lon").asDouble();
        String overpass = "[out:json];(node[amenity=pharmacy](around:10000," + lat + "," + lon + ");way[amenity=pharmacy](around:10000," + lat + "," + lon + "););out center tags;";
        HttpRequest osmReq = HttpRequest.newBuilder(URI.create("https://overpass-api.de/api/interpreter"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("User-Agent", "FarmaGrid/1.0 contato@farmagrid.app")
            .POST(HttpRequest.BodyPublishers.ofString("data=" + URLEncoder.encode(overpass, StandardCharsets.UTF_8))).build();
        JsonNode elementos = mapper.readTree(client.send(osmReq, HttpResponse.BodyHandlers.ofString()).body()).path("elements");
        List<Map<String, Object>> result = new ArrayList<>();
        for (JsonNode p : elementos) {
            JsonNode tags = p.path("tags");
            if (tags.path("name").asText().isBlank()) continue;
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", "osm-" + p.path("id").asText()); item.put("nome", tags.path("name").asText());
            item.put("endereco", montarEndereco(tags)); item.put("aberto", null);
            item.put("horario", tags.path("opening_hours").asText("Horário não informado")); item.put("fonte", "OpenStreetMap");
            result.add(item); if (result.size() == 15) break;
        }
        return result;
    }

    private String montarEndereco(JsonNode tags) {
        return java.util.stream.Stream.of(tags.path("addr:street").asText(), tags.path("addr:housenumber").asText(), tags.path("addr:suburb").asText())
            .filter(v -> v != null && !v.isBlank()).collect(java.util.stream.Collectors.joining(", "));
    }
}
