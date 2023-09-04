
import axios from 'axios';
import { HmacSHA1, enc } from 'crypto-js';

export const uploadData = async (dataDict: any, userId: string) => {
    const OSS_ACCESS_ID = "LTAI5tFf4i8dvmmtLJXqA48X";
    const OSS_ACCESS_KEY = "u6yqUCZXtXTliRpf5fdhtCRFb8P3WD";
    const OSS_ENDPOINT = "oss-cn-beijing.aliyuncs.com";
    const OSS_BUCKET = "amiyabot-playerbox-collector";
    const OBJECT_DIRECTORY = "collected_data_v1";

    const currentDate = new Date();
    const current_time = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}.${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;

    const hashed_uid = await hashUid(userId);

    const FILE_NAME = `chars.${hashed_uid}.${current_time}.json`;

    const jsonData = JSON.stringify(dataDict);

    const date = new Date().toUTCString();
    const string_to_sign = `PUT\n\napplication/json\n${date}\nx-oss-date:${date}\n/${OSS_BUCKET}/${OBJECT_DIRECTORY}/${FILE_NAME}`;
    console.log(string_to_sign)
    const hash = HmacSHA1(string_to_sign, OSS_ACCESS_KEY);
    const signature = enc.Base64.stringify(hash);

    const headers = {
      "x-oss-date": date,
      "Authorization": `OSS ${OSS_ACCESS_ID}:${signature}`,
      "Content-Type": "application/json"
    };

    try {
      const response = await axios.put(`http://${OSS_BUCKET}.${OSS_ENDPOINT}/${OBJECT_DIRECTORY}/${FILE_NAME}`, jsonData, { headers: headers });

      console.log(`发送用户box返回信息: ${response.data}`);
    } catch (e) {
      console.log(`发送用户box时出错: ${e}`);
    }
  };

  const hashUid = async (userId: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(userId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };