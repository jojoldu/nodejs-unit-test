import {api, log} from "../api";

function get(url): string {
    try {
        return api.getCompanyInfo (url);
    } catch (e) {
        log.error("Error occurred", e);
        return "A default response";
    }
}