const app = document.getElementById('app');

let products = [];
let screen = 'home';
let category = 'Semua';
let selectedProduct = null;
let qty = 1;
let cart = [];
let sugar = 'Normal';
let size = 'Regular';
let milk = 'Normal';
let payment = 'GoPay';
let orderHistory = [];
let tabOrder = 'Berlangsung';

let user = {
    name: 'Rian Pratama',
    email: 'rian@email.com'
};

let addresses = [
    {
        tag: 'Rumah',
        text: 'Jl. Melati No. 12, Kelurahan Sukamaju, Jakarta Selatan',
        selected: true
    },
    {
        tag: 'Kantor',
        text: 'Gedung Graha Niaga Lt. 8, Jl. Jend. Sudirman Kav. 58, Jakarta Selatan'
    }
];

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        render();
    })
    .catch(() => {
        app.innerHTML = '<div class="empty">Gagal memuat menu. Pastikan file dibuka melalui Live Server.</div>';
    });

const rupiah = angka => 'Rp ' + angka.toLocaleString('id-ID');

function goto(halaman) {
    screen = halaman;
    render();
}

function toast(pesan) {
    let pesanBox = document.createElement('div');
    pesanBox.className = 'toast';
    pesanBox.textContent = pesan;

    document.body.append(pesanBox);

    setTimeout(() => {
        pesanBox.remove();
    }, 1900);
}

function header(judul, kembali = 'home') {
    return `
        <div class="header">
            <button class="iconbtn" onclick="goto('${kembali}')">‹</button>
            <strong>${judul}</strong>
            <button class="iconbtn" onclick="goto('cart')">🛒</button>
        </div>
    `;
}

function nav() {
    return `
        <div class="nav">
            <button onclick="goto('home')">
                <span>⌂</span>Home
            </button>

            <button onclick="goto('orders')">
                <span>▤</span>Pesanan
            </button>

            <button onclick="goto('profile')">
                <span>♙</span>Profil
            </button>
        </div>
    `;
}

function shell(content, withnav = true) {
    return `
        <div class="mobile">
            ${content}
            ${withnav ? nav() : ''}
        </div>
    `;
}

function render() {
    switch (screen) {
        case 'splash':
            app.innerHTML = shell(`
                <div class="screen center" style="padding-top:30vh">
                    <div class="brandmark">K</div>
                    <div class="logo">KOPIKITA</div>
                    <p class="muted">Ngopi Tanpa Antre</p>

                    <button class="btn" onclick="goto('login')" style="margin-top:100px">
                        Mulai
                    </button>
                </div>
            `, false);
            break;

        case 'login':
            app.innerHTML = shell(`
                <div class="screen">
                    <div class="logo">☕ KopiKita</div>
                    <h1>Masuk</h1>
                    <p class="muted">Pesan kopi favoritmu dalam sekejap</p>

                    <div class="field">
                        <label>Email / No. HP</label>
                        <input id="email" placeholder="nama@email.com">
                    </div>

                    <div class="field">
                        <label>Kata Sandi</label>
                        <input id="password" type="password" placeholder="Kata sandi">
                    </div>

                    <p class="right">
                        <span class="link" onclick="goto('forgot')">
                            Lupa kata sandi?
                        </span>
                    </p>

                    <button class="btn" onclick="login()">Masuk</button>

                    <p class="center muted">atau</p>

                    <p class="center">
                        Belum punya akun?
                        <span class="link" onclick="goto('register')">Daftar</span>
                    </p>
                </div>
            `, false);
            break;

        case 'register':
            app.innerHTML = shell(`
                ${header('Daftar Akun', 'login')}
                <div class="screen">
                    <p class="muted">Buat akun baru untuk mulai pesan kopi</p>

                    ${field('Nama Lengkap', 'name')}
                    ${field('Email / No. HP', 'email')}
                    ${field('Kata Sandi', 'pass', 'password')}
                    ${field('Konfirmasi Kata Sandi', 'confirm', 'password')}

                    <button class="btn" onclick="register()">Daftar</button>

                    <p class="center">
                        Sudah punya akun?
                        <span class="link" onclick="goto('login')">Masuk</span>
                    </p>
                </div>
            `, false);
            break;

        case 'forgot':
            app.innerHTML = shell(`
                ${header('Lupa Kata Sandi', 'login')}
                <div class="screen">
                    <p class="muted">
                        Masukkan email atau nomor HP yang terdaftar,
                        kami akan kirimkan kode untuk reset kata sandi kamu.
                    </p>

                    ${field('Email / No. HP', 'forgotEmail')}

                    <button class="btn" onclick="goto('otp')">Kirim Kode</button>
                </div>
            `, false);
            break;

        case 'otp':
            app.innerHTML = shell(`
                ${header('Verifikasi', 'login')}
                <div class="screen">
                    <p class="muted">
                        Masukkan 4 digit kode verifikasi (demo: 1234).
                    </p>

                    ${field('Kode OTP', 'otp')}

                    <button class="btn" onclick="verifyOTP()">Verifikasi</button>

                    <p class="center link" onclick="toast('Kode demo: 1234')">
                        Kirim Ulang
                    </p>
                </div>
            `, false);
            break;

        case 'home':
            home();
            break;

        case 'detail':
            detail();
            break;

        case 'cart':
            cartScreen();
            break;

        case 'addresses':
            addressScreen();
            break;

        case 'payments':
            paymentScreen();
            break;

        case 'checkout':
            checkout();
            break;

        case 'success':
            successScreen();
            break;

        case 'orders':
            orders();
            break;

        case 'profile':
            profile();
            break;

        case 'logout':
            logoutScreen();
            break;

        case 'loggedout':
            app.innerHTML = shell(`
                <div class="screen center" style="padding-top:25vh">
                    <div class="brandmark">✓</div>
                    <h2>Kamu Berhasil Keluar</h2>
                    <p class="muted">
                        Sampai jumpa lagi! Terima kasih telah menggunakan KopiKita ☕
                    </p>

                    <button class="btn" onclick="goto('login')">
                        Kembali ke halaman Login
                    </button>
                </div>
            `, false);
            break;
    }
}

function verifyOTP() {
    let kode = document.getElementById('otp').value;

    if (kode === '1234') {
        toast('Verifikasi berhasil');
        goto('login');
    } else {
        toast('Kode OTP demo: 1234');
    }
}

function field(label, id, type = 'text') {
    return `
        <div class="field">
            <label>${label}</label>
            <input id="${id}" type="${type}" placeholder="${label}">
        </div>
    `;
}

function home() {
    const cats = ['Semua', 'Kopi Susu', 'Kopi Hitam', 'Non-Kopi'];

    let filtered = products.filter(product => {
        return category === 'Semua' || product.category === category;
    });

    app.innerHTML = shell(`
        <div class="top">
            <div class="row between">
                <div>
                    <h1>Halo, ${user.name.split(' ')[0]}!</h1>
                    <p>Mau ngopi apa hari ini?</p>
                </div>

                <button class="iconbtn" onclick="goto('profile')">♙</button>
            </div>

            <div class="search">
                ⌕
                <input id="search" placeholder="Cari menu kopi..." oninput="searchMenu(this.value)">
            </div>
        </div>

        <div class="screen" style="padding-top:8px">
            <div class="chips">
                ${cats.map(c => `
                    <button class="chip ${category === c ? 'active' : ''}"
                        onclick="category='${c}';render()">
                        ${c}
                    </button>
                `).join('')}
            </div>

            <div class="sectiontitle">
                <h2>Menu Favorit</h2>
                <span class="muted small">${filtered.length} menu</span>
            </div>

            <div class="grid" id="menu">
                ${filtered.map(card).join('')}
            </div>
        </div>
    `);
}

function card(product) {
    return `
        <div class="card">
            <img src="${product.image}" alt="${product.name}"
                onerror="this.src='https://placehold.co/400x300?text=KopiKita'">

            <h3>${product.name}</h3>

            <div class="price">${rupiah(product.price)}</div>

            <button class="add" onclick="openProduct(${product.id})">
                ＋ Pilih
            </button>
        </div>
    `;
}

function searchMenu(keyword) {
    let menu = document.getElementById('menu');

    let filtered = products.filter(product => {
        let cocokKategori = category === 'Semua' || product.category === category;
        let cocokNama = product.name.toLowerCase().includes(keyword.toLowerCase());

        return cocokKategori && cocokNama;
    });

    menu.innerHTML = filtered.map(card).join('');

    if (filtered.length === 0) {
        menu.innerHTML = '<p class="muted">Menu tidak ditemukan.</p>';
    }
}

function openProduct(id) {
    selectedProduct = products.find(product => product.id === id);

    qty = 1;
    sugar = 'Normal';
    size = 'Regular';
    milk = 'Normal';

    goto('detail');
}

function detail() {
    let product = selectedProduct;

    if (!product) {
        goto('home');
        return;
    }

    let price = product.price;

    if (size === 'Large') {
        price += 5000;
    } else if (size === 'Small') {
        price -= 2000;
    }

    app.innerHTML = shell(`
        ${header('Detail Produk')}

        <img class="producthero" src="${product.image}"
            onerror="this.src='https://placehold.co/600x400?text=KopiKita'">

        <div class="screen">
            <h2>${product.name}</h2>
            <h3 style="color:var(--coffee)">${rupiah(price)}</h3>
            <p class="muted">${product.description}</p>

            <div class="field">
                <label>Pilih Ukuran</label>

                <div class="option">
                    ${['Small', 'Regular', 'Large'].map(option => `
                        <button class="${size === option ? 'selected' : ''}"
                            onclick="size='${option}';render()">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="field">
                <label>Level Gula</label>

                <div class="option">
                    ${['Less', 'Normal', 'Extra'].map(option => `
                        <button class="${sugar === option ? 'selected' : ''}"
                            onclick="sugar='${option}';render()">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="field">
                <label>Jenis Susu</label>

                <div class="option">
                    ${['Normal', 'Oat', 'Soy'].map(option => `
                        <button class="${milk === option ? 'selected' : ''}"
                            onclick="milk='${option}';render()">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="field row between">
                <label>Jumlah</label>

                <div class="qty">
                    <button onclick="qty=Math.max(1,qty-1);render()">−</button>
                    <strong>${qty}</strong>
                    <button onclick="qty++;render()">＋</button>
                </div>
            </div>
        </div>

        <div class="bottomcta row between">
            <div>
                <div class="muted small">Total</div>
                <strong>${rupiah(price * qty)}</strong>
            </div>

            <button class="btn" style="width:60%" onclick="addCart()">
                Tambah ke Keranjang
            </button>
        </div>
    `, false);
}

function addCart() {
    let product = selectedProduct;
    let price = product.price;

    if (size === 'Large') {
        price += 5000;
    } else if (size === 'Small') {
        price -= 2000;
    }

    cart.push({
        id: product.id,
        name: product.name,
        price: price,
        qty: qty,
        image: product.image,
        size: size,
        sugar: sugar,
        milk: milk
    });

    toast('Ditambahkan ke keranjang');
    goto('home');
}

function cartScreen() {
    if (cart.length === 0) {
        app.innerHTML = shell(`
            ${header('Keranjang')}

            <div class="empty">
                <div style="font-size:50px">🛒</div>
                <h3>Keranjang masih kosong</h3>

                <button class="btn" onclick="goto('home')">
                    Cari Menu
                </button>
            </div>
        `);
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    app.innerHTML = shell(`
        ${header('Keranjang')}

        <div class="screen">
            ${cart.map((item, index) => `
                <div class="cartitem row">
                    <img src="${item.image}">

                    <div style="flex:1">
                        <strong>${item.name}</strong>

                        <p class="muted small">
                            ${item.size} · Gula ${item.sugar} · ${item.milk}
                        </p>

                        <strong>${rupiah(item.price * item.qty)}</strong>

                        <div class="qty" style="margin-top:8px">
                            <button onclick="changeQty(${index},-1)">−</button>
                            <span>${item.qty}</span>
                            <button onclick="changeQty(${index},1)">＋</button>
                        </div>
                    </div>

                    <button onclick="removeCart(${index})">✕</button>
                </div>
            `).join('')}

            <div class="panel">
                <div class="totalrow">
                    <span>Subtotal</span>
                    <strong>${rupiah(total)}</strong>
                </div>
            </div>

            <button class="btn" onclick="goto('checkout')">
                Lanjut Checkout
            </button>
        </div>
    `, false);
}

function changeQty(index, perubahan) {
    cart[index].qty += perubahan;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    render();
}

function removeCart(index) {
    cart.splice(index, 1);
    render();
}
function addressScreen() {
    app.innerHTML = shell(`
        ${header('Alamat Saya')}

        <div class="screen">
            ${addresses.map((address, index) => `
                <div class="addresscard">
                    <div class="row between">
                        <strong>${address.tag}</strong>

                        <input type="radio"
                            ${address.selected ? 'checked' : ''}
                            onchange="selectAddress(${index})">
                    </div>

                    <p>${address.text}</p>

                    <div class="row between">
                        <span class="link" onclick="editAddress(${index})">
                            Edit
                        </span>

                        <span class="link" onclick="removeAddress(${index})">
                            Hapus
                        </span>
                    </div>
                </div>
            `).join('')}

            <button class="btn secondary" onclick="addAddress()">
                ＋ Tambah Alamat Baru
            </button>

            <button class="btn" style="margin-top:12px" onclick="goto('checkout')">
                Gunakan Alamat Ini
            </button>
        </div>
    `, false);
}

function selectAddress(index) {
    addresses.forEach(address => address.selected = false);
    addresses[index].selected = true;

    render();
}

function removeAddress(index) {
    addresses.splice(index, 1);

    if (addresses.length > 0 && !addresses.some(address => address.selected)) {
        addresses[0].selected = true;
    }

    render();
}

function addAddress() {
    let tag = prompt('Label alamat (Rumah/Kantor):');

    if (!tag) return;

    let text = prompt('Masukkan alamat:');

    if (!text) return;

    addresses.push({
        tag: tag,
        text: text,
        selected: false
    });

    render();
}

function editAddress(index) {
    let address = prompt('Edit alamat:', addresses[index].text);

    if (address) {
        addresses[index].text = address;
        render();
    }
}

function paymentScreen() {
    let methods = [
        'GoPay',
        'OVO',
        'DANA',
        'Kartu Debit / Kredit',
        'Tunai (Cash)'
    ];

    app.innerHTML = shell(`
        ${header('Metode Pembayaran')}

        <div class="screen">
            <h3>Pilih metode pembayaran</h3>

            ${methods.map(method => `
                <div class="payment" onclick="selectPayment('${method}')">
                    <span>${method}</span>

                    <input type="radio" ${payment === method ? 'checked' : ''}>
                </div>
            `).join('')}

            <button class="btn" onclick="goto('checkout')">
                Simpan
            </button>
        </div>
    `, false);
}

function selectPayment(method) {
    payment = method;
    render();
}

function checkout() {
    if (cart.length === 0) {
        goto('cart');
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    let address = addresses.find(item => item.selected) || addresses[0];

    app.innerHTML = shell(`
        ${header('Ringkasan Pesanan')}

        <div class="screen">
            <div class="panel">
                <div class="row between">
                    <strong>ALAMAT PENGIRIMAN</strong>

                    <span class="link" onclick="goto('addresses')">
                        Ubah
                    </span>
                </div>

                <strong>${address?.tag || 'Alamat'}</strong>
                <p class="muted">${address?.text || 'Belum ada alamat'}</p>
            </div>

            <div class="panel">
                <div class="row between">
                    <strong>METODE PEMBAYARAN</strong>

                    <span class="link" onclick="goto('payments')">
                        Ubah
                    </span>
                </div>

                <p>${payment}</p>
            </div>

            <h3>Detail Pesanan</h3>

            ${cart.map(item => `
                <div class="totalrow">
                    <span>${item.qty}x ${item.name}</span>
                    <span>${rupiah(item.price * item.qty)}</span>
                </div>
            `).join('')}

            <hr>

            <div class="totalrow">
                <span>Subtotal</span>
                <span>${rupiah(total)}</span>
            </div>

            <div class="totalrow">
                <span>Biaya Layanan</span>
                <span>Rp 2.000</span>
            </div>

            <div class="totalrow">
                <strong>Total</strong>
                <strong>${rupiah(total + 2000)}</strong>
            </div>

            <button class="btn" onclick="placeOrder()">
                Bayar Sekarang • ${rupiah(total + 2000)}
            </button>
        </div>
    `, false);
}

function placeOrder() {
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    total += 2000;

    let order = {
        id: '#KK-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString('id-ID'),
        items: cart.map(item => `${item.qty}x ${item.name}`).join(', '),
        total: total,
        status: 'Berlangsung'
    };

    orderHistory.unshift(order);
    cart = [];

    goto('success');
}

function successScreen() {
    let order = orderHistory[0];

    app.innerHTML = shell(`
        <div class="screen center" style="padding-top:70px">
            <div class="brandmark">✓</div>

            <h2>Pesanan Berhasil!</h2>

            <p class="muted">
                Pesananmu sedang disiapkan oleh KopiKita
            </p>

            <div class="panel">
                <p>No. Pesanan</p>
                <h3>${order?.id || '#KK-0000'}</h3>

                <hr>

                <p>Estimasi siap dalam</p>
                <strong>12–15 menit</strong>
            </div>

            <button class="btn" onclick="goto('orders')">
                Lacak Pesanan
            </button>

            <button class="btn secondary" style="margin-top:12px" onclick="goto('home')">
                Kembali ke Beranda
            </button>
        </div>
    `, false);
}

function orders() {
    let filtered = orderHistory.filter(order => order.status === tabOrder);

    let tabs = ['Berlangsung', 'Selesai', 'Dibatalkan'];

    app.innerHTML = shell(`
        ${header('Pesanan Saya')}

        <div class="screen">
            <div class="tabs">
                ${tabs.map(tab => `
                    <button class="${tabOrder === tab ? 'active' : ''}"
                        onclick="selectOrderTab('${tab}')">
                        ${tab}
                    </button>
                `).join('')}
            </div>

            ${filtered.length > 0 ? filtered.map(order => `
                <div class="addresscard">
                    <div class="row between">
                        <span class="muted small">${order.date}</span>
                        <strong>${order.status}</strong>
                    </div>

                    <p>${order.items}</p>

                    <div class="row between">
                        <strong>${rupiah(order.total)}</strong>

                        <span class="link" onclick="showOrder('${order.id}')">
                            Lihat Detail
                        </span>
                    </div>
                </div>
            `).join('') : `
                <div class="empty">
                    Belum ada pesanan pada kategori ini.
                </div>
            `}
        </div>
    `, true);
}

function selectOrderTab(tab) {
    tabOrder = tab;
    render();
}

function showOrder(id) {
    let order = orderHistory.find(item => item.id === id);

    if (order) {
        alert('Order ' + order.id + '\n' + order.items);
    }
}
function profile() {
    let links = [
        ['Pesanan Saya', 'orders'],
        ['Alamat Tersimpan', 'addresses'],
        ['Metode Pembayaran', 'payments'],
        ['Pengaturan', 'profile'],
        ['Bantuan', 'profile']
    ];

    app.innerHTML = shell(`
        <div class="top">
            <h1>Profil Saya</h1>

            <div class="center" style="padding:20px">
                <div class="brandmark" style="margin:auto">R</div>

                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        </div>

        <div class="screen">
            ${links.map(link => `
                <div class="payment" onclick="goto('${link[1]}')">
                    ${link[0]}
                    <span>›</span>
                </div>
            `).join('')}

            <button class="btn danger" onclick="goto('logout')">
                Keluar
            </button>
        </div>
    `, true);
}

function logoutScreen() {
    app.innerHTML = shell(`
        <div class="screen center" style="padding-top:25vh">
            <div class="brandmark">?</div>

            <h2>Yakin ingin keluar?</h2>

            <p class="muted">
                Kamu perlu masuk lagi untuk pesan kopi favoritmu di KopiKita.
            </p>

            <button class="btn danger" onclick="goto('loggedout')">
                Ya, Keluar
            </button>

            <button class="btn secondary" style="margin-top:12px" onclick="goto('profile')">
                Batal
            </button>
        </div>
    `, false);
}

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (email === '' || password === '') {
        toast('Isi email dan kata sandi');
        return;
    }

    user.email = email;

    goto('home');
}

function register() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;
    let confirm = document.getElementById('confirm').value;

    if (name === '' || email === '' || password === '' || confirm === '') {
        toast('Lengkapi semua field');
        return;
    }

    if (password !== confirm) {
        toast('Kata sandi tidak sama');
        return;
    }

    user = {
        name: name,
        email: email
    };

    toast('Akun demo dibuat');
    goto('otp');
}