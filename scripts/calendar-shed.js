    // Theme cycle: swaps href on <link id="theme-stylesheet">
    (function () {
        const button = document.getElementById('theme-cycle');
        const link = document.getElementById('theme-stylesheet');
        if (!button || !link) return;

        // List your theme files (update to match files under css/themes/)
        const themeFiles = [
            'css/themes/theme-original.css',
            'css/themes/theme-forestgreen.css',
            'css/themes/theme-midnightInkBlue.css',
            'css/themes/theme-steelAndAmber.css',
            'css/themes/warmParchmentIron.css',
            'css/themes/colboltIce.css',
            'css/themes/charcoalOcre.css',
            'css/themes/nordicPlum.css',
            'css/themes/theme-original-lighter.css',
        ];

        // restore selection
        const saved = localStorage.getItem('selectedTheme');
        if (saved && themeFiles.includes(saved)) link.href = saved;

        // keep index in sync with current href
        let idx = themeFiles.indexOf(link.getAttribute('href'));
        if (idx === -1) {
            themeFiles.unshift(link.getAttribute('href'));
            idx = 0;
        }

        function themeName(path) {
            return path.split('/').pop().replace(/\.css$/i, '');
        }

        // optional: show current theme on button
        button.textContent = themeName(link.getAttribute('href'));

        button.addEventListener('click', () => {
            idx = (idx + 1) % themeFiles.length;
            const next = themeFiles[idx];
            link.setAttribute('href', next);
            localStorage.setItem('selectedTheme', next);
            button.textContent = themeName(next);
        });
    })();


    (function () {
        const btn = document.getElementById('more-options-button');

        const createCalendarButton = document.getElementById('create-calendar-button');
        const form = document.getElementById('builder-form');
        if (!btn || !form) return;

        let backdropEl = null;

        function openModal() {
            backdropEl = document.createElement('div');
            backdropEl.className = 'modal-backdrop';
            document.body.appendChild(backdropEl);

            form.classList.add('modal');
            document.body.style.overflow = 'hidden'; // prevent page scroll

            backdropEl.addEventListener('click', closeModal);
            document.addEventListener('keydown', onKeyDown);

            btn.textContent = 'Close';
        }

        function closeModal() {
            if (backdropEl) {
                backdropEl.removeEventListener('click', closeModal);
                backdropEl.remove();
                backdropEl = null;
            }
            form.classList.remove('modal');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
            btn.textContent = 'More options';
        }

        function onKeyDown(e) {
            if (e.key === 'Escape') closeModal();
        }


        btn.addEventListener('click', () => {
            if (form.classList.contains('modal')) closeModal();
            else openModal();
        });
        createCalendarButton.addEventListener('click', () => {
            if (form.classList.contains('modal')) closeModal();
            else openModal();
        });
    })();