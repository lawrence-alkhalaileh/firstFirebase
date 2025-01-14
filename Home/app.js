import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


import { firebaseConfig } from "../config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;

  try {
    const docRef = await addDoc(collection(db, "products"), {
      name: name,
      price: price,
      category: category,
      createdAt: serverTimestamp(),
    });
    productForm.reset();
    loadProducts();
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

async function loadProducts() {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnapshot) => {
    const product = docSnapshot.data();
    const productCard = createProductCard(
      product.name,
      product.price,
      product.category,
      docSnapshot.id
    );
    productsContainer.appendChild(productCard);
  });
}

function createProductCard(name, price, category, docId) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const productName = document.createElement("h3");
  productName.textContent = name;
  card.appendChild(productName);

  const productPrice = document.createElement("p");
  productPrice.textContent = `Price: $${price}`;
  card.appendChild(productPrice);

  const productCategory = document.createElement("p");
  productCategory.textContent = `Category: ${category}`;
  card.appendChild(productCategory);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  card.appendChild(deleteButton);

  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  card.appendChild(updateButton);

  deleteButton.addEventListener("click", () => {
    deleteProduct(docId);
  });

  updateButton.addEventListener("click", () => {
    updateProduct(docId);
  });

  return card;
}

async function deleteProduct(docId) {
  try {
    const productDoc = doc(db, "products", docId);
    await deleteDoc(productDoc);
    loadProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

async function updateProduct(docId) {
  const newName = prompt("Enter new product name:");
  const newPrice = prompt("Enter new product price:");
  const newCategory = prompt("Enter new product category:");

  if (newName && newPrice && newCategory) {
    try {
      const productDoc = doc(db, "products", docId);
      await updateDoc(productDoc, {
        name: newName,
        price: parseFloat(newPrice),
        category: newCategory,
      });
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }
}

const userSignOut = async () => {
  await signOut(auth);
  window.location.href = "../Auth/index.html";
};

document.getElementById("signOutButton").addEventListener("click", userSignOut);

loadProducts();
