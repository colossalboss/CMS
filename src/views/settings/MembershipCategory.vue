<template>
  <div>
    <div class="container mb-4">
      <div class="row d-md-flex justify-content-between mt-3 mb-5">
        <div class="col-md-12">
          <h2 class="memCat">Membership Category</h2>
        </div>
      </div>

      <div class="row grey-border pt-1 pb-5">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">
                  <h4 class="mt-2 mb-2 ml-5 memCat1">Membership Categories</h4>
                </div>
              </div>
              <!--prime Vue -->
              <Toast />
              <ConfirmDialog></ConfirmDialog>

              <div class="row">
                <div class="col-md-12 py-5 grey-background">
                  <div class="row d-md-flex justify-content-around">
                    <div class="col-md-7 col-sm-12">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Membership category name"
                        v-model="classificationTypes"
                      />
                    </div>
                    <div class="col-md-3 d-flex col-sm-12 justify-content-end">
                      <button class="btn primary-btn text-white bold  mt-sm-3 mt-lg-0 mt-xl-0 mt-md-0 mt-3 px-md-5 px-4 py-1" @click="saveMembership">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row table-header-row py-2 mt-5">
            <div class="col-md-7">
              <span class="py-2 font-weight-bold">NAME</span>
            </div>
            <div class="col-md-5 text-center">
              <span class="py-2 font-weight-bold mr-md-5 mr-0">ACTION</span>
            </div>
          </div>

          <div class="row py-2" v-for="(classification, index) in classifications" :key="index">
            <div class="col-md-12">
              <div class="row">
                <div
                  class="col-md-7 d-flex px-md-0 px-5 justify-content-between align-items-center  mb-md-0 mb-5"
                >
                  <span class="py-2 hidden-header">NAME</span>
                  <span class="py-2 text-xs-left mr-md-0 ml-md-3 mr-4">{{ classification.name }}</span>
                </div>
                <div
                  class="col-md-5 mb-md-0 mb-2 col-12 d-flex justify-md-content-end justify-content-start align-items-end"
                >
                  <span class="py-md-4 hidden-header hidden-header1">ACTION</span>
                  <div class="row">
                    <div class="col-md-6 col-6 d-flex justify-content-start">
                      <button class="btn secondary-btn py-1 px-4" @click="openClassification(index)">View</button>
                    </div>
                    <div class="col-md-6 col-6 d-flex justify-content-end">
                      <button class="delbtn py-1 primary-btn px-3" @click="deletePop(classification.id)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row grey-background py-2 mt-2" v-if="vissibleTab === `tab_${index}`">
                <div
                  class="col-md-7 d-flex justify-content-between align-items-center"
                >
                  <label for="" class="d-flex mt-4">
                    <span class="mr-2">Name</span>
                    <input type="text" class="form-control" v-model="classificationName">
                  </label>
                </div>
                <div
                  class="col-md-5 d-flex justify-content-end align-items-center"
                >
                  <div class="row mt-0">
                    <div class="col-md-6 col-6 d-flex justify-content-start">
                      <button class="btn primary-btn save-btn py-1 px-4 ml-md-0 ml-5" @click="updateMembership(classification.id, index)">Save</button>
                    </div>
                    <div class="col-md-6 col-6 d-flex justify-content-end">
                      <button class="btn secondary-btn py-1  px-3 bor" @click="discard">Discard</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 px-0">
                  <hr class="hr my-0" />
                </div>
              </div>
            </div>
          </div>
          <div class=" col-12 text-center p-5" v-if="loading">
             <i class="pi pi-spin pi-spinner text-center text-primary" style="fontSize: 3rem"></i>
         </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/gateway/backendapi";
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import finish from "../../services/progressbar/progress"

export default {
  components:{
     Toast,
    ConfirmDialog,
  },
  data() {
    return {
      classifications: [ ],
      vissibleTab: "",
      classificationName: "",
      memberClass:{},
      classificationTypes: "",
      loading: false
    }
  },

  methods: {
    async getClassifications() {
      try {
        this.loading = true
        const { data } = await axios.get("/api/Settings/GetTenantPeopleClassification");
        this.classifications = data;
        this.loading = false
      } catch (error) {
        console.log(error);
      }
    },
   //Membership save
    async saveMembership(){
      try{
        await axios.post('/api/Settings/CreateTenantPeopleClassification/' + this.classificationTypes);
        this.getClassifications()
        this.classificationTypes = ""
        this.$toast.add({severity:'success', summary: '', detail:' Membership Save Successfully', life: 3000});
      }catch(error){
        finish()
        console.log(error)
      }
    },
    async updateMembership(id, index){
      try{
        await axios.put('/api/Settings/UpdateTenantPeopleClassification', { name: this.classificationName, id:id});
        this.classifications[index].name = this.classificationName;
        this.discard()
        this.$toast.add({severity:'success', summary: '', detail:'Membership Updated Successfully', life: 3000});
      }catch (error){
        finish()
        console.log(error)
      }
    },
    async deleteMembership(id){
      try {
        let {data} = await axios.delete('/api/Settings/DeleteTenantPeopleClassification/'+id);
        console.log(data.status);
        if(data.status === false){
          this.$toast.add({severity:'error', summary: '', detail: 'This people classification you are trying to delete has been used to save contacts. You can not delete it. You can rename instead.', life: 9000})
        }else{
          this.classifications = this.classifications.filter(i => i.id !== id);
         this.$toast.add({severity:'success', summary: '', detail:'Membership Deleted Successfully', life: 3000});

        }
        
      } catch (error){
        finish()
        console.log(error);
      }
    },
     deletePop(id) {
            this.$confirm.require({
                message: 'Are you sure you want to Delete?',
                header: 'Delete Confirmation',
                icon: 'pi pi-exclamation-circle',
                acceptClass: 'confirm-delete',
                rejectClass: 'cancel-delete',
                accept: () => {
                  this.deleteMembership(id)
                    //callback to execute when user confirms the action
                },
                reject: () => {
                    'No internet'
                }
            });
        },

    openClassification(index) {
      this.vissibleTab = `tab_${index}`;
      this.classificationName = this.classifications[index].name;
    },

    discard() {
      this.vissibleTab = "";
    }
  },

  created() {
    this.getClassifications();
  }
};
</script>

<style scoped>
input::placeholder {
  text-align: center;
}

.table-header-row {
  background: #ebeff4;
  border-top: 1px solid #dde2e6;
  border-radius: 8px 8px 0 0;
}

.hidden-header {
  display: none;
}

.grey-background {
    background: #DDE2E6;
}

.save-btn {
  background: #50AB00;
}
.delbtn:hover{
    background-color:red!important;
    color: white!important;
  }
  .delbtn{
  background-color: #F2BC9E!important;
  color: black!important;
}
.delbtn:focus{
  outline: none!important;
  border: none!important;
}
 .memCat{
    font: var(--unnamed-font-style-normal) normal 800 34px/46px var(--unnamed-font-family-nunito-sans);
    letter-spacing: var(--unnamed-character-spacing-0);
    text-align: left;
    font: normal normal 800 34px/46px Nunito Sans;
    letter-spacing: 0px;
    color: #02172E;
    opacity: 1;
  }
  .memCat1{
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold) 24px/32px var(--unnamed-font-family-nunito-sans);
    letter-spacing: var(--unnamed-character-spacing-0);
    text-align: left;
    font: normal normal bold 24px/32px Nunito Sans;
    letter-spacing: 0px;
    color: #02172E;
    opacity: 1;
  }
  

@media screen and (max-width: 767px) {
  .hidden-header1{
    display: none!important;
  }
  .hidden-header {
    display: inline-block;
    font-weight: bold;
  }

  .table-header-row {
    display: none;
  }
  .bold:hover{
    color: white!important;
  }
  .bold{
    color: rgb(187, 176, 176)!important;
  }
  .bor{
    border: #02172E!important;
  }
  
}
@media screen and (max-width: 390px) {
  .memCat{
    font: var(--unnamed-font-style-normal) normal 500 20px/25px var(--unnamed-font-family-nunito-sans);
    letter-spacing: var(--unnamed-character-spacing-0);
    text-align: left;
    font: normal normal 800 20px/25px Nunito Sans;
    letter-spacing: 0px;
    color: #02172E;
    opacity: 1;
  }
   .memCat1{
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold) 18px/20px var(--unnamed-font-family-nunito-sans);
    letter-spacing: var(--unnamed-character-spacing-0);
    text-align: left;
    font: normal normal bold 18px/20px Nunito Sans;
    letter-spacing: 0px;
    color: #02172E;
    opacity: 1;
  }
  
  
}
</style>