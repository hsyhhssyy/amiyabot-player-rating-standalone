一个Vue组件,单文件,TypeScript,组合式Api风格

我现在开发了一个游戏内角色养成的统计系统，通过该系统收集了许多玩家的角色的平均等级。
现在我想根据这个统计数据，提供一个角色培养建议。
用户提交了他当前的角色等级列表后，我为其列出一个推荐其升级的角色的列表和推荐他升到的等级。
请结合下面几个数据，给出几个计算方案的参考：
“用户角色X当前等级” “角色X平均等级” “拥有该角色的玩家的数量” “样本总数”

这里判断热门与否，不能使用玩家持有率，因为玩家不可以控制他持有什么角色，最好是仅考虑“用户角色X当前等级” “角色X平均等级” 

我希望这个数据能够优先让玩家将热门角色的等级补到平均等级以上，然后再拉高冷门角色的等级。
但是你的这个公式会导致玩家优先将完全没练的冷门角色拉到中等练度，因为热门角色可能已经很接近平均等级了。

还有其他方案吗？最好不要机械的划分热门和冷门，而是给出一个因子来平滑的影响优先级

文件 "/home/hsyhhssyy/amiya-bot/vue-project/amiyabot-player-rating-standalone/src/algorithms/calcuate_character_score.ts" 不在项目 "/home/hsyhhssyy/amiya-bot/vue-project/amiyabot-player-rating-standalone/tsconfig.app.json" 的文件列表中。项目必须列出所有文件，或使用 "include" 模式。ts(6307) 


{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*","src/**/*.d.ts","src/**/*.ts", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

这个不对吗?


调整了推荐算法，现在改为计算权重系数
新的权重系数为 系数 = e^(0.01*(平均分数-干员满分))
然后，推荐度算法改为 (平均分-你分数)*系数
这个系数和计算分数时的线性加权不一样，目的是为了提高热门干员的占比。
比如，热门干员玛恩纳的系数高达0.9，而冷门干员图耶的系数只有0.05
那么，如果你玛恩纳是精2 1级，而图耶完全没练，系统仍然会推荐你先把玛恩纳升满。

修改了计分规则，用于对热门干员和冷门干员进行额外的奖惩，防止出现两个冷门干员顶一个热门干员的情况。具体规则可以看页面下面的计分规则。



/* color palette from <https://github.com/vuejs/theme> */
:root {
  --vt-c-white: #ffffff;
  --vt-c-white-soft: #f8f8f8;
  --vt-c-white-mute: #f2f2f2;

  --vt-c-black: #181818;
  --vt-c-black-soft: #222222;
  --vt-c-black-mute: #282828;

  --vt-c-indigo: #2c3e50;

  --vt-c-divider-light-1: rgba(60, 60, 60, 0.29);
  --vt-c-divider-light-2: rgba(60, 60, 60, 0.12);
  --vt-c-divider-dark-1: rgba(84, 84, 84, 0.65);
  --vt-c-divider-dark-2: rgba(84, 84, 84, 0.48);

  --vt-c-text-light-1: var(--vt-c-indigo);
  --vt-c-text-light-2: rgba(60, 60, 60, 0.66);
  --vt-c-text-dark-1: var(--vt-c-white);
  --vt-c-text-dark-2: rgba(235, 235, 235, 0.64);
}

/* semantic color variables for this project */
:root {
  --color-background: var(--vt-c-white);
  --color-background-soft: var(--vt-c-white-soft);
  --color-background-mute: var(--vt-c-white-mute);

  --color-border: var(--vt-c-divider-light-2);
  --color-border-hover: var(--vt-c-divider-light-1);

  --color-heading: var(--vt-c-text-light-1);
  --color-text: var(--vt-c-text-light-1);

  --section-gap: 160px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);

    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);

    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


这段css是否涉及浏览器深色模式?如果涉及,能否改成固定颜色不随着深色模式切换?



http://localhost:5174/OAuth?client-id=3c7ba8ceefb140f0a14c9124ffa409b1&state=testState&redirectUri=https%3A%2F%2Famiya-bot-score.hsyhhssyy.net%2FOAuthGetBox