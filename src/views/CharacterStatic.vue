<template>
    <div class="title">当前干员平均练度数据 样本总数:{{ batchCount }} 最后更新于:{{ updateTime }}</div>
    <div class="card-list">
      <div v-for="card in cards" :key="card.id" class="card">
        <img :src="card.image" :alt="card.imageAlt" class="card-image"/>
        <div class="card-text">
          <p class="line" style="font-size: 16px;">
            平均等级：&nbsp;精<span class="highlight">{{ card.avgEliteLevel }}&nbsp;-&nbsp;{{ card.avgLevel }}</span>级。平均 <span class="highlight"> {{ card.avgSkillLevel }}</span> 级技能 
          </p>
          <p class="line" style="font-size: 16px;" v-if="card.avgSkill1 !== undefined ">  
            平均专精：
            <span v-if="card.avgSkill1 !== undefined">1技能 <span class="highlight"> {{ card.avgSkill1 }}</span></span>
            &nbsp;
            <span v-if="card.avgSkill2 !== undefined">2技能 <span class="highlight"> {{ card.avgSkill2 }}</span></span>
            &nbsp;
            <span v-if="card.avgSkill3 !== undefined">3技能 <span class="highlight"> {{ card.avgSkill3 }}</span></span>
          </p>

          <p class="line" style="font-size: 16px;" v-if="card.avgModule1 !== undefined">
          平均模组：
          <span v-if="card.avgModule1 !== undefined">1模组 <span class="highlight"> {{ card.avgModule1 }}</span></span>
          &nbsp;
          <span v-if="card.avgModule2 !== undefined">2模组 <span class="highlight"> {{ card.avgModule2 }}</span></span>
          <!-- ...其他模组 -->
        </p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref , onMounted, onBeforeUnmount } from 'vue';
  import axios from "axios";

  interface Card {
  id: string;
  image: string;
  imageAlt: string;
  avgEliteLevel: number;
  avgLevel: number;
  avgSkillLevel: number;
  avgSkill1?: number; // 使用 ? 表示这是可选的字段
  avgSkill2?: number; // 使用 ? 表示这是可选的字段
  avgSkill3?: number; // 使用 ? 表示这是可选的字段
  avgModule1?: number; // 使用 ? 表示这是可选的字段
  avgModule2?: number; // 使用 ? 表示这是可选的字段
  // ...其他模组可以继续添加
}

  export default defineComponent({
    name: 'CharacterStatic',
    setup() {

      onMounted(() => {
      addMetaReferrer();
    });

    // 生命周期钩子 onBeforeUnmount
    onBeforeUnmount(() => {
      removeMetaReferrer();
    });

    // 添加 <meta> 标签的函数
    function addMetaReferrer() {
      const meta = document.createElement('meta');
      meta.name = 'referrer';
      meta.content = 'no-referrer';
      meta.id = 'dynamic-referrer-meta';  // 添加 id 以便稍后移除它
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // 移除 <meta> 标签的函数
    function removeMetaReferrer() {
      const meta = document.getElementById('dynamic-referrer-meta');
      if (meta) {
        document.getElementsByTagName('head')[0].removeChild(meta);
      }
    }

    const cards = ref<Card[]>([]);
    const updateTime = ref(Date.now());
    const batchCount = ref(1);
    
    const getImage = (characterName:any)=>{
      if(characterName=="char_1001_amiya2"){
        return `https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/char_1001_amiya2@casc%231.png`
      }
      return `https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/${characterName}%231.png`
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/hsyhhssyy/amiyabot-player-rating-standalone/master/latest_character_statistic.json");
        const data = response.data.data; // 根据你的数据结构进行调整
        updateTime.value = response.data.versionEnd
        batchCount.value = response.data.batchCount
        // 转换数据到`cards`格式
        const transformedData = data.map((item: any) => {
          return {
            id: item.characterId,
            image: getImage(item.characterId),
            imageAlt: item.characterId,
            avgEliteLevel: item.averageEvolvePhase,
            avgLevel: item.averageLevel,
            avgSkillLevel: item.averageSkillLevel,
            avgSkill1: item.averageSpecializeLevel.length > 0 ? item.averageSpecializeLevel[0] : undefined,
            avgSkill2: item.averageSpecializeLevel.length > 1 ? item.averageSpecializeLevel[1] : undefined,
            avgSkill3: item.averageSpecializeLevel.length > 2 ? item.averageSpecializeLevel[2] : undefined,
            avgModule1: item.averageEquipLevel["1"] !== undefined ? item.averageEquipLevel["1"] : undefined,
            avgModule2: item.averageEquipLevel["2"] !== undefined ? item.averageEquipLevel["2"] : undefined,
          };
        });

            // 对 transformedData 进行排序
    transformedData.sort((a:any, b:any) => {
      if (a.avgEliteLevel > b.avgEliteLevel) return -1;
      if (a.avgEliteLevel < b.avgEliteLevel) return 1;
      if (a.avgLevel > b.avgLevel) return -1;
      if (a.avgLevel < b.avgLevel) return 1;
      return 0;
    });

        cards.value = transformedData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // 在组件挂载完成后获取数据
    onMounted(fetchData);

      return { cards, updateTime, batchCount };
    }
  });
  </script>
  
  <style scoped>

.title {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.card-list {
    display: flex;
    flex-wrap: wrap;
    overflow-x: auto;
    width: 100%;
  }
  
  .card {
    width: 400px; /* Set fixed width */
    height: 50px; /* Set fixed height */
    margin: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row; /* Changed to row */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  
  .card-image {
    height: 100%; /* Make the height match the card height */
    object-fit: cover;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px; /* Rounded corner at the bottom left */
  }
  
  .card-text {
  flex: 1;
  padding: 0.2em;  /* 调整内边距 */
  overflow-y: auto;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}

.line {
  margin: 0;
  padding: 0;
  line-height: 14px; /* 调整行高 */
  font-size: 14px;   /* 调整字体大小 */
}

.highlight {
  font-weight: bold;
  color: blue; /* 或其他你喜欢的颜色 */
}
  </style>
  