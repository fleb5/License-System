local Config = {}
Config.license = "test"

PerformHttpRequest('http://localhost:4567/license', function(err, value)
    if value then
        value = json.decode(value)
        if value.status == "authenticated" then
            print("^3[License_System] ^0authenticated^0")
        elseif value.status == "ip" then
            print("^3[License_System] ^0ip incorrect^0")
            -- Citizen.Wait(10000)
            -- os.exit()
        elseif value.status == "expired" then
            print("^3[License_System] ^0license expired")
            -- Citizen.Wait(10000)
            -- os.exit()
        elseif value.status == "invalid" then
            print("^3[License_System] ^0invalid license^0")
            -- Citizen.Wait(10000)
            -- os.exit()
        else
            print("^3[License_System] ^0host-bot offline^0")
            -- Citizen.Wait(10000)
            -- os.exit()
        end
    else
        print("^3[License_System] ^0host-bot offline^0")
        -- Citizen.Wait(10000)
        -- os.exit()
    end
end, 'POST', "license", {license = Config.license, ['Content-Type'] = 'application/json'})