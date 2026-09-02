// ============================================================
// International Phone Input
// ============================================================

let phoneInput = null;

function initializePhoneInput() {

    const phoneElement = document.querySelector("#phone");

    if (!phoneElement) {
        return;
    }

    phoneInput = window.intlTelInput(phoneElement, {

        initialCountry: "pk",

        preferredCountries: [
            "pk",
            "ae",
            "sa",
            "qa",
            "bh",
            "om",
            "kw",
            "gb",
            "us",
            "ca"
        ],

        separateDialCode: true,

        nationalMode: true,

        autoPlaceholder: "polite",

        strictMode: false,

        utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"

    });


    phoneElement.addEventListener("countrychange", () => {

        updatePhonePlaceholder();

    });


    updatePhonePlaceholder();
}


// ============================================================
// Placeholder
// ============================================================

function updatePhonePlaceholder() {

    if (!phoneInput) {
        return;
    }

    const countryData =
        phoneInput.getSelectedCountryData();

    const phoneElement =
        document.querySelector("#phone");

    if (countryData && phoneElement) {

        phoneElement.placeholder =
            "Enter phone number";
    }
}


// ============================================================
// Get Complete International Number
// ============================================================

function getInternationalPhone() {

    if (!phoneInput) {
        return "";
    }

    return phoneInput.getNumber();
}


// ============================================================
// Validate Phone
// ============================================================

function isValidInternationalPhone() {

    if (!phoneInput) {
        return false;
    }

    return phoneInput.isValidNumber();
}


// ============================================================
// Country Data
// ============================================================

function getSelectedCountry() {

    if (!phoneInput) {
        return null;
    }

    return phoneInput.getSelectedCountryData();
}