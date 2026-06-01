import ImageKit from "imagekit";
import env from "./env.js";


// ImageKit client create karo using the environment variables for public key, private key, and url endpoint.
const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;