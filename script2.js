let form = document.querySelector("form");
let resultValue = document.querySelector("#result-value");
let countryOptions = document.querySelectorAll("select");

countryOptions.forEach(selectOption => {
    for (currCode in countryList) {
        let option = document.createElement("option");
        option.innerHTML = currCode;
        option.value = currCode;
        selectOption.append(option);
        if (selectOption.id === "from-currency" && currCode === "CNY") {
            option.selected = "selected";
        } else if (selectOption.id === "to-currency" && currCode === "PKR") {
            option.selected = "selected";
        }
    };
    selectOption.addEventListener("change", (e) => {
        countryFlag(e.target);
    });

});

// Function to update country flag based on selected currency.
async function countryFlag(countryOption) {
    let countryCode = countryList[countryOption.value];
    let URL = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = countryOption.parentElement.querySelector("IMG");
    img.src = URL;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let input = document.querySelector("input");
    let inputVal = Number(input.value);
    if (inputVal <= 0 || isNaN(inputVal)) {
        resultValue.innerText = "INVALID INPUT, TRY AGAIN."
        resultValue.classList.add("error")
        input.value = "";
        return;
    }
    else {
        fetchData(inputVal);
    }
});


async function fetchData(inputVal) {
    let fromCurrency = document.querySelector("#from-currency").value.toLowerCase();
    let toCurrency = document.querySelector("#to-currency").value.toLowerCase();

    try {
        let URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`
        let response = await fetch(URL);
        let data = await response.json();

        let exchangeRate = data[fromCurrency][toCurrency];
        if (!exchangeRate) {
            resultValue.innerText = "Exchange rate not available.";
            resultValue.classList.add("error");
            return;
        }

        let convertedAmount = (inputVal * exchangeRate).toFixed(2);
        resultValue.innerText = `${inputVal} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}`;
        resultValue.classList.remove("error");

    }

    catch (error) {
        resultValue.innerText = "Failed to fetch exchange rates. Please try again later."
        resultValue.classList.add("error");
        console.log("error", error);

    }
}