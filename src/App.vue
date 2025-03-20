<template>
  <div id="app">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="./assets/logo.png" alt="Lesson Booking Logo" class="logo" />
    </div>

    <!-- Page Content via Router -->
    <router-view :cart="cart" @add-to-cart="addToCart" @update-cart="updateCart" @order-placed="handleOrderPlaced" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      cart: [] // Cart items
    };
  },
  computed: {
    // Total items in cart for cart button
    totalItems() {
      return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0); // Ensure quantity is counted correctly
    }
  },
  methods: {
    // Add item to cart
    addToCart(lesson) {
      const existing = this.cart.find((item) => item._id === lesson._id);
      if (existing) {
        this.$set(existing, 'quantity', existing.quantity + 1); // Ensure Vue detects change
      } else {
        this.cart.push({ ...lesson, quantity: 1 });
      }
    },
    // Update cart (from CartPage)
    updateCart(updatedCart) {
      this.cart = [...updatedCart]; // Ensure reactivity
    },
    // Handle order placed successfully
    handleOrderPlaced() {
      this.cart = []; // Empty cart
      this.$router.push('/'); // Redirect to home page
    }
  }
};
</script>

<style>
/* App Container */
#app {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  min-height: 100vh;
  position: relative;
}

/* Logo Section */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  width: 200px;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

/* Floating Cart Button */
.cart-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cart-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>

