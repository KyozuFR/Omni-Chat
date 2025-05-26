package kyozu.omnichat.network;

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
    private static final String API_URL = "https://api-omnichat.2linares.fr/api/messages";
    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    public static void sendChat(String content, String author) {
        OmniChat.LOGGER.info("Envoi du message : {} de {}", content, author);
        try {
            String payload = String.format("{\"content\":\"%s\",\"author\":\"%s\"}",
                    content.replace("\"", "\\\""),
                    author.replace("\"", "\\\""));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .header("X-SERVICE", "minecraft")
                    .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                    .build();
            CLIENT.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                    .exceptionally(e -> { LOGGER.error("Envoi à l'API échoué", e); return null; });
            LOGGER.info("Payload envoyé : {}", payload);
        } catch (Exception e) {
            LOGGER.error("Erreur lors de la préparation de la requête", e);
        }
    }
}
