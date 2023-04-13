async function GetMonumentStatus(address) {
    // Get the monument status for the address in the format "POSTCODE HUISNUMMER"
    // Returns the monument status
    var url = "https://monumentenregister.cultureelerfgoed.nl/monumentenregister?tekst=" + encodeURIComponent(address);
    var resp = await fetch(url);
    var page = await resp.text();
    var html = $.parseHTML(page);
    var hits = $(html).find("#block-monumentenregister-content .view-register-of-monuments .view-header");
    return hits.length > 0;
}