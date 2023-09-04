
export interface DoctorScore {
    scoreEquipFactorTotal: number;
    scoreSpecializeFactorTotal: number;
    scoreLevelFactorTotal: number;
    name: string;
    charsTotal: number;
    scoreTotal: number;
    scoreFactorTotal: number;
    scoreBaseTotal: number;
    scoreLevelTotal: number;
    scoreSpecializeTotal: number;
    scoreEquipTotal: number;
  }
  
  
export interface ScoreDetail {
    characterId: string;
    factor:number;
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