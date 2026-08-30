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
import java.time.*;
import java.time.format.DateTimeFormatter;

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
            item.put("horario", p.path("currentOpeningHours").path("weekdayDescriptions").isArray()
                ? p.path("currentOpeningHours").path("weekdayDescriptions").toString() : "Horário não informado");
            item.put("fonte", "Google Places");
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
            String horario = tags.path("opening_hours").asText("");
            item.put("endereco", montarEndereco(tags)); item.put("aberto", estaAberto(horario));
            item.put("horario", horario.isBlank() ? "Horário não informado" : horario); item.put("fonte", "OpenStreetMap");
            result.add(item); if (result.size() == 15) break;
        }
        return result;
    }

    private String montarEndereco(JsonNode tags) {
        return java.util.stream.Stream.of(tags.path("addr:street").asText(), tags.path("addr:housenumber").asText(), tags.path("addr:suburb").asText())
            .filter(v -> v != null && !v.isBlank()).collect(java.util.stream.Collectors.joining(", "));
    }

    // Avalia os formatos mais comuns do opening_hours; regras complexas ficam como desconhecidas.
    private Boolean estaAberto(String openingHours) {
        if (openingHours == null || openingHours.isBlank()) return null;
        if ("24/7".equals(openingHours.trim())) return true;
        ZonedDateTime agora = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
        String dia = switch (agora.getDayOfWeek()) {
            case MONDAY -> "Mo"; case TUESDAY -> "Tu"; case WEDNESDAY -> "We";
            case THURSDAY -> "Th"; case FRIDAY -> "Fr"; case SATURDAY -> "Sa"; case SUNDAY -> "Su";
        };
        try {
            for (String regra : openingHours.split(";")) {
                String[] partes = regra.trim().split("\\s+", 2);
                if (partes.length != 2 || !incluiDia(partes[0], dia)) continue;
                if ("off".equalsIgnoreCase(partes[1])) return false;
                for (String faixa : partes[1].split(",")) {
                    String[] horas = faixa.trim().split("-");
                    if (horas.length != 2) continue;
                    LocalTime inicio = LocalTime.parse(horas[0], DateTimeFormatter.ofPattern("H:mm"));
                    LocalTime fim = LocalTime.parse(horas[1], DateTimeFormatter.ofPattern("H:mm"));
                    LocalTime atual = agora.toLocalTime();
                    if ((fim.isAfter(inicio) && !atual.isBefore(inicio) && atual.isBefore(fim))
                        || (!fim.isAfter(inicio) && (!atual.isBefore(inicio) || atual.isBefore(fim)))) return true;
                }
                return false;
            }
            return false;
        } catch (RuntimeException e) {
            return null;
        }
    }

    private boolean incluiDia(String expressao, String dia) {
        List<String> dias = List.of("Mo", "Tu", "We", "Th", "Fr", "Sa", "Su");
        for (String parte : expressao.split(",")) {
            String[] faixa = parte.split("-");
            if (faixa.length == 1 && faixa[0].equals(dia)) return true;
            if (faixa.length == 2) {
                int inicio = dias.indexOf(faixa[0]), fim = dias.indexOf(faixa[1]), atual = dias.indexOf(dia);
                if (inicio >= 0 && fim >= 0 && (inicio <= fim ? atual >= inicio && atual <= fim : atual >= inicio || atual <= fim)) return true;
            }
        }
        return false;
    }
}
