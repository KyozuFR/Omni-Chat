-- Services
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- RemoteEvent to send messages to clients
local event = ReplicatedStorage:WaitForChild("AfficherMessageChat")

-- API configuration
local url = "https://api-omnichat.2linares.fr/api/messages"
local headers = {
	["Content-Type"] = "application/json",
	["X-Service"] = "roblox",
}

-- Track last received message ID to prevent duplicates
local lastMessageID = nil

-- Sends a message to the external API
local function sendMessageToAPI(author, content)
	-- Sanitize and validate inputs
	if typeof(author) ~= "string" or typeof(content) ~= "string" then
		warn("Invalid message format")
		return
	end

	local data = {
		author = author,
		content = content,
	}

	local body = HttpService:JSONEncode(data)

	local success, response = pcall(function()
		return HttpService:RequestAsync({
			Url = url,
			Method = "POST",
			Headers = headers,
			Body = body,
		})
	end)

	if not success then
		warn("Failed to send message to API:", response)
	end
end

-- Checks for new messages from the external API
local function checkForNewMessages()
	local success, response = pcall(function()
		return HttpService:RequestAsync({
			Url = url,
			Method = "GET",
			Headers = headers,
		})
	end)

	if not success or not response.Success then
		warn("Failed to fetch messages:", response and response.StatusCode or "No response")
		return
	end

	local messages
	pcall(function()
		messages = HttpService:JSONDecode(response.Body)
	end)

	if typeof(messages) ~= "table" then
		return
	end

	for _, message in ipairs(messages) do
		local id = message.id or message.timestamp or message.created_at
		if id and id ~= lastMessageID then
			lastMessageID = id

			-- Validate message fields
			if typeof(message.author) == "string" and typeof(message.content) == "string" and typeof(message.service) == "string" then
				task.wait(1) -- Prevent flooding

				-- Send to all clients
				event:FireAllClients({
					platform = message.service,
					author = message.author,
					content = message.content,
				})
			end
		end
	end
end

-- When a player joins, listen for chat messages
Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(msg)
		sendMessageToAPI(player.Name, msg)
	end)
end)

-- Periodically fetch new messages
task.spawn(function()
	while true do
		checkForNewMessages()
		task.wait(2)
	end
end)
