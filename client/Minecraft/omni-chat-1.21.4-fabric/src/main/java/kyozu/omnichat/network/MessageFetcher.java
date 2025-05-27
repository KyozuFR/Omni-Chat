// src/main/java/kyozu/omnichat/network/MessageFetcher.java
package kyozu.omnichat.network;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import net.minecraft.server.MinecraftServer;
import net.minecraft.text.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class MessageFetcher {
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageFetcher.class);
    private static final String API_URL = kyozu.omnichat.OmniChat.API_URL;
    private static final HttpClient CLIENT = HttpClient.newHttpClient();
    private final MinecraftServer server;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private MessageFetcher(MinecraftServer server) {
        this.server = server;
    }

    public static void start(MinecraftServer server) {
        new MessageFetcher(server).begin();
    }

    private void begin() {
        scheduler.scheduleAtFixedRate(this::fetchAndBroadcast, 0, 5, TimeUnit.SECONDS);
    }

    private void fetchAndBroadcast() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("X-SERVICE", "minecraft")
                    .GET()
                    .build();

            CLIENT.sendAsync(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8))
                    .thenAccept(response -> {
                        try {
                            JsonArray array = JsonParser.parseString(response.body()).getAsJsonArray();
                            for (JsonElement el : array) {
                                var obj = el.getAsJsonObject();
                                String author = obj.get("author").getAsString();
                                String content = obj.get("content").getAsString();
                                String service = obj.get("service").getAsString();
                                server.getPlayerManager().broadcast(Text.of("(" + service + ") " + author + ": " + content), false);
                            }
                        } catch (Exception e) {
                            LOGGER.error("Erreur de parsing des messages", e);
                        }
                    })
                    .exceptionally(e -> {
                        LOGGER.error("Erreur lors du fetch des messages", e);
                        return null;
                    });
        } catch (Exception e) {
            LOGGER.error("Erreur lors de la préparation de la requête de fetch", e);
        }
    }
}