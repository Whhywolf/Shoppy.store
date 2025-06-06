<script type="module">
  // Import Firebase SDK modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

  // ✅ Your Firebase Configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "XXXXXXXXXXX",
    appId: "APP_ID"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const productRef = collection(db, "products");

  // Add Product Handler
  document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const desc = document.getElementById("desc").value;
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    // Upload image to Firebase Storage
    const storageRef = ref(storage, 'products/' + imageFile.name);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Save product to Firestore
    await addDoc(productRef, {
      name,
      price,
      category,
      desc,
      imageUrl
    });

    alert("Product saved!");
    e.target.reset();
    loadProducts();
  });

  // Load Products Function
  async function loadProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    const querySnapshot = await getDocs(productRef);
    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      productList.innerHTML += `
        <div style="border:1px solid #ccc;padding:10px;margin:10px;">
          <img src="${product.imageUrl}" alt="${product.name}" style="width:100px;height:100px;"><br>
          <strong>${product.name}</strong><br>
          ₹${product.price} - ${product.category}<br>
          ${product.desc}<br>
          <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
        </div>
      `;
    });
  }

  // Delete Product
  window.deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    alert("Product deleted.");
    loadProducts();
  };

  // Load on page start
  loadProducts();
</script>
