一个Vue组件,单文件,TypeScript,组合式Api风格


const cards = ref([
        {
          id: 1,
          image: 'https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/char_2015_dusk%232.png',
          avgEliteLevel: 2.01,
          avgLevel: 50.01,
          avgSkillLevel: 5.01,
          avgSkill1: 2.01,
          avgSkill2: 3.01,
          avgSkill3: 2.01,
          avgModule1: 1.01,
          avgModule2: 2.01
        },
        {
          id: 1,
          image: 'https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/char_2015_dusk%232.png',
          avgEliteLevel: 2,
          avgLevel: 50,
          avgSkillLevel: 5,
          avgSkill1: 2,
          avgSkill2: 3,
          avgSkill3: 2,
          avgModule1: 1,
          avgModule2: 2
        },
        {
          id: 1,
          image: 'https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/char_2015_dusk%232.png',
          avgEliteLevel: 2,
          avgLevel: 50,
          avgSkillLevel: 5,
          avgSkill1: 2,
          avgSkill2: 3,
          avgSkill3: 2,
          avgModule1: 1,
          avgModule2: 2
        },
        // ... more cards
      ]);
  
      return { cards };

现在我希望这个cards的数据来自于url https://amiya-bot-service.hsyhhssyy.net/characterStatistics
这个url的内容是一个json
例子如下:
{
    "versionStart": "2023-07-04T12:44:26.0000000+08:00",
    "versionEnd": "2023-09-02T12:44:26.0000000+08:00",
    "batchCount": 512,
    "data": [
        {
            "sampleCount": 484,
            "characterId": "char_4043_erato",
            "averageEvolvePhase": 0.72,
            "averageLevel": 20.89,
            "averageSkillLevel": 3.65,
            "averageSpecializeLevel": [
                0.13,
                0.06
            ],
            "averageEquipLevel": {
                "0": 1,
                "1": 1.01
            }
        },
        ....一些数据
        ]
}

image的地址为 https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/{characterId}#1.png