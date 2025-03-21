<template>
  <div class="checkout-page">
    <h2 class="text-center mb-4">🛒 Checkout</h2>

    <!-- ✅ Success Alert -->
    <div v-if="successMessage" class="alert alert-success" role="alert">
      {{ successMessage }}
    </div>

    <!-- ✅ Error Alert -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Checkout Form -->
    <form @submit.prevent="placeOrder" class="checkout-form">
      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label">First Name <span>*</span></label>
          <input
            type="text"
            v-model="order.firstName"
            class="form-control"
            placeholder="John"
            required
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Last Name <span>*</span></label>
          <input
            type="text"
            v-model="order.lastName"
            class="form-control"
            placeholder="Doe"
            required
          />
        </div>

        <div class="col-12">
          <label class="form-label">Address <span>*</span></label>
          <input
            type="text"
            v-model="order.address"
            class="form-control"
            placeholder="123 Main St"
            required
          />
        </div>

        <div class="col-md-4">
          <label class="form-label">City <span>*</span></label>
          <input
            type="text"
            v-model="order.city"
            class="form-control"
            placeholder="City Name"
            required
          />
        </div>

        <div class="col-md-4">
          <label class="form-label">State <span>*</span></label>
          <select v-model="order.state" class="form-select" required>
            <option disabled value="">Select State</option>
            <option v-for="(name, code) in states" :key="code" :value="name">
              {{ name }}
            </option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Zip Code <span>*</span></label>
          <input
            type="number"
            v-model="order.zip"
            class="form-control"
            placeholder="12345"
            required
          />
        </div>

        <div class="col-12">
          <label class="form-label">Shipping Method</label>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="order.method"
              value="Home"
              checked
            />
            <label class="form-check-label">Home</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="order.method"
              value="Business"
            />
            <label class="form-check-label">Business</label>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary mt-5">
        <h3>🧾 Order Summary</h3>
        <ul>
          <li v-for="item in cart" :key="item._id">
            {{ item.title }} x {{ item.quantity }} - ${{
              item.price * item.quantity
            }}
          </li>
        </ul>
        <p class="text-end">
          <strong>Total: ${{ total }}</strong>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="checkout-buttons mt-4 d-flex justify-content-between">
        <button type="submit" class="btn btn-success w-50 me-2">
          Place Order
        </button>
        <button
          type="button"
          class="btn btn-secondary w-50 ms-2"
          @click="$router.push('/cart')"
        >
          Back to Cart
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: "CheckoutPage",
    props: ["cart"],

    data() {
      return {
        order: {
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          method: "Home",
        },
         states : {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
},

        successMessage: "", // Success alert
        errorMessage: "", // Error alert
      };
    },

    computed: {
      total() {
        return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    },

    methods: {
      placeOrder() {
        // ✅ Basic Validation
        if (!this.order.firstName || !this.order.lastName || !this.order.address || !this.order.city || !this.order.state || !this.order.zip) {
          this.errorMessage = "⚠️ Please fill in all required fields!";
          this.successMessage = "";
          return;
        }

        // ✅ Prepare Data
        const orderData = {
          ...this.order,
          items: this.cart.map((item) => ({
            lessonId: item._id,
            quantity: item.quantity,
          })),
        };

        // ✅ Fetch API Call to backend
        fetch("https://activityhive-backend-2.onrender.com/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data); // Debug
            this.successMessage = "🎉 Order placed successfully!";
            this.errorMessage = "";

            // ✅ Redirect to Home Page after 2 seconds
            setTimeout(() => {
              this.$emit("order-placed"); // Notify parent
              this.$router.push("/"); // Redirect
            }, 2000);
          })
          .catch((err) => {
            console.error("Order error:", err);
            this.errorMessage = "❌ Failed to place order. Please try again!";
            this.successMessage = "";
          });
      },
    },
  };
</script>

<style scoped>
.checkout-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
}

.order-summary {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.order-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-summary li {
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.order-summary li:last-child {
  border-bottom: none;
}

.checkout-buttons button {
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  transition: 0.3s;
}

.checkout-buttons button:hover {
  opacity: 0.9;
}

.form-label span {
  color: red;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .checkout-buttons {
    flex-direction: column;
  }

  .checkout-buttons button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
