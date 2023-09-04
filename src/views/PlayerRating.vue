<template>
  <div class="container">
    <div v-if="loading" class="loading-mask">加载中，请稍候...</div>
    <div class="info-card">
      <h2>{{ doctorScore.name }} 博士</h2>
      <table>
        <!-- <tr>
          <th></th>
          <th>原始分数<p class="note">不考虑大数据练度</p></th>
          <th>加权分数<p class="note">考虑大数据练度</p></th>
        </tr> -->
        <tr>
          <td>干员总数</td>
          <td class="char-total" colspan="2" >{{ doctorScore.charsTotal }}</td>
        </tr>
        <tr>
          <td>干员等级分</td>
          <!-- <td>{{ Math.round(doctorScore.scoreLevelTotal) }}</td> -->
          <td>{{ Math.round(doctorScore.scoreLevelFactorTotal) }}</td>
        </tr>
        <tr>
          <td>干员专精分</td>
          <!-- <td>{{ Math.round(doctorScore.scoreSpecializeTotal) }}</td> -->
          <td>{{ Math.round(doctorScore.scoreSpecializeFactorTotal) }}</td>
        </tr>
        <tr>
          <td>干员模组分</td>
          <!-- <td>{{ Math.round(doctorScore.scoreEquipTotal) }}</td> -->
          <td>{{ Math.round(doctorScore.scoreEquipFactorTotal) }}</td>
        </tr>
        <tr>
          <td><p class="total-score">总分</p></td>
          <!-- <td><strong class="total-score">{{ Math.round(doctorScore.scoreTotal) }}&nbsp;</strong></td> -->
          <td><strong class="total-score">{{ Math.round(doctorScore.scoreFactorTotal) }}&nbsp;</strong></td>
        </tr>
      </table>
      <p class="note">补正用平均练度数据更新于：{{ updateTime }} &nbsp;规则更新于：2023-09-04T14:30</p>
      <p class="warning">该分数仅供娱乐，请不要用这个分数来评判博士呦~~</p>
    </div>

    <div class="info-card">
      下一步干员养成建议，仅列出当前练度低于平均水平的干员，仅供参考。
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
              <th @click="sortTable('factor')"
                :class="{ 'sorted-asc': sortKey === 'factor' && sortDirection === 'asc', 'sorted-desc': sortKey === 'factor' && sortDirection === 'desc' }">
                系数</th>
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
              <td>{{ detail.factor.toFixed(2) }}</td>
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
          <h2>加权因子</h2>
          <p>首先，计算一个干员加权因子W，这个因子的计算公式如下：<p id="formula" v-html="html"></p>
            </p>
            <p>该系数用于指示干员的热度，越是平均接近满练，则越是代表大家喜欢去练这个干员。因此对这个干员的奖励和惩罚都会变大。</p>
          <h2>计分规则</h2>
          <p>打分规则如下：</p>
          <p>计算玩家的各项分数</p>
          <ol>
            <li>干员等级分：每1级1分（将精英化也考虑进去，比如精二10级的玛恩纳，是50+80+10=140分）</li>
            <li>干员专精分：每个专精等级30分</li>
            <li>干员模组分：每个模组等级20分</li>
          </ol>
          <p>
            然后，根据最新统计的玩家练度数据（首页有展示），计算每项分数的补正如下：
          </p>
          <ol>
            <li>如果该项目的平均得分为X，而你的得分为Y，则补正为：X+(X-Y)*W</li>
            <li>比如玛恩纳的平均等级分为220分（平均精二满级），而你的练度为190分（精二60级），而玛恩纳的系数为0.9</li>
            <li>则你的分数为 190 + (190 -220) * 0.9 = 163</li>
            <li>任何单项的分数不会低于0分</li>
          </ol>
          <p>
            我期望基础得分代表了养成投入的资源,而加权得分则是对你的惩罚和奖励。
          </p>
          <p>
            如果大家都练你不练，则你的分数会低于练度应得的基础分。反之如果大家都不练但是你练了，那么会加奖励分。
          </p>
          <h2>练度推荐</h2>
          <p>
            计算得分时，还会同时计算提升潜力，（注意，提升潜力和分数差距并不完全相关）。
          </p>
          <ol>            
            <li>干员的提升潜力 = W * (干员的平均分数 - 你的加权前分数)</li>
            <li>接下来会将所有你拥有的干员根据潜力值排序，并过滤掉潜力值低于50的干员（以及潜力值负数的干员）</li>
            <li>按顺序展示提升潜力最大的前十位并输出你和平均水平的差距，作为练度提升建议。</li>
            <li>不会展示推荐将四五六星的等级提升到精0或者精1的提示。</li>
            <li>括号后面标记的是该干员的提升潜力，并不是练完以后会加的分数，一般来说，练完以后会加的分数比潜力值要高。</li>
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
import calculate_score from '../algorithms/calcuate_character_score';
import type { DoctorScore, ScoreDetail } from '../algorithms/interface';
import katex from 'katex'

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
    const updateTime = ref<String>("");

    const doctorScore = ref<DoctorScore>({
      name: "",
      charsTotal: 0,
      scoreTotal: 0,
      scoreBaseTotal: 0,
      scoreLevelTotal: 0,
      scoreSpecializeTotal: 0,
      scoreEquipTotal: 0,
      scoreEquipFactorTotal: 0,
      scoreSpecializeFactorTotal: 0,
      scoreLevelFactorTotal: 0,
      scoreFactorTotal: 0
  })

    const html = computed(() => katex.renderToString('W = e^{0.01 \\times (\\text{样本平均分} - \\text{干员满分})}', { output: "mathml" }))

    const sortKey = ref<string | null>(null);
    const sortDirection = ref<'asc' | 'desc'>('asc');

    const sortedItems = computed(() => {
      if (!sortKey.value) {
        return scoreDetails.value;
      }
      return [...scoreDetails.value].sort((a, b) => {
        //console.log(`${(a as any)[sortKey.value!]} vs ${(b as any)[sortKey.value!]}`)
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

    const handleButtonClick = () => {
      sessionStorage.removeItem('tokenValue')
      router.push({ name: 'AquireToken' });
    };

    onMounted(async () => {
      const storedToken = sessionStorage.getItem('tokenValue');
      if (storedToken) {
        tokenValue.value = storedToken;
        let success = await calculate_score(storedToken, doctorScore, updateTime, scoreDetails, suggestions, loading)
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
      html,
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

.info-card th {
  padding: 5px 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
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
  text-align: left;
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
  