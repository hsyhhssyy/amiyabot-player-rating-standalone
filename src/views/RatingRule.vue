<template>
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
      <li>如果该项目的平均得分为X，而你的得分为Y，则补正为：2*Y-X</li>
      <li>比如玛恩纳的平均等级分为220分（平均精二满级），而你的练度为190分（精二60级）</li>
      <li>则你的分数为 2 * 190 - 220 = 160</li>
    </ol>
    <p>
      基础得分代表了养成投入的资源。
    </p>
    <p>
      而补正得分则是对你的惩罚和奖励。
    </p>
    <p>
      如果大家都练你不练，则你的分数会低于练度应得的基础分，如果差太多甚至会扣分。反之，如果大家都不练但是你练了，那么会加奖励分，差距越大，加的越多。
    </p>
    <h2>关于练度推荐</h2>    
    <p>
      计算得分时，还会同时计算提升潜力，然后按顺序展示提升潜力最大的前五位（注意，提升潜力和分数差距并不完全相关）。
    </p>
    <ol>
      <li>如果你的某个干员的精英化等级落后于平均精英化等级，提升潜力=与平均等级分的差距*2 。这项的目的是首先推荐精英化等级落后的干员。</li>
      <li>如果你的干员的精英化等级高于平均精英化等级，则提升潜力=与平均等级分的差距+技能专精分差距最大的那个技能的技能专精分+模组分差距最大的那个模组的模组分。</li>
    </ol>
    <div class="github-link-container">
      <a href="https://github.com/hsyhhssyy/amiyabot-player-rating-standalone" target="_blank" rel="noopener noreferrer">
        <img src="@/assets/github-octocat.png" alt="查看GitHub项目" class="github-icon" />
        <span>查看GitHub项目</span>
      </a>
    </div>
  </div>

</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'RatingRules',

  setup() {
    // 可以在此处添加你的组合式API代码
    return {
      // 任何你想要返回到模板的响应式引用
    };
  }
};
</script>

<style scoped>
/* 这里是组件的样式 */
.scoring-rules {
  padding: 20px;
}

h2 {
  color: #333;
  font-size: 24px;
}

p, li {
  color: #555;
  font-size: 16px;
}

.github-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
</style>
