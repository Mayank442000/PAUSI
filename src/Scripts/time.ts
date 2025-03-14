import strftime from "strftime";

const getDTstring = (time: number): string => {
    if (typeof time === "string") return time;
    const date = new Date(time);
    const dt = Date.now() - time;
    let format: string = "%H:%M";
    if (dt / (1000 * 60 * 60 * 24 * 365.25) >= 1) format = "%-d/%-m/%y " + format;
    else if (dt / (1000 * 60 * 60 * 24) >= 1) format = "%-d %b " + format;
    // format = "%-d/%-m/%y " + format;
    return strftime(format, date);
};

export { getDTstring };
