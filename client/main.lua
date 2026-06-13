local isUIOpen   = false
local laserActive = false
local coordThread = nil


local function Round(num, decimals)
    local mult = 10 ^ (decimals or Config.Decimals)
    return math.floor(num * mult + 0.5) / mult
end

local function GetCoordData()
    local ped     = PlayerPedId()
    local coords  = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local camFov  = GetGameplayCamFov()
    return {
        x       = Round(coords.x),
        y       = Round(coords.y),
        z       = Round(coords.z),
        heading = Round(heading),
        camFov  = Round(camFov, 1)
    }
end

local function RotationToDirection(rotation)
    local adjustedRotation = {
        x = (math.pi / 180) * rotation.x,
        y = (math.pi / 180) * rotation.y,
        z = (math.pi / 180) * rotation.z
    }
    return {
        x = -math.sin(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        y =  math.cos(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        z =  math.sin(adjustedRotation.x)
    }
end

local function RayCastGamePlayCamera(distance)
    local camRot   = GetGameplayCamRot()
    local camCoord = GetGameplayCamCoord()
    local dir      = RotationToDirection(camRot)
    local dest = {
        x = camCoord.x + dir.x * distance,
        y = camCoord.y + dir.y * distance,
        z = camCoord.z + dir.z * distance
    }
    local _, hit, endCoords, _, _ = GetShapeTestResult(
        StartShapeTestRay(
            camCoord.x, camCoord.y, camCoord.z,
            dest.x, dest.y, dest.z,
            -1, PlayerPedId(), 0
        )
    )
    return hit == 1, endCoords
end

local function Draw2DText(content, font, colour, scale, x, y)
    SetTextFont(font)
    SetTextScale(scale, scale)
    SetTextColour(colour[1], colour[2], colour[3], 255)
    SetTextEntry("STRING")
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextEdge(4, 0, 0, 0, 255)
    SetTextOutline()
    AddTextComponentString(content)
    DrawText(x, y)
end

local function DrawLaser(message, color)
    local hit, coords = RayCastGamePlayCamera(20.0)
    Draw2DText(message, 4, {255, 255, 255}, 0.4, 0.43, 0.888 + 0.025)

    if hit then
        local position = GetEntityCoords(PlayerPedId())
        DrawLine(
            position.x, position.y, position.z,
            coords.x,   coords.y,   coords.z,
            color.r, color.g, color.b, color.a
        )
        DrawMarker(
            28,
            coords.x, coords.y, coords.z,
            0.0, 0.0, 0.0,
            0.0, 180.0, 0.0,
            0.1, 0.1, 0.1,
            color.r, color.g, color.b, color.a,
            false, true, 2, nil, nil, false
        )
    end

    return hit, coords
end

local function StartLaser()
    laserActive = true
    CreateThread(function()
        while laserActive do
            local hit, coords = DrawLaser(
                'PRESS ~g~E~w~ TO COPY VECTOR3\nPRESS ~g~G~w~ TO COPY {X,Y,Z}\nPRESS ~g~X~w~ TO COPY VECTOR4',
                { r = 2, g = 241, b = 181, a = 200 }
            )

            if IsControlJustReleased(0, 38) then
                laserActive = false
                if hit then
                    SendNUIMessage({
                        action = "laserCopy",
                        type   = "vector3",
                        x = Round(coords.x), y = Round(coords.y), z = Round(coords.z)
                    })
                    Wait(100)
                    isUIOpen = true
                    SetNuiFocus(true, true)
                    SendNUIMessage({ action = "open", data = GetCoordData() })
                    StartCoordThread()
                end

            elseif IsControlJustReleased(0, 47) then
                laserActive = false
                if hit then
                    SendNUIMessage({
                        action = "laserCopy",
                        type   = "table",
                        x = Round(coords.x), y = Round(coords.y), z = Round(coords.z)
                    })
                    Wait(100)
                    isUIOpen = true
                    SetNuiFocus(true, true)
                    SendNUIMessage({ action = "open", data = GetCoordData() })
                    StartCoordThread()
                end

            elseif IsControlJustReleased(0, 73) then
                laserActive = false
                if hit then
                    local heading = Round(GetEntityHeading(PlayerPedId()))
                    SendNUIMessage({
                        action  = "laserCopy",
                        type    = "vector4",
                        x = Round(coords.x), y = Round(coords.y),
                        z = Round(coords.z), w = heading
                    })
                    Wait(100)
                    isUIOpen = true
                    SetNuiFocus(true, true)
                    SendNUIMessage({ action = "open", data = GetCoordData() })
                    StartCoordThread()
                end
            end

            Wait(0)
        end
    end)
end

function StartCoordThread()
    if coordThread then return end
    coordThread = CreateThread(function()
        while isUIOpen do
            SendNUIMessage({
                action = "updateCoords",
                data   = GetCoordData()
            })
            Wait(Config.RefreshRate)
        end
        coordThread = nil
    end)
end

local function OpenUI()
    if isUIOpen then return end
    isUIOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "open", data = GetCoordData() })
    StartCoordThread()
end

local function CloseUI()
    isUIOpen = false
    laserActive = false
    SetNuiFocusKeepInput(false)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "close" })
end

RegisterCommand(Config.Command, function()
    if isUIOpen then CloseUI() else OpenUI() end
end, false)

RegisterNUICallback('close', function(_, cb)
    CloseUI()
    cb('ok')
end)

RegisterNUICallback('toggleLaser', function(_, cb)
    CloseUI()
    Wait(100)
    StartLaser()
    cb('ok')
end)

RegisterNUICallback('saveCoord', function(data, cb)
    local d = GetCoordData()
    print(string.format(
        '[JRC JCoord] Saved → {x= %s, y= %s, z= %s}',
        d.x, d.y, d.z
    ))
    cb('ok')
end)

RegisterNUICallback('saveFav', function(data, cb)
    print(string.format(
        '[JRC JCoord] ★ Favourite Saved → Name: "%s" | x= %s, y= %s, z= %s, heading= %s',
        tostring(data.name),
        tostring(data.x),
        tostring(data.y),
        tostring(data.z),
        tostring(data.heading)
    ))
    cb('ok')
end)

RegisterCommand('jcoordprint', function()
    local d = GetCoordData()
    print(string.format(
        '[JCoord] X: %s | Y: %s | Z: %s | Heading: %s | CamFOV: %s',
        d.x, d.y, d.z, d.heading, d.camFov
    ))
end, false)

CreateThread(function()
    while true do
        Wait(0)
        if isUIOpen and IsControlJustPressed(0, 200) then
            CloseUI()
        end
    end
end)
