一个Vue组件,单文件,TypeScript,组合式Api风格


const calcuate_single_char = (character: any, charMapData: any,averageData :any) => {
      let scoreDict = {
        total: 0,
        totalAveraged:0,
        level: 0,
        levelAveraged:0,
        specialize: 0,
        specializeAveraged:0,
        equip: 0,
        equipAveraged:0
      };

      let baseIncrease = 0;
      let evolveIncrease = 0;

        switch (charMapData.rarity) {
          case 5:
              baseIncrease = 50;
              evolveIncrease = 80;
              break;
          case 4:
              baseIncrease = 50;
              evolveIncrease = 70;
              break;
          case 3:
              baseIncrease = 45;
              evolveIncrease = 60;
              break;
          case 2:
              baseIncrease = 40;
              break;
        }

        if (character.evolvePhase == 0) scoreDict.level = character.level;
    if (character.evolvePhase == 1) scoreDict.level = character.level + baseIncrease;
    if (character.evolvePhase == 2) scoreDict.level = character.level + baseIncrease + evolveIncrease;

            const averageCalculatedLevel = averageData.averageCalculatedLevel;
            const levelScore = 2 * scoreDict.level - averageCalculatedLevel;

            scoreDict.levelAveraged = levelScore;

            character.skills.forEach((skill: { specializeLevel: any; }, index: number) => {
              const averageSpecializeLevel = averageData.averageSpecializeLevel[index];
              const specializeScore = ( 2 * skill.specializeLevel - averageSpecializeLevel ) * 30;
              scoreDict.specialize += skill.specializeLevel * 30;
              scoreDict.specializeAveraged += specializeScore;
            });

            character.equip.forEach((equipment: { level: any; }, index: number) => {
              if(index==0){
                return
              }

              const averageEquipLevel = averageData.averageEquipLevel[index.toString()];
              const equipScore = ( 2 * equipment.level - averageEquipLevel ) * 20;
              scoreDict.equip += equipment.level *  20;
              scoreDict.equipAveraged += equipScore;

              if(isNaN(scoreDict.equipAveraged)){
                debugger
              }

            });

            scoreDict.total = scoreDict.level + scoreDict.specialize + scoreDict.equip;
        scoreDict.totalAveraged = scoreDict.levelAveraged + scoreDict.specializeAveraged + scoreDict.equipAveraged;
      

      return scoreDict;
    }

    请修改这个函数
计算得分时，还会同时计算提升潜力
如果你的某个干员的精英化等级落后于平均精英化等级，提升潜力=与平均等级分的差距*2 。这项的目的是首先推荐精英化等级落后的干员。
如果你的干员的精英化等级高于平均精英化等级，则提升潜力=与平均等级分的差距+技能专精分差距最大的那个技能的技能专精分+模组分差距最大的那个模组的模组分。

