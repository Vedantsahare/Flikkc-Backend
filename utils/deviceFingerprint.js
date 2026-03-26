import crypto from "crypto";

function fingerprint(deviceData) {

  const sortedData = Object.keys(deviceData)
    .sort()
    .reduce((obj, key) => {
      obj[key] = deviceData[key];
      return obj;
    }, {});

  const raw = JSON.stringify(sortedData);

  return crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");

}

export default fingerprint;