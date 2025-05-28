if (not SERVER) then return end

include("autorun/sv_config.lua")

util.AddNetworkString("SendMessage")
util.AddNetworkString("GetMessages")

-- Called when client sends a message; forwards it to the Symfony API
local function sendMessageToAPI(_, ply)
    local message = net.ReadString()

    local jsonBody = util.TableToJSON({
        author = IsValid(ply) and ply:Nick() or "Unknown",
        content = message or ""
    })

    HTTP({
        method = "POST",
        url = omni_bot.SYMFONY_REST_API_URL,
        headers = {
            ["X-Service"] = "garrys_mod",
            ["Content-Type"] = "application/json",
        },
        body = jsonBody,
        success = function(code, body, headers)
            if code < 200 or code >= 300 then
                print("Error sending messages to REST API -> HTTP: " .. code .. " | Message: " .. body)
            end
        end,
        failed = function(reason)
            print("Error sending messages to REST API -> Message: " .. reason)
        end,
    })
end

-- Periodically fetch messages from Symfony API and broadcast to clients
local function getMessageFromAPI()
    HTTP({
        method = "GET",
        url = omni_bot.SYMFONY_REST_API_URL,
        headers = {
            ["X-Service"] = "garrys_mod",
        },
        success = function(code, body, headers)
            if code >= 200 and code < 300 then
                local messages = util.JSONToTable(body)
                if not istable(messages) then
                    print("Error requesting messages from REST API -> HTTP: 500 | Message: Invalid JSON from API.")
                    return
                end

                for _, msg in ipairs(messages) do
                    net.Start("GetMessages")
                        net.WriteUInt(1, 8) -- Only sending one message at a time
                        net.WriteString(msg.author or "Unknown")
                        net.WriteString(msg.content or "(none)")
                        net.WriteString(msg.service or "?")
                    net.Broadcast()
                end
            else
                print("Error requesting messages from REST API -> HTTP: " .. code .. " | Message: " .. body)
            end
        end,
        failed = function(reason)
            print("Error requesting messages from REST API -> Message: " .. reason)
        end,
    })
end

net.Receive("SendMessage", sendMessageToAPI)
-- Set up polling based on the interval defined in sv_config.lua
timer.Create("FetchChatsMessages", omni_bot.SYMFONY_REST_API_POLLING_TIMER, 0, getMessageFromAPI)