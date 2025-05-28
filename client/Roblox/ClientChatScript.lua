local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TextChatService = game:GetService("TextChatService")

-- RemoteEvent for receiving chat messages from the server
local event = ReplicatedStorage:WaitForChild("AfficherMessageChat")

-- Function to sanitize content (basic HTML escaping)
local function sanitize(text)
	text = tostring(text)
	text = text:gsub("&", "&amp;")
	text = text:gsub("<", "&lt;")
	text = text:gsub(">", "&gt;")
	return text
end

-- When a message is received from the server
event.OnClientEvent:Connect(function(message)
	-- Validate incoming message structure
	if typeof(message) ~= "table" then return end
	if type(message.platform) ~= "string" or type(message.author) ~= "string" or type(message.content) ~= "string" then
		warn("Invalid message received")
		return
	end

	-- Sanitize each field to prevent formatting abuse
	local platform = sanitize(message.platform)
	local author = sanitize(message.author)
	local content = sanitize(message.content)

	local formattedText = "<b><font color='#AAAAAA'>(" .. platform .. ")</font> " ..
		"<font color='#00FFAA'>" .. author .. "</font>: " ..
		"<font color='#FFFFFF'>" .. content .. "</font></b>"

	TextChatService.TextChannels.RBXSystem:DisplaySystemMessage(formattedText)
end)
