<template>
  <div class="constainer-fluid">
    <div class="row">
      <div class="col-md-12"></div>
    </div>

    <div class="row px-1">
      <ConfirmDialog />
      <Toast />
      <!-- Feed -->
      <div class="col-md-12 mx-auto py-4">
        <div
          class="row bordered mb-4"
          v-for="(post, index) in feed"
          :key="index"
        >
          <div class="col-md-12 py-3">
            <!-- User details -->
            <div class="row">
              <div class="col-2 d-md-flex justify-content-center">
                <div class="img-holder bg-secondary">
                  <img
                    :src="post.posterDetails.posterImageUrl"
                    alt="User Image"
                    style="height: 40px; width: 100%"
                  />
                </div>
              </div>
              <div class="col-10 pl-md-0">
                <p
                  class="mb-0 font-weight-700 mb-n2 d-flex justify-content-between"
                >
                  <span>{{ post.posterDetails.posterName }}</span>
                  <span>
                    <div class="dropdown">
                      <i
                        class="pi pi-ellipsis-h c-pointer cursor-pointer"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      ></i>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a class="dropdown-item elipsis-items cursor-pointer"
                        @click="addToStore(post)"
                        >
                        <router-link :to="{ name: 'SocialPost', query: { postId: post.postId } }" class="text-decoration-none text-dark">Edit</router-link>
                        </a>
                        <a
                          class="dropdown-item elipsis-items cursor-pointer"
                          @click="showDeleteModal(post)"
                        >
                          Delete
                        </a>
                        <a class="dropdown-item elipsis-items cursor-pointer"
                          @click="showDisapproveModal(post.postId)"
                        >
                          Disapprove
                        </a>
                      </div>
                    </div>
                  </span>
                </p>
                <small class="mb-0">{{ formatDate(post.date) }}</small>
              </div>
            </div>

            <!-- Post message -->
            <div class="row">
              <div class="col-md-12 pt-3">
                <h5 class="font-weight-bold mb-0">
                  {{ post.postCategoryName }}
                </h5>
                <p class="mb-0 text-justify">
                  <span
                    v-if="
                      post.showFullMessage || post.content.length < previewLenth
                    "
                    >{{ post.content }}</span
                  >
                  <span v-else>{{ post.briefMessage }}...</span>
                  <span
                    v-if="post.content.length > previewLenth"
                    class="font-weight-700 primary-text c-pointer ml-3"
                    @click="
                      () => (post.showFullMessage = !post.showFullMessage)
                    "
                    >{{ post.showFullMessage ? "See less" : "See more" }}</span
                  >
                </p>
              </div>
            </div>

            <!-- Post media -->
            <div class="row">
              <div class="col-md-12 text-center">
                <span><img
                  v-if="post.type === 'Picture'"
                  :src="post.mediaUrl"
                  alt=""
                  style="width: auto;max-width:100%;max-height:300px;border-radius: 15px;"
                /></span>
                <video
                  v-if="post.type === 'Video'"
                  style="width: 100%"
                  height="240"
                  controls
                >
                  <source :src="post.mediaUrl" />
                  <!-- <source src="movie.mp4" type="video/mp4"> -->
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <!-- Post Extras -->
            <!-- <div class="row my-3">
              <div class="col-md-12">
                <h6 class="mb-0 font-weight-700">
                  Bodacious and awesome dragon warrior
                </h6>
                <p class="mb-0">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Perspiciatis obcaecati laboriosam adipisci esse autem nisi
                  natus magnam omnis, ut quibusdam?
                </p>
                <a class="text-decoration-none font-weight-700 c-pointer"
                  >KungFu.Panda</a
                >
              </div>
            </div> -->

            <!-- Post Actions -->
            <div class="row my-3">
              <div class="col-md-12">
                <a
                  class="text-decoration-none c-pointer post-action-link px-3 px-md-4"
                >
                  <span><i class="pi pi-thumbs-up mr-2"></i></span>
                  <span>Like</span>
                  <span class="ml-2">{{ post.likeCount }}</span>
                </a>
                <a
                  class="text-decoration-none c-pointer post-action-link px-3 px-md-4"
                >
                  <span><i class="pi pi-comment mr-2"></i></span>
                  <span>Comment</span>
                  <span class="ml-2">{{
                    post.comments ? post.comments.length : 0
                  }}</span>
                </a>
                <a
                  class="text-decoration-none c-pointer post-action-link px-3 px-md-4"
                >
                  <span><i class="pi pi-share-alt mr-2"></i></span>
                  <span>Share</span>
                </a>
              </div>
              <div class="col-md-12">
                <div class="row my-2">
                  <div class="col-md-11 mx-auto bordered-bottom"></div>
                </div>
              </div>
            </div>

            <div
              class="row my-3"
              v-for="(comment, indx) in post.comments"
              :key="indx"
            >
              <div class="col-2 d-md-flex justify-content-center">
                <div class="img-holder bg-secondary"></div>
              </div>
              <div>
                <div
                  class="py-2 px-3 small-border-radius"
                  style="background: #ebeef0"
                >
                  <h6 class="mb-0 font-weight-600">
                    {{ comment.commenterName }}
                  </h6>
                  <p class="mb-0 small-text">
                    {{ comment.commentMessage.trim() }}
                  </p>
                </div>
                <div class="px-2">
                  <p class="mb-0">
                    <small>{{
                      formatDate(comment.commentDate).toLowerCase()
                    }}</small>
                  </p>
                </div>
              </div>
            </div>

            <div class="row my-2">
              <div class="col-2 d-md-flex justify-content-center">
                <div class="img-holder bg-secondary"></div>
              </div>
              <div class="pl-0 col-10 d-flex align-items-center">
                <form class="w-100">
                  <p class="border mb-0 w-100 medium-border-radius">
                    <textarea
                      rows="1"
                      class="border-0 textarea mt-0 px-2 comment-field"
                      @keyup="postComment($event, post.postId, index)"
                      v-model="comment.message"
                      placeholder="Comment..."
                    ></textarea>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- SKELETON LOADER -->
        <div class="row mt-3" v-if="loaded">
          <div class="col-md-12">
            <div class="row my-4">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-2 my-2">
                    <Skeleton
                      shape="circle"
                      style="width: 100%; height: 70px"
                      class="p-mr-2 small-border-radius"
                    ></Skeleton>
                  </div>
                  <div class="col-10 my-2">
                    <Skeleton
                      style="width: 100%; height: 70px"
                      class="small-border-radius"
                    ></Skeleton>
                  </div>
                </div>
              </div>
              <div class="col-md-12 my-2">
                <Skeleton
                  style="width: 100%; height: 200px"
                  class="p-mb-2 small-border-radius"
                ></Skeleton>
              </div>
              <div class="col-md-12 d-flex">
                <Skeleton
                  width="4rem"
                  class="mr-2 small-border-radius"
                  height="2rem"
                ></Skeleton>
                <Skeleton
                  width="4rem"
                  height="2rem"
                  class="mr-2 small-border-radius"
                ></Skeleton>
              </div>
            </div>

            <div class="row my-4">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-2 my-2">
                    <Skeleton
                      shape="circle"
                      style="width: 100%; height: 70px"
                      class="p-mr-2 small-border-radius"
                    ></Skeleton>
                  </div>
                  <div class="col-10 my-2">
                    <Skeleton style="width: 100%; height: 70px"></Skeleton>
                  </div>
                </div>
              </div>
              <div class="col-md-12 my-2">
                <Skeleton
                  style="width: 100%; height: 200px"
                  class="p-mb-2"
                ></Skeleton>
              </div>
              <div class="col-md-12 d-flex">
                <Skeleton
                  width="4rem"
                  class="mr-2 small-border-radius"
                  height="2rem"
                ></Skeleton>
                <Skeleton
                  width="4rem"
                  height="2rem"
                  class="mr-2 small-border-radius"
                ></Skeleton>
              </div>
            </div>

            <div class="row my-4">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-2 my-2">
                    <Skeleton
                      shape="circle"
                      style="width: 100%; height: 70px"
                      class="p-mr-2 small-border-radius"
                    ></Skeleton>
                  </div>
                  <div class="col-10 my-2">
                    <Skeleton
                      style="width: 100%; height: 70px"
                      class="small-border-radius"
                    ></Skeleton>
                  </div>
                </div>
              </div>
              <div class="col-md-12 my-2">
                <Skeleton
                  style="width: 100%; height: 200px"
                  class="p-mb-2 small-border-radius"
                ></Skeleton>
              </div>
              <div class="col-md-12 d-flex">
                <Skeleton
                  width="4rem"
                  class="mr-2 small-border-radius"
                  height="2rem"
                ></Skeleton>
                <Skeleton
                  width="4rem"
                  height="2rem"
                  class="mr-2 small-border-radius"
                ></Skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import Skeleton from "primevue/skeleton";
import social_service from "../../../../services/social/social_service";
import membershipService from "../../../../services/membership/membershipservice";
import dateFormatter from "../../../../services/dates/dateformatter";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useStore } from "vuex";

export default {
  components: { Skeleton },
  setup() {
    const feed = ref([]);
    const tenantId = ref("");
    const previewLenth = 300;
    const toast = useToast();
    const confirm = useConfirm();
    const store = useStore()

    membershipService
      .getSignedInUser()
      .then((res) => {
        tenantId.value = res.tenantId;
        getFeed(res.tenantId);
      })
      .catch((err) => console.log(err));

    const loaded = ref(true);
    const getFeed = async (tenantId) => {
      try {
        const response = await social_service.getFeed(tenantId);
        feed.value = response.map((i) => {
          i.showFullMessage = false;
          i.briefMessage = i.content.slice(0, previewLenth);
          return i;
        });
        loaded.value = false;
        console.log(feed.value);
      } catch (error) {
        console.log(error);
        loaded.value = false;
      }
    };

    const comment = ref({});
    const postComment = async (e, postId, index) => {
      if (!comment.value.message) return false;
      if (e.keyCode == 13) {
        e.preventDefault();
        try {
          const response = await social_service.postComment({
            postId: postId,
            commentMessage: comment.value.message,
            commenterName: "Church Admin",
          });
          feed.value[index].comments.push(response);
          console.log(feed.value);
          comment.value.message = "";
        } catch (error) {
          console.log(error);
        }
      }
    };

    const formatDate = (date) => {
      return dateFormatter.monthDayTime(date);
    };

    const showDeleteModal = (post) => {
      console.log(post, "post");
      confirm.require({
        message: "Are you sure you want to delete this post?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "confirm-delete",
        rejectClass: "cancel-delete",
        accept: () => {
          deletePost(post);
        },
        reject: () => {
          console.log("rejected");
        },
      });
    };

    const showDisapproveModal = (postId) => {
      confirm.require({
        message: "Are you sure you want to proceed? This post will no longer be public.",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "confirm-delete",
        rejectClass: "cancel-delete",
        accept: () => {
          disapprovePost(postId);
        },
        reject: () => {
          console.log("rejected");
        },
      });
    };

    const deletePost = async (post) => {
      try {
        await social_service.deletePost(post.postId);
        feed.value = feed.value.filter(i => i.postId !== post.postId);
        toast.add({
          severity: "success",
          summary: "Post Deleted",
          detail: "The post has been deleted successfully",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Delete Error",
          detail: "Post could not be deleted, please reload and try again",
          life: 3000,
        });
      }
    };

    const disapprovePost = async (postId) => {
      try {
        await social_service.disapprovePost(postId);
        feed.value = feed.value.filter(i => i.postId !== postId);
        toast.add({
          severity: "success",
          summary: "Post Disapproved",
          detail: "The post has been disapproved successfully",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Operation Error",
          detail: "Post could not be disapproved, please reload and try again",
          life: 3000,
        });
      }
    };

    const addToStore = (post) => {
      store.dispatch('setPost', post);
    }

    return {
      feed,
      postComment,
      comment,
      formatDate,
      loaded,
      previewLenth,
      showDeleteModal,
      showDisapproveModal,
      addToStore,
    };
  },
};
</script>

<style scoped>
.blue-bg {
  height: 500px;
  position: absolute;
  background: #0f529f;
  width: 100%;
}

.bg-blue {
  background: #0f529f;
}

.blue-bg:before {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
  content: "";
  background-color: red;
}

.img-holder {
  width: 48px;
  height: 48px;
  border: 1px solid;
  border-radius: 50%;
}

.textarea {
  outline: none;
  margin-top: 10px;
  background: transparent;
}

.post-add-ons {
  background: #f5f6f7;
  border-radius: 0 0 10px 10px;
}

/* .main-post {
        background: #fbfbfb;
    } */

.bordered {
  border: 0.20000000298023224px solid #dddfe2;
  /* border: 0.20000000298023224px solid #e9eef0; */
  border-radius: 15px;
  background: #fff;
}

.bordered-bottom {
  border-bottom: 0.20000000298023224px solid #dddfe2;
}

.post-action-link {
  color: #4b5257cc;
}

.small-border-radius {
  border-radius: 10px;
}

.medium-border-radius {
  border-radius: 15px;
}

.comment-field {
  width: calc(100% - 60px);
}

.all-platforms {
  background: #136acd;
}

.facebook {
  background: #0f529f;
}

.twitter {
  background: #1a91da;
}

.instagram {
  background: transparent
    linear-gradient(81deg, #e90263 0%, #fd0604 49%, #ff5d00 100%) 0% 0%
    no-repeat padding-box;
}

.whatsapp {
  background: transparent linear-gradient(256deg, #48c658 0%, #2ab540 100%) 0%
    0% no-repeat padding-box;
}

.mobile {
  background: #e87109 0% 0% no-repeat padding-box;
}

@media screen and (min-width: 768px) {
  .b-right {
    border-right: 0.20000000298023224px solid #e9eef0;
  }
}
</style>