import { type Ref } from 'vue';
import axios from 'axios';
import type { DoctorScore, ScoreDetail } from './interface';
import { uploadData } from './oss_upload';
import convertToDisplayFormat from './date_process';

function calculateWeightFactor(avgLevel: number, X: number, k: number) {
  return Math.exp(k * (avgLevel - X));
}

function calcuate_single_char(character: any, charMapData: any, averageData: any) {
  let scoreDict = {
    characterId: "",
    total: 0,
    factor: 0,
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
    potentialSuggestion: "",
    potentialRank:0
  };

  let equipFactor = 20;
  let specializeFactor = 30;

  let baseIncrease = 0;
  let evolveIncrease = 0;
  let evolve2Increase = 0;
  let minEquiptLevel = 100;

  switch (charMapData.rarity) {
    case 5:
      baseIncrease = 50;
      evolveIncrease = 80;
      evolve2Increase = 90;

      minEquiptLevel = 60;
      break;
    case 4:
      baseIncrease = 50;
      evolveIncrease = 70;
      evolve2Increase = 80;

      minEquiptLevel = 50;
      break;
    case 3:
      baseIncrease = 45;
      evolveIncrease = 60;
      evolve2Increase = 70;

      minEquiptLevel = 40;
      break;
    case 2:
      baseIncrease = 40;
      evolveIncrease = 55;
      break;
    case 1:
      baseIncrease = 30;
      break;
    case 0:
      baseIncrease = 30;
      break;
  }

  if (character.evolvePhase === 0) scoreDict.level = character.level;
  if (character.evolvePhase === 1) scoreDict.level = character.level + baseIncrease;
  if (character.evolvePhase === 2) scoreDict.level = character.level + baseIncrease + evolveIncrease;

  let factor = calculateWeightFactor(averageData.averageCalculatedLevel, baseIncrease + evolveIncrease + evolve2Increase, 0.01);

  const averageCalculatedLevel = averageData.averageCalculatedLevel;
  const levelScore = scoreDict.level + (scoreDict.level - averageCalculatedLevel) * factor;

  scoreDict.characterId = character.charId
  scoreDict.factor = factor
  scoreDict.levelAveraged = levelScore;
  scoreDict.evolvePhaseText = `${character.evolvePhase}`
  scoreDict.levelText = `${character.level}`

  scoreDict.skillLevel = character.mainSkillLvl
  scoreDict.potentialRank = character.potentialRank

  // 计算提升潜力
  let maxSpecializeSkillIndex = 0;
  let maxSpecializeDifference = 0;
  scoreDict.specializeText = ""
  character.skills.forEach((skill: any, index: number) => {
    const averageSpecializeLevel = averageData.averageSpecializeLevel[index];
    const specializeScore = (skill.specializeLevel + (skill.specializeLevel - averageSpecializeLevel) * factor) * specializeFactor;

    scoreDict.specialize += skill.specializeLevel * specializeFactor;
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
    const specializeDifference = (averageSpecializeLevel - skill.specializeLevel) * specializeFactor;
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
    const equipScore = (equipment.level + (equipment.level - averageEquipLevel) * factor) * equipFactor;
    scoreDict.equip += equipment.level * equipFactor;
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
    const equipDifference = (averageEquipLevel - equipment.level) * equipFactor;
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

  //开始计算潜力值

  let hasEquip = character.equip && character.equip.length > 1;

  let rawProt = (averageData.averageCalculatedLevel - scoreDict.level)
    + (averageData.averageSpecializeLevel.reduce((acc: any, curr: any) => acc + curr, 0) * specializeFactor - scoreDict.specializeAveraged)

  if (hasEquip && maxEquipIndex > 0) {
    for (let key in averageData.averageEquipLevel) {
      if (key !== "0") {
        rawProt += averageData.averageEquipLevel[key] * equipFactor;
      }
    }
    rawProt = rawProt - scoreDict.equipAveraged;
  }

  scoreDict.potential = factor * rawProt

  //let potentialSuggestion = `averageCalculatedLevel=${averageCalculatedLevel} averageData.averageEvolvePhase=${averageData.averageEvolvePhase} scoreDict.level=${scoreDict.level} character.level=${character.level} averageData.averageLevel=${averageData.averageLevel} minEquiptLevel=${minEquiptLevel}`
  //let potentialSuggestion = `factor=${factor} averageData.averageCalculatedLevel=${averageData.averageCalculatedLevel} `
  let potentialSuggestion = ""

  if (character.evolvePhase < averageData.averageEvolvePhase) {

    potentialSuggestion += `提升${charMapData.name}干员到精英化${averageData.averageEvolvePhase}阶段，并建议升至${Math.ceil(averageData.averageLevel)}级`;

  } else if (character.level < averageData.averageLevel) {
    potentialSuggestion += `提升${charMapData.name}干员的等级至精英化${character.evolvePhase} ${Math.ceil(averageData.averageLevel)}级`;
  } else {
    potentialSuggestion += `提升${charMapData.name}干员`;
  }

  if (maxSpecializeSkillIndex > 0 && (averageData.averageEvolvePhase >= 2 || character.evolvePhase >= 2)) {
    potentialSuggestion += `，专精${maxSpecializeSkillIndex + 1}技能至专${Math.ceil(averageData.averageSpecializeLevel[maxSpecializeSkillIndex])}`;
  }

  if (hasEquip && maxEquipIndex > 0 && (averageData.averageEvolvePhase >= 2 || character.evolvePhase >= 2)
    && (character.level >= minEquiptLevel || averageData.averageLevel >= minEquiptLevel)) {
    potentialSuggestion += `，开启${maxEquipIndex}模组至${Math.ceil(averageData.averageEquipLevel[maxEquipIndex])}级`;
  }

  scoreDict.potentialSuggestion = potentialSuggestion + `。(+${Math.ceil(scoreDict.potential)})`;

  return scoreDict;
}

export default async function calculate_score(token: string, doctorScore: Ref<DoctorScore>,
  updateTime: Ref<String>, scoreDetails: Ref<ScoreDetail[]>, suggestions: Ref<String[]>, loading: Ref<boolean>) {

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
    updateTime.value = convertToDisplayFormat(response.data.versionEnd)

    infoData.chars.forEach((character: { charId: string | number; }) => {
      const charMapData = infoData.charInfoMap[character.charId];

      const averageData = characterStatisticsData.find((stat: { characterId: string }) => stat.characterId === character.charId);

      if(averageData == undefined){
        return
      }

      const scoreDict = calcuate_single_char(character, charMapData, averageData);

      doctorScore.value.scoreTotal += scoreDict.total;
      doctorScore.value.scoreFactorTotal += scoreDict.totalAveraged;
      doctorScore.value.scoreLevelTotal += scoreDict.level;
      doctorScore.value.scoreLevelFactorTotal += scoreDict.levelAveraged;
      doctorScore.value.scoreSpecializeTotal += scoreDict.specialize;
      doctorScore.value.scoreSpecializeFactorTotal += scoreDict.specializeAveraged;
      doctorScore.value.scoreEquipTotal += scoreDict.equip;
      doctorScore.value.scoreEquipFactorTotal += scoreDict.equipAveraged;

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

    // 找出total比totalAveraged少的项目
    const lowerTotalDetails = scoreDetails.value.filter(detail => detail.potential > 50);
    //const lowerTotalDetails = scoreDetails.value

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