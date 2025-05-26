if (!SERVER) then return end

include("autorun/env.lua")
util.AddNetworkString("SendMessage")
util.AddNetworkString("GetMessages")

local function sendMessageToAPI(length, player)
    local content = net.ReadString()

    local function successLogic(code, body, headers)
        //print( "HTTP request succeeded \nCODE: ", code, "\nBODY: ", body, "\nHEADER: ", headers )
    end

    local function failedLogic(reason)
        //print( "HTTP request failed \nREASON: ", reason )
    end

    local jsonBody = util.TableToJSON({
        author = player:Nick(),
        content = content
    })

    HTTP( {
        failed = failedLogic,
        success = successLogic,
        method = "POST",
        headers = {
            ["X-Service"] = "garrys_mod",
            ["Content-Type"] = "application/json",
        },
        body = jsonBody,
        url = ENV.REST_API_URL,
    } )
end

local function getMessageFromAPI()
    local function successLogic(code, body, headers)
        //print( "HTTP request succeeded \nCODE: ", code, "\nBODY: ", body, "\nHEADER: ", headers )

        local messages = util.JSONToTable(body)
        if not istable(messages) then
            print("Failed to parse JSON response.")
            return
        end

        local delayStep = 3 / #messages

        for i, msg in ipairs(messages) do
            timer.Simple(i * delayStep, function()
                net.Start("GetMessages")
                    net.WriteUInt(1, 8)
                    net.WriteString(msg.author or "Unknown")
                    net.WriteString(msg.content or "(none)")
                    net.WriteString(msg.createdAt or "?")
                    net.WriteString(msg.service or "?")
                net.Broadcast()
            end)
        end
    end

    local function failedLogic(reason)
        //print( "HTTP request failed \nREASON: ", reason )
    end

    HTTP( {
        failed = failedLogic,
        success = successLogic,
        method = "GET",
        headers = {
            ["X-Service"] = "garrys_mod",
        },
        url = ENV.REST_API_URL,
    } )
end

net.Receive("SendMessage", sendMessageToAPI)
timer.Create("FetchChatsMessages", ENV.POLL_TIMER, 0, getMessageFromAPI)