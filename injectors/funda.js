/* INJECTOR API */
// uses chrome listeners
// {action: "GetPostcodeData", data: null} => {Postcode, Number}
// {action: "ReplacePrice", data: {"€ 1.000.000,-"}}

function get_postcode() {
    var postcode_contained = document.querySelectorAll("span.object-header__subtitle")[0].innerHTML;
    var number_contained = document.querySelectorAll("span.object-header__title")[0].innerHTML;
    // match postcode
    var parts = postcode_contained.match(/([0-9]{4})\s?([A-Z]{2})/);
    var postcode = parts[1] + parts[2];
    // match number
    var number = number_contained.match(/([0-9]+)/)[1];
    return postcode + " " + number;
}

function setprice(price) {
    var price_contained = document.querySelectorAll("strong.object-header__price")[0];
    // add strikethrough and change color to red
    price_contained.style.textDecoration = "line-through";
    price_contained.style.color = "red";
    // add a new strong with the new price
    var newprice = document.createElement("strong");
    newprice.innerHTML = price;
    // set css class to match the old price
    newprice.className = "object-header__price";
    price_contained.parentNode.insertBefore(newprice, price_contained.nextSibling);
}

function getadditionaldata() {
    let data = {};
  
    // Custom function to find an element containing specific text
    function findElementByText(selector, text) {
      let elements = document.querySelectorAll(selector);
      for (let element of elements) {
        if (element.textContent.includes(text)) {
          return element;
        }
      }
      return null;
    }

    // Find li > span with title attribute = "wonen"
    let wonen = document.querySelectorAll("li span[title='wonen']")[0];
    if (wonen) {
      data.wonen = wonen.nextElementSibling.innerHTML.match(/([0-9]+)/)[1];
    }
  
    // Find <dt> with "Overige inpandige ruimte" and get the next <dd>
    let perceel = document.querySelectorAll("li span[title='perceel']")[0];
    if (perceel) {
      data.perceel = perceel.nextElementSibling.innerHTML.match(/([0-9]+)/)[1];
    }
  
    return data;
  }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "GetPostcodeData") {
            sendResponse({postcode: get_postcode()});
        } else if (request.action == "ReplacePrice") {
            setprice(request.data);
            sendResponse({status: "ok"});
        } else if (request.action == "GetAdditionalData") {
            sendResponse(getadditionaldata());
        }
    }
);