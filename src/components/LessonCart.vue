<template>
  <div class="cart-page">
    <h2>🛒 Your Shopping Cart</h2>

    <!-- Cart Items -->
    <div v-if="cart.length" class="cart-items">
      <div v-for="item in cart" :key="item._id" class="cart-item">
        <div>
          <h3>{{ item.title }}</h3>
          <p>Price: ${{ item.price }}</p>
          <p>Quantity: {{ item.quantity }}</p>
        </div>
        <div class="cart-item-actions">
          <p><strong>Total:</strong> ${{ item.price * item.quantity }}</p>
          <button @click="removeItem(item)" class="remove-btn">Remove</button>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <p><strong>Total Items:</strong> {{ totalQuantity }}</p>
        <p><strong>Total Price:</strong> ${{ total }}</p>

        <div class="cart-buttons">
          <button @click="goToCheckout" class="checkout-btn">Proceed to Checkout</button>
          <button @click="goBackToLessons" class="back-btn">Back to Lessons</button>
        </div>
      </div>
    </div>

    <!-- Empty Cart Message -->
    <div v-else class="empty-cart">
      <p>Your cart is empty. Go back and add some lessons!</p>
      <button @click="goBackToLessons" class="home-btn">🏠 Return to Lessons</button>
    </div>
  </div>
</template>

<script>
// LessonCart.vue
export default {
  name: "LessonCart",
  props: {
    cart: {
      type: Array,
      required: true,
    },
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    },
    totalQuantity() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  methods: {
    increaseQuantity(item) {
      if (item.space > 0) {
        item.quantity++;
        item.space--;
        this.$emit("update-cart", this.cart);
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        item.space++;
        this.$emit("update-cart", this.cart);
      } else {
        this.removeItem(item);
      }
    },
    removeItem(item) {
      const updatedCart = this.cart.filter((i) => i._id !== item._id);
      this.$emit("update-cart", updatedCart);
      this.$emit("update-lesson-space", { _id: item._id, quantity: item.quantity });
    },
    goToCheckout() {
      this.$router.push("/checkout");
    },
    goBackToLessons() {
      this.$router.push("/lessons");
    },
  },
};

</script>


<style scoped>
/* Main Cart Section */
.cart-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 25px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* Cart Items */
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.cart-item h3 {
  margin: 0 0 5px;
  color: #007bff;
}

.cart-item p {
  margin: 4px 0;
  color: #444;
}

.cart-item-actions {
  text-align: right;
}

.remove-btn {
  padding: 8px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #c82333;
}

/* Cart Summary */
.cart-summary {
  margin-top: 20px;
  padding: 20px;
  background: #f1f1f1;
  border-radius: 10px;
  text-align: center;
}

.cart-summary p {
  margin: 10px 0;
  font-size: 18px;
  color: #333;
}

.cart-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Buttons */
button {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.checkout-btn {
  background: #28a745;
}

.checkout-btn:hover {
  background: #218838;
}

.back-btn {
  background: #007bff;
}

.back-btn:hover {
  background: #0056b3;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  margin: 50px 0;
  font-size: 20px;
  color: #888;
}

/* Home Button for Empty Cart */
.home-btn {
  background: #ff9800;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  margin-top: 20px;
  transition: background 0.3s ease-in-out, transform 0.2s;
}

.home-btn:hover {
  background: #e68900;
  transform: scale(1.05);
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
