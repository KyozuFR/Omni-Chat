local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TextChatService = game:GetService("TextChatService")

local afficherMessageEvent = ReplicatedStorage:WaitForChild("AfficherMessageChat")

-- Event handler triggered when a message is received from the server
afficherMessageEvent.OnClientEvent:Connect(function(messageData)
	local platform = messageData.platform or "Unknown"
	local author = messageData.author or "Anonymous"
	local content = messageData.content or ""

	local formattedMessage = string.format(
		"<b><font color='#AAAAAA'>(%s)</font> <font color='#00FFAA'>%s</font>: <font color='#FFFFFF'>%s</font></b>",
		platform, author, content
	)

	TextChatService.TextChannels.RBXSystem:DisplaySystemMessage(formattedMessage)
end)
