
<template>
<!-- To whoever will update this page -->
<!-- This page is the online giving platform for the IFrame version -->

<!-- It similar to the Online Giving in churchplus, with few differences in styles. -->

<!-- The logic is quite the same, so any changes made to this page should be made in the main Online Giving Page which is GivingForm4.vue, except the changes that is to be made is specific for the Iframe version -->

<!-- Bless you :)-->

  <div>
    <!-- nav section area -->
    <div class="container-fluid nav-color">
      <div class="container">
      
      </div>
    </div>
    <!--end of nav section area -->
    
        <div class="container-fluid">
            <div class="row mt-4">
                <div class="col-sm-10 col-md-8 mx-auto  pt-1">
                    <div class="row">
                      <div class="col-8">{{ formResponse.churchName }}</div>
                      <div class="col-4 d-flex justify-content-end">
                        <div href="#" style="cursor: pointer" class="mr-3" @click="checkForToken"
                          >{{ Object.keys(userData).length > 0 ? userData.email ? userData.email : userData.name : "Sign In"}} <i class="fas fa-user text-white" v-if="signedIn"></i
                      ></div>
                      <div href="#" style="cursor: pointer" @click="signOut" v-if="signedIn"
                        >
                        Sign Out
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- body area -->
    <div class="container-fluid">
      <div class="row mx-0">
        <div class="col-12 px-0">
            <div class="row d-flex justify-content-center">
              <div class="col-6">
                <p class="text-center pt-2 main-font">Giving</p>
              <!-- <p class="text-center mt-n3 sub-main-font">
                Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you.”
              </p>
              <p class="text-center">- Luke 6:38 NIV</p> -->
              </div>
            </div>

            <!-- form area -->
            <div>
              <div class="row px-4">
                <div class="col-md-3 d-sm-none"></div>
              <transition name="move" mode="out-in">
                <div
                  class="col-sm-10 col-md-8 mx-auto form-area shadow p-md-5 mb-5 bg-white rounded MIDDLE"
                  v-if="!paymentSuccessful"
                  key="form"
                >
                  <div class="row">
                    <div class="col-12 my-3 pr-md-0">
                      <label class="hfont">Currency</label>

                       <Dropdown
                            v-model="dfaultCurrency"
                            :options="currencyInput"
                            optionLabel="shortCode"
                            :placeholder="dfaultCurrency.shortCode"
                            class="w-100 px-0"
                          />
                    </div>
                    <div class="col-12 my-3">
                      <label class="hfont">Purpose</label>

                      <Dropdown
                        v-model="selectedContributionType"
                        :options="formResponse.contributionItems"
                        optionLabel="financialContribution.name"
                        placeholder="Select"
                        class="w-100 px-0"
                      />
                      
                    </div>
                    <div class="col-12 my-3">
                      <label class="hfont">Amount</label>

                      <input
                            class="form-control col-md-12 text-left imp1 border"
                            type="text"
                            v-model="amount"
                            placeholder="Amount"
                          />
                    </div>
                  </div>


                  <!-- start of dynamic Area 1-->
                  <div class="row" v-if="false">
                    <div class="col-md-12">
                      <section>
                        <p class="col-12 hfont px-0 mb-1">
                          How often do you give:
                        </p>

                        <div class="col-12 mt-1 imp1">
                          <div class="row border rounded">
                            <div
                              class="col-md-6 fone p-3 text-center borderl header-color1"
                              :class="{ 'header-color': hideTabOne }"
                              @click="toggleTabOne"
                            >
                              <span><i class="fas fa-donate"></i></span>&nbsp;
                              Give One Time
                            </div>
                            <div
                              class="col-md-6 p-3 fone text-center btn-default header-color1"
                              :class="{ 'header-color': !hideTabOne }"
                              @click="toggleTabTwo"
                            >
                              <span
                                ><i class="fas fa-redo-alt"></i> &nbsp; Set Up
                                Recurring</span
                              >
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  <!-- end of dynamic Area 1-->

                  <!-- start of dynamic Area 2-->
                  <div class="row">
                    <div class="col-md-12">
                      <section class="col-md-12 mt-3 px-0" v-if="!hideTabOne">
                        <p class="col-10 hfont px-0 mb-1">Frequency:</p>

                        <div class="col-12 mt-1">
                          <div class="row border rounded">
                            <div
                              :class="{ 'header-color': oftenGive1 }"
                              class="col-md-3 fone p-2 text-center header-color1 borderl"
                              @click="givingOften"
                            >
                              Every Week
                            </div>
                            <div
                              :class="{ 'header-color': oftenGive2 }"
                              class="col-md-3 fone p-2 header-color1 text-center borderl"
                              @click="givingOften"
                            >
                              Every 2 Week
                            </div>
                            <div
                              :class="{ 'header-color': oftenGive3 }"
                              class="col-md-3 fone p-2 header-color1 text-center borderl"
                              @click="givingOften"
                            >
                              Every month
                            </div>
                            <div
                              class="col-md-3 p-2 fone text-center header-color1"
                              @click="givingOften"
                              :class="{ 'header-color': oftenGive4 }"
                            >
                              1st and 15th monthly
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  <!-- end of dynamic Area 2 -->

                  <!-- start of date area -->
                  <section class="col-md-12 mt-3 px-0" v-if="!hideTabOne">
                    <div class="row">
                      <p class="col-6 py-0 ml-1 hfont">Starting</p>
                      <div class="col-md-6 d-flex flex-row mt-n2">
                        <input
                          type="date"
                          class="form-control fone p-3 imp1"
                          v-model="date"
                        />
                      </div>
                    </div>
                  </section>
                  <!-- end of date area -->
                  <div class="col-12" v-if="false">
                  <div class="row mt-4 stroke" v-if="!signedIn" >
                    <!-- <div class="col-1">
                     
                    </div> -->
                    <div class="col-6 align-self-center pointer" :class="{ 'active-tab' : activeTab1 }" @click="toggleActive1">
                    <div class="p-2 fone">Give Now</div>
                    </div>
                    <div class="col-6 align-self-center pointer" :class="{ 'active-tab' : activeTab2 }" @click="toggleActive2">
                      <div class="p-2 fone">Sign In</div>
                    </div>
                  </div>
                  </div>

                  <div class="col-12 d-flex align-items-center mt-3 p-0" v-if="!signedIn && !activeTab2">
                    <Checkbox id="binary" v-model="checked" :binary="true" />
                    <label for="binary" class="mb-0 pl-3">
                      Give as anonymous
                    </label>
                  </div>
                  <!-- start of user credentials area -->
          
                    <transition name="fade">
                      
                  <div class="col-12" v-if="!checked">
                    <div class="row d-flex">
                    
                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-md-12 mx-auto my-2 px-0 px-2">
                          <label class="hfont">Name</label>
                          <input
                            class="form-control col-md-12 text-left border imp1"
                            type="text"
                            placeholder="Enter your name"
                            v-model="name"
                          />
                      </div>
                      </div>
                    </div>


                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-md-12 mx-auto my-2 px-0 px-2">
                          <label class="hfont">Phone Number</label>
                          <input
                            class="form-control col-md-12 text-left border imp1"
                            type="text"
                            v-model="phone"

                          />
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  </transition>
  
                   <div class="col-12" v-if="activeTab2 && !signedIn">
                    <div class="row d-flex" v-if="showSignInForm">
                    
                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-md-12 mx-auto my-2 px-0 px-2">
                          <label class="hfont">Email</label>
                          <input
                            class="form-control col-md-12 text-left border imp1"
                            type="email"
                            v-model="signInEmail"                     
                          />
                      </div>
                      </div>
                    </div>


                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-md-12 mx-auto my-2 px-0 px-2">
                          <label class="hfont">Password</label>
                          <input
                            class="form-control col-md-12 text-left border imp1"
                            type="password"
                            v-model="signInPassword"
                           />
                        </div>
                      </div>
                      </div>
                      <div class="col-sm-12 mt-3">
                        <div class="d-flex justify-content-center">
                          <div class="button signin-color text-center w-25" @click="signin">Sign in</div>
                        </div>
                        <div class="label mt-3 text-center hfont">
                          Not registered yet?
                          <a href="#" class="text-primary" @click.prevent="showSignInForm = false">Create a new account</a>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-else>
                      <SignUp :tenantId="formResponse.tenantID" @signed-up="signedUp" @show-signin="displaySignInForm"/>
                    </div>
                  </div>
                  
                  
                    <div class="col-md-12">
                      <section
                        class="col-10 offset-1 mt-3 px-0"
                        v-if="!hideTabOne || hideTabOne"
                      >
                        <!-- button section -->
                        <div class="row my-3">
                          <div class="col-md-12 text-center mt-4">
                            <button
                              @click="convertAmount"
                              data-toggle="modal"
                              data-target="#PaymentOptionModal"
                              class="btn btn-default btngive default-color hfontb btt"
                            >
                              Give Now
                            </button>
                          </div>
                        </div>
                        <!--end of button section -->
                      </section>
                      <!-- <button type="button" class="btn btn-primary" >
            Launch demo modal
          </button> -->
                    <!-- Modal -->
                    <div class="modal fade" id="PaymentOptionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                          <div class="modal-header bg-modal">
                            <h5 class="modal-title" id="exampleModalLongTitle">Payment methods</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true" ref="close">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body p-0 bg-modal pb-5">
                            <PaymentOptionModal :orderId="formResponse.orderId" :donation="donationObj" :close="close" :name="name" :amount="amount" :converted="computeAmount" :email="email" @payment-successful="successfulPayment" :gateways="formResponse.paymentGateWays" :currency="dfaultCurrency.shortCode" @selected-gateway="gatewaySelected" @transaction-reference="setTransactionReference" @paystack-amount="setPaystackAmount" :churchLogo="formResponse.churchLogo" :churchName="formResponse.churchName"/>
                          </div>
                          <!-- <div class="modal-footer bg-modal">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                          </div> -->
                          </div>
                        </div>
                      </div>
                    </div>

        
                  <!-- end of dynamic Area 3 -->
                </div>
                <div
                  class="col-sm-10 col-md-8 mx-auto form-area shadow pt-5 mb-5 bg-white rounded MIDDLE"
                  v-else 
                  key="success"
                >
                  <div class="row">
                    <div class="col-2 offset-5"><img src="../../../assets/smile.jpg" class="w-100"></div>
                    <div class="col-12 stylish-text primary-text text-center">
                      
                      Thank You
                    </div>
                    <div class="col-12 font-weight-700 text-center p-5 mt-4 primary-bg text-white success-card">Your transaction has been successful. God Bless You!</div>
                  </div>
                </div>
              </transition>



              </div>

              <!-- payment Methods area -->
              <div class="container mt-n1">
                <div class="row">
                  <div class="col-md-3 d-sm-none d-md-block"></div>
                  <div class="col-md-6 d-flex justify-content-center">
                    <div class="col-1 px-1 ml-2">
                      <img
                        class="w-100"
                        src="../../../assets/2flutterwave.png"
                        alt=""
                      />
                    </div>
                    <div class="col-1 px-1">
                      <img
                        class="w-100"
                        src="../../../assets/1s519863150871.png"
                        alt=""
                      />
                    </div>
                    <div class="col-3 px-1">
                      <img
                        class="imgg w-100"
                        src="../../../assets/4PaystackLogo.png"
                        alt=""
                      />
                    </div>
                    <div class="col-1 px-0">
                      <img
                        class="w-100"
                        src="../../../assets/5visa_PNG30.png"
                        alt=""
                      />
                    </div>
                    <div class="col-1 px-1">
                      <img
                        class="w-100"
                        src="../../../assets/3MasterCard500.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="col-md-3 d-sm-none d-md-block"></div>
                </div>
              </div>
              <!-- payment Methods area -->
              <!-- Footer area -->
              <div class="container mt-5">
                <div class="row">
                  <div class="col-md-6 offset-md-3">
                    <div class="row hfont">
                      <p class="text-nowrap col-12 text-center">
                        Churchplus <span>Terms & Conditions </span
                          > and
                          <span>Privacy Policy </span>
                        </p>
                        <p class="mt-n2 col-12 text-center text-wrap">
                          Organization Legal Name: {{ formResponse.churchName }} 
                        </p>
                     
                      <div class="col-md-4 offset-5 px-0">
                        <img
                          class="logo img-fluid mb-5"
                          src="../../../assets/logoblue.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3"></div>
                </div>
              </div>
              <!--End of Footer area -->
              <!-- end of form area -->
            </div>
        </div>
      </div>
      <!--end of body area -->
    </div>
    <Toast />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Dropdown from "primevue/dropdown";
import axios from "@/gateway/backendapi";
import PaymentOptionModal from "./PaymentOptionModal";
import Checkbox from "primevue/checkbox";
import { useRoute, useRouter } from "vue-router";
import finish from "../../../services/progressbar/progress"
import { useToast } from "primevue/usetoast";
import SignUp from "./SignUp"
import convertCurrency from "../../../services/currency-converter/currencyConverter"
import { useStore } from "vuex"
export default {
  components: {
    PaymentOptionModal,
    Checkbox,
    SignUp
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    let toast = useToast();
    const store = useStore()
    const hideTabOne = ref(true);

    const toggleTabOne = () => {
      hideTabOne.value = true;
    };
    const toggleTabTwo = () => {
      hideTabOne.value = false;
    };

    const formResponse = ref({});
    const selectedContributionType = ref({});
    const funds = ref([]);

    const dfaultCurrency = ref("");
    const currencyInput = ref([]);

    const date = ref(new Date().toISOString().substr(0, 10));
    const oftenGive1 = ref(false);
    const oftenGive2 = ref(false);
    const oftenGive3 = ref(false);
    const oftenGive4 = ref(false);
    const amount = ref("")
    const name = ref("")
    const phone = ref("")
    const email = ref("anonymous@churchplus.co")
    const checked = ref(true)
    // const donationObj = ref({})
    const close = ref("")
    const paymentSuccessful = ref(false)
    const userData = ref({})
    const signedIn = ref(false)
    const activeTab1 = ref(true)
    const activeTab2 = ref(false)
    const signInEmail = ref("")
    const signInPassword = ref("")
    const routeParams = ref(`${route.params.userId}`)
    const showSignInForm = ref(true)
    const tenantCurrency = ref("")
    const convertedAmount = ref(0)

    const computeAmount = computed(() => {
        if (convertedAmount.value) return convertedAmount.value
        return amount.value
    })

    const givingOften = (e) => {
      console.log(e.target.innerText);
      // e.target.classList.add("default-color");
      // console.log(e.target.siblingElement);
      if (e.target.innerText == "Every Week") {
        oftenGive1.value = true;
        oftenGive2.value = false;
        oftenGive3.value = false;
        oftenGive4.value = false;
      } else if (e.target.innerText == "Every 2 Week") {
        oftenGive2.value = true;
        oftenGive1.value = false;
        oftenGive3.value = false;
        oftenGive4.value = false;
      } else if (e.target.innerText == "Every month") {
        oftenGive3.value = true;
        oftenGive1.value = false;
        oftenGive2.value = false;
        oftenGive4.value = false;
      } else {
        oftenGive4.value = true;
        oftenGive1.value = false;
        oftenGive2.value = false;
        oftenGive3.value = false;
      }
    };

    // getting contribution items
    const addfunds = () => {
      axios
        .get(
          // "/api/PaymentForm/GetOne?paymentFormID=4a276e37-a1e7-4077-a851-60b82180f4a0"
          `/give?paymentFormID=${route.params.userId}`
        )
        .then((res) => {
          // funds.value = res.data.contributionItems;
          // console.log(funds.value, "kjjjhjjjje");
          console.log(res.data);
          formResponse.value = res.data;
          selectedContributionType.value = formResponse.value.currencyId;
          console.log(formResponse.value);
          localStorage.setItem('tenantId', res.data.tenantID)
          tcurrency();
        })
        .catch((err) => {
          console.log(err.response)
          finish()
        });
    };
    addfunds();

    // getting currency
    const tcurrency = () => {
      axios
        .get("/api/LookUp/GetAllCurrencies")
        .then((res) => {
          currencyInput.value = res.data;
          console.log(res);
          for (let i = 0; 1 < res.data.length; i++) {
            if (formResponse.value.currencyId === res.data[i].id) {
              console.log(res.data[i], "foundddd");
              dfaultCurrency.value = res.data[i];
            } else {
              console.log("not found");
            }
          }
        })
        .catch((err) => console.log(err.response, "You know me! yes gang"));
    };
    

    const getRates = async() => {
            try {
                let { data } = await axios.get('/fxRates')
                console.log(data)
                store.dispatch("getRates", data)
            }   catch (error) {
                    console.log(error);
            }
        }
    getRates()

    const donationObj = computed(() => {
      if (selectedContributionType.value && selectedContributionType.value.financialContribution) return {
            paymentFormId: formResponse.value.id,
            churchLogoUrl: formResponse.value.churchLogo,
            churchName: formResponse.value.churchName,
            tenantID: formResponse.value.tenantID,
            merchantID: formResponse.value.merchantId,
            orderID: formResponse.value.orderId,
            currencyID: dfaultCurrency.value.id,
            paymentGateway: formResponse.value.paymentGateWays,
            contributionItems: [
                        {
                          contributionItemId: selectedContributionType.value.financialContribution.id,
                          contributionItemName: selectedContributionType.value.financialContribution.name,
                          amount: amount.value,
                          contributionCurrencyId: dfaultCurrency.value.id
                        }
            ],
            contributionItem: selectedContributionType.value.financialContribution.id

          }
          return {}
    })

    const convertAmount = async() => {
      try {
        let { data } = await axios.get(`/api/Lookup/TenantCurrency?tenantID=${formResponse.value ? formResponse.value.tenantID : ""}`)
        tenantCurrency.value = data.currency
      }

      catch (err) {
        console.log(err)
      }
          // Heres where im converting the currenccy
          try {
            let fromCurrencyRate = `usd${dfaultCurrency.value.shortCode.toLowerCase()}`
            let toDestinationCurrencyRate = `usd${tenantCurrency.value.toLowerCase()}`
            const result = await convertCurrency.currencyConverter(amount.value, fromCurrencyRate, toDestinationCurrencyRate)
            console.log(amount.value, fromCurrencyRate, toDestinationCurrencyRate)
            console.log(result)
            convertedAmount.value = Math.round(result)
          }
          catch (err) {
            console.log(err)
          }
    }

    const donation = async() => {
          
     
          if(localStorage.getItem('giverToken') !== "" || localStorage.getItem('giverToken') !== null || localStorage.getItem('giverToken')) {
              donationObj.value.name = userData.value.name
              donationObj.value.email = userData.value.email
              donationObj.value.phone = userData.value.phone
              donationObj.value.userId = userData.value.id
              if (checked.value) {
                donationObj.value.isAnonymous = false
              } else {
                donationObj.value.isAnonymous = false
              }
          } else {
              donationObj.value.name = name.value,
              donationObj.value.phone = phone.value,
              donationObj.value.email = email.value

              if (name.value !== "" || phone.value !== "") {
                donationObj.value.isAnonymous = false
              } else {
                donationObj.value.isAnonymous = true
              }
          }

         

          try {
            let  res = await axios.post('/donation', donationObj.value)
            console.log(res)
     
            finish()
          }
          catch (error) {
            finish()
            console.log(error)
          }
          console.log(formResponse.value)
    }

    const successfulPayment = (payload) => {
      paymentSuccessful.value = payload
    }

    const getUserDetails = async() => {
      console.log(localStorage.getItem('giverToken'))
      if (localStorage.getItem('giverToken') === null ) {
        console.log('Not signed in yet')        
    } else {
      let storedDetails = JSON.parse(localStorage.getItem('giverToken'))
        console.log(storedDetails)
        userData.value = {
          email: storedDetails.email,
          name: storedDetails.name,
          userId: storedDetails.giverId
        }
          email.value = storedDetails.email
          name.value = storedDetails.name
          phone.value = storedDetails.phone
          signedIn.value = storedDetails.setSignInStatus
      // try {
      //     let   { data } = await axios.get(`/mobile/v1/Profile/GetMobileUserProfile?userId=${storedDetails.giverId}`)
      //     console.log(data)
      //     userData.value = data
      //     email.value = data.email
      //     name.value = userData.value.name
      //     phone.value = userData.value.phone
      //     finish()
      //   }
      //   catch (error) {
      //     console.log(error)
      //     finish()
      //   }
    }
    }
    getUserDetails()

    const checkForToken = () => {
      if (localStorage.getItem('giverToken') == "" || localStorage.getItem('giverToken') == null || !localStorage.getItem('giverToken')) {
        router.push({ name: 'SignInPayment', params: { userId: route.params.userId } })
      } else {
        router.push({ name: 'TransactionPage', params: { userId: route.params.userId } })
      }
    }

    const signOut = () => {
      localStorage.removeItem('giverToken')
      toast.add({
            severity: "success",
            summary: "Signed Out",
            detail: `Signed Out Successfully`,
            life: 3000,
          });
          userData.value  = {}
          signedIn.value = false
          signInEmail.value = ""
          signInPassword.value = ""
    }

    const toggleActive1 = () => {
      activeTab1.value = true
      activeTab2.value = false
    }

    const toggleActive2 = () => {
      activeTab2.value = true
      activeTab1.value = false
    }

    const signin = async () => {
      let userdetails = {
        email: signInEmail.value,
        password: signInPassword.value,
      };

      try {
        let { data } = await axios.post(
          "/mobile/v1/Account/SignIn",
          userdetails
        );
        if (!data.returnObject) {
            toast.add({
              severity: "warn",
              summary: "Incorrect details",
              detail: `${data.response}`,
              life: 4000,
            });
        } else if (data && data.returnObject.token && data.status) {
            let giverDetails = {
                giverToken: data.returnObject.token,
                giverId: data.returnObject.userId,
                tenantId: data.returnObject.tenantID
            }
          localStorage.setItem("giverToken", JSON.stringify(giverDetails));

          localStorage.setItem("token", JSON.stringify(data.returnObject.token));
          
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: `${data.response}`,
            life: 4000,
          });
          console.log(data)

          let userProfile = {
            name: data.returnObject.fullname,
            email: data.returnObject.email,
            id: data.returnObject.userId,
            tenantID: data.returnObject.tenantID,
            phone: data.returnObject.phoneNumber,
          }
          userData.value = userProfile
          signedIn.value = true
          console.log(data)
          // userData.value = data
        }   else {
           console.log(data.response)
        }
        finish()
    } catch (error) {
          finish()
        console.log(error);
        console.log(error.response && error.response.data.message);
        if (error.response && error.response.data.message ) {
          toast.add({
            severity: "info",
            summary: "Error Signing In",
            detail: `${error.response.data.message}`,
            life: 3000,
          });
        } else if (error.response && error.response.toString().includes('network error')){
          toast.add({
            severity: "error",
            summary: "Network Error",
            detail: `Please ensure you  have a strong internet connection`,
            life: 3000,
          });
        } else {
          toast.add({
            severity: "error",
            summary: "Not Successful",
            detail: `Please try again`,
            life: 3000,
          });
        }
      }
    };

    const signedUp = async(payload) => {
        userData.value = {
        email: payload.email,
        name: payload.name,
        userId: payload.giverId
      }
      email.value = payload.email
      name.value = payload.name
      phone.value = payload.phone
      signedIn.value = payload.setSignInStatus
    
    }

    const displaySignInForm = (payload) => {
      showSignInForm.value = payload
    }

    const gatewaySelected  = (payload) => {
        donationObj.value.usedPaymentGateway = payload
        console.log(payload)
        donation()
    }

    const setTransactionReference = (payload) => {
      donationObj.value.transactionReference = payload
    }

    const setPaystackAmount = () => {
      delete donationObj.value[amount]
      donationObj.value.amount = convertedAmount.value * 100
    }

    return {
      hideTabOne,
      toggleTabOne,
      funds,
      toggleTabTwo,
      Dropdown,
      selectedContributionType,
      date,
      givingOften,
      oftenGive1,
      oftenGive2,
      oftenGive3,
      oftenGive4,
      dfaultCurrency,
      currencyInput,
      amount,
      name,
      donation,
      formResponse,
      phone,
      checked,
      donationObj,
      close,
      paymentSuccessful,
      successfulPayment,
      userData,
      checkForToken,
      email,
      signedIn,
      signOut,
      activeTab1,
      activeTab2,
      toggleActive1,
      toggleActive2,
      signin,
      signInEmail,
      signInPassword,
      routeParams,
      showSignInForm,
      signedUp,
      displaySignInForm,
      gatewaySelected,
      tenantCurrency,
      convertedAmount,
      convertAmount,
      setTransactionReference,
      setPaystackAmount,
      computeAmount
    };
  },
};
</script>

<style scoped>
.nav-color {
  background: #020f1e;
}
.nav-color2 {
  background: transparent;
}

.lstyle {
  list-style: none;
}

.logo {
  height: auto;
  object-fit: cover;
  max-width: 100px;
}

.img {
  /* width: 100vw; */
  height: 40vh;
  background: url("../../../assets/churchplusimage.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  -o-object-fit: cover;
  object-fit: cover;
}

.main-font {
  font-size: 50px;
  font: normal normal medium 70px/106px Poppins;
  letter-spacing: 4px;
}
.sub-main-font {
  font-size: 18px;
  color: #f17c30;
}

.form-area {
  background: #fff;
  border-radius: 8px;
  height: fit-content;
}

.fone {
  font-size: 14px;
  font-weight: 300;
  color: #80878d;
}

.hfont {
  font-size: 12px;
  font-weight: 400;
  color: #020f1e;
}

.imp1 {
  height: 58%;
}

.imp2 {
  height: 80%;
}

.default-color {
  background: #136acd;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

 /* .header-color1 {
  background: #0b0b0c;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
} */
.header-color {
  background:#020f1ec5;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.header-color1:hover {
  background: #020f1e83;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}



.btt {
  width: 180px;
  height: 50px;
  border-radius: 500px;
}

.hfontb {
  font-weight: bold;
}

.pay-method {
  width: 100%;
  height: auto;
}

.borderl {
  border-right: 1px solid #dee2e6;
}

.stylish-text {
      font-size: 55px;
      font-family: cursive;
  }

.bg-modal {
  background: rgba(226, 226, 226, 0.514);
}

.success-card {
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.2s;
} */
/* .fade-enter-active {
  transition: all .5s ease-in-out;;
}
.fade-leave-active {
  transition: all .5s ease-in-out;
}
.fade-enter, .fade-leave-to {*/
/* .slide-fade-leave-active below version 2.1.8 */ 
  /* transform: translateX(30px);
  opacity: 0;
}
.fade-leave, .fade-enter-to {
  opacity: 1;
} */

.fade-enter-active {
  animation: fade-in .5s;
}
.fade-leave-active {
  animation: fade-in .5s reverse;
}
@keyframes fade-in {
  0% {
    transform: translateX(50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }

}

.move-enter-active {
  animation: move-in .8s;
}
.move-leave-active {
  animation: move-in .8s reverse;
}
@keyframes move-in {
  0% {
    transform: translateX(-200px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }

}

.pointer {
  cursor: pointer;
}

.active-tab {
  background: rgba(206, 206, 206, 0.274);
}

.stroke {
  border-bottom: 1px solid rgba(206, 206, 206, 0.562);
}

.signin-color {
  background: rgba(206, 206, 206, 0.274);
  color: black;
}
</style>