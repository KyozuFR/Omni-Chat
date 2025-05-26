package kyozu.omnichat;

import kyozu.omnichat.network.MessageFetcher;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import kyozu.omnichat.network.ApiClient;
import net.fabricmc.fabric.api.message.v1.ServerMessageEvents;

public class OmniChat implements ModInitializer {
	public static final String MOD_ID = "omni-chat";
	public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	@Override
	public void onInitialize() {
		LOGGER.info("Hello Fabric world!");

		ServerMessageEvents.CHAT_MESSAGE.register((message, sender, type) -> {
			if (sender != null && !sender.getName().getString().isEmpty()) {
				String author = sender.getName().getString();
				String content = message.getSignedContent();
				sendChat(content, author);
			} else {
				LOGGER.warn("Message from an unknown sender: {}", message.getSignedContent());
			}
		});

		ServerLifecycleEvents.SERVER_STARTED.register(MessageFetcher::start);
	}

	public static void sendChat(String content, String author) {
		ApiClient.sendChat(content, author);
	}
}
