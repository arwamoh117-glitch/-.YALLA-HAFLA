/* ==========================================
   🎁 نظام إدارة محل الهدايا
   يــــــلا حــــــفــــــلــــــة 🎊✨
   ========================================== */


/* ==========================================
   تحميل البيانات
   ========================================== */

let products =
    JSON.parse(localStorage.getItem("giftProducts")) || [];

let sales =
    JSON.parse(localStorage.getItem("giftSales")) || [];

let warehouseProducts =
    JSON.parse(localStorage.getItem("giftWarehouseProducts")) || [];

let warehouseSales =
    JSON.parse(localStorage.getItem("giftWarehouseSales")) || [];

let monthlyArchive =
    JSON.parse(localStorage.getItem("giftMonthlyArchive")) || [];


/* ==========================================
   حفظ البيانات
   ========================================== */

function saveData() {

    localStorage.setItem(
        "giftProducts",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "giftSales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "giftWarehouseProducts",
        JSON.stringify(warehouseProducts)
    );

    localStorage.setItem(
        "giftWarehouseSales",
        JSON.stringify(warehouseSales)
    );

    localStorage.setItem(
        "giftMonthlyArchive",
        JSON.stringify(monthlyArchive)
    );
}


/* ==========================================
   تنظيف الباركود
   ========================================== */

function cleanBarcode(barcode) {

    if (barcode === undefined || barcode === null) {
        return "";
    }

    return String(barcode)
        .trim()
        .replace(/\s+/g, "");
}


/* ==========================================
   التاريخ
   ========================================== */

function getTodayDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentMonth() {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;
}


/* ==========================================
   فتح المخزن
   ========================================== */

function openWarehouse() {

    const section =
        document.getElementById("warehouseSection");

    const salesSection =
        document.getElementById("warehouseSalesSection");

    section.style.display = "block";

    salesSection.style.display = "block";

    section.scrollIntoView({
        behavior: "smooth"
    });

    displayWarehouse();
}


/* ==========================================
   إغلاق المخزن
   ========================================== */

function closeWarehouse() {

    document.getElementById(
        "warehouseSection"
    ).style.display = "none";

    document.getElementById(
        "warehouseSalesSection"
    ).style.display = "none";
}


/* ==========================================
   إضافة منتج عادي
   ========================================== */

function addProduct() {

    const name =
        document.getElementById("productName")
            .value.trim();

    const barcode =
        cleanBarcode(
            document.getElementById("productBarcode")
                .value
        );

    const quantity =
        Number(
            document.getElementById("productQuantity")
                .value
        );

    const price =
        Number(
            document.getElementById("productPrice")
                .value
        );


    if (!name) {

        alert("⚠️ اكتبي اسم المنتج");

        return;
    }


    if (!barcode) {

        alert("⚠️ اكتبي باركود المنتج");

        return;
    }


    if (quantity <= 0) {

        alert("⚠️ الكمية يجب أن تكون أكبر من صفر");

        return;
    }


    if (price <= 0) {

        alert("⚠️ السعر يجب أن يكون أكبر من صفر");

        return;
    }


    const duplicateName =
        products.some(
            p => p.name.toLowerCase() === name.toLowerCase()
        );


    if (duplicateName) {

        alert("⚠️ هذا المنتج موجود بالفعل");

        return;
    }


    const duplicateBarcode =
        products.some(
            p => cleanBarcode(p.barcode) === barcode
        );


    if (duplicateBarcode) {

        alert("⚠️ هذا الباركود موجود بالفعل");

        return;
    }


    const warehouseDuplicateBarcode =
        warehouseProducts.some(
            p => cleanBarcode(p.barcode) === barcode
        );


    if (warehouseDuplicateBarcode) {

        alert(
            "⚠️ هذا الباركود مستخدم في منتج من المخزن"
        );

        return;
    }


    products.push({

        name: name,

        barcode: barcode,

        quantity: quantity,

        price: price

    });


    saveData();

    displayProducts();

    updateDashboard();


    document.getElementById("productName").value = "";

    document.getElementById("productBarcode").value = "";

    document.getElementById("productQuantity").value = "";

    document.getElementById("productPrice").value = "";


    alert("✅ تم إضافة المنتج بنجاح");
}


/* ==========================================
   عرض المنتجات
   ========================================== */

function displayProducts() {

    const table =
        document.getElementById("productsTable");

    table.innerHTML = "";


    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    لا توجد منتجات حاليًا
                </td>
            </tr>
        `;

    } else {

        products.forEach((product, index) => {

            table.innerHTML += `

                <tr>

                    <td>${product.name}</td>

                    <td>${product.barcode || "-"}</td>

                    <td>${product.quantity}</td>

                    <td>${product.price} جنيه</td>

                    <td>
                        ${getStockStatus(product.quantity)}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct(${index})">

                            🗑️ حذف

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "productsNumber"
    ).textContent =
        `${products.length} منتج`;
}


/* ==========================================
   إضافة منتج للمخزن
   ========================================== */

function addWarehouseProduct() {

    const name =
        document.getElementById(
            "warehouseProductName"
        ).value.trim();

    const barcode =
        cleanBarcode(
            document.getElementById(
                "warehouseProductBarcode"
            ).value
        );

    const quantity =
        Number(
            document.getElementById(
                "warehouseProductQuantity"
            ).value
        );

    const price =
        Number(
            document.getElementById(
                "warehouseProductPrice"
            ).value
        );


    if (!name) {

        alert("⚠️ اكتبي اسم المنتج");

        return;
    }


    if (!barcode) {

        alert("⚠️ اكتبي باركود المنتج");

        return;
    }


    if (quantity <= 0) {

        alert("⚠️ الكمية يجب أن تكون أكبر من صفر");

        return;
    }


    if (price <= 0) {

        alert("⚠️ السعر يجب أن يكون أكبر من صفر");

        return;
    }


    const normalBarcode =
        products.some(
            p => cleanBarcode(p.barcode) === barcode
        );


    if (normalBarcode) {

        alert(
            "⚠️ هذا الباركود مستخدم في المنتجات الأساسية"
        );

        return;
    }


    const existing =
        warehouseProducts.find(
            p =>
                p.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (existing) {

        if (
            existing.barcode &&
            cleanBarcode(existing.barcode) !== barcode
        ) {

            alert(
                "⚠️ هذا المنتج موجود بباركود مختلف"
            );

            return;
        }


        existing.quantity += quantity;

        existing.price = price;

        existing.barcode = barcode;

    } else {

        warehouseProducts.push({

            name: name,

            barcode: barcode,

            quantity: quantity,

            price: price

        });

    }


    saveData();

    displayWarehouse();

    updateDashboard();


    document.getElementById(
        "warehouseProductName"
    ).value = "";

    document.getElementById(
        "warehouseProductBarcode"
    ).value = "";

    document.getElementById(
        "warehouseProductQuantity"
    ).value = "";

    document.getElementById(
        "warehouseProductPrice"
    ).value = "";


    alert("✅ تم إضافة المنتج للمخزن");
}


/* ==========================================
   عرض المخزن
   ========================================== */

function displayWarehouse() {

    const table =
        document.getElementById("warehouseTable");

    table.innerHTML = "";


    if (warehouseProducts.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    المخزن فارغ حاليًا
                </td>
            </tr>
        `;

        return;
    }


    warehouseProducts.forEach(
        (product, index) => {

            table.innerHTML += `

                <tr>

                    <td>${product.name}</td>

                    <td>${product.barcode || "-"}</td>

                    <td>${product.quantity}</td>

                    <td>${product.price} جنيه</td>

                    <td>
                        ${getStockStatus(product.quantity)}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteWarehouseProduct(${index})">

                            🗑️ حذف

                        </button>

                    </td>

                </tr>

            `;

        }
    );
}


/* ==========================================
   حالة المخزون
   ========================================== */

function getStockStatus(quantity) {

    if (quantity <= 0) {

        return "❌ نفد";

    }

    if (quantity <= 5) {

        return "⚠️ قليل";

    }

    return "✅ متوفر";
}


/* ==========================================
   حذف منتج عادي
   ========================================== */

function deleteProduct(index) {

    const product = products[index];

    if (!product) return;


    const confirmDelete =
        confirm(
            `هل تريدين حذف المنتج "${product.name}"؟`
        );


    if (!confirmDelete) return;


    products.splice(index, 1);

    saveData();

    displayProducts();

    updateDashboard();

    alert("✅ تم حذف المنتج");
}


/* ==========================================
   حذف منتج من المخزن
   ========================================== */

function deleteWarehouseProduct(index) {

    const product =
        warehouseProducts[index];

    if (!product) return;


    const confirmDelete =
        confirm(
            `هل تريدين حذف "${product.name}" من المخزن؟`
        );


    if (!confirmDelete) return;


    warehouseProducts.splice(index, 1);

    saveData();

    displayWarehouse();

    updateDashboard();

    alert("✅ تم حذف المنتج من المخزن");
}


/* ==========================================
   البحث عن منتج بالباركود
   هذه الدالة للبحث فقط
   ========================================== */

function findProductByBarcode(barcode) {

    const code =
        cleanBarcode(barcode);


    if (!code) return null;


    const normalProduct =
        products.find(
            p => cleanBarcode(p.barcode) === code
        );


    if (normalProduct) {

        return {
            product: normalProduct,
            type: "normal"
        };

    }


    const warehouseProduct =
        warehouseProducts.find(
            p => cleanBarcode(p.barcode) === code
        );


    if (warehouseProduct) {

        return {
            product: warehouseProduct,
            type: "warehouse"
        };

    }


    return null;
}


/* ==========================================
   البحث بالباركود - البيع العادي
   ========================================== */

function searchSaleBarcode() {

    const input =
        document.getElementById("saleBarcode");

    const barcode =
        cleanBarcode(input.value);


    const info =
        document.getElementById(
            "barcodeProductInfo"
        );


    if (!barcode) {

        info.style.display = "none";

        return;
    }


    const result =
        findProductByBarcode(barcode);


    if (!result) {

        info.style.display = "flex";

        document.getElementById(
            "barcodeProductName"
        ).textContent =
            "❌ المنتج غير موجود";

        document.getElementById(
            "barcodeProductPrice"
        ).textContent = "-";

        document.getElementById(
            "barcodeProductQuantity"
        ).textContent = "-";

        return;
    }


    const product = result.product;


    info.style.display = "flex";


    document.getElementById(
        "barcodeProductName"
    ).textContent =
        product.name;


    document.getElementById(
        "barcodeProductPrice"
    ).textContent =
        `${product.price} جنيه`;


    document.getElementById(
        "barcodeProductQuantity"
    ).textContent =
        product.quantity;


    if (result.type === "normal") {

        document.getElementById(
            "saleProduct"
        ).value =
            product.name;

        document.getElementById(
            "saleQuantity"
        ).value = 1;

    } else {

        openWarehouse();


        document.getElementById(
            "warehouseSaleBarcode"
        ).value =
            barcode;

        document.getElementById(
            "warehouseSaleProduct"
        ).value =
            product.name;

        document.getElementById(
            "warehouseSaleQuantity"
        ).value = 1;

        findWarehouseProductByBarcode();

    }
}


/* ==========================================
   Enter في باركود البيع
   ========================================== */

function barcodeEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        searchSaleBarcode();

    }
}


/* ==========================================
   البحث عن باركود المخزن
   ========================================== */

function findWarehouseProductByBarcode() {

    const input =
        document.getElementById(
            "warehouseSaleBarcode"
        );

    const barcode =
        cleanBarcode(input.value);


    const info =
        document.getElementById(
            "warehouseBarcodeInfo"
        );


    if (!barcode) {

        info.style.display = "none";

        return;
    }


    const product =
        warehouseProducts.find(
            p =>
                cleanBarcode(p.barcode) ===
                barcode
        );


    if (!product) {

        info.style.display = "flex";

        document.getElementById(
            "warehouseBarcodeName"
        ).textContent =
            "❌ المنتج غير موجود";

        document.getElementById(
            "warehouseBarcodePrice"
        ).textContent = "-";

        document.getElementById(
            "warehouseBarcodeQuantity"
        ).textContent = "-";

        return;
    }


    info.style.display = "flex";


    document.getElementById(
        "warehouseBarcodeName"
    ).textContent =
        product.name;


    document.getElementById(
        "warehouseBarcodePrice"
    ).textContent =
        `${product.price} جنيه`;


    document.getElementById(
        "warehouseBarcodeQuantity"
    ).textContent =
        product.quantity;


    document.getElementById(
        "warehouseSaleProduct"
    ).value =
        product.name;


    document.getElementById(
        "warehouseSaleQuantity"
    ).value = 1;
}


/* ==========================================
   بيع منتج عادي
   ========================================== */

function sellProduct() {

    const name =
        document.getElementById(
            "saleProduct"
        ).value.trim();


    const quantity =
        Number(
            document.getElementById(
                "saleQuantity"
            ).value
        );


    if (!name) {

        alert("⚠️ اكتبي اسم المنتج");

        return;
    }


    if (quantity <= 0) {

        alert("⚠️ اكتبي كمية صحيحة");

        return;
    }


    const product =
        products.find(
            p =>
                p.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (!product) {

        alert("❌ المنتج غير موجود");

        return;
    }


    if (product.quantity < quantity) {

        alert(
            `❌ الكمية غير كافية\nالمتاح: ${product.quantity}`
        );

        return;
    }


    product.quantity -= quantity;


    const total =
        quantity * product.price;


    const now =
        new Date();


    sales.push({

        product: product.name,

        barcode: product.barcode || "",

        quantity: quantity,

        price: product.price,

        total: total,

        date: getTodayDate(),

        displayDate:
            now.toLocaleDateString("ar-EG"),

        time:
            now.toLocaleTimeString("ar-EG")

    });


    saveData();

    displayProducts();

    displaySales();

    updateDashboard();


    document.getElementById(
        "saleProduct"
    ).value = "";

    document.getElementById(
        "saleQuantity"
    ).value = "";

    document.getElementById(
        "saleBarcode"
    ).value = "";

    document.getElementById(
        "barcodeProductInfo"
    ).style.display = "none";


    alert("✅ تم تسجيل البيع");
}


/* ==========================================
   بيع من المخزن
   ========================================== */

function sellWarehouseProduct() {

    const name =
        document.getElementById(
            "warehouseSaleProduct"
        ).value.trim();


    const quantity =
        Number(
            document.getElementById(
                "warehouseSaleQuantity"
            ).value
        );


    if (!name) {

        alert("⚠️ اكتبي اسم المنتج");

        return;
    }


    if (quantity <= 0) {

        alert("⚠️ اكتبي كمية صحيحة");

        return;
    }


    const product =
        warehouseProducts.find(
            p =>
                p.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (!product) {

        alert("❌ المنتج غير موجود في المخزن");

        return;
    }


    if (product.quantity < quantity) {

        alert(
            `❌ الكمية غير كافية\nالمتاح: ${product.quantity}`
        );

        return;
    }


    product.quantity -= quantity;


    const total =
        quantity * product.price;


    const now =
        new Date();


    warehouseSales.push({

        product: product.name,

        barcode: product.barcode || "",

        quantity: quantity,

        price: product.price,

        total: total,

        date: getTodayDate(),

        displayDate:
            now.toLocaleDateString("ar-EG"),

        time:
            now.toLocaleTimeString("ar-EG")

    });


    saveData();

    displayWarehouse();

    displaySales();

    updateDashboard();


    document.getElementById(
        "warehouseSaleProduct"
    ).value = "";

    document.getElementById(
        "warehouseSaleQuantity"
    ).value = "";

    document.getElementById(
        "warehouseSaleBarcode"
    ).value = "";

    document.getElementById(
        "warehouseBarcodeInfo"
    ).style.display = "none";


    alert("✅ تم تسجيل البيع من المخزن");
}


/* ==========================================
   مبيعات اليوم
   ========================================== */

function displaySales() {

    const table =
        document.getElementById(
            "salesTable"
        );

    table.innerHTML = "";


    const today =
        getTodayDate();


    const normalToday =
        sales
            .map((sale, index) => ({
                sale: sale,
                index: index,
                type: "normal"
            }))
            .filter(
                item =>
                    item.sale.date === today
            );


    const warehouseToday =
        warehouseSales
            .map((sale, index) => ({
                sale: sale,
                index: index,
                type: "warehouse"
            }))
            .filter(
                item =>
                    item.sale.date === today
            );


    const allToday =
        normalToday.concat(
            warehouseToday
        );


    if (allToday.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    لا توجد مبيعات اليوم
                </td>
            </tr>
        `;

    } else {

        allToday.forEach(item => {

            const sale =
                item.sale;


            const source =
                item.type === "normal"
                    ? "🎁 المنتجات"
                    : "📦 المخزن";


            table.innerHTML += `

                <tr>

                    <td>
                        ${sale.product}
                    </td>

                    <td>
                        ${source}
                    </td>

                    <td>
                        ${sale.quantity}
                    </td>

                    <td>
                        ${sale.price} جنيه
                    </td>

                    <td>
                        ${sale.total} جنيه
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteTodaySale('${item.type}', ${item.index})">

                            ↩️ مرتجع

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "salesCount"
    ).textContent =
        `${allToday.length} عملية`;
}


/* ==========================================
   حذف عملية بيع من مبيعات اليوم
   وإرجاع الكمية للمخزون
   ========================================== */

function deleteTodaySale(type, index) {

    const saleArray =
        type === "normal"
            ? sales
            : warehouseSales;


    const productArray =
        type === "normal"
            ? products
            : warehouseProducts;


    const sale =
        saleArray[index];


    if (!sale) {

        alert("❌ عملية البيع غير موجودة");

        return;
    }


    const confirmReturn =
        confirm(
            `هل تريدين حذف عملية بيع "${sale.product}" وإرجاع الكمية للمخزون؟`
        );


    if (!confirmReturn) return;


    let product = null;


    if (sale.barcode) {

        product =
            productArray.find(
                p =>
                    cleanBarcode(p.barcode) ===
                    cleanBarcode(sale.barcode)
            );

    }


    if (!product) {

        product =
            productArray.find(
                p =>
                    p.name.toLowerCase() ===
                    sale.product.toLowerCase()
            );

    }


    if (product) {

        product.quantity +=
            Number(sale.quantity);

    }


    saleArray.splice(index, 1);


    saveData();

    displayProducts();

    displayWarehouse();

    displaySales();

    updateDashboard();


    if (product) {

        alert(
            "✅ تم حذف البيع وإرجاع الكمية للمخزون"
        );

    } else {

        alert(
            "⚠️ تم حذف البيع، لكن المنتج لم يعد موجودًا في المخزون"
        );

    }
}


/* ==========================================
   إجمالي المبيعات
   ========================================== */

function calculateSalesTotal(
    salesArray,
    month = null
) {

    return salesArray.reduce(
        (total, sale) => {

            if (month) {

                if (
                    !sale.date ||
                    sale.date.substring(0, 7) !== month
                ) {

                    return total;

                }

            }

            return total +
                Number(sale.total || 0);

        },

        0
    );
}


/* ==========================================
   تحديث لوحة التحكم
   ========================================== */

function updateDashboard() {

    const today =
        getTodayDate();

    const currentMonth =
        getCurrentMonth();


    const todayNormal =
        sales
            .filter(
                sale =>
                    sale.date === today
            );


    const todayWarehouse =
        warehouseSales
            .filter(
                sale =>
                    sale.date === today
            );


    const todayTotal =
        calculateSalesTotal(
            todayNormal
        ) +
        calculateSalesTotal(
            todayWarehouse
        );


    const monthlyNormal =
        sales
            .filter(
                sale =>
                    sale.date &&
                    sale.date.substring(0, 7) ===
                    currentMonth
            );


    const monthlyWarehouse =
        warehouseSales
            .filter(
                sale =>
                    sale.date &&
                    sale.date.substring(0, 7) ===
                    currentMonth
            );


    const monthlyTotal =
        calculateSalesTotal(
            monthlyNormal
        ) +
        calculateSalesTotal(
            monthlyWarehouse
        );


    const warehouseStock =
        warehouseProducts.reduce(
            (total, product) =>
                total +
                Number(product.quantity || 0),

            0
        );


    const lowStock =
        warehouseProducts.filter(
            product =>
                Number(product.quantity) <= 5
        ).length;


    document.getElementById(
        "todaySales"
    ).textContent =
        `${todayTotal} جنيه`;


    document.getElementById(
        "monthlySales"
    ).textContent =
        `${monthlyTotal} جنيه`;


    document.getElementById(
        "productsCount"
    ).textContent =
        products.length;


    document.getElementById(
        "totalStock"
    ).textContent =
        warehouseStock;


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStock;
}


/* ==========================================
   اسم الشهر
   ========================================== */

function getMonthName(monthString) {

    const names = [

        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"

    ];


    const parts =
        monthString.split("-");


    const year =
        parts[0];

    const month =
        Number(parts[1]) - 1;


    return `${names[month]} ${year}`;
}


/* ==========================================
   زر تصفية الشهر الحالي
   ========================================== */

function createMonthlyClearButton() {

    const area =
        document.getElementById(
            "monthlyClearArea"
        );


    const month =
        getCurrentMonth();


    const monthName =
        getMonthName(month);


    area.innerHTML = `

        <div class="monthly-clear-box">

            <h3>
                📅 الشهر الحالي: ${monthName}
            </h3>

            <p>
                عند التصفية سيتم حفظ مبيعات الشهر
                في الأرشيف ثم إزالة مبيعاته من المبيعات الحالية.
            </p>

            <button
                class="monthly-clear-btn"
                onclick="clearCurrentMonthSales()">

                📅 تصفية مبيعات ${monthName}

            </button>

        </div>

    `;
}


/* ==========================================
   تصفية الشهر الحالي
   ========================================== */

function clearCurrentMonthSales() {

    const month =
        getCurrentMonth();


    const monthName =
        getMonthName(month);


    const normalMonthSales =
        sales.filter(
            sale =>
                sale.date &&
                sale.date.substring(0, 7) === month
        );


    const warehouseMonthSales =
        warehouseSales.filter(
            sale =>
                sale.date &&
                sale.date.substring(0, 7) === month
        );


    const total =
        calculateSalesTotal(
            normalMonthSales
        ) +
        calculateSalesTotal(
            warehouseMonthSales
        );


    const operations =
        normalMonthSales.length +
        warehouseMonthSales.length;


    if (operations === 0) {

        alert(
            "⚠️ لا توجد مبيعات في الشهر الحالي لتصفيتها"
        );

        return;
    }


    const alreadyArchived =
        monthlyArchive.some(
            archive =>
                archive.month === month
        );


    if (alreadyArchived) {

        alert(
            "⚠️ هذا الشهر موجود بالفعل في الأرشيف"
        );

        return;
    }


    const confirmClear =
        confirm(
            `هل تريدين تصفية مبيعات ${monthName}؟\n\n` +
            `عدد العمليات: ${operations}\n` +
            `إجمالي المبيعات: ${total} جنيه\n\n` +
            `لن يتم حذف أي منتج أو مخزون.`
        );


    if (!confirmClear) return;


    monthlyArchive.push({

        month: month,

        monthName: monthName,

        total: total,

        operations: operations,

        normalSales: normalMonthSales,

        warehouseSales: warehouseMonthSales,

        createdAt:
            new Date().toISOString()

    });


    sales =
        sales.filter(
            sale =>
                !(
                    sale.date &&
                    sale.date.substring(0, 7) === month
                )
        );


    warehouseSales =
        warehouseSales.filter(
            sale =>
                !(
                    sale.date &&
                    sale.date.substring(0, 7) === month
                )
        );


    saveData();

    displaySales();

    displayMonthlyArchive();

    updateDashboard();


    alert(
        `✅ تم تصفية ${monthName} بنجاح`
    );
}


/* ==========================================
   عرض أرشيف الشهور
   ========================================== */

function displayMonthlyArchive() {

    const container =
        document.getElementById(
            "monthlyArchive"
        );


    container.innerHTML = "";


    document.getElementById(
        "archiveCount"
    ).textContent =
        `${monthlyArchive.length} شهر`;


    if (monthlyArchive.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                📚 لا توجد شهور محفوظة في الأرشيف

            </div>

        `;

        return;
    }


    monthlyArchive
        .slice()
        .reverse()
        .forEach(
            (archive) => {

                container.innerHTML += `

                    <div class="archive-item">

                        <div class="archive-info">

                            <h3>
                                📅 ${archive.monthName}
                            </h3>

                            <p>
                                🧾 عدد العمليات:
                                ${archive.operations}
                            </p>

                            <p class="archive-total">
                                💰 إجمالي المبيعات:
                                ${archive.total} جنيه
                            </p>

                        </div>


                        <button
                            class="delete-btn archive-delete-btn"
                            onclick="deleteMonthlyArchive('${archive.month}')">

                            🗑️ حذف الشهر

                        </button>

                    </div>

                `;

            }
        );
}


/* ==========================================
   حذف شهر من الأرشيف
   ========================================== */

function deleteMonthlyArchive(month) {

    const archive =
        monthlyArchive.find(
            item =>
                item.month === month
        );


    if (!archive) {

        alert("❌ الشهر غير موجود");

        return;
    }


    const confirmDelete =
        confirm(
            `هل تريدين حذف شهر "${archive.monthName}" من الأرشيف؟\n\n` +
            `هذا لن يحذف المنتجات أو المخزون.`
        );


    if (!confirmDelete) return;


    monthlyArchive =
        monthlyArchive.filter(
            item =>
                item.month !== month
        );


    saveData();

    displayMonthlyArchive();

    alert(
        "✅ تم حذف الشهر من الأرشيف فقط"
    );
}


/* ==========================================
   نظام Barcode Scanner
   ========================================== */

let scannerBuffer = "";

let scannerTimer = null;

let scannerLastTime = 0;


document.addEventListener(
    "keydown",
    function (event) {

        const target =
            event.target;


        const isInput =
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            );


        /*
           لو المستخدم واقف داخل خانة،
           نخلي الخانة نفسها تستقبل الباركود.
        */

        if (isInput) {

            return;
        }


        const now =
            Date.now();


        /*
           جهاز الباركود بيبعت الحروف بسرعة جدًا،
           لذلك بنعتبر الكتابة السريعة Scanner.
        */

        if (
            scannerLastTime &&
            now - scannerLastTime > 100
        ) {

            scannerBuffer = "";

        }


        scannerLastTime = now;


        if (event.key === "Enter") {

            if (scannerBuffer.length > 0) {

                processScannedBarcode(
                    scannerBuffer
                );

                scannerBuffer = "";

                event.preventDefault();
            }

            return;
        }


        if (
            event.key.length === 1 &&
            /^[0-9A-Za-z\-]+$/.test(event.key)
        ) {

            scannerBuffer += event.key;

        }


        clearTimeout(scannerTimer);


        scannerTimer =
            setTimeout(
                () => {

                    scannerBuffer = "";

                },

                300
            );

    }
);


/* ==========================================
   معالجة الباركود الممسوح
   ========================================== */

function processScannedBarcode(barcode) {

    barcode =
        cleanBarcode(barcode);


    if (!barcode) return;


    const result =
        findProductByBarcode(barcode);


    if (!result) {

        showScannerMessage(
            "❌ الباركود غير موجود"
        );

        return;
    }


    const product =
        result.product;


    if (result.type === "normal") {

        document.getElementById(
            "saleBarcode"
        ).value =
            barcode;


        document.getElementById(
            "saleProduct"
        ).value =
            product.name;


        document.getElementById(
            "saleQuantity"
        ).value = 1;


        searchSaleBarcode();


        document.getElementById(
            "saleQuantity"
        ).focus();


        showScannerMessage(
            `✅ ${product.name}`
        );


    } else {

        openWarehouse();


        document.getElementById(
            "warehouseSaleBarcode"
        ).value =
            barcode;


        findWarehouseProductByBarcode();


        document.getElementById(
            "warehouseSaleQuantity"
        ).focus();


        showScannerMessage(
            `📦 ${product.name}`
        );
    }
}


/* ==========================================
   رسالة Scanner
   ========================================== */

function showScannerMessage(message) {

    let messageBox =
        document.getElementById(
            "scannerMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "scannerMessage";


        messageBox.style.position =
            "fixed";

        messageBox.style.bottom =
            "20px";

        messageBox.style.left =
            "20px";

        messageBox.style.background =
            "#c084fc";

        messageBox.style.color =
            "white";

        messageBox.style.padding =
            "14px 20px";

        messageBox.style.borderRadius =
            "10px";

        messageBox.style.fontWeight =
            "bold";

        messageBox.style.zIndex =
            "9999";

        messageBox.style.boxShadow =
            "0 5px 15px #d9b9e9";


        document.body.appendChild(
            messageBox
        );
    }


    messageBox.textContent =
        message;


    messageBox.style.display =
        "block";


    clearTimeout(
        messageBox.hideTimer
    );


    messageBox.hideTimer =
        setTimeout(
            () => {

                messageBox.style.display =
                    "none";

            },

            2000
        );
}


/* ==========================================
   تشغيل النظام
   ========================================== */

displayProducts();

displayWarehouse();

displaySales();

displayMonthlyArchive();

createMonthlyClearButton();

updateDashboard();