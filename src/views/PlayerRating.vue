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
          <td>干员等级分</td>
          <td>{{ Math.round(doctorScore.scoreLevelTotal) }}</td>
        </tr>
        <tr>
          <td>干员专精分</td>
          <td>{{ Math.round(doctorScore.scoreSpecializeTotal) }}</td>
        </tr>
        <tr>
          <td>干员模组分</td>
          <td>{{ Math.round(doctorScore.scoreEquipTotal) }}</td>
        </tr>
      </table>
      <p class="total-score">总分为：<strong>{{ Math.round(doctorScore.scoreTotal) }}</strong></p>
      <p class="note">补正用平均练度数据更新于：{{ updateTime }} &nbsp;规则更新于：2023-09-04T03:00</p>
      <p class="warning">该分数仅供娱乐，请不要用这个分数来评判博士呦~~</p>
    </div>

    <div class="info-card">
      下一步干员养成建议，仅列出当前练度低于平均水平的干员，仅供参考哦。
      <p />
      <span>（如果你觉得这里面的养成建议没啥用，那大概是你的练度已经很高了，或者该练的干员都已经练了。）</span>
      <p />
      <li v-if="suggestions.length == 0">给大佬跪了，大佬您想练什么就练什么吧。</li>
      <ul>
        <li v-for="suggestion in suggestions">{{ suggestion }}</li>
      </ul>
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
              <th @click="sortTable('name')"
                :class="{ 'sorted-asc': sortKey === 'name' && sortDirection === 'asc', 'sorted-desc': sortKey === 'name' && sortDirection === 'desc' }">
                干员名称</th>
              <th @click="sortTable('total')"
                :class="{ 'sorted-asc': sortKey === 'total' && sortDirection === 'asc', 'sorted-desc': sortKey === 'total' && sortDirection === 'desc' }">
                总分</th>
              <th @click="sortTable('totalAveraged')"
                :class="{ 'sorted-asc': sortKey === 'totalAveraged' && sortDirection === 'asc', 'sorted-desc': sortKey === 'totalAveraged' && sortDirection === 'desc' }">
                补正后</th>
              <th @click="sortTable('evolvePhaseText')"
                :class="{ 'sorted-asc': sortKey === 'evolvePhaseText' && sortDirection === 'asc', 'sorted-desc': sortKey === 'evolvePhaseText' && sortDirection === 'desc' }">
                精英化</th>
              <th @click="sortTable('levelText')"
                :class="{ 'sorted-asc': sortKey === 'levelText' && sortDirection === 'asc', 'sorted-desc': sortKey === 'levelText' && sortDirection === 'desc' }">
                等级</th>
              <th @click="sortTable('level')"
                :class="{ 'sorted-asc': sortKey === 'level' && sortDirection === 'asc', 'sorted-desc': sortKey === 'level' && sortDirection === 'desc' }">
                等级分</th>
              <th @click="sortTable('levelAveraged')"
                :class="{ 'sorted-asc': sortKey === 'levelAveraged' && sortDirection === 'asc', 'sorted-desc': sortKey === 'levelAveraged' && sortDirection === 'desc' }">
                补正后</th>
              <th @click="sortTable('skillLevel')"
                :class="{ 'sorted-asc': sortKey === 'skillLevel' && sortDirection === 'asc', 'sorted-desc': sortKey === 'skillLevel' && sortDirection === 'desc' }">
                技能等级</th>
              <th @click="sortTable('specializeText1')"
                :class="{ 'sorted-asc': sortKey === 'specializeText1' && sortDirection === 'asc', 'sorted-desc': sortKey === 'specializeText1' && sortDirection === 'desc' }">
                1技能</th>
              <th @click="sortTable('specializeText2')"
                :class="{ 'sorted-asc': sortKey === 'specializeText2' && sortDirection === 'asc', 'sorted-desc': sortKey === 'specializeText2' && sortDirection === 'desc' }">
                2技能</th>
              <th @click="sortTable('specializeText3')"
                :class="{ 'sorted-asc': sortKey === 'specializeText3' && sortDirection === 'asc', 'sorted-desc': sortKey === 'specializeText3' && sortDirection === 'desc' }">
                3技能</th>
              <th @click="sortTable('specialize')"
                :class="{ 'sorted-asc': sortKey === 'specialize' && sortDirection === 'asc', 'sorted-desc': sortKey === 'specialize' && sortDirection === 'desc' }">
                专精分</th>
              <th @click="sortTable('specializeAveraged')"
                :class="{ 'sorted-asc': sortKey === 'specializeAveraged' && sortDirection === 'asc', 'sorted-desc': sortKey === 'specializeAveraged' && sortDirection === 'desc' }">
                补正后</th>
              <th @click="sortTable('equipText1')"
                :class="{ 'sorted-asc': sortKey === 'equipText1' && sortDirection === 'asc', 'sorted-desc': sortKey === 'equipText1' && sortDirection === 'desc' }">
                1模组<span class="note">(注)</span></th>
              <th @click="sortTable('equipText2')"
                :class="{ 'sorted-asc': sortKey === 'equipText2' && sortDirection === 'asc', 'sorted-desc': sortKey === 'equipText2' && sortDirection === 'desc' }">
                2模组<span class="note">(注)</span></th>
              <th @click="sortTable('equip')"
                :class="{ 'sorted-asc': sortKey === 'equip' && sortDirection === 'asc', 'sorted-desc': sortKey === 'equip' && sortDirection === 'desc' }">
                模组分</th>
              <th @click="sortTable('equipAveraged')"
                :class="{ 'sorted-asc': sortKey === 'equipAveraged' && sortDirection === 'asc', 'sorted-desc': sortKey === 'equipAveraged' && sortDirection === 'desc' }">
                补正后</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in sortedItems" :key="detail.characterId">
              <td>{{ detail.name }}</td>
              <td>{{ Math.round(detail.total) }}</td>
              <td>{{ Math.round(detail.totalAveraged) }}</td>
              <td>{{ detail.evolvePhaseText }}</td>
              <td>{{ detail.levelText }}</td>
              <td>{{ Math.round(detail.level) }}</td>
              <td>{{ Math.round(detail.levelAveraged) }}</td>
              <td>{{ Math.round(detail.skillLevel) }}</td>
              <td>{{ detail.specializeText1 }}</td>
              <td>{{ detail.specializeText2 }}</td>
              <td>{{ detail.specializeText3 }}</td>
              <td>{{ Math.round(detail.specialize) }}</td>
              <td>{{ Math.round(detail.specializeAveraged) }}</td>
              <td>{{ detail.equipText1 }}</td>
              <td>{{ detail.equipText2 }}</td>
              <td>{{ Math.round(detail.equip) }}</td>
              <td>{{ Math.round(detail.equipAveraged) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="note">注：模组数据因森空岛API的BUG无法正确显示，表现为未开启模组和1级模组均显示为1级。</p>
      </div>
    </div>

    <div class="text-section">
      <div @click="toggleRule" class="title">
        评分规则
        <span v-if="!ruleExpanded">
          <i class="fas fa-chevron-down"></i>
        </span>
        <span v-else>
          <i class="fas fa-chevron-up"></i>
        </span>
      </div>
      <div v-if="ruleExpanded" class="details-table">
        <div class="scoring-rules">
          <h2>计分规则</h2>
          <p>打分规则如下：</p>
          <p>首先计算玩家的各项分数</p>
          <ol>
            <li>干员等级分：每1级1分（将精英化也考虑进去，比如精二10级的玛恩纳，是50+80+10=140分）</li>
            <li>干员专精分：每个专精等级30分</li>
            <li>干员模组分：每个模组等级20分</li>
          </ol>
          <p>
            然后，根据最新统计的玩家练度数据（首页有展示），计算每项分数的补正如下：
          </p>
          <ol>
            <li>如果该项目的平均得分为X，而你的得分为Y，则补正为：X+(X-Y)/2</li>
            <li>比如玛恩纳的平均等级分为220分（平均精二满级），而你的练度为190分（精二60级）</li>
            <li>则你的分数为 190 + (190-220)/2 = 175</li>
            <li>任何单项的分数不会低于0分</li>
          </ol>
          <p>
            基础得分代表了养成投入的资源。
          </p>
          <p>
            而补正得分则是对你的惩罚和奖励。
          </p>
          <p>
            如果大家都练你不练，则你的分数会低于练度应得的基础分。反之如果大家都不练但是你练了，那么会加奖励分。
          </p>
          <h2>关于练度推荐</h2>
          <p>
            计算得分时，还会同时计算提升潜力，然后按顺序展示提升潜力最大的前十位（注意，提升潜力和分数差距并不完全相关）。
          </p>
          <ol>
            <li>如果你的某个干员的精英化等级落后于平均精英化等级，提升潜力=与平均等级分的差距*2 。这项的目的是首先推荐精英化等级落后的干员。</li>
            <li>如果你的干员的精英化等级高于平均精英化等级，则提升潜力=与平均等级分的差距+技能专精分差距最大的那个技能的技能专精分+模组分差距最大的那个模组的模组分。</li>
            <li>也就是说，如果你的某位干员的练度，高于大家的平均练度，那么这位干员就完全不会出现在列表里</li>
          </ol>
          <div class="github-link-container">
            <a href="https://github.com/hsyhhssyy/amiyabot-player-rating-standalone" target="_blank"
              rel="noopener noreferrer">
              <img src="@/assets/github-octocat.png" alt="查看GitHub项目" class="github-icon" />
              <span>查看GitHub项目</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <button @click="handleButtonClick">返回首页</button>

  </div>
</template>
  
<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // 导入 vue-router 的 useRouter 钩子
import axios from 'axios';
import { HmacSHA1, enc } from 'crypto-js';

interface ScoreDetail {
  characterId: string;
  total: number;
  totalAveraged: number;
  evolvePhaseText: string;
  level: number;
  levelText: string;
  levelAveraged: number;
  skillLevel: number;
  specialize: number;
  specializeText: string;
  specializeText1: string;
  specializeText2: string;
  specializeText3: string;
  specializeAveraged: number;
  equip: number;
  equipText: string;
  equipText1: string;
  equipText2: string;
  equipAveraged: number;
  name: string;
  potential: number;
  potentialSuggestion: string;
}

export default {
  name: 'PlayerRating',
  setup() {
    const router = useRouter(); // 初始化 router 对象

    const expanded = ref(false);
    const ruleExpanded = ref(false);
    const loading = ref(true);
    const tokenValue = ref("");
    const scoreDetails = ref<ScoreDetail[]>([]);
    const suggestions = ref<String[]>([]);
    const updateTime = ref(Date.now());

    const sortKey = ref<string | null>(null);
    const sortDirection = ref<'asc' | 'desc'>('asc');

    const sortedItems = computed(() => {
      if (!sortKey.value) {
        return scoreDetails.value;
      }
      return [...scoreDetails.value].sort((a, b) => {
        console.log(`${(a as any)[sortKey.value!]} vs ${(b as any)[sortKey.value!]}`)
        if ((a as any)[sortKey.value!] < (b as any)[sortKey.value!]) {
          return sortDirection.value === 'asc' ? -1 : 1;
        }
        if ((a as any)[sortKey.value!] > (b as any)[sortKey.value!]) {
          return sortDirection.value === 'asc' ? 1 : -1;
        }
        return 0;
      });
    });

    const sortTable = (key: string) => {
      if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortDirection.value = 'asc';
      }
    };


    const doctorScore = ref({
      name: "",
      charsTotal: 0,
      scoreTotal: 0,
      scoreBaseTotal: 0,
      scoreLevelTotal: 0,
      scoreSpecializeTotal: 0,
      scoreEquipTotal: 0
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


    const handleButtonClick = () => {
      sessionStorage.removeItem('tokenValue')
      router.push({ name: 'AquireToken' });
    };

    const calcuate_single_char = (character: any, charMapData: any, averageData: any) => {
      let scoreDict = {
        characterId: "",
        total: 0,
        totalAveraged: 0,
        evolvePhaseText: "",
        level: 0,
        levelAveraged: 0,
        levelText: "",
        skillLevel: 0,
        specialize: 0,
        specializeAveraged: 0,
        specializeText: "",
        specializeText1: "",
        specializeText2: "",
        specializeText3: "",
        equip: 0,
        equipAveraged: 0,
        equipText: "",
        equipText1: "",
        equipText2: "",
        potential: 0,
        potentialSuggestion: ""
      };
      let baseIncrease = 0;
      let evolveIncrease = 0;
      let minEquiptLevel = 100;

      switch (charMapData.rarity) {
        case 5:
          baseIncrease = 50;
          evolveIncrease = 80;
          minEquiptLevel = 60;
          break;
        case 4:
          baseIncrease = 50;
          evolveIncrease = 70;
          minEquiptLevel = 50;
          break;
        case 3:
          baseIncrease = 45;
          evolveIncrease = 60;
          minEquiptLevel = 40;
          break;
        case 2:
          baseIncrease = 40;
          break;
      }

      if (character.evolvePhase === 0) scoreDict.level = character.level;
      if (character.evolvePhase === 1) scoreDict.level = character.level + baseIncrease;
      if (character.evolvePhase === 2) scoreDict.level = character.level + baseIncrease + evolveIncrease;

      const averageCalculatedLevel = averageData.averageCalculatedLevel;
      const levelScore = 2 * scoreDict.level - averageCalculatedLevel;

      scoreDict.characterId = character.charId

      scoreDict.levelAveraged = levelScore;
      scoreDict.evolvePhaseText = `${character.evolvePhase}`
      scoreDict.levelText = `${character.level}`

      scoreDict.skillLevel = character.mainSkillLvl

      // 计算提升潜力
      let maxSpecializeSkillIndex = 0;
      let maxSpecializeDifference = 0;
      scoreDict.specializeText = ""
      character.skills.forEach((skill: any, index: number) => {
        const averageSpecializeLevel = averageData.averageSpecializeLevel[index];
        const specializeScore = (2 * skill.specializeLevel - averageSpecializeLevel) * 30;

        scoreDict.specialize += skill.specializeLevel * 30;
        scoreDict.specializeAveraged += specializeScore;

        scoreDict.specializeText += `${index + 1}:${skill.specializeLevel} `

        switch (index) {
          case 0:
            scoreDict.specializeText1 = `${skill.specializeLevel}`
            break
          case 1:
            scoreDict.specializeText2 = `${skill.specializeLevel}`
            break
          case 2:
            scoreDict.specializeText3 = `${skill.specializeLevel}`
            break
        }

        // 计算技能专精分差距最大值
        const specializeDifference = (averageSpecializeLevel - skill.specializeLevel) * 30;
        if (specializeDifference > maxSpecializeDifference) {
          maxSpecializeSkillIndex = index
          maxSpecializeDifference = specializeDifference
        }
      });

      let maxEquipDifference = 0;
      let maxEquipIndex = 0;
      character.equip.forEach((equipment: any, index: number) => {
        if (index === 0) return;

        const averageEquipLevel = averageData.averageEquipLevel[index.toString()] || 0;
        const equipScore = (2 * equipment.level - averageEquipLevel) * 20;
        scoreDict.equip += equipment.level * 20;
        scoreDict.equipAveraged += equipScore;


        scoreDict.equipText += `${index + 1}:${equipment.level} `

        switch (index) {
          case 1:
            scoreDict.equipText1 = `${equipment.level}`
            break
          case 2:
            scoreDict.equipText2 = `${equipment.level}`
            break
        }

        // 计算模组分差距最大值
        const equipDifference = (averageEquipLevel - equipment.level) * 20;
        if (equipDifference > maxEquipDifference) {
          maxEquipIndex = index
          maxEquipDifference = equipDifference
        }
      });

      scoreDict.total = scoreDict.level + scoreDict.specialize + scoreDict.equip;

      if (scoreDict.specializeAveraged < 0) {
        scoreDict.specializeAveraged = 0;
      }

      if (scoreDict.equipAveraged < 0) {
        scoreDict.equipAveraged = 0;
      }

      if (scoreDict.levelAveraged < 0) {
        scoreDict.levelAveraged = 0;
      }

      scoreDict.totalAveraged = scoreDict.levelAveraged + scoreDict.specializeAveraged + scoreDict.equipAveraged;

      //let potentialSuggestion = `averageCalculatedLevel=${averageCalculatedLevel} averageData.averageEvolvePhase=${averageData.averageEvolvePhase} scoreDict.level=${scoreDict.level} character.level=${character.level} averageData.averageLevel=${averageData.averageLevel} minEquiptLevel=${minEquiptLevel}`
      let potentialSuggestion = ""

      if (character.evolvePhase < averageData.averageEvolvePhase) {
        if (averageData.averageEvolvePhase < 2 && charMapData.rarity > 2) {
          scoreDict.potential = 0;
        } else {
          scoreDict.potential = (averageCalculatedLevel - scoreDict.level) * 2;
        }

        potentialSuggestion += `提升${charMapData.name}干员到精英化${averageData.averageEvolvePhase}阶段，并建议升至${Math.ceil(averageData.averageLevel)}级`;

      } else if (character.level < averageData.averageLevel) {
        scoreDict.potential = averageCalculatedLevel - scoreDict.level + maxSpecializeDifference + maxEquipDifference;
        potentialSuggestion += `提升${charMapData.name}干员的等级至精英化${character.evolvePhase} ${Math.ceil(averageData.averageLevel)}级`;
      } else {
        scoreDict.potential = averageCalculatedLevel - scoreDict.level + maxSpecializeDifference + maxEquipDifference;
        potentialSuggestion += `提升${charMapData.name}干员`;
      }

      let hasEquip = character.equip && character.equip.length > 1;

      if (maxSpecializeSkillIndex > 0 && (averageData.averageEvolvePhase >= 2 || character.evolvePhase >= 2)) {
        potentialSuggestion += `，专精${maxSpecializeSkillIndex + 1}技能至专${Math.ceil(averageData.averageSpecializeLevel[maxSpecializeSkillIndex])}`;
      }

      if (hasEquip && maxEquipIndex > 0 && (averageData.averageEvolvePhase >= 2 || character.evolvePhase >= 2)
        && (character.level >= minEquiptLevel || averageData.averageLevel >= minEquiptLevel)) {
        potentialSuggestion += `，开启${maxEquipIndex}模组至${Math.ceil(averageData.averageEquipLevel[maxEquipIndex])}级`;
      }

      scoreDict.potentialSuggestion = potentialSuggestion + `。(+${Math.ceil(scoreDict.potential)})`;

      return scoreDict;
    };

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

        response = await axios.get("/latest_character_statistic.json");
        const characterStatisticsData: any = response.data.data; // 根据你的数据结构进行调整
        updateTime.value = response.data.versionEnd

        let totalScores = 0;
        let totalLevelScores = 0;
        let totalSpecializeScores = 0;
        let totalEquipScores = 0;

        infoData.chars.forEach((character: { charId: string | number; }) => {
          const charMapData = infoData.charInfoMap[character.charId];

          const averageData = characterStatisticsData.find((stat: { characterId: string }) => stat.characterId === character.charId);

          const scoreDict = calcuate_single_char(character, charMapData, averageData);

          totalScores += scoreDict.totalAveraged;
          totalLevelScores += scoreDict.levelAveraged;
          totalSpecializeScores += scoreDict.specializeAveraged;
          totalEquipScores += scoreDict.equipAveraged;

          let charName = charMapData.name
          if (scoreDict.characterId == "char_1001_amiya2") {
            charName = "阿米娅-近卫"
          }

          if (scoreDict.total !== 0) {
            scoreDetails.value.push({
              name: charName,
              ...scoreDict
            });
          }
        });

        doctorScore.value.charsTotal = infoData.chars.length;
        doctorScore.value.scoreTotal = totalScores;
        doctorScore.value.scoreLevelTotal = totalLevelScores;
        doctorScore.value.scoreSpecializeTotal = totalSpecializeScores;
        doctorScore.value.scoreEquipTotal = totalEquipScores;

        // 找出total比totalAveraged少的项目
        const lowerTotalDetails = scoreDetails.value.filter(detail => detail.potential > 50);

        const sortedScoreDicts = lowerTotalDetails.sort((a, b) => b.potential - a.potential);

        // 获取前五个潜力最高的
        //const topFivePotentials = sortedScoreDicts;
        const topFivePotentials = sortedScoreDicts.slice(0, 10);

        // 输出建议
        const topFiveSuggestions = topFivePotentials.map(dict => dict.potentialSuggestion);

        suggestions.value = topFiveSuggestions;

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

    const toggleRule = () => {
      ruleExpanded.value = !ruleExpanded.value;
    };

    return {
      loading,
      tokenValue,
      expanded,
      ruleExpanded,
      doctorScore,
      scoreDetails,
      toggleText,
      toggleRule,
      handleButtonClick,
      updateTime,
      sortedItems,
      sortTable,
      sortKey,
      sortDirection,
      suggestions
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

.note {
  font-size: 12px;
  margin-top: 10px;
}

.info-card .total-score {
  font-size: 24px;
  /* 或任何你想要的大小 */
  text-align: center;
  margin-top: 15px;
}

.info-card .warning {
  font-size: 14px;
  color: #e74c3c;
  margin-top: 10px;
}


.scoring-rules {
  padding: 20px;
}

h2 {
  color: #333;
  font-size: 24px;
}

p,
li {
  color: #555;
  font-size: 16px;
}

.github-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

button {
  align-self: start;
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.sorted-asc {
  background-color: #e0e0e0;
  font-weight: bold;
}

.sorted-desc {
  background-color: #c0c0c0;
  font-weight: bold;
}

.sorted-asc::after {
  content: "↑";
}

.sorted-desc::after {
  content: "↓";
}
</style>
  