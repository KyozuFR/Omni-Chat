if (!CLIENT) then return end

local function sendMessageToServer(player, text)
    net.Start("SendMessage")
    net.WriteString(text)
    net.WriteString(os.date("%Y-%m-%d %H:%M:%S"))
    net.SendToServer()
end

local function displayMessageFromAPI()
    local count = net.ReadUInt(8)

    for i = 1, count do
        local author = net.ReadString()
        local message = net.ReadString()
        local timestamp = net.ReadString()
        local service = net.ReadString()

        local time = string.match(timestamp, "%d%d:%d%d") or "??:??"

        chat.AddText(Color(150, 150, 150), "[" .. time .. "] ", Color(80, 170, 240), "(" .. service .. ") ", Color(255, 200, 0), author .. ": ", Color(255,255,255), message)
    end
end

hook.Add( "OnPlayerChat", "SendMessage", sendMessageToServer)
net.Receive("GetMessages", displayMessageFromAPI)