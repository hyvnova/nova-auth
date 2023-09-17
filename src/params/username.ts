import { REGEX_USERNAME } from "$lib/types";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = ( param ) => {
    // Decode param (it's encoded because it's in the url and might contain some special characters)
    param = decodeURIComponent(param);
    return  REGEX_USERNAME.test(param);
}