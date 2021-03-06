// import axios from "@/gateway/backendapi";
import media_service from "../media/media_service";

/**
 * Customized upload picture plugin
 */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const data = new FormData();
    data.append("mediaFile", "test_imagee");
    data.append("mediaFile", await this.loader.file);
    data.append("mediaFileImage", await this.loader.file);
    data.append("mediaType", 0);
    data.append("tenantId", 'e9749fad-85e8-4130-b553-37acc8acde61');

    try {
        const res = await media_service.uploadMedia(data);
        console.log(res, "data");
        console.log(res.returnObject, "data");
        return {
        //   default: process.env.VUE_APP_TARGET_URL + res.data.data.url,
        default: res.returnObject.imagePath,
        };
    } catch (error) {
        console.log(error, "error");
        return {
            //   default: process.env.VUE_APP_TARGET_URL + res.data.data.url,
            default: "https://www.tekportal.net/wp-content/uploads/2019/02/failed-7227.jpg",
        };
    }

    // const res = await axios({
    //   url: process.env.VUE_APP_BASE_URL + `/upload`,
    //   method: "POST",
    //   data,
    //   withCredentials: true, // True is not allowed to bring token, false is allowed
    // });

    // console.log(res.data);
    // Backstage returns data:
    // {"code":0,"msg":"success","data":{"url":"/upload/struts2.jpeg"}}

    // Method Returns data format: {Default: "URL"}
    // return {
    //   default: process.env.VUE_APP_TARGET_URL + res.data.data.url,
    // };
  }
}

export default MyUploadAdapter;