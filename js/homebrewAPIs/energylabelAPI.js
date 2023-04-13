function ParseEPData(energyPage) {
    // Parse the Energy Page HTML to get the necessary values
    // Returns an object with the values
    var label = null;
    var html = $.parseHTML(energyPage);
    // Find all "rows"
    var rows = $(html).find(".row + .g-0");
    // Loop through the labels and values and add them to the data object
    for (var i = 0; i < rows.length; i++) {
        if ($(rows[i]).find(".se-item-description-nta>span").text() == "Labelklasse") {
            label = $(rows[i]).find(".se-item-value-nta>span").text();
            break;
        }
    }
    return label;
}

async function GetEPData(address) {
    // Get the EP data for the address
    // Address should be in the format: "POSTCODE HUISNUMMER"

    // First fetch the page to get the anti-CSRF token
    var url = "https://www.ep-online.nl/Energylabel/Search";
    // using fetch
    var resp = await fetch(url);
    var page = await resp.text();
    // Get the anti-CSRF token
    var token = page.match(/<input name="__RequestVerificationToken" type="hidden" value="(.*)" \/>/)[1];


    // Now make the actual request
    var data = {
        "SearchValue": address,
        "__RequestVerificationToken": token
    }
    var cookies = resp.headers.get("set-cookie");
    var resp = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(data),
        headers: {
            "cookie": cookies
        }
    });

    var page = await resp.text();
    var data = ParseEPData(page);
    return data;
}