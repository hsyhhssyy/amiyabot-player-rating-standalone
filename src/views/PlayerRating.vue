<template>
  <div class="container">
    <div v-if="loading" class="loading-mask">加载中，请稍候...</div>
    <div class="info-card">
      <h2>{{ doctorScore.name }} 博士</h2>
      <table>
        <tr>
          <td>干员总数</td>
          <td>{{ doctorScore.charsTotal }}</td>
        </tr>
        <tr>
          <td>干员深度分</td>
          <td>{{ doctorScore.scoreBaseTotal }}</td>
        </tr>
        <tr>
          <td>干员等级分</td>
          <td>{{ doctorScore.scoreLevelTotal }}</td>
        </tr>
        <tr>
          <td>干员专精分</td>
          <td>{{ doctorScore.scoreSpecializeTotal }}</td>
        </tr>
        <tr>
          <td>干员模组分</td>
          <td>{{ doctorScore.scoreEquipTotal }}</td>
        </tr>
      </table>
      <p class="total-score">总分为：<strong>{{ doctorScore.scoreTotal }}</strong></p>
      <p class="note">计分规则更新于2023-08-07，<a href="/ratingRule">查看规则详情</a>。</p>
      <p class="warning">该分数仅供娱乐，请不要用这个分数来评判博士呦~~</p>
    </div>

    <div class="text-section">
      <div @click="toggleText" class="title">
        评分详情
        <span v-if="!expanded">
          <i class="fas fa-chevron-down"></i>
        </span>
        <span v-else>
          <i class="fas fa-chevron-up"></i>
        </span>
      </div>
      <div v-if="expanded" class="details-table">
        <table>
          <thead>
            <tr>
              <th>干员名称</th>
              <th>总分</th>
              <th>基础分</th>
              <th>等级分</th>
              <th>专精分</th>
              <th>模组分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in scoreDetails" :key="detail.name">
              <td>{{ detail.name }}</td>
              <td>{{ detail.total }}</td>
              <td>{{ detail.base }}</td>
              <td>{{ detail.level }}</td>
              <td>{{ detail.specialize }}</td>
              <td>{{ detail.equip }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 导入 vue-router 的 useRouter 钩子
import axios from 'axios';
import { HmacSHA1, enc } from 'crypto-js';

interface ScoreDetail {
  total: number;
  base: number;
  level: number;
  specialize: number;
  equip: number;
  name: string;
}

export default {
  name: 'PlayerRating',
  setup() {
    const router = useRouter(); // 初始化 router 对象

    const expanded = ref(false);
    const loading = ref(true);
    const tokenValue = ref("");
    const scoreDetails = ref<ScoreDetail[]>([]);

    const doctorScore = ref({
      name: "",
      charsTotal: "0",
      scoreTotal: "0",
      scoreBaseTotal: "0",
      scoreLevelTotal: "0",
      scoreSpecializeTotal: "0",
      scoreEquipTotal: "0"
    })


    const uploadData = async (dataDict: any, userId: string) => {
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

    const calcuate_single_char = (character: any, charMapData: any) => {
      let scoreDict = {
        total: 0,
        base: 0,
        level: 0,
        specialize: 0,
        equip: 0
      };

      if (character.evolvePhase >= 2) {
        switch (charMapData.rarity) {
          case 3:
            scoreDict.base += 40;
            break;
          case 4:
            scoreDict.base += 70;
            break;
          case 5:
            scoreDict.base += 100;
            break;
        }

        scoreDict.level = character.level;

        character.skills.forEach((skill: { specializeLevel: any; }) => {
          switch (skill.specializeLevel) {
            case 1:
              scoreDict.specialize += 20;
              break;
            case 2:
              scoreDict.specialize += 60;
              break;
            case 3:
              scoreDict.specialize += 100;
              break;
          }
        });

        character.equip.forEach((equipment: { level: any; }) => {
          switch (equipment.level) {
            case 1:
              scoreDict.equip += 0;
              break;
            case 2:
              scoreDict.equip += 30;
              break;
            case 3:
              scoreDict.equip += 50;
              break;
          }
        });

        scoreDict.total = scoreDict.base + scoreDict.level + scoreDict.specialize + scoreDict.equip;
      }

      return scoreDict;
    }

    const calculate_score = async (token: string) => {


      try {
        const headers = {
          "Cred": token
        }

        let response = await axios.get('https://zonai.skland.com/api/v1/user/me', {
          headers: headers
        });

        console.log(response)

        if (response.status != 200 || response.data.code != 0) {
          return false
        }

        let meData = response.data.data

        doctorScore.value.name = meData.gameStatus.name

        response = await axios.get('https://zonai.skland.com/api/v1/game/player/info?uid=' + meData.gameStatus.uid, {
          headers: headers
        });

        console.log(response)

        if (response.status != 200 || response.data.code != 0) {
          return false
        }

        let infoData = response.data.data

        let totalScores = 0;
        let totalBaseScores = 0;
        let totalLevelScores = 0;
        let totalSpecializeScores = 0;
        let totalEquipScores = 0;

        infoData.chars.forEach((character: { charId: string | number; }) => {
          const charMapData = infoData.charInfoMap[character.charId];
          const scoreDict = calcuate_single_char(character, charMapData);

          totalScores += scoreDict.total;
          totalBaseScores += scoreDict.base;
          totalLevelScores += scoreDict.level;
          totalSpecializeScores += scoreDict.specialize;
          totalEquipScores += scoreDict.equip;

          if (scoreDict.total !== 0) {
            scoreDetails.value.push({
              name: charMapData.name,
              ...scoreDict
            });
          }
        });

        doctorScore.value.charsTotal = infoData.chars.length;
        doctorScore.value.scoreTotal = totalScores.toString();
        doctorScore.value.scoreBaseTotal = totalBaseScores.toString();
        doctorScore.value.scoreLevelTotal = totalLevelScores.toString();
        doctorScore.value.scoreSpecializeTotal = totalSpecializeScores.toString();
        doctorScore.value.scoreEquipTotal = totalEquipScores.toString();

        loading.value = false
       
        const currentTime = new Date().getTime();
        const lastUploadTime = localStorage.getItem('lastUploadTime-' + meData.gameStatus.uid);
        if (!lastUploadTime || (currentTime - parseInt(lastUploadTime) > 3600000)) {
          // 如果不存在上次上传时间或上次上传时间超过一个小时（3600000 毫秒）
          uploadData(infoData.chars, meData.gameStatus.uid + "|" + meData.gameStatus.name);
          localStorage.setItem('lastUploadTime-' + meData.gameStatus.uid, currentTime.toString());
        }

        return true
      } catch (error) {
        alert("凭据失效或错误，请重新输入凭据。")
        console.error("Error getting code:", error);
        return false
      }


    }

    onMounted(async () => {
      const storedToken = sessionStorage.getItem('tokenValue');
      if (storedToken) {
        tokenValue.value = storedToken;
        let success = await calculate_score(storedToken)
        if (success == false) {
          sessionStorage.removeItem('tokenValue')
          router.push({ name: 'AquireToken' });
        }
      } else {
        sessionStorage.removeItem('tokenValue')
        router.push({ name: 'AquireToken' });
      }
    });

    const toggleText = () => {
      expanded.value = !expanded.value;
    };

    return {
      loading,
      tokenValue,
      expanded,
      doctorScore,
      scoreDetails,
      toggleText
    };
  }
}
</script>
  
<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1.5em;
  z-index: 9999;
}

.container {
  padding: 0px;
}

.text-section {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.title {
  cursor: pointer;
  padding: 10px 15px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title i {
  margin-left: 10px;
}

.details-table table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
}

.details-table th {
  background-color: #e5e5e5;
}


.info-card {
  background: #f5f5f5;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.info-card table {
  width: 100%;
  border-collapse: collapse;
}

.info-card td {
  padding: 5px 10px;
  border-bottom: 1px solid #e0e0e0;
}

.info-card .note {
  font-size: 12px;
  margin-top: 10px;
}

.info-card .total-score {
  font-size: 24px; /* 或任何你想要的大小 */
  text-align: center;
  margin-top: 15px;
}

.info-card .warning {
  font-size: 14px;
  color: #e74c3c;
  margin-top: 10px;
}
</style>
  