<template>
  <div
    class=" row w-100  text-dark "
    style="margin: 0"
    
  >
    <div class="col-md-12 desc">
      <p class="">
        <span
          class="text-dark font-weight-bold d-flex d-md-none fontIncrease"
          style="font-size: 15px"
          >Group Name</span
          
        >
        <ul class="p-0 w-100">
        <li v-for="(group, index) in items" :key="index" class="p-2  c-pointer parent-li border-top exempt-hide">
          <div class="row exempt-hide justify-content-between">
            <div class="text-primary exempt-hide" >
              <span>
                <i class="pi pi-chevron-down roll-icon exempt-hide ml-4"  v-if="group.children && group.children.length > 0" @click="toggleItems(group, $event)"></i>
              </span>
              <span class="text-primary exempt-hide" @click="groupClick(group, $event)">
                <span class="p-3 exempt-hide">{{ group.name }}</span>
              </span>
            </div>
            
            <div class="col-3 text-primary" @click="groupClick(group.id)">
              <div @click="groupClick(group.id)">
                <div class="d-flex small justify-content-between text-primary">
                  <span class="text-dark font-weight-bold d-flex d-md-none fontIncrease" style="font-size:15px">Membership Size</span>
                    <div class="small-text text-right text-md-center">
                      {{ group.peopleInGroupsCount }}
                    </div>
                </div>
              </div>
            </div>
            <div class=" d-flex justify-content-end">
              <!-- <i class="pi pi-trash text-danger" @click="removeSubGroup(group, $event)"></i> -->
        
                      <div>
                        <div class="dropdown">
                          <span class="d-flex justify-content-between">
                            
                            
                              <i
                                class="
                                  fas
                                  fa-ellipsis-v
                                  cursor-pointer
                                  ml-2
                                  fontIncrease
                                "
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              ></i>

                              <div
                                class="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <a class="dropdown-item">
                                  <a
                                    @click="sendGroupSms(group)"
                                    >Send SMS</a>
                                </a>
                                <a class="dropdown-item" @click="sendGroupEmail(group)">
                                    Send Email
                                </a>
                                <a
                                  class="dropdown-item"
                                  @click="confirmDelete(group.id, index)"
                                  >Delete</a
                                >
                              </div>
                          
                          </span>
                        </div>
                      </div>
                 
            </div>
          </div>
            <div class="d-none"  @click="checkForGroup(group, $event)">
            <GroupTree
                :items="group.children"
                v-if="group.children"
                :class="{ 'd-none' : !showCheckBox }"
                
              /> 
            </div>                   
        </li>
        <li class="shadow-sm text-center border p-2 font-weight-700 c-pointer" @click="openCreateGroupModal" v-if="onDropDown">
          <i class="pi pi-plus-circle"></i>&nbsp;Add new group
        </li>
        </ul>
      </p>
    </div>
  </div>

  <Dialog header="Create group" v-model:visible="displayCreateGroup"  style="width: 450px" :breakpoints="{'960px': '75vw'}" :modal="true">
      <div class="row">
        <div class="col-12">
          <div class="mb-1">Group name<sup class="text-danger">*</sup></div>
          <input class="form-control" v-model="newGroup.name" required/>
        </div>
        <div class="col-12 mt-4">
          <div class="mb-1">Description</div>
          <textarea class="form-control" rows="4" v-model="newGroup.description"></textarea>
        </div>
      </div>
      <template #footer>
          <div class="d-flex justify-content-end">
            <div class="default-btn text-center c-pointer" @click="displayCreateGroup = false">Cancel</div>
            <div class="ml-3 default-btn border-0 text-white primary-bg text-center c-pointer" @click="createGroup"><i class="pi pi-spin pi-spinner" v-if="createGroupLoading"></i>&nbsp;Create group</div>
          </div>
      </template>
  </Dialog>
  <Toast />

  <Sidebar v-model:visible="showSMS" :baseZIndex="10000" position="right">
        <smsComponent :groupData ="groupListDetails" @closesidemodal="() => showSMS = false" />
    </Sidebar>

  <Sidebar v-model:visible="showEmail" :baseZIndex="10000" position="right">
        <emailComponent :groupData ="groupListDetails"  @closesidemodal="() => showEmail = false" />
    </Sidebar>
</template>

<script>
import Dialog from "primevue/dialog";
import { ref } from "@vue/reactivity";
import { useToast } from "primevue/usetoast";
import axios from "@/gateway/backendapi";
import { watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useConfirm } from "primevue/useconfirm";
import { onBeforeRouteLeave } from "vue-router";
import Sidebar from "primevue/sidebar";
import smsComponent from "../component/smsComponent.vue";
import emailComponent from "../component/emailComponent.vue";
import groupsService from "../../../services/groups/groupsservice";
export default {
  name: "GroupTree",
  props: ["items", "addGroupValue", "showCheckBox"],
  emits: ["group", "groupp", "closemodal"],
  inheritAttrs: false,
  components: {
    Dialog,
    Sidebar,
    smsComponent,
    emailComponent,
  },
  setup(props, { emit }) {
    const store = useStore();
    const confirm = useConfirm()
    const displayCreateGroup = ref(false);
    const newGroup = ref({});
    const toast = useToast();
    const onDropDown = ref(false);
    const createGroupLoading = ref(false);
    const showSMS = ref(false);
    const showEmail = ref(false);
    const groupListDetails = ref([]);

    const toggleItems = (i, e) => {
      e.target.classList.toggle("roll-icon");
      if (
        e.target.parentElement.parentElement.parentElement.nextElementSibling.classList.contains(
          "d-none"
        )
      ) {
        e.target.parentElement.parentElement.parentElement.nextElementSibling.classList.replace(
          "d-none",
          "d-block"
        );
      } else {
        e.target.parentElement.parentElement.parentElement.nextElementSibling.classList.replace(
          "d-block",
          "d-none"
        );
      }
    };

    const groupClick = (group, e) => {
      store.dispatch("groups/setSelectedTreeGroupList", group);
      store.dispatch("groups/setSelectedTreeGroup", group);
      emit("group", { selectedGroup: group, iconElement: e.target });
    };

    watchEffect(() => {
      if (props.addGroupValue) {
        onDropDown.value = true;
      }
    });

    const checkForGroup = (group, e) => {
      console.log(group);
      let grouped = group.children.find((i) => i.name == e.target.textContent);
      // emit("group", grouped);
      emit("group", { selectedGroup: grouped, iconElement: e.target });
    };

    const openCreateGroupModal = () => {
      displayCreateGroup.value = true;
      emit("closemodal");
    };

    const createGroup = async () => {
      createGroupLoading.value = true;
      try {
        let { data } = await axios.post("/api/CreateGroup", newGroup.value);
        createGroupLoading.value = false;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Group created successfully",
          life: 4000,
        });
        displayCreateGroup.value = false;
        console.log(data);
      } catch (err) {
        createGroupLoading.value = false;
        console.log(err);
      }
    };

    onBeforeRouteLeave(() => {
      store.dispatch("groups/setSelectedTreeGroupList", {});
      store.dispatch("groups/setSelectedTreeGroup", {});
    });

    const sendGroupSms = (group) => {
      showSMS.value = true;
      if (group.id) {
        groupListDetails.value = [{ data: `group_${group.id}` }];
      }
    };
    const sendGroupEmail = (group) => {
      showEmail.value = true;
      if (group.id) {
        groupListDetails.value = [{ data: `group_${group.id}` }];
      }
    };

    const confirmDelete = (id, index) => {
      confirm.require({
        message: "Do you want to delete this group?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClass: "confirm-delete",
        rejectClass: "cancel-delete",
        accept: () => {
          try {
            groupsService.deleteGroup(id).then((res) => {
              console.log(res, "Delete Response");
              if (res !== false) {
                groups.value.splice(index, 1);
                store.dispatch("groups/getGroups");
                toast.add({
                  severity: "success",
                  summary: "Deleted",
                  detail: "Group was deleted",
                  life: 3000,
                });
                groupsService.removeGroupFromStore(id);
              }
            });
          } catch (error) {
            console.log(error);
          }
        },
        reject: () => {},
      });
    };

    return {
      toggleItems,
      groupClick,
      checkForGroup,
      openCreateGroupModal,
      displayCreateGroup,
      newGroup,
      createGroup,
      onDropDown,
      createGroupLoading,
      sendGroupSms,
      sendGroupEmail,
      showSMS,
      showEmail,
      groupListDetails,
      confirmDelete,
    };
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
}

li li:hover {
  /* border: 2px solid red; */
  background: rgba(224, 223, 223, 0.46);
}

.node-height {
  height: 0px;
  overflow: hidden;
  /* transition: all .5s ease-in-out; */
}

.node-height-open {
  height: 100%;
  overflow: hidden;
  /* transition: all .5s ease-in-out; */
}

.roll-icon {
  transform: rotate(-90deg);
  /* transition: all .5s ease-in-out; */
}

.fa-ellipsis-v:hover {
  cursor: pointer;
}

.fa-ellipsis-v {
  padding: 10px;
}
</style>