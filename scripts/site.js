// Region Data Mapped to Nager.Date 'counties' ISO Codes
const regionMap = {
    CA: {
        label: "Province / Territory",
        options: [
            { code: "ALL", name: "All National Holidays Only" },
            { code: "CA-ON", name: "Ontario" },
            { code: "CA-QC", name: "Quebec" },
            { code: "CA-BC", name: "British Columbia" },
            { code: "CA-AB", name: "Alberta" },
            { code: "CA-MB", name: "Manitoba" },
            { code: "CA-NB", name: "New Brunswick" },
            { code: "CA-NL", name: "Newfoundland and Labrador" },
            { code: "CA-NS", name: "Nova Scotia" },
            { code: "CA-PE", name: "Prince Edward Island" },
            { code: "CA-SK", name: "Saskatchewan" },
            { code: "CA-NT", name: "Northwest Territories" },
            { code: "CA-NU", name: "Nunavut" },
            { code: "CA-YT", name: "Yukon" }
        ]
    },
    US: {
        label: "State / Territory",
        options: [
            { code: "ALL", name: "Federal Holidays Only" },
            { code: "US-AL", name: "Alabama" },
            { code: "US-AK", name: "Alaska" },
            { code: "US-AZ", name: "Arizona" },
            { code: "US-AR", name: "Arkansas" },
            { code: "US-CA", name: "California" },
            { code: "US-CO", name: "Colorado" },
            { code: "US-CT", name: "Connecticut" },
            { code: "US-DE", name: "Delaware" },
            { code: "US-FL", name: "Florida" },
            { code: "US-GA", name: "Georgia" },
            { code: "US-HI", name: "Hawaii" },
            { code: "US-ID", name: "Idaho" },
            { code: "US-IL", name: "Illinois" },
            { code: "US-IN", name: "Indiana" },
            { code: "US-IA", name: "Iowa" },
            { code: "US-KS", name: "Kansas" },
            { code: "US-KY", name: "Kentucky" },
            { code: "US-LA", name: "Louisiana" },
            { code: "US-ME", name: "Maine" },
            { code: "US-MD", name: "Maryland" },
            { code: "US-MA", name: "Massachusetts" },
            { code: "US-MI", name: "Michigan" },
            { code: "US-MN", name: "Minnesota" },
            { code: "US-MS", name: "Mississippi" },
            { code: "US-MO", name: "Missouri" },
            { code: "US-MT", name: "Montana" },
            { code: "US-NE", name: "Nebraska" },
            { code: "US-NV", name: "Nevada" },
            { code: "US-NH", name: "New Hampshire" },
            { code: "US-NJ", name: "New Jersey" },
            { code: "US-NM", name: "New Mexico" },
            { code: "US-NY", name: "New York" },
            { code: "US-NC", name: "North Carolina" },
            { code: "US-ND", name: "North Dakota" },
            { code: "US-OH", name: "Ohio" },
            { code: "US-OK", name: "Oklahoma" },
            { code: "US-OR", name: "Oregon" },
            { code: "US-PA", name: "Pennsylvania" },
            { code: "US-RI", name: "Rhode Island" },
            { code: "US-SC", name: "South Carolina" },
            { code: "US-SD", name: "South Dakota" },
            { code: "US-TN", name: "Tennessee" },
            { code: "US-TX", name: "Texas" },
            { code: "US-UT", name: "Utah" },
            { code: "US-VT", name: "Vermont" },
            { code: "US-VA", name: "Virginia" },
            { code: "US-WA", name: "Washington" },
            { code: "US-WV", name: "West Virginia" },
            { code: "US-WI", name: "Wisconsin" },
            { code: "US-WY", name: "Wyoming" },
            { code: "US-DC", name: "District of Columbia" }
        ]
    },
    GB: {
        label: "Region",
        options: [
            { code: "ALL", name: "All UK Holidays" },
            { code: "GB-ENG", name: "England" },
            { code: "GB-SCT", name: "Scotland" },
            { code: "GB-NIR", name: "Northern Ireland" },
            { code: "GB-WLS", name: "Wales" }
        ]
    },
    AU: {
        label: "State / Territory",
        options: [
            { code: "ALL", name: "National Holidays Only" },
            { code: "AU-NSW", name: "New South Wales" },
            { code: "AU-VIC", name: "Victoria" },
            { code: "AU-QLD", name: "Queensland" }
        ]
    }
};



document.addEventListener('DOMContentLoaded', () => {

    const holidayCheckbox = document.getElementById('include-holidays');
    const countrySelect = document.getElementById('country-select');
    const regionSelect = document.getElementById('region-select');
    const regionLabel = document.getElementById('region-label');
    const countryLabel = document.getElementById('country-label');
    // Toggle enabling/disabling of holiday inputs
    function toggleHolidayControls() {
        const isChecked = holidayCheckbox.checked;

        countrySelect.disabled = !isChecked;
        regionSelect.disabled = !isChecked;

        if (isChecked) {
            countryLabel.classList.remove('disabled');
            regionLabel.classList.remove('disabled');
        } else {
            countryLabel.classList.add('disabled');
            regionLabel.classList.add('disabled');
        }
    };

    function updateRegionDropdown() {
        const selectedCountry = countrySelect.value;
        const regionData = regionMap[selectedCountry];


        // Reset options
        regionSelect.innerHTML = '';

        if (regionData && regionData.options.length > 0) {
            regionSelect.disabled = false;
            regionLabel.textContent = regionData.label;

            regionData.options.forEach(region => {
                const opt = document.createElement('option');
                opt.value = region.code;
                opt.textContent = region.name;
                regionSelect.appendChild(opt);
            });
        } else {
            regionSelect.disabled = true;
            regionLabel.textContent = "Province / State";
            const opt = document.createElement('option');
            opt.value = "ALL";
            opt.textContent = "N/A (National Only)";
            regionSelect.appendChild(opt);
        }
    }

    // Event Listener for Cascading Select
    holidayCheckbox.addEventListener('change', toggleHolidayControls);
    countrySelect.addEventListener('change', updateRegionDropdown);
    toggleHolidayControls();
    // Initialize on Load
    updateRegionDropdown();

});
