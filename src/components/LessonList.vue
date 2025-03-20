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
      <div class="sort-buttons">
        <button @click="setSort('subject')">Sort by Subject</button>
        <button @click="setSort('location')">Sort by Location</button>
        <button @click="setSort('price')">Sort by Price</button>
        <button @click="setSort('spaces')">Sort by Spaces</button>
        <button @click="toggleSortOrder">
          {{ sortOrder === 'asc' ? "⬆ Ascending" : "⬇ Descending" }}
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
      console.log("Refreshing lessons...");
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

        if (!response.ok) {
          throw new Error(HTTP Error: ${response.status});
        }

        const data = await response.json();
        this.lessons = data.map((lesson) => ({
          ...lesson,
          cartQuantity: 0, // Track quantity in cart
        }));
      } catch (err) {
        console.error("API Error:", err);
        this.apiError = "Failed to fetch lessons. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    addToCart(lesson) {
      if (lesson.space > 0) {
        let cartItem = this.cart.find((item) => item._id === lesson._id);
        if (cartItem) {
          if (lesson.space > cartItem.cartQuantity) {
            cartItem.cartQuantity++;
            lesson.space--; // Reduce available space
          } else {
            this.alertMessage = "No more spaces available!";
            setTimeout(() => (this.alertMessage = ""), 3000);
            return;
          }
        } else {
          this.$emit("add-to-cart", { ...lesson, cartQuantity: 1 });
          lesson.space--; // Reduce available space
        }
        this.alertMessage = "Lesson added to cart successfully!";
      } else {
        this.alertMessage = "No spaces left!";
      }
      setTimeout(() => (this.alertMessage = ""), 3000);
    },
    setSort(key) {
      this.sortKey = key;
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
            return this.sortOrder === "asc"
              ? aValue - bValue
              : bValue - aValue;
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
/* ✅ Sorting Buttons Styling */
.sort-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-buttons button {
  padding: 8px 12px;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.sort-buttons button:hover {
  background-color: #007bff;
  color: white;
}

.sort-buttons button:focus {
  outline: none;
  background-color: #0056b3;
  color: white;
}

/* ✅ Error Message */
.error-message {
  color: red;
  font-size: 16px;
  text-align: center;
  margin-bottom: 15px;
}

.alert {
  padding: 10px;
  margin-bottom: 15px;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  text-align: center;
}

.cart-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.3s;
}

.cart-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.lesson-list {
  max-width: 1500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
}

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>
