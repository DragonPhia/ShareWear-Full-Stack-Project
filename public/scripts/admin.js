// admin.js
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    if (document.getElementById("create_product_form")) {
        populateCategoryDropdownFromAPI();
    }

    let allProducts = [];

    const searchInput = document.getElementById("search_input");
    const categoryInput = document.getElementById("filter_input");

    if (searchInput && categoryInput) {
        searchInput.addEventListener("input", () => filterAndRenderProducts());
        categoryInput.addEventListener("input", () => filterAndRenderProducts());
    }



    const addProductButton = document.getElementById("add_product");
    if (addProductButton) {
        addProductButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "admin-create.html";
        });
    }

    const createForm = document.getElementById("create_product_form");
    if (createForm) {
        createForm.addEventListener("submit", function(e) {
            e.preventDefault();
    
            const product = {
                name: document.getElementById("name").value.trim(),
                description: document.getElementById("description").value.trim(),
                category_id: parseInt(document.getElementById("category_id").value),
                image_url: document.getElementById("image_url").value.trim(),
                price: parseFloat(document.getElementById("price").value),
                is_featured: parseInt(document.getElementById("is_featured").value)
            };
    
            fetch('/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to add product.");
                return res.json();
            })
            .then(data => {
                alert("Product added successfully!");
                window.location.href = "admin-products.html";
            })
            .catch(err => {
                console.error("Add product error:", err);
                alert("Error adding product.");
            });
        });
    }

    const editForm = document.getElementById("edit_product_form");
    if (editForm) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) {
            alert("Product ID is missing.");
            return;
        }

        fetch('/admin/products')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products.");
                return res.json();
            })
            .then(products => {
                const product = products.find(p => p.id == productId);
                if (!product) throw new Error("Product not found.");

                document.getElementById("name").value = product.name;
                document.getElementById("description").value = product.description;
                populateCategoryDropdownFromAPI(product.category_id);
                document.getElementById("image_url").value = product.image_url;
                document.getElementById("price").value = product.price;
                
                // Set the dropdown value for featured status
                document.getElementById("is_featured").value = product.is_featured === 1 ? "yes" : "no";
            })
            .catch(err => {
                console.error("Error loading product:", err);
                alert("Could not load product data.");
            });

        editForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const updatedProduct = {
                name: document.getElementById("name").value.trim(),
                description: document.getElementById("description").value.trim(),
                category_id: parseInt(document.getElementById("category_id").value),
                image_url: document.getElementById("image_url").value.trim(),
                price: parseFloat(document.getElementById("price").value),
                is_featured: document.getElementById("is_featured").value === "yes" ? 1 : 0 // Convert "yes"/"no" to 1/0
            };

            fetch(`/admin/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update product.");
                return res.json();
            })
            .then(data => {
                alert("Product updated successfully!");
                window.location.href = "admin-products.html";
            })
            .catch(err => {
                console.error("Update product error:", err);
                alert("Error updating product.");
            });
        });
    }
});

function fetchProducts() {
    fetch('/admin/products')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then(products => {
            allProducts = products;
            populateCategoryDropdown(products); // <--- NEW
            filterAndRenderProducts();
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}

function populateTable(products) {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach(product => {
        const tr = document.createElement("tr");

        const idTd = document.createElement("td");
        idTd.textContent = product.id;
        tr.appendChild(idTd);

        const nameTd = document.createElement("td");
        nameTd.textContent = product.name;
        tr.appendChild(nameTd);

        const descTd = document.createElement("td");
        descTd.textContent = product.description;
        tr.appendChild(descTd);

        const categoryTd = document.createElement("td");
        categoryTd.textContent = product.category_name || product.category_id;
        tr.appendChild(categoryTd);

        const imgTd = document.createElement("td");
        const img = document.createElement("img");
        img.src = product.image_url;
        img.alt = product.name;
        img.width = 50;
        imgTd.appendChild(img);
        tr.appendChild(imgTd);

        const priceTd = document.createElement("td");
        priceTd.textContent = `$${parseFloat(product.price).toFixed(2)}`;
        tr.appendChild(priceTd);

        const featuredTd = document.createElement("td");
        featuredTd.textContent = product.is_featured === 1 ? "Yes" : "No";
        tr.appendChild(featuredTd);

        const actionsTd = document.createElement("td");

        const editLink = document.createElement("a");
        editLink.href = `product-edit.html?id=${product.id}`;
        editLink.textContent = "Edit";
        editLink.className = "button";
        actionsTd.appendChild(editLink);

        // const archiveLink = document.createElement("a");
        // archiveLink.href = "#";
        // archiveLink.textContent = "Archive";
        // archiveLink.className = "button";
        // archiveLink.addEventListener("click", (e) => {
        //     e.preventDefault();
        //     archiveProduct(product.id);
        // });
        // actionsTd.appendChild(archiveLink);

        const deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.textContent = "Delete";
        deleteLink.className = "button";
        deleteLink.addEventListener("click", (e) => {
            e.preventDefault();
            deleteProduct(product.id);
        });
        actionsTd.appendChild(deleteLink);

        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
    });
}

// function archiveProduct(id) {
//     alert(`Archive feature for product ${id} is not implemented yet.`);
// }

function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`/admin/products/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to delete product.");
        return response.json();
    })
    .then(data => {
        alert(data.message || "Product deleted successfully");
        fetchProducts();
    })
    .catch(error => {
        console.error("Delete failed:", error);
        alert("An error occurred while deleting the product.");
    });
}

function filterAndRenderProducts() {
    const query = document.getElementById("search_input").value.toLowerCase();
    const selectedCategory = document.getElementById("filter_input").value.toLowerCase();

    const filtered = allProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        const categoryName = (product.category_name || product.category_id || "").toString().toLowerCase();
        const categoryMatch = !selectedCategory || categoryName === selectedCategory;
        return (nameMatch || descMatch) && categoryMatch;
    });

    populateTable(filtered);
}

function populateCategoryDropdown(products) {
    const categorySelect = document.getElementById("filter_input");
    if (!categorySelect) return;

    const categories = [...new Set(products.map(p => p.category_name || p.category_id))];
    
    categorySelect.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function populateCategoryDropdownFromAPI(selectedCategoryId = null) {
    fetch('/categories')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch categories.");
            return response.json();
        })
        .then(categories => {
            const categorySelect = document.getElementById("category_id");
            categorySelect.innerHTML = "";

            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                if (selectedCategoryId && category.id === selectedCategoryId) {
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error populating category dropdown:", error);
        });
}