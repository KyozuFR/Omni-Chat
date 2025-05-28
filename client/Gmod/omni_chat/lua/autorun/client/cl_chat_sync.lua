if (not CLIENT) then return end

-- Sends chat message to the server
local function sendMessageToServer(ply, text, teamChat, isDead)
    if text and text:Trim() ~= "" then
        net.Start("SendMessage")
        net.WriteString(text)
        net.SendToServer()
    end
end

-- Receives messages from the server and displays in chat
local function displayMessageFromAPI()
    local count = net.ReadUInt(8)

    for i = 1, count do
        local author = net.ReadString()
        local message = net.ReadString()
        local service = net.ReadString()

        chat.AddText(
            Color(80, 170, 240), "(" .. service .. ") ",
            Color(255, 200, 0), author .. ": ",
            Color(255, 255, 255), message
        )
    end
end

-- Hook to intercept player chat
hook.Add("OnPlayerChat", "SendMessage", sendMessageToServer)
net.Receive("GetMessages", displayMessageFromAPI)
