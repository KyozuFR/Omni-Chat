// src/main/java/kyozu/omnichat/network/ApiClient.java
package kyozu.omnichat.network;

import com.google.gson.JsonObject;
import kyozu.omnichat.OmniChat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class ApiClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApiClient.class);
    private static final String API_URL = kyozu.omnichat.OmniChat.API_URL;
    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    public static void sendChat(String content, String author) {
        try {
            JsonObject payload = new JsonObject();
            payload.addProperty("content", content);
            payload.addProperty("author", author);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .header("X-SERVICE", "minecraft")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString(), StandardCharsets.UTF_8))
                    .build();

            CLIENT.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                    .thenRun(() -> LOGGER.info("Message envoyé à l'API : {} de {}", content, author))
                    .exceptionally(e -> {
                        LOGGER.error("Erreur lors de l'envoi à l'API", e);
                        return null;
                    });
        } catch (Exception e) {
            LOGGER.error("Erreur lors de la préparation de la requête", e);
        }
    }
}