<template>
<div class="container-fluid mt-5 mb-4 p-0">
  <div class="row d-flex justify-content-between px-3 mb-3">
              <!-- <div class="heading-text">Attendance Report</div> -->
              <h3 class="heading-text">Church Activities Attendance Report</h3>
              <div class="default-btn border-secondary font-weight-normal c-pointer"
                @click="() => (showExport = !showExport)"
                style="width: fixed; position:relative">
                        Export &nbsp; &nbsp; <i class="pi pi-angle-down" ></i>
                        <div class=" c-pointer" style="width: 6rem; z-index:1000; position:absolute" v-if="showExport">
                              <Listbox @click="downloadFile" v-model="selectedFileType" :options="bookTypeList" optionLabel="name"/>
                        </div>
              </div>
        </div>
     <div>
      </div>
                <div style="background: #ebeff4;" class="row m-0 py-5 mb-2" >
                    <div class="col-md-6 mb-3">
                      <div class="font-weight-bold">Select branch</div>
                      <BranchSelect @selectedbranch="setSelectedBranch" />
                    </div>
                    <div class="col-md-6 mb-3">
                      <ProgressSpinner class="loader-icon" v-if="loading" />
                    </div>
                    <div class="col-12 col-md-6 col-lg-3" v-show="allEvents.length > 0">
                      
                        <div><label for="" class="font-weight-bold">Select Event</label></div>
                        <div>
                          <Dropdown  :options="allEvents" optionLabel="text" placeholder="Select event" class="w-100" v-model="selectedEvent" />
                            <!-- <MultiSelect v-model="selectedEvents" :options="allEvents" optionLabel="text" placeholder="Select Events" :filter="true" class="multiselect-custom w-100">
                                <template #value="slotProps">
                                    <div class="country-item country-item-value bg-secondary font-weight-bold small" v-for="option of slotProps.value" :key="option.code">
                                        <div>{{option.text}}</div>
                                    </div>
                                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                                        All Events
                                    </template>
                                </template>
                                <template #option="slotProps">
                                    <div class="country-item">
                                        <div>{{slotProps.option.text}}</div>
                                    </div>
                                </template>
                            </MultiSelect> -->
                        </div>

                    </div>
                    <div class="col-12 col-md-6 col-lg-3" v-show="allEvents.length > 0">
                        <div class=""><label for="" class=" ml-2 font-weight-bold">Start Date</label></div>
                        <div>
                            <div>
                                <Calendar id="icon" v-model="startDate" class="calendar1 w-100" :showIcon="true" dateFormat="dd/mm/yy" />
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3" v-show="allEvents.length > 0">
                        <div><label for="" class="font-weight-bold">End Date</label></div>
                        <div>
                            <Calendar id="icon" class="w-100" v-model="endDate" :showIcon="true" dateFormat="dd/mm/yy" />
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3" v-show="allEvents.length > 0">
                        <label for="" ></label>
                        <div class="mt-2">
                            <button @click="getActivityReport()" class="btn default-btn primary-bg "><div class="text-white">Generate Report</div></button>
                        </div>
                    </div>
                </div>
             <div id="element-to-print">
                 <h3 class="font-weight-bold mt-5 ml-2"  v-show="activityReport > 0"> SERVICE ANALYSIS REPORT </h3>

                 <div class=" borderInner mb-2">
                     <h5 class="ml-3 mt-4"></h5>
                         <div v-show="activityReport.length > 0" :class="{ 'show-report': showReport, 'hide-report' : !showReport}">
                        <PerformanceColumnChart
                            domId="chart"
                            title="Attendance Analysis Chart"
                            distance="5"
                            :titleMargin="10"
                            :data ="attendanceChart"
                            :series = "series"
                            :seriesText="`Attendance analysis`"

                        />
                        </div>
                 </div>
                 <div class="area-chart mt-5 lineGrap" v-show="activityReport.length > 0" :class="{ 'show-report': showReport, 'hide-report' : !showReport}" >
                      <ReportAreaChart
                        elemId="chart"
                        domId="areaChart1"
                        title="Attendance Analysis Line Graph"
                        subtitle=""
                        lineColor="#50AB00"
                        :xAxis="series"
                        :series="attendanceData"
                      />
                    </div>

                    <div class=" borderInner mt-5">
                     <h5 class="ml-3 mt-4"></h5>
                         <div v-show="activityReport.length > 0" :class="{ 'show-report': showReport, 'hide-report' : !showReport}">
                        <PerformanceColumnChart
                            domId="chart1"
                            title="Attendance Analysis Chart By Category"
                            distance="5"
                            :titleMargin="10"
                            :data ="summaryChart"
                            :series = "attendanceSeries"
                            :seriesText="`Attendance analysis`"

                        />
                        </div>
                 </div>
                 <!-- <div
                      class="area-chart mt-5"
                      v-show="
                        activityReport.length > 0
                      "
                    >
                      <ReportAreaChart
                        elemId="chart"
                        domId="areaChart"
                        title="Attendance Analysis Line Graph By Category"
                        subtitle=""
                       lineColor="#50AB00"
                        :xAxis="series"
                        :series="categoryData"
                      />
                    </div> -->
             <section>
                 <!-- table header -->

      <div class="container-fluid table-main px-0 remove-styles2 remove-border responsiveness mb-5 mt-5" id="table" v-show="activityReport.length > 0" :class="{ 'show-report': showReport, 'hide-report' : !showReport}">
        <table  class="table remove-styles mt-0 table-hover table-header-area">
          <thead class="table-header-area-main">
            <tr
              class="text-capitalize text-nowrap font-weight-bolder"
              style="border-bottom: 0"
            >
              <th scope="col">Event Name & Date</th>
              <th scope="col">Category</th>
              <th scope="col">Category Attendance</th>
            </tr>
          </thead>
          <tbody class="font-weight-bolder text-nowrap">
            <tr v-for="(item, index) in groupedActivityService" :key="index" >
              <td>{{ item.name}}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <div class="table-foot d-flex justify-content-end">
          <PaginationButtons />
        </div> -->
      </div>
      <!--end table header -->
      </section>
      </div>
    </div>
    <Toast />


</template>


<script>
import { computed, ref } from 'vue';
import PerformanceColumnChart from "../../../components/charts/ReportColumnChart.vue";
import groupData from '../../../services/groupArray/groupResponse';
// import MultiSelect from 'primevue/multiselect';

import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import ReportAreaChart from "../../../components/charts/AreaChart.vue";
import axios from "@/gateway/backendapi";
// import InputText from "primevue/inputtext"
import dateFormatter from "../../../services/dates/dateformatter.js"
import exportService from "../../../services/exportFile/exportservice"
import printJS from "print-js";
import Listbox from 'primevue/listbox';
import { useToast } from 'primevue/usetoast';
import BranchSelect from "../component/BranchSelect.vue"
import ProgressSpinner from 'primevue/progressspinner';
    export default {
        components:{
          Dropdown,
          Listbox,
          // MultiSelect,
            Calendar,
            // InputText,
            PerformanceColumnChart,
            ReportAreaChart,
            BranchSelect,
            ProgressSpinner

        },
    setup() {
    const toast = useToast()
    const showReport = ref(false);
    const fileName = ref("");
    const selectedFileType = ref("");
    const fileHeaderToExport = ref([])
    const fileToExport = ref([]);
    const bookTypeList = ref([ { name: 'xlsx' },{ name: 'csv'}, {name: 'txt'}, {name: 'pdf'} ]);
    const showExport = ref(false);
    const allEvents = ref([]);
    const selectedEvent =ref({})
    const series = ref([])
    const activityReport = ref([])
    const attendanceSeries = ref([])
    const startDate = ref('');
    const endDate = ref('');
    const attendanceData = ref([])
    const babiesData = ref([])
    const womenData = ref([])
    const maleData = ref([])
    const boyData = ref([])
    const girlData = ref([])
    const ChildrenData = ref([])
    const TeenagersData = ref([])
    const SinglesData = ref([])
    const mainAttendanceData = ref([])
    const categoryData = ref([])
    const attendanceGroup = ref({})
    const grousService = ref([])
    const groupedActivityService = ref([])
     const downloadFile = () => {
        exportService.downLoadExcel(selectedFileType.value.name, document.getElementById('element-to-print'), fileName.value, fileHeaderToExport.value, fileToExport.value)
      }
    const loading = ref(false)
    const branchId = ref("")

    const setSelectedBranch = async(payload) => {
      loading.value = true
      branchId.value = payload.id
      try {
        let { data } = await axios.get(`/api/BranchReports/events/Events?tenantID=${payload.id}`)
        loading.value = false
        console.log(data)
        allEvents.value = data
      }
      catch (err) {
        loading.value = false
        console.log(err)
      }
    }

  
     const getActivityReport = ()=> {
    
       activityReport.value = []
         axios.get(`/api/branchreports/event/getactivityanalysisreport?startDate=${new Date(startDate.value).toLocaleDateString("en-US")}&endDate=${new Date(endDate.value).toLocaleDateString("en-US")}&eventId=${selectedEvent.value.id}&tenantID=${branchId.value}`)
         .then((res)=>{
             activityReport.value = res.data;
             console.log(activityReport.value);
             mainAttendanceData.value = []
             attendanceData.value = []
             series.value = []
             groupCategory()
             groupName()
             categoryData.value = []
             getActivityServices()
             setTimeout(() => {
                        fileHeaderToExport.value = exportService.tableHeaderToJson(document.getElementsByTagName("th"))
                        fileToExport.value = exportService.tableToJson(document.getElementById("table"))
                    }, 1000)
                    showReport.value = true

              if (activityReport.value.length === 0) {
                toast.add({
                    severity: 'warn', 
                    summary:'No data for this date range', 
                    detail:'Select other parameters to generate report', 
                    life: 8000
                })
              }
          })
         .catch((err)=> console.log(err))
     };

     const groupCategory = () => {
        attendanceGroup.value = groupData.groupData(activityReport.value, 'attendanceCategory');
        const dateSeries = groupData.groupData(activityReport.value, 'date');
        for (const prop in dateSeries) {
                attendanceSeries.value.unshift(dateFormatter.monthDayYear(prop))
            }
            console.log(attendanceGroup.value)
            console.log(attendanceSeries.value)
            
     }
     const groupName = () =>{
       const result = groupData.groupData(activityReport.value, 'name');
        for (const prop in result) {
                grousService.value.push({
                name: prop,
                value: result[prop]
                })
            }
     
      grousService.value.forEach(i => {
        i.value.forEach(j => {
          groupedActivityService.value.push({
            name: i.name.split(",").join(""),
            category: j.attendanceCategory,
            amount: j.attendance
          })
        })
      })

     }

     const attendanceChart = computed(() => {
         if (activityReport.value.length === 0) return []
           activityReport.value.forEach(i => {
            let attendanceIndex = Object.keys(i).findIndex(i => i === 'attendance')
            let attendanceValue = Object.values(i)[attendanceIndex]
            attendanceData.value.unshift(attendanceValue)
         });

         mainAttendanceData.value.push({
             name: 'Attendance',
             color: '#f94144',
             data: attendanceData.value
         })
         return mainAttendanceData.value

     })
     const getActivityServices = () => {
           activityReport.value.forEach(i => {
            let serviceIndex = Object.keys(i).findIndex(i => i === 'date')
            let serviceValue = Object.values(i)[serviceIndex]
            series.value.unshift(dateFormatter.monthDayYear(serviceValue))
           })

     }

    const summaryChart = computed(() => {
         if (Object.keys(attendanceGroup.value).length === 0) return new Object()
         Object.entries(attendanceGroup.value).forEach(([key, value]) => {
              console.log(key, value)

              let newArr = []
              value.forEach(i => {
                  let valIndex = Object.keys(i).findIndex(i => i === 'attendance')
                  let attValue = Object.values(i)[valIndex]
                  newArr.unshift(attValue)
              })
              categoryData.value.push({
                      name: key,
                      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                      data: newArr
                  })
            })
            console.log(categoryData.value)
        return categoryData.value
      })

      const formatDate = (date) => {
        return dateFormatter.monthDayYear(date);
      };

        return{

            formatDate,
            startDate,
            endDate,
            selectedEvent,
            allEvents,
            activityReport,
           getActivityReport,
            series,
            attendanceSeries,
            attendanceChart,
            womenData,
            maleData,
            boyData,
            girlData,
            ChildrenData,
            TeenagersData,
            SinglesData,
            attendanceData,
            mainAttendanceData,
           categoryData,
            babiesData,
            summaryChart,
            attendanceGroup,
            grousService,
            showExport,
              printJS,
            downloadFile,
          bookTypeList,
          selectedFileType,
          fileHeaderToExport,
          fileToExport,
          fileName,
          showReport,
          groupedActivityService,
          setSelectedBranch,
          loading,
          branchId
        }

    }

    }

</script>

<style scoped>
* {
  box-sizing: border-box;
}
.table {
  width: 100% !important;
  box-shadow: 0 0.063rem 0.25rem #02172e45;
  border: 0.063rem solid #dde2e6;
  border-radius: 30px;
  text-align: left;
  margin-bottom: auto !important;
  padding-bottom: 0.9rem;
}

.table-header-area {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.table-header-area-main {
  background-color: #ebeff4;
}
/* .round-border{
   border-radius: 0.5rem;
   box-shadow: 0 0.063rem 0.25rem #02172e45;
   border: 0.063rem solid #dde2e6;
} */

.table-main {
    width: 100% !important;
    box-shadow: 0 0.063rem 0.25rem #02172e45 !important;
    border: 0.063rem solid #dde2e6 !important;
    border-radius: 30px !important;
    text-align: left !important;
    margin-bottom: auto !important;
    padding-bottom: 0.5rem !important;
}
.remove-styles{
    border: none !important;
    box-shadow: none !important;
    border-bottom: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.remove-styles2{
padding-right: 0;
padding-left: 0;
border-top-left-radius: 0 !important;
border-top-right-radius: 0 !important;
}

.remove-border{
    box-shadow: none !important;
}
.tablerow-style {
  min-width: 100%;
  border-bottom: 0px;
}

.graph-area{
    border: 1px solid #dde2e6;
    border-radius: 0.5rem;
    padding: 1rem 0rem;
    margin: 2rem 0rem;
}

.responsiveness{
  max-width: 100%;
  overflow-y: scroll;
}

.p-multiselect {
    width: 18rem;
}

.multiselect-custom {

        padding-top: .1rem;
        padding-bottom: .1rem;

}

    .country-item-value {
        padding: .25rem .5rem;
        border-radius: 3px;
        display: inline-flex;
        margin-right: .5rem;
        /* background-color:  */
        /* background-color: var(--primary-color); */
        /* color: var(--primary-color-text); */
    }
    .border{
    border-color:  #b0b2b5!important;
    border-radius: 15px!important;

    }
    .lineGrap{
   /* border-radius: 30px; */
   box-shadow: 0px 1px 4px #02172e45;
   padding: 20px;
   /* box-shadow: 0 0.063rem 0.25rem #02172e45;
   border: 0.063rem solid #dde2e6; */
       font-weight: bold;
    }
    .borderInner{
        width: 100%;
        /* height: 700px; */
    }
        img.flag {
            width: 17px;
        }
        .primary-bg{
            background-color: rgb(19, 106, 205)!important;
            border-style: none!important;
        };
        .p-button.p-button-icon-only{
            background-color: red!important;

        }


@media screen and (max-width: 640px) {
    .p-multiselect {
        width: 100%;
    }
}

.loader-icon {
    animation-duration: 0.8s;
    width: 47px;
}

.heading-text {
  font: normal normal 800 1.5rem Nunito sans;
}

</style>