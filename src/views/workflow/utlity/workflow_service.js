import axios from "@/gateway/backendapi";

const workflowFunctions = {
    getContributionItems() {
        return new Promise((resolve, reject) => {
            axios.get(`/api/Financials/Contributions/Items`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    /*eslint no-undef: "warn"*/
                    NProgress.done();
                    if (error.response) {
                        reject(error.response)
                    } else {
                        reject(error)
                    }
                })
        })
    },

    saveWorkflow(body) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/Workflow/save`, body)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    /*eslint no-undef: "warn"*/
                    NProgress.done();
                    if (error.response) {
                        reject(error.response)
                    } else {
                        reject(error)
                    }
                })
        })
    }
}

export default workflowFunctions;