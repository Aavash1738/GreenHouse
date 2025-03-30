import { HmacSHA256, SHA256, enc } from "crypto-js";
import moment from "moment";
import { Client, Message } from "paho-mqtt";

export const SigV4Utils = {
  sign(key, msg) {
    return HmacSHA256(msg, key).toString(enc.Hex);
  },
  sha256(msg) {
    return SHA256(msg).toString(enc.Hex);
  },
  getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = HmacSHA256(dateStamp, "AWS4" + key);
    const kRegion = HmacSHA256(regionName, kDate);
    const kService = HmacSHA256(serviceName, kRegion);
    return HmacSHA256("aws4_request", kService);
  },
};

export const startSession = ({
  onConnect,
  onFailure,
  onMessageArrived,
  onConnectionLost,
}) => {
  const time = moment.utc();
  const dateStamp = time.format("YYYYMMDD");
  const amzdate = dateStamp + "T" + time.format("HHmmss") + "Z";
  const service = "iotdevicegateway";
  const region = process.env.REACT_APP_AWS_REGION;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const endpoint = process.env.REACT_APP_AWS_IOT_ENDPOINT;
  const algorithm = "AWS4-HMAC-SHA256";
  const method = "GET";
  const canonicalUri = "/mqtt";
  const host = endpoint;

  const credentialScope =
    dateStamp + "/" + region + "/" + service + "/aws4_request";
  let canonicalQuerystring =
    "X-Amz-Algorithm=AWS4-HMAC-SHA256" +
    "&X-Amz-Credential=" +
    encodeURIComponent(accessKeyId + "/" + credentialScope) +
    "&X-Amz-Date=" +
    amzdate +
    "&X-Amz-Expires=86400" +
    "&X-Amz-SignedHeaders=host";

  const canonicalHeaders = `host:${host}\n`;
  const payloadHash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const canonicalRequest =
    `${method}\n${canonicalUri}\n${canonicalQuerystring}\n` +
    `${canonicalHeaders}\nhost\n${payloadHash}`;
  const stringToSign =
    `${algorithm}\n${amzdate}\n${credentialScope}\n` +
    SigV4Utils.sha256(canonicalRequest);
  const signingKey = SigV4Utils.getSignatureKey(
    secretAccessKey,
    dateStamp,
    region,
    service
  );
  const signature = SigV4Utils.sign(signingKey, stringToSign);

  canonicalQuerystring += `&X-Amz-Signature=${signature}`;

  const requestUrl = `wss://${host}${canonicalUri}?${canonicalQuerystring}`;
  const client = new Client(requestUrl, "user");

  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;

  client.connect({
    onSuccess: () => onConnect(client),
    onFailure: (err) => onFailure(err),
    useSSL: true,
    timeout: 3,
  });

  return client;
};

export const publishMessage = (mqttClient, topic, message) => {
  if (mqttClient && message) {
    const mqttMessage = new Message(message);
    mqttMessage.destinationName = topic;
    mqttClient.send(mqttMessage);
  } else {
    throw new Error("Client not connected or message not provided.");
  }
};
