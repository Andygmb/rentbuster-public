
async function GetKeyID(address) {
    // Get the keyid for the address in the format "POSTCODE HUISNUMMER"
    // Returns both the keyid and the address
    // the address should be shown to the user to confirm
    var url = "https://bagviewer.kadaster.nl/lvbag/bag-viewer/api/suggest?count=1&offset=0&searchQuery=" + encodeURIComponent(address);
    var resp = await fetch(url);
    var data = await resp.json();
    var keyid = data.lsIdDisplayStringPairs[0].key;
    return keyid;
}

async function GetBAGData(keyid) {
    // Get additional BAG data for the keyid
    var url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?fl=*&id=" + encodeURIComponent(keyid);
    var resp = await fetch(url);
    var data = await resp.json();
    var bagdata = data.response.docs[0];
    return bagdata;
}

async function GetAdditionalBAGData(bagid) {
    // Get additional BAG data for the bagid
    var url = "https://bagviewer.kadaster.nl/lvbag/bag-viewer/api/bag/bevragen?objectIds=" + encodeURIComponent(bagid);
    var resp = await fetch(url);
    var data = await resp.json();
    var bagdata = data;
    return bagdata;
}

async function GetWOZData(nummeraanduiding_id) {
    // First get a cookie by accessing the WOZ Waarde Loket
    var initialurl = "https://www.wozwaardeloket.nl/wozwaardeloket-api/v1/session/start";
    // Send post request with empty body
    var resp = await fetch(initialurl, {
        method: "POST",
        body: ""
    });
    var cookie = resp.headers.get("set-cookie");
    // Then get the WOZ data
    var url = "https://www.wozwaardeloket.nl/wozwaardeloket-api/v1/wozwaarde/nummeraanduiding/" + encodeURIComponent(nummeraanduiding_id);
    var resp = await fetch(url, {
        headers: {
            "cookie": cookie
        }
    });
    var data = await resp.json();
    var wozdata = data;
    return wozdata;
}


async function GetAllBasicData(address) {
    data = {};
    data.keyid = await GetKeyID(address);
    data.bagdata = await GetBAGData(data.keyid);
    data.additionalbagdata = await GetAdditionalBAGData(data.bagdata.nummeraanduiding_id);
    data.wozdata = await GetWOZData(data.bagdata.nummeraanduiding_id);
    return data;
}