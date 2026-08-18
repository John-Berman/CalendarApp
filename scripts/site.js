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
const { jsPDF } = window.jspdf;
function padZero(n) {
    const i = Number(n);
    if (!Number.isFinite(i)) return '';
    const sign = i < 0 ? '-' : '';
    const abs = Math.abs(Math.trunc(i));
    return sign + String(abs).padStart(2, '0');
}


async function readCanadaJson() {
    try {
        const res = await fetch('/data/canada-2026-2027.JSON');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Failed to read JSON:', err);
        return null;
    }
}


async function readCanadaJson({ startDate, endDate } = {}) {
    try {
        const res = await fetch('/data/canada-2026-2027.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json(); // expect array of records with `date` like "YYYY-MM-DD"

        // Normalize range to ISO date strings (YYYY-MM-DD)
        const toISO = d => d.toISOString().slice(0, 10);
        const startISO = startDate ? toISO(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) : null;
        const endISO = endDate ? toISO(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) : null;

        // Filter by range if provided
        const filtered = raw.filter(rec => {
            if (!rec.date) return false;
            // console.log('Checking date:', rec.date, 'against startISO:', startISO);
            // console.log('Checking date:', rec.date, 'against endISO:', endISO);

            if (startISO && rec.date < startISO) return false;
            if (endISO && rec.date > endISO) return false;
            return true;
        });

        // Build map: { "YYYY-MM-DD": [records...] }
        const byDate = filtered.reduce((acc, rec) => {
            (acc[rec.date] = acc[rec.date] || []).push(rec);
            return acc;
        }, {});

        return { list: filtered, byDate };
    } catch (err) {
        console.error('Failed to read/parse JSON:', err);
        return { list: [], byDate: {} };
    }
}


const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getMonthName(i) {
    if (i < 0 || i > 11) return null;
    return monthNames[i];
}
// example

// Example: Pre-selecting Country & Region on Page Load
async function autoDetectLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return;

        const data = await response.json();

        // Set Country (e.g., "CA")
        if (data.country_code) {
            countryLabel.value = data.country_code;
        }
    } catch (err) {
        console.warn('IP Geolocation failed. Falling back to default selects.', err);
    }
}

const startMonthInput = document.getElementById('start-date');
const endMonthInput = document.getElementById('end-date');
const downloadPdfButton = document.getElementById('download-pdf-btn');

function parseMonthBoundary(val, boundary = 'start') {
    if (!val) return null;
    const parts = String(val).split('-');
    let year, month;
    if (parts.length === 2) {
        year = Number(parts[0]);
        month = Number(parts[1]) - 1;
    } else {
        const d = new Date(val);
        if (isNaN(d)) return null;
        year = d.getFullYear();
        month = d.getMonth();
    }

    if (boundary === 'end' || boundary === 'last') {
        return new Date(year, month + 1, 0); // last day of month
    }
    return new Date(year, month, 1); // first day of month
}

// Examples:



function getMonthsInRange(startDate, endDate) {
    const months = [];
    if (!startDate || !endDate || startDate > endDate) return months;
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cur <= end) {
        let newDate = new Date(cur);

        console.log(newDate.getMonth(), newDate.getFullYear());

        months.push(newDate);
        cur.setMonth(cur.getMonth() + 1);
    }
    return months;
}

function getMonthsYearsInRange(startDate, endDate) {
    const months = [];
    if (!startDate || !endDate || startDate > endDate) return months;
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cur <= end) {
        let newDate = new Date(cur);
        months.push({ month: newDate.getMonth(), year: newDate.getFullYear() });
        cur.setMonth(cur.getMonth() + 1);
    }
    return months;
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    if (!startDate || !endDate || startDate > endDate) return dates;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(newDate);
    }
    return dates;
}

/* Usage inside generateButtonHandler */
async function generateButtonHandler(e) {
    const start = parseMonthBoundary(startMonthInput.value, 'start');

    const end = parseMonthBoundary(endMonthInput.value, 'end');



    console.log(start.getDate());


    if (!start || !end) { alert('Invalid dates'); return; }
    if (start > end) { alert('Start must be <= end'); return; }

    const monthsArray = getMonthsYearsInRange(start, end); // array of month-start Dates
    console.log(monthsArray);

    const holidaysPromise = await readCanadaJson({ startDate: start, endDate: end })
        .then(data => {
            if (data) {
                return data;
                // You can now use this data to mark holidays in your calendar generation logic
            }
        });

    const holidaysByDate = holidaysPromise.byDate;

    generateCalendars(monthsArray, 'landscape', holidaysByDate); // or 'landscape' based on user selection

    downloadPdfButton.classList.remove('disabled');
    // If you need every single day instead:
    // const daysArray = getDatesInRange(start, new Date(end.getFullYear(), end.getMonth()+1, 0));
    // console.log(daysArray);

}

document.addEventListener('DOMContentLoaded', () => {

    const holidayCheckbox = document.getElementById('include-holidays');
    const countrySelect = document.getElementById('country-select');
    const regionSelect = document.getElementById('region-select');
    const regionLabel = document.getElementById('region-label');
    const countryLabel = document.getElementById('country-label');



    const buttonGenerate = document.getElementById('generate-pdf-btn');



    function validateDateRange(e) {
        console.log(e.target.id)
        const startDate = new Date(startMonthInput.value);
        const endDate = new Date(endMonthInput.value);
        if (startDate > endDate) {
            alert('Start date cannot be after end date.');

            if (e.target.id === 'start-date') {
                startMonthInput.value = '';
            } else {
                endMonthInput.value = '';
            }
        }

    }

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

    // Check localStorage first, otherwise fallback to IP detection
    const savedCountry = localStorage.getItem('pws_user_country');
    if (savedCountry) {
        countrySelect.value = savedCountry;
    } else {
        autoDetectLocation();
    }

    // Event Listener for Cascading Select
    endMonthInput.addEventListener('change', validateDateRange);
    startMonthInput.addEventListener('change', validateDateRange);
    holidayCheckbox.addEventListener('change', toggleHolidayControls);
    countrySelect.addEventListener('change', updateRegionDropdown);
    buttonGenerate.addEventListener('click', generateButtonHandler);
    downloadPdfButton.addEventListener('click', downloadPdf);
    toggleHolidayControls();
    // Initialize on Load
    updateRegionDropdown();

});


// --- Draw SVG Month ---
function createSVGMonth(year, monthIndex, orientation, holidaysByDate, province) {
    const width = orientation === 'portrait' ? 794 : 1123;
    const height = orientation === 'portrait' ? 1123 : 794;
    const margin = 50;
    const headerHeight = 50;
    const cellHeight = (height - margin * 2 - headerHeight) / 6;
    const cellWidth = (width - margin * 2) / 7;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    // Month title
    const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", width / 2);
    title.setAttribute("y", margin);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "36");
    title.setAttribute("font-family", "Arial");
    title.textContent = `${getMonthName(monthIndex)} ${year}`;
    svg.appendChild(title);

    // Weekday headers
    weekdays.forEach((day, i) => {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", margin + i * cellWidth);
        rect.setAttribute("y", margin + 20);
        rect.setAttribute("width", cellWidth);
        rect.setAttribute("height", headerHeight);
        rect.setAttribute("fill", "black");
        rect.setAttribute("stroke", "black");
        svg.appendChild(rect);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", margin + i * cellWidth + cellWidth / 2);
        text.setAttribute("y", margin + 20 + headerHeight / 2 + 6);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "16");
        text.setAttribute("font-family", "Arial");
        text.textContent = day;
        svg.appendChild(text);
    });

    // Dates
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    let day = 1;

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            let datetime = (`${year}-${padZero(monthIndex + 1)}-${padZero(day)}`);
            let holiday = holidaysByDate[datetime];

            const x = margin + j * cellWidth;
            const y = margin + 20 + headerHeight + i * cellHeight;
            const cellIndex = i * 7 + j;
            const isBlank = cellIndex < firstDay || day > daysInMonth;

            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", cellWidth);
            rect.setAttribute("height", cellHeight);
            rect.setAttribute("fill", isBlank ? "#eee" : "#fff");
            rect.setAttribute("stroke", "black");
            svg.appendChild(rect);

            if (!isBlank) {
                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", x + 5);
                text.setAttribute("y", y + 20);
                text.setAttribute("font-size", "16");
                text.setAttribute("font-family", "Arial");
                text.textContent = day;
                svg.appendChild(text);
                day++;
            }

            if (!isBlank) {
                if (holiday && holiday.length > 0) {
                    console.log(`Holiday on ${datetime}:`, holiday);
                    let yy = 17;
                    holiday.forEach(h => {
                        console.log(`Holiday: ${h.localName} - ${h.name} - ${h}`);

                        // if(h.subdivisionCodes !== null){
                        //     h.subdivisionCodes.forEach(sub => {
                        //         console.log(sub);
                        //     });
                        // }

                        const holidayText = document.createElementNS(svgNS, "text");
                        holidayText.setAttribute("x", x + 25);
                        holidayText.setAttribute("y", y + yy);
                        holidayText.setAttribute("font-size", "10");
                        holidayText.setAttribute("font-family", "Arial");
                        holidayText.textContent = h.name; // or h.name depending on what you want to display
                        svg.appendChild(holidayText);

                        yy += 12;
                    });
                }
            }
        }
    }

    return svg;
}

// --- Generate calendars ---
function generateCalendars(monthsContainer, orientation = 'landscape', holidaysByDate = {}) {
    // const year = parseInt(document.getElementById('yearInput').value);
    // const orientation = document.getElementById('orientation').value;
    // const selectedMonths = Array.from(monthContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
    const province = document.getElementById('region-select').value;
    console.log(province);
    const container = document.getElementById('svg-placeholder');
    container.innerHTML = '';
    monthsContainer.forEach(monthIndex => {
        //console.log(getMonthName(monthIndex.month)); // "January"
        let monthName = getMonthName(monthIndex.month);
        const svg = createSVGMonth(monthIndex.year, monthIndex.month, orientation, holidaysByDate, province);
        container.appendChild(svg);
    });
}


async function downloadPdf(orientation = 'landscape') {
    const svgs = document.querySelectorAll('#svg-placeholder svg');
    if (!svgs.length) { alert('Generate calendars first.'); return; }

    //const orientation = document.getElementById('orientation').value;
    const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i].cloneNode(true); // clone so we can modify safely

        // --- Ensure SVG has a viewBox ---
        if (!svg.getAttribute('viewBox')) {
            const w = svg.getAttribute('width') || 800;
            const h = svg.getAttribute('height') || 1120;
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        }

        const vb = svg.getAttribute('viewBox').split(' ').map(Number);
        const svgWidth = vb[2];
        const svgHeight = vb[3];

        // --- Compute scale to fit page ---
        const scale = Math.min(
            pageWidth / svgWidth,
            pageHeight / svgHeight
        );

        const xOffset = (pageWidth - svgWidth * scale) / 2;
        const yOffset = (pageHeight - svgHeight * scale) / 2;

        // --- Render vector graphics into the PDF ---
        await window.svg2pdf(svg, pdf, {
            xOffset,
            yOffset,
            scale
        });

        if (i < svgs.length - 1) pdf.addPage();
    }

    pdf.save('calendar.pdf');
}

