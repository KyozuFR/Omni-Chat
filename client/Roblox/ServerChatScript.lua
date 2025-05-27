local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local event = ReplicatedStorage:WaitForChild("AfficherMessageChat")

local url = "https://api-omnichat.2linares.fr/api/messages"
local headers = {
	["Content-Type"] = "application/json",
	["X-Service"] = "roblox",
}

local lastMessageID = nil

-- Sends a message to the external API
local function sendMessage(author, content)
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
end

-- Checks for new messages from the API
local function checkNewMessages()
	local success, response = pcall(function()
		return HttpService:RequestAsync({
			Url = url,
			Method = "GET",
			Headers = headers,
		})
	end)

	if success and response.Success then
		local messages = HttpService:JSONDecode(response.Body)

		if typeof(messages) == "table" then
			for _, message in ipairs(messages) do
				local id = message.id or message.timestamp or message.created_at
				-- Only process new messages with a different ID
				if id and id ~= lastMessageID then
					lastMessageID = id
					task.wait(1)
					-- Send formatted message data to all clients
					event:FireAllClients({
						platform = message.service,
						author = message.author,
						content = message.content
					})
				end
			end
		end
	else
		warn("GET request failed:", response and response.StatusCode or "no response")
	end
end

-- When a player chats, send their message to the external API
Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(msg)
		sendMessage(player.Name, msg)
	end)
end)

-- Continuously poll the API every 5 seconds for new messages
task.spawn(function()
	while true do
		checkNewMessages()
		task.wait(5)
	end
end)
