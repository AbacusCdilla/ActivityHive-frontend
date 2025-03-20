<template>
    <div>
      <!-- Call LessonCart component here -->
      <LessonCart
        :cart="cart"
        @update-cart="handleCartUpdate"
        @go-to-checkout="goToCheckout"
        @back="backToLessons"
      />
    </div>
  </template>
  
  <script>
  // Import LessonCart component
  import LessonCart from "@/components/LessonCart.vue"; // Adjust path if different
  
    // Import LessonCart component
  
  export default {
    name: "CartPage",
    components: { LessonCart }, // Register component
    data() {
      return {
        cart: [] // This will hold cart data
      };
    },
    methods: {
      handleCartUpdate(newCart) {
        this.cart = newCart; // Update cart when item is removed
      },
      goToCheckout() {
        // Example navigation to checkout page
        this.$router.push("/checkout");
      },
      backToLessons() {
        // Example navigation back to lessons page
        this.$router.push("/lessons");
      }
    },
    mounted() {
      // Load cart from localStorage or other source
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      this.cart = savedCart;
    }
  };
  </script>
  
