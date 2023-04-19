import {api} from "../api";
import { log } from '../../log';

function get(url): string {
    try {
        return api.getCompanyInfo (url);
    } catch (e) {
        log.error("Error occurred", e);
        return "response";
    }
}