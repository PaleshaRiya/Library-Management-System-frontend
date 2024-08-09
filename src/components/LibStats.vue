<template>
  <NavbarThree />
  <div class="container mt-5">
    <div class="chart-container">
      <div class="chart-item" v-if="activeUsersData">
        <h3>Active Users</h3>
        <BarChart :data="activeUsersData" />   
        <button class="btn btn-secondary temp mb-3" @click="goToUsersDetails">View User Details</button>
      </div>
      <div class="chart-item" v-if="combinedData">
        <h3>Requests and E-Books</h3>
        <BarChart :data="combinedData" />
        <button class="btn btn-secondary temp mb-3" @click="exportEBookData">Export EBook Request Data</button>
      </div>
      <div class="chart-item pie-chart-item" v-if="sectionWiseEbooksData">
        <h3>Section-wise E-Books</h3>
        <PieChart :data="sectionWiseEbooksData" />
      </div>
    </div>
  </div>
</template>

<script>
import NavbarThree from "./NavbarThree.vue";
import axios from "axios";
import BarChart from "./BarChart.vue";
import PieChart from "./PieChart.vue";

export default {
  data() {
    return {
      activeUsersData: null,
      combinedData: null,
      sectionWiseEbooksData: null,
    };
  },
  components: {
    NavbarThree,
    BarChart,
    PieChart,
  },
  created() {
    this.fetchStatistics();
  },
  methods: {
    goToUsersDetails() {
      this.$router.push({ name: 'UsersDetails' });
    },
    async exportEBookData() {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/request/export`);
        
        if (response.status === 200 || response.status === 202) {
          alert("Requested data has been sent mailed.");
        }
      } catch (error) {
        console.error("Error exporting eBook data:", error);
      }
    },
    async fetchStatistics() {
      try {
        const usersResponse = await axios.get(
          "http://127.0.0.1:5000/api/users"
        );
        const activeUsersCount = usersResponse.data.filter(
          (user) => user.active
        ).length-1;

        this.activeUsersData = {
          labels: ["Active Users"],
          datasets: [
            {
              label: "Active Users",
              backgroundColor: "#42A5F5",
              data: [activeUsersCount],
            },
          ],
        };

        const requestsResponse = await axios.get(
          "http://127.0.0.1:5000/api/request"
        );
        const requests = requestsResponse.data;

        const grantedRequestsCount = requests.filter(
          (request) => request.isApproved
        ).length;
        const ebooksIssuedCount = requests.length;

        const revokedRequestsCount = requests.filter(
          (request) => request.isRevoked
        ).length;

        this.combinedData = {
          labels: ["Granted Requests", "E-Book Requests", "Revoked Requests"],
          datasets: [
            {
              label: "Statistics",
              backgroundColor: ["#66BB6A", "#FFA726", "#FF7043"],
              data: [
                grantedRequestsCount,
                ebooksIssuedCount,
                revokedRequestsCount,
              ],
            },
          ],
        };

        const ebooksResponse = await axios.get(
          "http://127.0.0.1:5000/api/ebook"
        );
        const sectionsCount = {};
        ebooksResponse.data.forEach((ebook) => {
          ebook.sections.forEach((section) => {
            if (sectionsCount[section.name]) {
              sectionsCount[section.name]++;
            } else {
              sectionsCount[section.name] = 1;
            }
          });
        });

        this.sectionWiseEbooksData = {
          labels: Object.keys(sectionsCount),
          datasets: [
            {
              label: "E-Books by Section",
              backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#FF7043",
                "#AB47BC",
                "#26A69A",
              ],
              data: Object.values(sectionsCount),
            },
          ],
        };

        console.log("Statistics fetched successfully!");
        console.log("Active Users Data:", this.activeUsersData);
        console.log("Combined Data:", this.combinedData);
        console.log("Section-wise E-Books Data:", this.sectionWiseEbooksData);
        console.log("Sections Count:", sectionsCount);
      } catch (error) {
        console.error("There was an error fetching the statistics!", error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
.temp{
  margin-top: 60px;
}
.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.chart-item {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.chart-item h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  text-align: center;
}

.pie-chart-item {
  max-width: 400px;
  margin: 0 auto;
}
</style>
