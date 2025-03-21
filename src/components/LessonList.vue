<template>
  <div class="lesson-list">
    <h1>Available Lessons</h1>

    <!-- Alerts -->
    <div v-if="alertMessage" class="alert alert-primary" role="alert">
      {{ alertMessage }}
    </div>

    <!-- Search & Sort -->
    <div class="search-sort-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search lessons..."
        class="search-bar"
      />
      <div class="sort-controls">
        <select v-model="sortKey" class="sort-select">
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
        <button @click="toggleSortOrder" class="sort-order-btn">
          {{ sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending" }}
        </button>
      </div>
    </div>

    <!-- Show Loading Text -->
    <p v-if="loading">⏳ Loading lessons...</p>

    <!-- Show API Error -->
    <p v-if="apiError" class="error-message">❌ {{ apiError }}</p>

    <!-- Lessons Table -->
    <table v-if="sortedLessons.length">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Title</th>
          <th>Subject</th>
          <th>Description</th>
          <th>Location</th>
          <th>Price</th>
          <th>Spaces</th>
          <th>Duration</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in sortedLessons" :key="lesson._id">
          <td><img :src="lesson.icon" alt="icon" width="50" /></td>
          <td>{{ lesson.title }}</td>
          <td>{{ lesson.subject }}</td>
          <td>{{ lesson.description }}</td>
          <td>{{ lesson.location }}</td>
          <td>${{ lesson.price }}</td>
          <td>{{ lesson.space }}</td>
          <td>{{ lesson.duration }}</td>
          <td>
            <button @click="addToCart(lesson)" :disabled="lesson.space <= 0">
              {{ lesson.space > 0 ? "Add to Cart" : "Sold Out" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No lessons found.</p>

    <!-- ✅ Cart Button -->
    <router-link v-if="cart.length > 0" to="/cart" class="cart-btn">
      🛒 Cart ({{ cart.length }})
    </router-link>
  </div>
</template>

<script>
// LessonList.vue
export default {
  name: "LessonList",
  props: ["refresh", "cart"],
  data() {
    return {
      lessons: [],
      searchQuery: "",
      sortKey: "subject",
      sortOrder: "asc",
      alertMessage: "",
      loading: true,
      apiError: "",
    };
  },
  created() {
    this.fetchLessons();
  },
  watch: {
    refresh() {
      this.fetchLessons();
    },
  },
  methods: {
    async fetchLessons() {
      this.loading = true;
      this.apiError = "";

      try {
        const response = await fetch(
          "https://activityhive-backend-2.onrender.com/lessons"
        );
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        this.lessons = data.map((lesson) => {
          const cartItem = this.cart.find((item) => item._id === lesson._id);
          return {
            ...lesson,
            quantity: cartItem ? cartItem.quantity : 0,
            space: lesson.space - (cartItem ? cartItem.quantity : 0),
          };
        });
      } catch (err) {
        console.error("API Error:", err);
        this.apiError = "Failed to fetch lessons.";
      } finally {
        this.loading = false;
      }
    },
    addToCart(lesson, selectedQuantity = 1) {
      if (lesson.space >= selectedQuantity) {
        let cartItem = this.cart.find((item) => item._id === lesson._id);
        if (cartItem) {
          cartItem.quantity += selectedQuantity;
        } else {
          let newItem = { ...lesson, quantity: selectedQuantity };
          this.$emit("add-to-cart", newItem);
        }
        lesson.space -= selectedQuantity;
        this.alertMessage = "Lesson added to cart!";
      } else {
        this.alertMessage = "Not enough space!";
      }
      setTimeout(() => (this.alertMessage = ""), 3000);
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
  },
  computed: {
    sortedLessons() {
      let sorted = [...this.lessons];
      if (this.sortKey) {
        sorted.sort((a, b) => {
          let aValue = a[this.sortKey];
          let bValue = b[this.sortKey];

          if (typeof aValue === "string") {
            return this.sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else {
            return this.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
        });
      }
      return sorted.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          lesson.subject
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.lesson-list {
  max-width: 1400px;
  margin: 30px auto;
  padding: 25px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* Search & Sort Section */
.search-sort-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.search-bar {
  flex: 1;
  padding: 12px;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 16px;
  transition: 0.3s;
}

.search-bar:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 91, 187, 0.3);
}

/* Sort Controls */
.sort-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-select,
.sort-order-btn {
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
  transition: 0.3s;
}

.sort-select:hover,
.sort-order-btn:hover {
  background: #007bff;
  color: white;
}

/* Alerts & Messages */
.alert {
  padding: 12px;
  margin-bottom: 15px;
  color: white;
  background: #007bff;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

/* Lessons Table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 14px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}

tr:nth-child(even) {
  background: #f8f8f8;
}

tr:hover {
  background: rgba(0, 123, 255, 0.1);
  transition: 0.3s;
}

/* Add to Cart Button */
button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  background: #007bff;
  color: white;
  transition: 0.3s;
}

button:disabled {
  background: gray;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

/* Cart Button */
.cart-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 14px 20px;
  font-size: 18px;
  font-weight: bold;
  background: #007bff;
  color: white;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.cart-btn:hover {
  background: #0056b3;
  transform: scale(1.05);
}
</style>
