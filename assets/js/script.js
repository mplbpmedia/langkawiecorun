// Tetapkan tarikh acara Langkawi Eco Run 2.0 di sini
const eventDate = new Date("Nov 21, 2026 07:00:00").getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Pengiraan masa untuk Hari, Jam, Minit dan Saat
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Paparkan hasil dalam elemen dengan ID masing-masing
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

    // Jika countdown tamat
    if (distance < 0) {
        clearInterval(countdownInterval);
        
        // Menggantikan grid countdown dengan satu kotak glass yang center
        const countdownContainer = document.querySelector(".grid-cols-4");
        
        // Mengubah kelas grid kepada flex center untuk memastikan ia berada di tengah paparan
        countdownContainer.className = "flex justify-center items-center max-w-2xl mx-auto w-full";
        
        // Memasukkan struktur glass effect
        countdownContainer.innerHTML = `
            <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex flex-col justify-center items-center mx-auto 
                        w-full max-w-[500px] min-h-[50px] p-6 text-center animate-pulse mb-10">
                <p class="text-2xl md:text-4xl font-black tracking-wider text-orange-500 uppercase">
                    <i class="fas fa-running mr-2"></i> ACARA TELAH BERMULA!
                </p>
                <p class="text-xs md:text-sm uppercase tracking-widest opacity-70 mt-2 text-white font-medium">
                    Selamat Maju Jaya Kepada Semua Peserta
                </p>
            </div>
        `;
    }
};

// Jalankan fungsi setiap 1 saat
const countdownInterval = setInterval(updateCountdown, 1000);

// Panggil sekali terus semasa load untuk elak delay 1 saat
updateCountdown();

// ==========================================
// LOGIK MOBILE HAMBURGER MENU
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

const toggleMenu = () => {
    // Semak sama ada menu sedang terbuka atau tidak
    const isOpen = mobileMenu.classList.contains('translate-y-0');

    if (!isOpen) {
        // Buka Menu
        mobileMenu.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('translate-y-0', 'opacity-100');
        // Tukar ikon kepada pangkah (X)
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times', 'rotate-90');
        // Halang skrin belakang dari skrol semasa menu buka
        document.body.classList.add('overflow-hidden');
    } else {
        // Tutup Menu
        mobileMenu.classList.remove('translate-y-0', 'opacity-100');
        mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        // Tukar ikon balik kepada hamburger
        menuIcon.classList.remove('fa-times', 'rotate-90');
        menuIcon.classList.add('fa-bars');
        // Benarkan skrol semula
        document.body.classList.remove('overflow-hidden');
    }
};

// Event Listeners
menuBtn.addEventListener('click', toggleMenu);

// Tutup menu secara automatik jika pengguna klik mana-mana link di dalam menu mobile
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// ==========================================
// LOGIK INTERAKTIF MERCHANDISE SLIDER
// ==========================================
const slider = document.getElementById('merch-slider');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const dots = document.querySelectorAll('#slider-dots button');

if (slider) {
    // Fungsi Gerak Menggunakan Arrow Button
    nextBtn.addEventListener('click', () => {
        const slideWidth = slider.clientWidth;
        // Jika dah di penghujung, pusing balik ke awal, jika belum, slide ke kanan
        if (slider.scrollLeft + slideWidth >= slider.scrollWidth - 10) {
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
    });

    prevBtn.addEventListener('click', () => {
        const slideWidth = slider.clientWidth;
        if (slider.scrollLeft <= 0) {
            slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        }
    });

    // Kemas kini Petunjuk "Dots" semasa user melakukan swipe manual (di mobile)
    slider.addEventListener('scroll', () => {
        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('w-2', 'bg-blue-200');
                dot.classList.add('w-8', 'bg-blue-600'); // Dot aktif bertukar jadi panjang
            } else {
                dot.classList.remove('w-8', 'bg-blue-600');
                dot.classList.add('w-2', 'bg-blue-200');
            }
        });
    });

    // Klik pada Dot untuk lompat ke gambar spesifik
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            slider.scrollTo({ left: slider.clientWidth * i, behavior: 'smooth' });
        });
    });
}