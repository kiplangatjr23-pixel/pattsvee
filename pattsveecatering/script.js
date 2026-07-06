/* Minimal Pattsvee Catering Front-End Script */

const defaultPackages = [
    { id: 1, name: 'Bronze Package', price: 800, minGuests: 50, meals: 'Main Course, Salad, Dessert', drinks: 'Juice, Water, Soda', staff: '2 Chefs, 3 Servers', description: 'Perfect for intimate gatherings' },
    { id: 2, name: 'Silver Package', price: 1200, minGuests: 100, meals: 'Multiple Main Courses, Appetizers, Salad, Dessert', drinks: 'Juice, Water, Soda, Coffee, Tea', staff: '3 Chefs, 5 Servers', description: 'Ideal for medium-sized events' },
    { id: 3, name: 'Gold Package', price: 1800, minGuests: 200, meals: 'Premium Mains, Appetizers, Salad, Dessert, Cheese Platter', drinks: 'Juice, Water, Soda, Coffee, Tea, Wine', staff: '4 Chefs, 8 Servers, 1 Coordinator', description: 'For grand celebrations' },
    { id: 4, name: 'VIP Executive Package', price: 2500, minGuests: 300, meals: 'Premium Mains, Appetizers, Salad, Dessert, Cheese Platter, Live Station', drinks: 'Premium Beverages, Wine, Champagne', staff: '5 Chefs, 12 Servers, 2 Coordinators', description: 'Luxury catering experience' }
];

let isDarkMode = true;

function init() {
    AOS.init({ duration: 1000, offset: 100, easing: 'ease-in-out', once: false });
    setupNavigation();
    setupScrollEffects();
    setupThemeToggle();
    setupFormListeners();
    loadPackagesData();
    populatePackageSelects();
    animateCounters();
    setTimeout(() => document.getElementById('loadingScreen').style.display = 'none', 1000);
}

document.addEventListener('DOMContentLoaded', init);

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                scrollToSection(href.substring(1));
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
        backToTop.classList.toggle('show', window.scrollY > 300);
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentId = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 250) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkMode = savedTheme === 'dark';
    applyTheme(isDarkMode);

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
}

function applyTheme(dark) {
    const themeToggle = document.getElementById('themeToggle');
    document.body.classList.toggle('dark-mode', dark);
    document.body.classList.toggle('light-mode', !dark);
    themeToggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = Number(entry.target.dataset.target || 0);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.max(1, Math.round(target / 50));
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current >= target ? target : current;
        if (current >= target) clearInterval(timer);
    }, 20);
}

function setupFormListeners() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
}

function loadPackagesData() {
    let packages = JSON.parse(localStorage.getItem('packages') || 'null');
    if (!packages) {
        packages = defaultPackages;
        localStorage.setItem('packages', JSON.stringify(packages));
    }
    displayPackages(packages);
}

function displayPackages(packages) {
    const packagesGrid = document.getElementById('packagesGrid');
    if (!packagesGrid) return;
    packagesGrid.innerHTML = '';

    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
            <div class="package-header">
                <div class="package-name">${pkg.name}</div>
                <div class="package-price">KES <span>${pkg.price.toLocaleString()}</span><span> /person</span></div>
            </div>
            <ul class="package-details">
                <li>Min ${pkg.minGuests} guests</li>
                <li>${pkg.meals}</li>
                <li>${pkg.drinks}</li>
                <li>${pkg.staff}</li>
            </ul>
            <div class="package-actions">
                <button class="btn btn-primary btn-sm" onclick="selectPackage(${pkg.id})">
                    <i class="fas fa-check"></i> Choose Package
                </button>
            </div>
        `;
        packagesGrid.appendChild(card);
    });
}

function selectPackage(id) {
    const packages = JSON.parse(localStorage.getItem('packages') || JSON.stringify(defaultPackages));
    const selected = packages.find(pkg => pkg.id === Number(id));
    if (!selected) return;

    const cateringPackage = document.getElementById('cateringPackage');
    const quotePackage = document.getElementById('quotePackage');
    if (cateringPackage) cateringPackage.value = selected.id;
    if (quotePackage) quotePackage.value = selected.id;

    updateQuotation();
    scrollToSection('booking');
}

function populatePackageSelects() {
    const packages = JSON.parse(localStorage.getItem('packages') || JSON.stringify(defaultPackages));
    ['cateringPackage', 'quotePackage'].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.innerHTML = '<option value="">Select Package</option>';
        packages.forEach(pkg => {
            const option = document.createElement('option');
            option.value = pkg.id;
            option.textContent = `${pkg.name} (KES ${pkg.price}/person)`;
            select.appendChild(option);
        });
    });
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;

    fields.forEach(field => {
        const error = field.closest('.form-group')?.querySelector('.error-message');
        if (!error) return;
        if (!field.value.trim()) {
            valid = false;
            error.textContent = 'This field is required';
            error.classList.add('show');
            field.style.borderColor = '#e74c3c';
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            valid = false;
            error.textContent = 'Please enter a valid email';
            error.classList.add('show');
            field.style.borderColor = '#e74c3c';
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            valid = false;
            error.textContent = 'Please enter a valid phone number';
            error.classList.add('show');
            field.style.borderColor = '#e74c3c';
        } else {
            error.textContent = '';
            error.classList.remove('show');
            field.style.borderColor = '';
        }
    });

    return valid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^(\+254|0)[0-9]{9}$/.test(phone.replace(/[\s-]/g, ''));
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!validateForm(form)) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }

    const booking = {
        id: Date.now(),
        clientName: document.getElementById('clientName').value,
        clientPhone: document.getElementById('clientPhone').value,
        eventType: document.getElementById('eventType').value,
        eventDate: document.getElementById('eventDate').value,
        guestCount: Number(document.getElementById('guestCount').value),
        eventLocation: document.getElementById('eventLocation').value,
        cateringPackage: document.getElementById('cateringPackage').value,
        additionalNotes: document.getElementById('additionalNotes').value,
        createdAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    const bookingReference = document.getElementById('bookingReference');
    if (bookingReference) bookingReference.textContent = 'BK' + booking.id.toString().slice(-6);
    document.getElementById('successModal')?.classList.add('show');
    form.reset();
}

function closeSuccessModal() {
    document.getElementById('successModal')?.classList.remove('show');
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!validateForm(form)) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }
    showToast('Message sent successfully! We will contact you soon.', 'success');
    form.reset();
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    if (!emailInput) return;
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
    showToast('Successfully subscribed to our newsletter!', 'success');
    event.target.reset();
}

function bookService(serviceName) {
    const eventType = document.getElementById('eventType');
    if (eventType) eventType.value = serviceName;
    scrollToSection('booking');
}

function updateQuotation() {
    const packageId = document.getElementById('quotePackage')?.value;
    const guests = Number(document.getElementById('quoteGuests')?.value || 0);
    const packages = JSON.parse(localStorage.getItem('packages') || JSON.stringify(defaultPackages));
    const selectedPackage = packages.find(pkg => pkg.id === Number(packageId));

    if (!selectedPackage) {
        document.getElementById('quotationRef').textContent = '--';
        document.getElementById('quoteDisplayPackage').textContent = '--';
        document.getElementById('quoteDisplayGuests').textContent = '--';
        document.getElementById('quoteBasePrice').textContent = 'KES 0';
        document.getElementById('quoteExtraServices').style.display = 'none';
        document.getElementById('quotationTotal').textContent = 'KES 0';
        return;
    }

    const basePrice = selectedPackage.price * guests;
    let extraTotal = 0;
    document.querySelectorAll('input[name="extraServices"]:checked').forEach(cb => {
        extraTotal += Number(cb.dataset.price || 0);
    });

    const total = basePrice + extraTotal;
    document.getElementById('quotationRef').textContent = 'QT' + Date.now().toString().slice(-6);
    document.getElementById('quoteDisplayPackage').textContent = selectedPackage.name;
    document.getElementById('quoteDisplayGuests').textContent = `${guests} guests`;
    document.getElementById('quoteBasePrice').textContent = `KES ${basePrice.toLocaleString()}`;

    const extraRow = document.getElementById('quoteExtraServices');
    if (extraTotal > 0) {
        extraRow.style.display = 'flex';
        document.getElementById('quoteExtraTotal').textContent = `KES ${extraTotal.toLocaleString()}`;
    } else {
        extraRow.style.display = 'none';
    }

    document.getElementById('quotationTotal').textContent = `KES ${total.toLocaleString()}`;
}

function generateQuotationPDF() {
    const packageId = document.getElementById('quotePackage')?.value;
    if (!packageId) {
        showToast('Please select a package first', 'error');
        return;
    }
    const element = document.getElementById('quotationCard');
    if (!element) return;
    html2pdf().set({ margin: 10, filename: `quotation-${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' } }).from(element).save();
    showToast('Quotation downloaded successfully!', 'success');
}

function printQuotation() {
    const element = document.getElementById('quotationCard');
    if (!element) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Quotation</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#000;} .detail-row{display:flex;justify-content:space-between;margin-bottom:10px;}</style></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function sendQuotationViaWhatsApp() {
    const packageName = document.getElementById('quoteDisplayPackage')?.textContent || 'selected package';
    const total = document.getElementById('quotationTotal')?.textContent || 'KES 0';
    window.open(`https://wa.me/254722113855?text=${encodeURIComponent(`Hi! I'm interested in your ${packageName} catering service. The quotation shows ${total}. Please send details.`)}`);
}

function selectPaymentMethod(event) {
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function initiatePayment() {
    const amount = document.getElementById('paymentAmount')?.value;
    const phone = document.getElementById('paymentPhone')?.value;
    if (!amount || !phone) {
        showToast('Please fill in all payment details', 'error');
        return;
    }
    if (!isValidPhone(phone)) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }
    const transactionRef = 'TXN' + Date.now().toString().slice(-6);
    const paymentRef = document.getElementById('paymentRef');
    if (paymentRef) paymentRef.value = transactionRef;
    showToast(`M-Pesa prompt sent to ${phone}`, 'success');
}

function toggleFAQ(element) {
    const item = element.closest('.faq-item');
    item?.classList.toggle('active');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOutRight 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

document.addEventListener('click', event => {
    document.querySelectorAll('.modal.show').forEach(modal => {
        if (event.target === modal) modal.classList.remove('show');
    });
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
