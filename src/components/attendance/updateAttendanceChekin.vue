<template>
  <div class="container">
    <div
      class="row mt-5 border box-boundary py-3 c-pointer"
      v-if="contributionItems.length > 0"
      data-toggle="collapse"
      data-target="#collapseExampleOffering"
    >
      <div class="col-6 font-weight-700" style="font-size: 1.5em">
        Contributions
      </div>
      <div class="col-6 text-right align-self-center">
        <i class="pi pi-chevron-down"></i>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="collapse" id="collapseExampleOffering">
          <div class="card-body py-2 px-0">
            <div
              class="col-12 py-2 border-top"
              v-for="item in churchContributionItems"
              :key="item.id"
            >
              <div class="row">
                <div class="col-md-8 mt-3 align-self-center font-weight-700">
                  {{ item.name }}
                </div>
                <div class="col-md-4 mt-3 mt-md-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Amount"
                    v-model="item.amount"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row mt-3 border box-boundary py-3 c-pointer"
      data-toggle="collapse"
      data-target="#collapseExampleAttendance"
      v-if="attendanceType.length > 0"
    >
      <div class="col-10 font-weight-700" style="font-size: 1.5em">
        Summary attendance
      </div>
      <div class="col-2 text-right align-self-center">
        <i class="pi pi-chevron-down"></i>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="collapse" id="collapseExampleAttendance">
          <div class="card-body py-2 px-0">
            <div
              class="col-12 py-2 border-top"
              v-for="item in churchAttendanceCategory"
              :key="item.id"
            >
              <div class="row">
                <div class="col-md-8 mt-3 align-self-center font-weight-700">
                  {{ item.name }}
                </div>
                <div class="col-md-4 mt-3 mt-md-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Count"
                    v-model="item.number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row mt-3 border box-boundary py-3 c-pointer"
      data-toggle="collapse"
      data-target="#collapseExampleOther"
      v-if="dynamicCustomFields.length > 0"
    >
      <div class="col-10 font-weight-700" style="font-size: 1.5em">
        Other Information
      </div>
      <div class="col-2 text-right align-self-center">
        <i class="pi pi-chevron-down"></i>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="collapse" id="collapseExampleOther">
          <div class="card-body py-2 px-0">
            <div
              class="col-12 py-2 border-top"
              v-for="item in attendanceCustomField"
              :key="item.id"
            >
              <div class="row">
                <div class="col-md-8 mt-3 align-self-center font-weight-700">
                  {{ item.label }}
                </div>
                <div class="col-md-4 mt-3 mt-md-0">
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="item.label"
                    v-model="item.number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <textarea
        class="form-control"
        rows="5"
        placeholder="Enter your note here"
        v-model="note"
      ></textarea>
    </div>
    <div class="row d-flex justify-content-center my-4 c-pointer">
      <div
        class="default-btn primary-bg border-0 text-white text-center"
        @click="updateAttendanceCheckin"
      >
        Save
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "@vue/runtime-core";
import axios from "@/gateway/backendapi";
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";
import router from "../../router";
import allCustomFields from "../../services/customfield/customField";
export default {
  props: ["contributionItems", "attendanceType", "groupDetail"],
  setup(props) {
    const note = ref("");
    const toast = useToast();
    const route = useRoute();
    const dynamicCustomFields = ref([]);
    const churchContributionItems = computed(() => {
      if (
        props.groupDetail &&
        props.groupDetail.offerings &&
        props.groupDetail.offerings.length == 0
      )
        return props.contributionItems;
      if (
        props.groupDetail &&
        props.groupDetail.offerings &&
        props.groupDetail.offerings.length > 0 &&
        props.contributionItems.length > 0
      )
        return props.contributionItems.map((i) => {
          const y = props.groupDetail.offerings.findIndex(
            (j) => j.financialContributionID == i.id
          );
          if (y >= 0) {
            i.amount = props.groupDetail.offerings[y].amount;
            i.contributionAttendanceID = props.groupDetail.offerings[y].id;
          }
          return i;
        });
    });

    const churchAttendanceCategory = computed(() => {
      if (
          props.groupDetail &&
          props.groupDetail.attendances &&
          props.groupDetail.attendances.length == 0
      ) return props.attendanceType
      if (
        props.groupDetail &&
        props.groupDetail.attendances &&
        props.groupDetail.attendances.length > 0 &&
        props.attendanceType.length > 0
      )
        return props.attendanceType.map((i) => {
          const y = props.groupDetail.attendances.findIndex(
            (j) => j.attendanceTypeID == i.id
          );
          console.log(y, props.groupDetail.attendances[y].number);
          if (y >= 0) {
            i.number = props.groupDetail.attendances[y].number;
            i.attendanceTypeAttendanceID = props.groupDetail.attendances[y].id;
          }
          return i;
        });
    });
    
    const attendanceCustomField = computed(() => {
      if (
          props.groupDetail &&
          props.groupDetail.customAttributeData &&
          props.groupDetail.customAttributeData.length == 0
      ) return dynamicCustomFields.value
      if (
        props.groupDetail &&
        props.groupDetail.customAttributeData &&
        props.groupDetail.customAttributeData.length > 0 &&
        dynamicCustomFields.value.length > 0
      )
        return dynamicCustomFields.value.map((i) => {
          const y = props.groupDetail.customAttributeData.findIndex(
            (j) => j.customAttributeID == i.id
          );
          if (y >= 0) {
            i.number = props.groupDetail.customAttributeData[y].data;
            // i.attendanceTypeAttendanceID = props.groupDetail.attendances[y].id;
          }
          return i;
        });
    });

    // const computedNote = computed(() => {
    //   if (!props.groupDetail && Object.keys(props.groupDetail).length == 0) return 
    //   return props.groupDetail.note
    // })

    watchEffect(() => {
      if (props.groupDetail && Object.keys(props.groupDetail).length > 0) {
        note.value = props.groupDetail.note;
        console.log(props.groupDetail, 'hereee')
      }else {
        console.log('ddddd')
      }
    });

    const updateAttendanceCheckin = async () => {
      let body = {
        eventName: props.groupDetail.eventName,
        eventDate: props.groupDetail.eventDate,
        details: props.groupDetail.details,
        status: props.groupDetail.status,
        title: props.groupDetail.title,
        bannerImage: props.groupDetail.bannerImage,
        id: props.groupDetail.id,
        offerings: props.contributionItems.map((i) => {
          return {
            id: i.contributionAttendanceID,
            financialContributionID: i.id,
            amount: i.amount ? Number(i.amount) : 0,
          };
        }),
        attendances: props.attendanceType.map((i) => {
          return {
            id: i.attendanceTypeAttendanceID,
            attendanceTypeID: i.id,
            number: i.number ? Number(i.number) : 0,
          };
        }),
        customAttributeData: dynamicCustomFields.value.map((i) => {
          return {
            customAttributeID: i.id,
            data: i.number,
            entityID: route.query.id,
          };
        }),
        note: note.value,
      };
      console.log(body);
      try {
        let data = await axios.put(
          "/api/CheckInAttendance/UpdateCheckInAttendance",
          body
        );
        console.log(data);
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Updated successfully",
          life: 3000,
        });

        if (route.fullPath.includes("/tenant/takeattendance")) {
          setTimeout(() => {
            router.push("/tenant/groupleader");
          }, 3000);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getAllCustomFields = async () => {
      try {
        let data = await allCustomFields.allCustomFields();
        console.log(data);
        dynamicCustomFields.value = data.filter((i) => i.entityType === 5);
      } catch (err) {
        console.log(err);
      }
    };
    getAllCustomFields();

    return {
      churchContributionItems,
      churchAttendanceCategory,
      updateAttendanceCheckin,
      note,
      dynamicCustomFields,
      attendanceCustomField
    };
  },
};
</script>

<style scoped>
.box-boundary {
  box-shadow: 0px 3px 6px #2c28281c;
  background: #eee;
}
</style>