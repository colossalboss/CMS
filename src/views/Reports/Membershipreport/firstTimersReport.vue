<template>
  <div class="container-fluid px-5">
    <!-- header area -->
    <div class="container">
      <div
        class="
          row
          d-flex
          flex-row
          justify-content-between
          mt-5
          align-items-center
        "
      >
        <div class="centered-items">
          <h3 class="heading-text">First Timers Report</h3>
        </div>

        <!-- <div  class="centered-items pr-3">
          <button
            class="default-btn font-weight-normal"
            @click="() => (showExport = !showExport)">
            Export &nbsp; &nbsp; <i class="pi pi-angle-down"></i>
          </button>
        </div> -->
          <div
          class="default-btn font-weight-normal c-pointer"
          @click="() => (showExport = !showExport)"
          style="width: fixed; position:relative">
                   Export &nbsp; &nbsp; <i class="pi pi-angle-down" ></i>
                   <div
                        class=" c-pointer"
                        style="width: 6rem; z-index:1000; position:absolute"
                        v-if="showExport">

                         <Listbox
                         @click="downloadFile"
                         v-model="selectedFileType"
                         :options="bookTypeList"
                         optionLabel="name"/>
                    </div>
              </div>


      </div>
    

    </div>
    <!--end of header area -->
    <!-- date area -->
      <div class="container-fluid bg-area my-3">
        <div class="row px-4 w-100 ml-md-5 px-sm-4 mt-sm-3 ">
              <div class="col-md-4 col-sm-12 px-md-0">
                  <div class="p-field p-col-12 pt-md-2 pb-2">
                    <div>
                      <label for="icon" class="mb-0 font-weight-bold">Start Date</label>
                    </div>
                    <Calendar class="w-100" id="icon" v-model="startDate" :showIcon="true" dateFormat="dd/mm/yy"/>
                  </div>
              </div>
              <div class="col-md-4 col-sm-12 pr-md-0">
                  <div class="p-field p-col-12 pt-md-2">
                    <div>
                      <label for="icon" class="mb-0 font-weight-bold">End Date</label>
                    </div>
                    <Calendar class="w-100" id="icon" v-model="endDate" :showIcon="true" dateFormat="dd/mm/yy"/>
                  </div>
              </div>
            <div class="col-md-4 col-sm-12 pr-md-0">
                  <div class="p-field p-col-12 pt-md-2">
                    <button
                            class="default-btn generate-report c-pointer font-weight-normal mt-4"
                            @click="generateReport">
                            Generate Report
                    </button>
                  </div>
              </div>
        </div>
      </div>
    <!--end of date area -->
    <div id="element-to-print">
      <section>
        <!-- chart area -->
        <div
          class="chart row"
          :class="
            firstTimerInChurch && firstTimerInChurch.length > 0
              ? 'graph-area'
              : ''
          "
        >
          <div class="chart1 col-12 col-md-6">
            <ByGenderChart
              domId="chart"
              title="By Gender"
              distance="5"
              :titleMargin="10"
              :summary="data"
            />
          </div>
          <div class="chart1 col-12 col-md-6">
            <ByGenderChart
              domId="chartid"
              title="Marital Status"
              distance="5"
              :titleMargin="10"
              :summary="maritalChartInfo"
            />
          </div>
        </div>
        <!--end of chart area -->
      </section>

      <section>
        <!-- table header -->
      <div v-if="firstTimerInChurch.length > 0">
          <div
          class="
            container-fluid
            table-main
            px-0
            remove-styles2 remove-border
            responsiveness
          "
        >
          <table
            id="table"
            class="table remove-styles mt-0 table-hover table-header-area"
          >
            <thead class="table-header-area-main">
              <tr
                class="text-capitalize text-nowrap font-weight-bold"
                style="border-bottom: 0; font-size:medium"
              >
                <!-- <th scope="col">Church Activity</th> -->
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Home Address</th>
                <th scope="col">Gender</th>
                <th scope="col">Current Status</th>
                <!-- <th scope="col">Marital Status</th> -->
                <!-- <th scope="col">Activity Date</th> -->

              </tr>
            </thead>
            <tbody class="small-text font-weight-bold text-nowrap">
              <tr v-for="(firstTimer, index) in firstTimerInChurch" :key="index">
                <td>{{ firstTimer.firstName }}</td>
                <td>{{ firstTimer.lastName }}</td>
                <td>{{ firstTimer.mobilePhone }}</td>
                <td>{{ firstTimer.email }}</td>
                <td>{{ firstTimer.homeAddress }}</td>
                <td>{{ firstTimer.gender }}</td>
                <td>{{ firstTimer.status }}</td>
                <!-- <td>{{ firstTimer.maritalStatus }}</td> -->
                <!-- <td>{{ formatDate(firstTimer.activityDate) }}</td> -->
              </tr>
            </tbody>
          </table>
          <div class="table-foot d-flex justify-content-end mt-3">
            <!-- mt-n3" -->
            <!-- <PaginationButtons /> -->
          </div>
        </div>
      </div>
        <!--end table header  -->
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Calendar from "primevue/calendar";
import ByGenderChart from "@/components/charts/PieChart.vue";
// import PaginationButtons from "../../../components/pagination/PaginationButtons";
import axios from "@/gateway/backendapi";
import dateFormatter from "../../../services/dates/dateformatter";
import printJS from "print-js";
import exportService from "../../../services/exportFile/exportservice";
import Listbox from 'primevue/listbox';

export default {
  components: {
    Calendar,
    ByGenderChart,
    Listbox,
    // PaginationButtons
  },
  setup() {
    const startDate = ref("");
    const endDate = ref("");
    const firstTimerInChurch = ref([]);
    const genderChartResult = ref([]);
    const data = ref([]);
    const maritalChartInfo = ref([]);
    const showExport = ref(false);
    const fileName = ref("");
    const bookTypeList = ref([{name: "xlsx" }, {name: "csv" }, {name: "txt" }, {name: "" }]);
    const selectedFileType = ref({});
    const fileHeaderToExport = ref([]);
    const fileToExport = ref([]);
    const generateReport = () => {
      axios
        .get(
          `/api/Reports/people/getFirstTimersReport?startDate=${new Date(
            startDate.value
          ).toLocaleDateString("en-US")}&endDate=${new Date(
            endDate.value
          ).toLocaleDateString("en-US")}`
        )
        .then((res) => {
          firstTimerInChurch.value = res.data;
          data.value = getGenderChart(res.data);
          maritalChartInfo.value = maritalChart(res.data);
          /* function to call service and populate table */
          setTimeout(() => {
            fileHeaderToExport.value = exportService.tableHeaderToJson(
              document.getElementsByTagName("th")
            );
            fileToExport.value = exportService.tableToJson(
              document.getElementById("table")
            );
          }, 1000);
          /* End function to call service and populate table */
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getGenderChart = (arr) => {
      return [
        getSumOfItems(arr, "gender", "Male"),
        getSumOfItems(arr, "gender", "Female"),
        // getSumOfItems(arr, "gender", null),
        // getSumOfItems(arr, "gender", "Other"),
      ];
    };

    const maritalChart = (arr) => {
      return [
        getSumOfItems(arr, "maritalStatus", "Married"),
        getSumOfItems(arr, "maritalStatus", "Single"),
        // getSumOfItems(arr, "maritalStatus", null),
      ];
    };

    const getSumOfItems = (arr, key, value) => {
      return {
        name: value,
        value: firstTimerInChurch.value.filter((i) => i[key] === value).length,
      };
    };

    /* Code For Exporting File */
    const downloadFile = () => {
      exportService.downLoadExcel(selectedFileType.value.name, document.getElementById("element-to-print"), fileName.value, fileHeaderToExport.value,  fileToExport.value,);
    };
    /* End Code For Exporting File */

    const formatDate = (activityDate) => {
      return dateFormatter.monthDayTime(activityDate);
    };

    return {
      Calendar,
      startDate,
      endDate,
      firstTimerInChurch,
      generateReport,
      formatDate,
      genderChartResult,
      data,
      maritalChartInfo,
      fileName,
      downloadFile,
      showExport,
      bookTypeList,
      printJS,
      selectedFileType,
    };
  },
};
</script>

<style scoped>
/* .default-btn {
  font-weight: 800;
  font-size: 1rem;
  white-space: initial;
  border-radius: 3rem;
  border: 1px solid #136acd;
  padding: 0.5rem 1.25rem;
  color: #136acd;
  width: auto;
  outline: transparent !important;
  max-height: 2.5rem;
  background: #fff;
  min-width: 7.6rem;
} */

.default-btn {
    font-weight: 600;
    white-space: initial;
    font-size: 1rem;
    border-radius: 3rem;
    border: 1px solid #002044;
    padding: .5rem 1.25rem;
    width: auto;
	/* border:none; */
    /* outline: transparent !important; */
    max-height: 40px;
    /* background: #6c757d47 !important; */
    color:#000;
    text-decoration: none;
    min-width: 121px;
}

.default-btn:hover {
  text-decoration: none;
}


.generate-report {
  font-size: 1rem;
  color: #fff;
  background-color: #136acd !important ;
  border: none;
  min-width: 7rem;
}

.heading-text {
  font: normal normal 800 1.5rem Nunito sans;
}

.bg-area {
  background-color: #ebeff4;
  border-radius: 0.5rem;
  padding: 0.2rem 0 1.2rem 0;
}

.table {
  width: 100% !important;
  box-shadow: 0 0.063rem 0.25rem #02172e45;
  border: 0.063rem solid #dde2e6;
  border-radius: 30px;
  text-align: left;
  margin-bottom: auto !important;
  padding-bottom: 0.5rem;
}

.table-header-area {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.table-header-area-main {
  background-color: #ebeff4;
}

.table-main {
  width: 100% !important;
  box-shadow: 0 0.063rem 0.25rem #02172e45 !important;
  border: 0.063rem solid #dde2e6 !important;
  /* border-radius: 30px !important; */
  text-align: left !important;
  margin-bottom: auto !important;
  padding-bottom: 0.5rem !important;
}

.remove-styles {
  border: none !important;
  box-shadow: none !important;
  border-bottom: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.remove-styles2 {
  padding-right: 0;
  padding-left: 0;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.remove-border {
  box-shadow: none !important;
}

.graph-area {
  border: 1px solid #dde2e6;
  border-radius: 0.5rem;
  padding: 1rem 0rem;
  margin: 2rem 0rem !important;
  width: 100% !important;
  box-shadow: 0 0.063rem 0.25rem #02172e45;
}

.responsiveness {
  max-width: 100%;
  /* overflow-y: scroll; */
  overflow-x: scroll;
}

/* .move-enter-active {
  animation: move-in .8s;
}
.move-leave-active {
  animation: move-in .8s reverse;
}
@keyframes move-in {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }

} */
</style>