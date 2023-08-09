<template>
  <div class="scoring-rules">
    <h2>计分规则</h2>
    <p>初版因为没有收集到足够的玩家练度数据，因此打分规则暂时固定如下：</p>
    <ol>
      <li>只有精二的干员才算分</li>
      <li>算分规则为 干员基础分（Box深度分）+干员等级分+干员专精分+干员模组分</li>
      <li>干员基础分：4星40分，5星70分，6星100分</li>
      <li>干员等级分：每1级1分</li>
      <li>干员专精分：每个技能 专1：20分 专2：60分，专3:100分</li>
      <li>干员模组分：每个模组 1级：0分 2级：30分，3级：50分</li>
    </ol>
    <p>
      其中1模0分的原因是鹰角目前森空岛的接口有Bug，没开的模组也会显示1级，所以插件没办法知道你开没开1级模组，总不能每个有模组的人都有分吧，因此1模改为0分
    </p>
    <p>
      目前的打分规则代表了养成投入的资源，未来会根据干员持有率来统计强度（大家都练的干员更强，大家都专的技能更强）然后根据强度加权计算平均强度分。
    </p>
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
