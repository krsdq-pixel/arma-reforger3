import { BallisticSolution, WeaponConfig, BallisticDataPoint, AmmoConfig } from '../types';
import { solveMortarFireMission } from '../services/ballisticsCalculator';

// ===========================================================================
// OFFICIAL IN-GAME MANUAL TABLES: US M252 81mm MORTAR (M821 HE SHELL)
// Direct 1:1 transcription from official in-game clipboard instruction sheets
// ===========================================================================

export const M252_M821_HE_CHARGE_0: BallisticDataPoint[] = [
  {
    "range": 50,
    "elevation": 1456,
    "tof": 15,
    "dElevPer100m": 12,
    "peakAlt": 276,
    "angleImpact": 88,
    "dispersion": 13
  },
  {
    "range": 100,
    "elevation": 1411,
    "tof": 15,
    "dElevPer100m": 12.2,
    "peakAlt": 276,
    "angleImpact": 85,
    "dispersion": 13
  },
  {
    "range": 150,
    "elevation": 1365,
    "tof": 14.9,
    "dElevPer100m": 12.5,
    "peakAlt": 272,
    "angleImpact": 82,
    "dispersion": 14
  },
  {
    "range": 200,
    "elevation": 1319,
    "tof": 14.8,
    "dElevPer100m": 12.9,
    "peakAlt": 268,
    "angleImpact": 79,
    "dispersion": 14
  },
  {
    "range": 250,
    "elevation": 1269,
    "tof": 14.6,
    "dElevPer100m": 13.4,
    "peakAlt": 261,
    "angleImpact": 76,
    "dispersion": 15
  },
  {
    "range": 300,
    "elevation": 1218,
    "tof": 14.4,
    "dElevPer100m": 14,
    "peakAlt": 254,
    "angleImpact": 73,
    "dispersion": 15
  },
  {
    "range": 350,
    "elevation": 1160,
    "tof": 14.1,
    "dElevPer100m": 14.8,
    "peakAlt": 244,
    "angleImpact": 70,
    "dispersion": 16
  },
  {
    "range": 400,
    "elevation": 1097,
    "tof": 13.7,
    "dElevPer100m": 15.9,
    "peakAlt": 230,
    "angleImpact": 66,
    "dispersion": 17
  },
  {
    "range": 450,
    "elevation": 1025,
    "tof": 13.2,
    "dElevPer100m": 17.5,
    "peakAlt": 214,
    "angleImpact": 61,
    "dispersion": 18
  },
  {
    "range": 500,
    "elevation": 927,
    "tof": 12.4,
    "dElevPer100m": 20.4,
    "peakAlt": 188,
    "angleImpact": 55,
    "dispersion": 19
  }
];

export const M252_M821_HE_CHARGE_1: BallisticDataPoint[] = [
  {
    "range": 100,
    "elevation": 1446,
    "tof": 19.5,
    "dElevPer100m": 16,
    "peakAlt": 466,
    "angleImpact": 87,
    "dispersion": 18
  },
  {
    "range": 200,
    "elevation": 1392,
    "tof": 19.4,
    "dElevPer100m": 16.5,
    "peakAlt": 461,
    "angleImpact": 84,
    "dispersion": 19
  },
  {
    "range": 300,
    "elevation": 1336,
    "tof": 19.2,
    "dElevPer100m": 17.2,
    "peakAlt": 452,
    "angleImpact": 80,
    "dispersion": 20
  },
  {
    "range": 400,
    "elevation": 1276,
    "tof": 18.9,
    "dElevPer100m": 18.1,
    "peakAlt": 438,
    "angleImpact": 77,
    "dispersion": 21
  },
  {
    "range": 500,
    "elevation": 1213,
    "tof": 18.6,
    "dElevPer100m": 19.2,
    "peakAlt": 424,
    "angleImpact": 73,
    "dispersion": 22
  },
  {
    "range": 600,
    "elevation": 1142,
    "tof": 18.1,
    "dElevPer100m": 20.7,
    "peakAlt": 402,
    "angleImpact": 69,
    "dispersion": 24
  },
  {
    "range": 700,
    "elevation": 1060,
    "tof": 17.4,
    "dElevPer100m": 22.8,
    "peakAlt": 371,
    "angleImpact": 64,
    "dispersion": 26
  },
  {
    "range": 800,
    "elevation": 955,
    "tof": 16.4,
    "dElevPer100m": 26.2,
    "peakAlt": 330,
    "angleImpact": 57,
    "dispersion": 29
  }
];

export const M252_M821_HE_CHARGE_2: BallisticDataPoint[] = [
  {
    "range": 200,
    "elevation": 1432,
    "tof": 24.8,
    "dElevPer100m": 20,
    "peakAlt": 754,
    "angleImpact": 86,
    "dispersion": 26
  },
  {
    "range": 300,
    "elevation": 1397,
    "tof": 24.7,
    "dElevPer100m": 20.5,
    "peakAlt": 748,
    "angleImpact": 84,
    "dispersion": 27
  },
  {
    "range": 400,
    "elevation": 1362,
    "tof": 24.6,
    "dElevPer100m": 21,
    "peakAlt": 742,
    "angleImpact": 82,
    "dispersion": 28
  },
  {
    "range": 500,
    "elevation": 1326,
    "tof": 24.4,
    "dElevPer100m": 21.7,
    "peakAlt": 730,
    "angleImpact": 80,
    "dispersion": 30
  },
  {
    "range": 600,
    "elevation": 1288,
    "tof": 24.2,
    "dElevPer100m": 22.6,
    "peakAlt": 718,
    "angleImpact": 77,
    "dispersion": 31
  },
  {
    "range": 700,
    "elevation": 1249,
    "tof": 24,
    "dElevPer100m": 23.6,
    "peakAlt": 706,
    "angleImpact": 75,
    "dispersion": 33
  },
  {
    "range": 800,
    "elevation": 1208,
    "tof": 23.7,
    "dElevPer100m": 24.8,
    "peakAlt": 688,
    "angleImpact": 72,
    "dispersion": 35
  },
  {
    "range": 900,
    "elevation": 1163,
    "tof": 23.3,
    "dElevPer100m": 26.3,
    "peakAlt": 665,
    "angleImpact": 70,
    "dispersion": 37
  },
  {
    "range": 1000,
    "elevation": 1115,
    "tof": 22.9,
    "dElevPer100m": 28.1,
    "peakAlt": 643,
    "angleImpact": 67,
    "dispersion": 40
  },
  {
    "range": 1100,
    "elevation": 1062,
    "tof": 22.3,
    "dElevPer100m": 30.5,
    "peakAlt": 609,
    "angleImpact": 64,
    "dispersion": 43
  },
  {
    "range": 1200,
    "elevation": 999,
    "tof": 21.5,
    "dElevPer100m": 33.7,
    "peakAlt": 566,
    "angleImpact": 60,
    "dispersion": 47
  },
  {
    "range": 1300,
    "elevation": 917,
    "tof": 20.4,
    "dElevPer100m": 38.8,
    "peakAlt": 510,
    "angleImpact": 55,
    "dispersion": 52
  },
  {
    "range": 1400,
    "elevation": 765,
    "tof": 17.8,
    "dElevPer100m": 48,
    "peakAlt": 388,
    "angleImpact": 46,
    "dispersion": 60
  }
];

export const M252_M821_HE_CHARGE_3: BallisticDataPoint[] = [
  {
    "range": 300,
    "elevation": 1423,
    "tof": 28.9,
    "dElevPer100m": 25,
    "peakAlt": 1024,
    "angleImpact": 85,
    "dispersion": 36
  },
  {
    "range": 400,
    "elevation": 1398,
    "tof": 28.8,
    "dElevPer100m": 25.5,
    "peakAlt": 1017,
    "angleImpact": 84,
    "dispersion": 37
  },
  {
    "range": 500,
    "elevation": 1373,
    "tof": 28.7,
    "dElevPer100m": 26,
    "peakAlt": 1010,
    "angleImpact": 82,
    "dispersion": 39
  },
  {
    "range": 600,
    "elevation": 1347,
    "tof": 28.6,
    "dElevPer100m": 26.6,
    "peakAlt": 1003,
    "angleImpact": 81,
    "dispersion": 40
  },
  {
    "range": 700,
    "elevation": 1320,
    "tof": 28.4,
    "dElevPer100m": 27.3,
    "peakAlt": 989,
    "angleImpact": 79,
    "dispersion": 42
  },
  {
    "range": 800,
    "elevation": 1292,
    "tof": 28.3,
    "dElevPer100m": 28.1,
    "peakAlt": 982,
    "angleImpact": 78,
    "dispersion": 44
  },
  {
    "range": 900,
    "elevation": 1261,
    "tof": 28.1,
    "dElevPer100m": 29.1,
    "peakAlt": 968,
    "angleImpact": 76,
    "dispersion": 46
  },
  {
    "range": 1000,
    "elevation": 1227,
    "tof": 27.9,
    "dElevPer100m": 30.2,
    "peakAlt": 954,
    "angleImpact": 74,
    "dispersion": 48
  },
  {
    "range": 1100,
    "elevation": 1193,
    "tof": 27.6,
    "dElevPer100m": 31.6,
    "peakAlt": 934,
    "angleImpact": 72,
    "dispersion": 51
  },
  {
    "range": 1200,
    "elevation": 1157,
    "tof": 27.3,
    "dElevPer100m": 33.2,
    "peakAlt": 914,
    "angleImpact": 69,
    "dispersion": 54
  },
  {
    "range": 1300,
    "elevation": 1119,
    "tof": 26.9,
    "dElevPer100m": 35.1,
    "peakAlt": 887,
    "angleImpact": 67,
    "dispersion": 57
  },
  {
    "range": 1400,
    "elevation": 1079,
    "tof": 26.4,
    "dElevPer100m": 37.4,
    "peakAlt": 854,
    "angleImpact": 65,
    "dispersion": 61
  },
  {
    "range": 1500,
    "elevation": 1037,
    "tof": 25.8,
    "dElevPer100m": 40.2,
    "peakAlt": 816,
    "angleImpact": 62,
    "dispersion": 65
  },
  {
    "range": 1600,
    "elevation": 993,
    "tof": 25.1,
    "dElevPer100m": 43.6,
    "peakAlt": 772,
    "angleImpact": 60,
    "dispersion": 70
  },
  {
    "range": 1700,
    "elevation": 944,
    "tof": 24.3,
    "dElevPer100m": 47.9,
    "peakAlt": 724,
    "angleImpact": 57,
    "dispersion": 76
  },
  {
    "range": 1800,
    "elevation": 888,
    "tof": 23.3,
    "dElevPer100m": 53.6,
    "peakAlt": 665,
    "angleImpact": 53,
    "dispersion": 83
  },
  {
    "range": 1900,
    "elevation": 818,
    "tof": 22,
    "dElevPer100m": 62,
    "peakAlt": 593,
    "angleImpact": 49,
    "dispersion": 92
  },
  {
    "range": 2000,
    "elevation": 760,
    "tof": 20.1,
    "dElevPer100m": 74,
    "peakAlt": 495,
    "angleImpact": 46,
    "dispersion": 104
  }
];

export const M252_M821_HE_CHARGE_4: BallisticDataPoint[] = [
  {
    "range": 400,
    "elevation": 1415,
    "tof": 34,
    "dElevPer100m": 31,
    "peakAlt": 1417,
    "angleImpact": 85,
    "dispersion": 45
  },
  {
    "range": 600,
    "elevation": 1378,
    "tof": 33.7,
    "dElevPer100m": 32,
    "peakAlt": 1392,
    "angleImpact": 83,
    "dispersion": 48
  },
  {
    "range": 800,
    "elevation": 1338,
    "tof": 33.3,
    "dElevPer100m": 33.2,
    "peakAlt": 1359,
    "angleImpact": 80,
    "dispersion": 52
  },
  {
    "range": 1000,
    "elevation": 1295,
    "tof": 32.8,
    "dElevPer100m": 34.8,
    "peakAlt": 1319,
    "angleImpact": 78,
    "dispersion": 56
  },
  {
    "range": 1200,
    "elevation": 1250,
    "tof": 32.2,
    "dElevPer100m": 36.8,
    "peakAlt": 1271,
    "angleImpact": 75,
    "dispersion": 61
  },
  {
    "range": 1400,
    "elevation": 1202,
    "tof": 31.5,
    "dElevPer100m": 39.2,
    "peakAlt": 1216,
    "angleImpact": 72,
    "dispersion": 67
  },
  {
    "range": 1600,
    "elevation": 1152,
    "tof": 30.7,
    "dElevPer100m": 42.2,
    "peakAlt": 1155,
    "angleImpact": 69,
    "dispersion": 74
  },
  {
    "range": 1800,
    "elevation": 1098,
    "tof": 29.8,
    "dElevPer100m": 46,
    "peakAlt": 1089,
    "angleImpact": 66,
    "dispersion": 82
  },
  {
    "range": 2000,
    "elevation": 1040,
    "tof": 28.8,
    "dElevPer100m": 50.8,
    "peakAlt": 1017,
    "angleImpact": 62,
    "dispersion": 91
  },
  {
    "range": 2200,
    "elevation": 978,
    "tof": 27.6,
    "dElevPer100m": 57,
    "peakAlt": 934,
    "angleImpact": 59,
    "dispersion": 102
  },
  {
    "range": 2400,
    "elevation": 910,
    "tof": 26.2,
    "dElevPer100m": 65.2,
    "peakAlt": 842,
    "angleImpact": 55,
    "dispersion": 115
  },
  {
    "range": 2600,
    "elevation": 834,
    "tof": 24.5,
    "dElevPer100m": 76.5,
    "peakAlt": 736,
    "angleImpact": 50,
    "dispersion": 132
  },
  {
    "range": 2800,
    "elevation": 785,
    "tof": 23.1,
    "dElevPer100m": 90,
    "peakAlt": 654,
    "angleImpact": 47,
    "dispersion": 150
  },
  {
    "range": 2900,
    "elevation": 750,
    "tof": 22,
    "dElevPer100m": 102,
    "peakAlt": 593,
    "angleImpact": 45,
    "dispersion": 165
  }
];

// ===========================================================================
// OFFICIAL IN-GAME MANUAL TABLES: SOVIET 2B14 PODNOS 82mm (O-832DU HE)
// Direct 1:1 transcription from official in-game clipboard instruction sheets
// ===========================================================================

export const PODNOS_O832DU_HE_CHARGE_0: BallisticDataPoint[] = [
  {
    "range": 50,
    "elevation": 1456,
    "tof": 15,
    "dElevPer100m": 11.8,
    "peakAlt": 276,
    "angleImpact": 88,
    "dispersion": 13
  },
  {
    "range": 100,
    "elevation": 1411,
    "tof": 15,
    "dElevPer100m": 12,
    "peakAlt": 276,
    "angleImpact": 85,
    "dispersion": 13
  },
  {
    "range": 150,
    "elevation": 1365,
    "tof": 14.9,
    "dElevPer100m": 12.4,
    "peakAlt": 272,
    "angleImpact": 82,
    "dispersion": 14
  },
  {
    "range": 200,
    "elevation": 1319,
    "tof": 14.8,
    "dElevPer100m": 12.8,
    "peakAlt": 268,
    "angleImpact": 79,
    "dispersion": 14
  },
  {
    "range": 250,
    "elevation": 1269,
    "tof": 14.6,
    "dElevPer100m": 13.3,
    "peakAlt": 261,
    "angleImpact": 76,
    "dispersion": 15
  },
  {
    "range": 300,
    "elevation": 1218,
    "tof": 14.4,
    "dElevPer100m": 13.9,
    "peakAlt": 254,
    "angleImpact": 73,
    "dispersion": 15
  },
  {
    "range": 350,
    "elevation": 1160,
    "tof": 14.1,
    "dElevPer100m": 14.7,
    "peakAlt": 244,
    "angleImpact": 70,
    "dispersion": 16
  },
  {
    "range": 400,
    "elevation": 1097,
    "tof": 13.7,
    "dElevPer100m": 15.8,
    "peakAlt": 230,
    "angleImpact": 66,
    "dispersion": 17
  },
  {
    "range": 450,
    "elevation": 1025,
    "tof": 13.2,
    "dElevPer100m": 17.4,
    "peakAlt": 214,
    "angleImpact": 61,
    "dispersion": 18
  },
  {
    "range": 500,
    "elevation": 927,
    "tof": 12.4,
    "dElevPer100m": 20.2,
    "peakAlt": 188,
    "angleImpact": 55,
    "dispersion": 19
  }
];

export const PODNOS_O832DU_HE_CHARGE_1: BallisticDataPoint[] = [
  {
    "range": 100,
    "elevation": 1446,
    "tof": 19.5,
    "dElevPer100m": 15.8,
    "peakAlt": 466,
    "angleImpact": 87,
    "dispersion": 18
  },
  {
    "range": 200,
    "elevation": 1392,
    "tof": 19.4,
    "dElevPer100m": 16.3,
    "peakAlt": 461,
    "angleImpact": 84,
    "dispersion": 19
  },
  {
    "range": 300,
    "elevation": 1336,
    "tof": 19.2,
    "dElevPer100m": 17,
    "peakAlt": 452,
    "angleImpact": 80,
    "dispersion": 20
  },
  {
    "range": 400,
    "elevation": 1276,
    "tof": 18.9,
    "dElevPer100m": 17.9,
    "peakAlt": 438,
    "angleImpact": 77,
    "dispersion": 21
  },
  {
    "range": 500,
    "elevation": 1213,
    "tof": 18.6,
    "dElevPer100m": 19,
    "peakAlt": 424,
    "angleImpact": 73,
    "dispersion": 22
  },
  {
    "range": 600,
    "elevation": 1142,
    "tof": 18.1,
    "dElevPer100m": 20.5,
    "peakAlt": 402,
    "angleImpact": 69,
    "dispersion": 24
  },
  {
    "range": 700,
    "elevation": 1060,
    "tof": 17.4,
    "dElevPer100m": 22.5,
    "peakAlt": 371,
    "angleImpact": 64,
    "dispersion": 26
  },
  {
    "range": 800,
    "elevation": 955,
    "tof": 16.4,
    "dElevPer100m": 25.8,
    "peakAlt": 330,
    "angleImpact": 57,
    "dispersion": 29
  }
];

export const PODNOS_O832DU_HE_CHARGE_2: BallisticDataPoint[] = [
  {
    "range": 200,
    "elevation": 1432,
    "tof": 24.8,
    "dElevPer100m": 19.8,
    "peakAlt": 754,
    "angleImpact": 86,
    "dispersion": 26
  },
  {
    "range": 300,
    "elevation": 1397,
    "tof": 24.7,
    "dElevPer100m": 20.3,
    "peakAlt": 748,
    "angleImpact": 84,
    "dispersion": 27
  },
  {
    "range": 400,
    "elevation": 1362,
    "tof": 24.6,
    "dElevPer100m": 20.8,
    "peakAlt": 742,
    "angleImpact": 82,
    "dispersion": 28
  },
  {
    "range": 500,
    "elevation": 1326,
    "tof": 24.4,
    "dElevPer100m": 21.5,
    "peakAlt": 730,
    "angleImpact": 80,
    "dispersion": 30
  },
  {
    "range": 600,
    "elevation": 1288,
    "tof": 24.2,
    "dElevPer100m": 22.4,
    "peakAlt": 718,
    "angleImpact": 77,
    "dispersion": 31
  },
  {
    "range": 700,
    "elevation": 1249,
    "tof": 24,
    "dElevPer100m": 23.4,
    "peakAlt": 706,
    "angleImpact": 75,
    "dispersion": 33
  },
  {
    "range": 800,
    "elevation": 1208,
    "tof": 23.7,
    "dElevPer100m": 24.6,
    "peakAlt": 688,
    "angleImpact": 72,
    "dispersion": 35
  },
  {
    "range": 900,
    "elevation": 1163,
    "tof": 23.3,
    "dElevPer100m": 26.1,
    "peakAlt": 665,
    "angleImpact": 70,
    "dispersion": 37
  },
  {
    "range": 1000,
    "elevation": 1115,
    "tof": 22.9,
    "dElevPer100m": 27.9,
    "peakAlt": 643,
    "angleImpact": 67,
    "dispersion": 40
  },
  {
    "range": 1100,
    "elevation": 1062,
    "tof": 22.3,
    "dElevPer100m": 30.2,
    "peakAlt": 609,
    "angleImpact": 64,
    "dispersion": 43
  },
  {
    "range": 1200,
    "elevation": 999,
    "tof": 21.5,
    "dElevPer100m": 33.4,
    "peakAlt": 566,
    "angleImpact": 60,
    "dispersion": 47
  },
  {
    "range": 1300,
    "elevation": 917,
    "tof": 20.4,
    "dElevPer100m": 38.4,
    "peakAlt": 510,
    "angleImpact": 55,
    "dispersion": 52
  },
  {
    "range": 1400,
    "elevation": 765,
    "tof": 17.8,
    "dElevPer100m": 47.5,
    "peakAlt": 388,
    "angleImpact": 46,
    "dispersion": 60
  }
];

export const PODNOS_O832DU_HE_CHARGE_3: BallisticDataPoint[] = [
  {
    "range": 300,
    "elevation": 1423,
    "tof": 28.9,
    "dElevPer100m": 24.8,
    "peakAlt": 1024,
    "angleImpact": 85,
    "dispersion": 36
  },
  {
    "range": 400,
    "elevation": 1398,
    "tof": 28.8,
    "dElevPer100m": 25.3,
    "peakAlt": 1017,
    "angleImpact": 84,
    "dispersion": 37
  },
  {
    "range": 500,
    "elevation": 1373,
    "tof": 28.7,
    "dElevPer100m": 25.8,
    "peakAlt": 1010,
    "angleImpact": 82,
    "dispersion": 39
  },
  {
    "range": 600,
    "elevation": 1347,
    "tof": 28.6,
    "dElevPer100m": 26.4,
    "peakAlt": 1003,
    "angleImpact": 81,
    "dispersion": 40
  },
  {
    "range": 700,
    "elevation": 1320,
    "tof": 28.4,
    "dElevPer100m": 27.1,
    "peakAlt": 989,
    "angleImpact": 79,
    "dispersion": 42
  },
  {
    "range": 800,
    "elevation": 1292,
    "tof": 28.3,
    "dElevPer100m": 28.1,
    "peakAlt": 982,
    "angleImpact": 78,
    "dispersion": 44
  },
  {
    "range": 900,
    "elevation": 1261,
    "tof": 28.1,
    "dElevPer100m": 29.9,
    "peakAlt": 968,
    "angleImpact": 76,
    "dispersion": 46
  },
  {
    "range": 1000,
    "elevation": 1227,
    "tof": 27.9,
    "dElevPer100m": 30,
    "peakAlt": 954,
    "angleImpact": 74,
    "dispersion": 48
  },
  {
    "range": 1100,
    "elevation": 1193,
    "tof": 27.6,
    "dElevPer100m": 31.4,
    "peakAlt": 934,
    "angleImpact": 72,
    "dispersion": 51
  },
  {
    "range": 1200,
    "elevation": 1157,
    "tof": 27.3,
    "dElevPer100m": 33,
    "peakAlt": 914,
    "angleImpact": 69,
    "dispersion": 54
  },
  {
    "range": 1300,
    "elevation": 1119,
    "tof": 26.9,
    "dElevPer100m": 34.9,
    "peakAlt": 887,
    "angleImpact": 67,
    "dispersion": 57
  },
  {
    "range": 1400,
    "elevation": 1079,
    "tof": 26.4,
    "dElevPer100m": 37.1,
    "peakAlt": 854,
    "angleImpact": 65,
    "dispersion": 61
  },
  {
    "range": 1500,
    "elevation": 1037,
    "tof": 25.8,
    "dElevPer100m": 39.9,
    "peakAlt": 816,
    "angleImpact": 62,
    "dispersion": 65
  },
  {
    "range": 1600,
    "elevation": 993,
    "tof": 25.1,
    "dElevPer100m": 43.3,
    "peakAlt": 772,
    "angleImpact": 60,
    "dispersion": 70
  },
  {
    "range": 1700,
    "elevation": 944,
    "tof": 24.3,
    "dElevPer100m": 47.5,
    "peakAlt": 724,
    "angleImpact": 57,
    "dispersion": 76
  },
  {
    "range": 1800,
    "elevation": 840,
    "tof": 22,
    "dElevPer100m": 57,
    "peakAlt": 593,
    "angleImpact": 50,
    "dispersion": 85
  }
];

export const PODNOS_O832DU_HE_CHARGE_4: BallisticDataPoint[] = [
  {
    "range": 400,
    "elevation": 1410,
    "tof": 33.2,
    "dElevPer100m": 30.8,
    "peakAlt": 1350,
    "angleImpact": 85,
    "dispersion": 45
  },
  {
    "range": 600,
    "elevation": 1373,
    "tof": 32.9,
    "dElevPer100m": 31.8,
    "peakAlt": 1326,
    "angleImpact": 82,
    "dispersion": 48
  },
  {
    "range": 800,
    "elevation": 1332,
    "tof": 32.5,
    "dElevPer100m": 33,
    "peakAlt": 1294,
    "angleImpact": 80,
    "dispersion": 52
  },
  {
    "range": 1000,
    "elevation": 1288,
    "tof": 32,
    "dElevPer100m": 34.6,
    "peakAlt": 1255,
    "angleImpact": 77,
    "dispersion": 56
  },
  {
    "range": 1200,
    "elevation": 1242,
    "tof": 31.4,
    "dElevPer100m": 36.5,
    "peakAlt": 1208,
    "angleImpact": 75,
    "dispersion": 61
  },
  {
    "range": 1400,
    "elevation": 1192,
    "tof": 30.7,
    "dElevPer100m": 38.9,
    "peakAlt": 1155,
    "angleImpact": 72,
    "dispersion": 67
  },
  {
    "range": 1600,
    "elevation": 1140,
    "tof": 29.9,
    "dElevPer100m": 41.8,
    "peakAlt": 1096,
    "angleImpact": 68,
    "dispersion": 74
  },
  {
    "range": 1800,
    "elevation": 1084,
    "tof": 28.9,
    "dElevPer100m": 45.5,
    "peakAlt": 1024,
    "angleImpact": 65,
    "dispersion": 82
  },
  {
    "range": 2000,
    "elevation": 1022,
    "tof": 27.8,
    "dElevPer100m": 50.2,
    "peakAlt": 948,
    "angleImpact": 61,
    "dispersion": 91
  },
  {
    "range": 2200,
    "elevation": 948,
    "tof": 26.2,
    "dElevPer100m": 57.5,
    "peakAlt": 842,
    "angleImpact": 57,
    "dispersion": 102
  },
  {
    "range": 2300,
    "elevation": 750,
    "tof": 23.5,
    "dElevPer100m": 72,
    "peakAlt": 676,
    "angleImpact": 45,
    "dispersion": 118
  }
];

// ===========================================================================
// SPG-9 RECOILLESS RIFLE DIRECT FIRE TABLE
// ===========================================================================

export const SPG9_PG9V_HEAT_CHARGE_0: BallisticDataPoint[] = [
  {
    "range": 200,
    "elevation": 6,
    "tof": 0.35,
    "dElevPer100m": 2
  },
  {
    "range": 400,
    "elevation": 15,
    "tof": 0.72,
    "dElevPer100m": 2.5
  },
  {
    "range": 600,
    "elevation": 28,
    "tof": 1.15,
    "dElevPer100m": 3.2
  },
  {
    "range": 800,
    "elevation": 46,
    "tof": 1.62,
    "dElevPer100m": 4.1
  },
  {
    "range": 1000,
    "elevation": 70,
    "tof": 2.15,
    "dElevPer100m": 5.3
  },
  {
    "range": 1200,
    "elevation": 102,
    "tof": 2.76,
    "dElevPer100m": 6.8
  },
  {
    "range": 1300,
    "elevation": 120,
    "tof": 3.1,
    "dElevPer100m": 7.8
  }
];

// ===========================================================================
// COMPREHENSIVE AMMUNITION REGISTRIES
// Authentic in-game ammunition types with calibrated weights and charges
// ===========================================================================

export const M252_AMMUNITION: AmmoConfig[] = [
  {
    "id": "M821_HE",
    "name": "M821 HE-FRAG",
    "code": "M821",
    "category": "HE",
    "weightKg": 4.06,
    "description": "High-Explosive Fragmentation round with Comp B explosive filler and M734 multi-option fuze.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 50,
        "maxRange": 500,
        "muzzleVelocity": 68,
        "table": [
          {
            "range": 50,
            "elevation": 1456,
            "tof": 15,
            "dElevPer100m": 12,
            "peakAlt": 276,
            "angleImpact": 88,
            "dispersion": 13
          },
          {
            "range": 100,
            "elevation": 1411,
            "tof": 15,
            "dElevPer100m": 12.2,
            "peakAlt": 276,
            "angleImpact": 85,
            "dispersion": 13
          },
          {
            "range": 150,
            "elevation": 1365,
            "tof": 14.9,
            "dElevPer100m": 12.5,
            "peakAlt": 272,
            "angleImpact": 82,
            "dispersion": 14
          },
          {
            "range": 200,
            "elevation": 1319,
            "tof": 14.8,
            "dElevPer100m": 12.9,
            "peakAlt": 268,
            "angleImpact": 79,
            "dispersion": 14
          },
          {
            "range": 250,
            "elevation": 1269,
            "tof": 14.6,
            "dElevPer100m": 13.4,
            "peakAlt": 261,
            "angleImpact": 76,
            "dispersion": 15
          },
          {
            "range": 300,
            "elevation": 1218,
            "tof": 14.4,
            "dElevPer100m": 14,
            "peakAlt": 254,
            "angleImpact": 73,
            "dispersion": 15
          },
          {
            "range": 350,
            "elevation": 1160,
            "tof": 14.1,
            "dElevPer100m": 14.8,
            "peakAlt": 244,
            "angleImpact": 70,
            "dispersion": 16
          },
          {
            "range": 400,
            "elevation": 1097,
            "tof": 13.7,
            "dElevPer100m": 15.9,
            "peakAlt": 230,
            "angleImpact": 66,
            "dispersion": 17
          },
          {
            "range": 450,
            "elevation": 1025,
            "tof": 13.2,
            "dElevPer100m": 17.5,
            "peakAlt": 214,
            "angleImpact": 61,
            "dispersion": 18
          },
          {
            "range": 500,
            "elevation": 927,
            "tof": 12.4,
            "dElevPer100m": 20.4,
            "peakAlt": 188,
            "angleImpact": 55,
            "dispersion": 19
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 100,
        "maxRange": 800,
        "muzzleVelocity": 105,
        "table": [
          {
            "range": 100,
            "elevation": 1446,
            "tof": 19.5,
            "dElevPer100m": 16,
            "peakAlt": 466,
            "angleImpact": 87,
            "dispersion": 18
          },
          {
            "range": 200,
            "elevation": 1392,
            "tof": 19.4,
            "dElevPer100m": 16.5,
            "peakAlt": 461,
            "angleImpact": 84,
            "dispersion": 19
          },
          {
            "range": 300,
            "elevation": 1336,
            "tof": 19.2,
            "dElevPer100m": 17.2,
            "peakAlt": 452,
            "angleImpact": 80,
            "dispersion": 20
          },
          {
            "range": 400,
            "elevation": 1276,
            "tof": 18.9,
            "dElevPer100m": 18.1,
            "peakAlt": 438,
            "angleImpact": 77,
            "dispersion": 21
          },
          {
            "range": 500,
            "elevation": 1213,
            "tof": 18.6,
            "dElevPer100m": 19.2,
            "peakAlt": 424,
            "angleImpact": 73,
            "dispersion": 22
          },
          {
            "range": 600,
            "elevation": 1142,
            "tof": 18.1,
            "dElevPer100m": 20.7,
            "peakAlt": 402,
            "angleImpact": 69,
            "dispersion": 24
          },
          {
            "range": 700,
            "elevation": 1060,
            "tof": 17.4,
            "dElevPer100m": 22.8,
            "peakAlt": 371,
            "angleImpact": 64,
            "dispersion": 26
          },
          {
            "range": 800,
            "elevation": 955,
            "tof": 16.4,
            "dElevPer100m": 26.2,
            "peakAlt": 330,
            "angleImpact": 57,
            "dispersion": 29
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 200,
        "maxRange": 1400,
        "muzzleVelocity": 145,
        "table": [
          {
            "range": 200,
            "elevation": 1432,
            "tof": 24.8,
            "dElevPer100m": 20,
            "peakAlt": 754,
            "angleImpact": 86,
            "dispersion": 26
          },
          {
            "range": 300,
            "elevation": 1397,
            "tof": 24.7,
            "dElevPer100m": 20.5,
            "peakAlt": 748,
            "angleImpact": 84,
            "dispersion": 27
          },
          {
            "range": 400,
            "elevation": 1362,
            "tof": 24.6,
            "dElevPer100m": 21,
            "peakAlt": 742,
            "angleImpact": 82,
            "dispersion": 28
          },
          {
            "range": 500,
            "elevation": 1326,
            "tof": 24.4,
            "dElevPer100m": 21.7,
            "peakAlt": 730,
            "angleImpact": 80,
            "dispersion": 30
          },
          {
            "range": 600,
            "elevation": 1288,
            "tof": 24.2,
            "dElevPer100m": 22.6,
            "peakAlt": 718,
            "angleImpact": 77,
            "dispersion": 31
          },
          {
            "range": 700,
            "elevation": 1249,
            "tof": 24,
            "dElevPer100m": 23.6,
            "peakAlt": 706,
            "angleImpact": 75,
            "dispersion": 33
          },
          {
            "range": 800,
            "elevation": 1208,
            "tof": 23.7,
            "dElevPer100m": 24.8,
            "peakAlt": 688,
            "angleImpact": 72,
            "dispersion": 35
          },
          {
            "range": 900,
            "elevation": 1163,
            "tof": 23.3,
            "dElevPer100m": 26.3,
            "peakAlt": 665,
            "angleImpact": 70,
            "dispersion": 37
          },
          {
            "range": 1000,
            "elevation": 1115,
            "tof": 22.9,
            "dElevPer100m": 28.1,
            "peakAlt": 643,
            "angleImpact": 67,
            "dispersion": 40
          },
          {
            "range": 1100,
            "elevation": 1062,
            "tof": 22.3,
            "dElevPer100m": 30.5,
            "peakAlt": 609,
            "angleImpact": 64,
            "dispersion": 43
          },
          {
            "range": 1200,
            "elevation": 999,
            "tof": 21.5,
            "dElevPer100m": 33.7,
            "peakAlt": 566,
            "angleImpact": 60,
            "dispersion": 47
          },
          {
            "range": 1300,
            "elevation": 917,
            "tof": 20.4,
            "dElevPer100m": 38.8,
            "peakAlt": 510,
            "angleImpact": 55,
            "dispersion": 52
          },
          {
            "range": 1400,
            "elevation": 765,
            "tof": 17.8,
            "dElevPer100m": 48,
            "peakAlt": 388,
            "angleImpact": 46,
            "dispersion": 60
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 300,
        "maxRange": 2000,
        "muzzleVelocity": 182,
        "table": [
          {
            "range": 300,
            "elevation": 1423,
            "tof": 28.9,
            "dElevPer100m": 25,
            "peakAlt": 1024,
            "angleImpact": 85,
            "dispersion": 36
          },
          {
            "range": 400,
            "elevation": 1398,
            "tof": 28.8,
            "dElevPer100m": 25.5,
            "peakAlt": 1017,
            "angleImpact": 84,
            "dispersion": 37
          },
          {
            "range": 500,
            "elevation": 1373,
            "tof": 28.7,
            "dElevPer100m": 26,
            "peakAlt": 1010,
            "angleImpact": 82,
            "dispersion": 39
          },
          {
            "range": 600,
            "elevation": 1347,
            "tof": 28.6,
            "dElevPer100m": 26.6,
            "peakAlt": 1003,
            "angleImpact": 81,
            "dispersion": 40
          },
          {
            "range": 700,
            "elevation": 1320,
            "tof": 28.4,
            "dElevPer100m": 27.3,
            "peakAlt": 989,
            "angleImpact": 79,
            "dispersion": 42
          },
          {
            "range": 800,
            "elevation": 1292,
            "tof": 28.3,
            "dElevPer100m": 28.1,
            "peakAlt": 982,
            "angleImpact": 78,
            "dispersion": 44
          },
          {
            "range": 900,
            "elevation": 1261,
            "tof": 28.1,
            "dElevPer100m": 29.1,
            "peakAlt": 968,
            "angleImpact": 76,
            "dispersion": 46
          },
          {
            "range": 1000,
            "elevation": 1227,
            "tof": 27.9,
            "dElevPer100m": 30.2,
            "peakAlt": 954,
            "angleImpact": 74,
            "dispersion": 48
          },
          {
            "range": 1100,
            "elevation": 1193,
            "tof": 27.6,
            "dElevPer100m": 31.6,
            "peakAlt": 934,
            "angleImpact": 72,
            "dispersion": 51
          },
          {
            "range": 1200,
            "elevation": 1157,
            "tof": 27.3,
            "dElevPer100m": 33.2,
            "peakAlt": 914,
            "angleImpact": 69,
            "dispersion": 54
          },
          {
            "range": 1300,
            "elevation": 1119,
            "tof": 26.9,
            "dElevPer100m": 35.1,
            "peakAlt": 887,
            "angleImpact": 67,
            "dispersion": 57
          },
          {
            "range": 1400,
            "elevation": 1079,
            "tof": 26.4,
            "dElevPer100m": 37.4,
            "peakAlt": 854,
            "angleImpact": 65,
            "dispersion": 61
          },
          {
            "range": 1500,
            "elevation": 1037,
            "tof": 25.8,
            "dElevPer100m": 40.2,
            "peakAlt": 816,
            "angleImpact": 62,
            "dispersion": 65
          },
          {
            "range": 1600,
            "elevation": 993,
            "tof": 25.1,
            "dElevPer100m": 43.6,
            "peakAlt": 772,
            "angleImpact": 60,
            "dispersion": 70
          },
          {
            "range": 1700,
            "elevation": 944,
            "tof": 24.3,
            "dElevPer100m": 47.9,
            "peakAlt": 724,
            "angleImpact": 57,
            "dispersion": 76
          },
          {
            "range": 1800,
            "elevation": 888,
            "tof": 23.3,
            "dElevPer100m": 53.6,
            "peakAlt": 665,
            "angleImpact": 53,
            "dispersion": 83
          },
          {
            "range": 1900,
            "elevation": 818,
            "tof": 22,
            "dElevPer100m": 62,
            "peakAlt": 593,
            "angleImpact": 49,
            "dispersion": 92
          },
          {
            "range": 2000,
            "elevation": 760,
            "tof": 20.1,
            "dElevPer100m": 74,
            "peakAlt": 495,
            "angleImpact": 46,
            "dispersion": 104
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Rings (Charge 4)",
        "minRange": 400,
        "maxRange": 2900,
        "muzzleVelocity": 220,
        "table": [
          {
            "range": 400,
            "elevation": 1415,
            "tof": 34,
            "dElevPer100m": 31,
            "peakAlt": 1417,
            "angleImpact": 85,
            "dispersion": 45
          },
          {
            "range": 600,
            "elevation": 1378,
            "tof": 33.7,
            "dElevPer100m": 32,
            "peakAlt": 1392,
            "angleImpact": 83,
            "dispersion": 48
          },
          {
            "range": 800,
            "elevation": 1338,
            "tof": 33.3,
            "dElevPer100m": 33.2,
            "peakAlt": 1359,
            "angleImpact": 80,
            "dispersion": 52
          },
          {
            "range": 1000,
            "elevation": 1295,
            "tof": 32.8,
            "dElevPer100m": 34.8,
            "peakAlt": 1319,
            "angleImpact": 78,
            "dispersion": 56
          },
          {
            "range": 1200,
            "elevation": 1250,
            "tof": 32.2,
            "dElevPer100m": 36.8,
            "peakAlt": 1271,
            "angleImpact": 75,
            "dispersion": 61
          },
          {
            "range": 1400,
            "elevation": 1202,
            "tof": 31.5,
            "dElevPer100m": 39.2,
            "peakAlt": 1216,
            "angleImpact": 72,
            "dispersion": 67
          },
          {
            "range": 1600,
            "elevation": 1152,
            "tof": 30.7,
            "dElevPer100m": 42.2,
            "peakAlt": 1155,
            "angleImpact": 69,
            "dispersion": 74
          },
          {
            "range": 1800,
            "elevation": 1098,
            "tof": 29.8,
            "dElevPer100m": 46,
            "peakAlt": 1089,
            "angleImpact": 66,
            "dispersion": 82
          },
          {
            "range": 2000,
            "elevation": 1040,
            "tof": 28.8,
            "dElevPer100m": 50.8,
            "peakAlt": 1017,
            "angleImpact": 62,
            "dispersion": 91
          },
          {
            "range": 2200,
            "elevation": 978,
            "tof": 27.6,
            "dElevPer100m": 57,
            "peakAlt": 934,
            "angleImpact": 59,
            "dispersion": 102
          },
          {
            "range": 2400,
            "elevation": 910,
            "tof": 26.2,
            "dElevPer100m": 65.2,
            "peakAlt": 842,
            "angleImpact": 55,
            "dispersion": 115
          },
          {
            "range": 2600,
            "elevation": 834,
            "tof": 24.5,
            "dElevPer100m": 76.5,
            "peakAlt": 736,
            "angleImpact": 50,
            "dispersion": 132
          },
          {
            "range": 2800,
            "elevation": 785,
            "tof": 23.1,
            "dElevPer100m": 90,
            "peakAlt": 654,
            "angleImpact": 47,
            "dispersion": 150
          },
          {
            "range": 2900,
            "elevation": 750,
            "tof": 22,
            "dElevPer100m": 102,
            "peakAlt": 593,
            "angleImpact": 45,
            "dispersion": 165
          }
        ]
      }
    ]
  },
  {
    "id": "M853A1_ILLUM",
    "name": "M853A1 Illumination",
    "code": "M853A1",
    "category": "ILLUM",
    "weightKg": 4,
    "description": "Pyrotechnic candle illuminating battlefield with 525,000 candlepower on parachute descent.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 50,
        "maxRange": 510,
        "muzzleVelocity": 69,
        "table": [
          {
            "range": 50,
            "elevation": 1456,
            "tof": 15.1,
            "dElevPer100m": 11.8,
            "peakAlt": 280,
            "angleImpact": 88,
            "dispersion": 12.8
          },
          {
            "range": 100,
            "elevation": 1411,
            "tof": 15.1,
            "dElevPer100m": 12,
            "peakAlt": 280,
            "angleImpact": 85,
            "dispersion": 12.8
          },
          {
            "range": 150,
            "elevation": 1365,
            "tof": 15,
            "dElevPer100m": 12.3,
            "peakAlt": 276,
            "angleImpact": 82,
            "dispersion": 13.8
          },
          {
            "range": 200,
            "elevation": 1319,
            "tof": 14.9,
            "dElevPer100m": 12.7,
            "peakAlt": 272,
            "angleImpact": 79,
            "dispersion": 13.8
          },
          {
            "range": 250,
            "elevation": 1269,
            "tof": 14.7,
            "dElevPer100m": 13.2,
            "peakAlt": 265,
            "angleImpact": 76,
            "dispersion": 14.8
          },
          {
            "range": 300,
            "elevation": 1218,
            "tof": 14.5,
            "dElevPer100m": 13.8,
            "peakAlt": 258,
            "angleImpact": 73,
            "dispersion": 14.8
          },
          {
            "range": 360,
            "elevation": 1160,
            "tof": 14.2,
            "dElevPer100m": 14.6,
            "peakAlt": 248,
            "angleImpact": 70,
            "dispersion": 15.8
          },
          {
            "range": 410,
            "elevation": 1097,
            "tof": 13.8,
            "dElevPer100m": 15.7,
            "peakAlt": 233,
            "angleImpact": 66,
            "dispersion": 16.7
          },
          {
            "range": 460,
            "elevation": 1025,
            "tof": 13.3,
            "dElevPer100m": 17.2,
            "peakAlt": 217,
            "angleImpact": 61,
            "dispersion": 17.7
          },
          {
            "range": 510,
            "elevation": 927,
            "tof": 12.5,
            "dElevPer100m": 20.1,
            "peakAlt": 191,
            "angleImpact": 55,
            "dispersion": 18.7
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 100,
        "maxRange": 810,
        "muzzleVelocity": 106,
        "table": [
          {
            "range": 100,
            "elevation": 1446,
            "tof": 19.6,
            "dElevPer100m": 15.8,
            "peakAlt": 473,
            "angleImpact": 87,
            "dispersion": 17.7
          },
          {
            "range": 200,
            "elevation": 1392,
            "tof": 19.5,
            "dElevPer100m": 16.3,
            "peakAlt": 468,
            "angleImpact": 84,
            "dispersion": 18.7
          },
          {
            "range": 300,
            "elevation": 1336,
            "tof": 19.3,
            "dElevPer100m": 16.9,
            "peakAlt": 459,
            "angleImpact": 80,
            "dispersion": 19.7
          },
          {
            "range": 410,
            "elevation": 1276,
            "tof": 19,
            "dElevPer100m": 17.8,
            "peakAlt": 445,
            "angleImpact": 77,
            "dispersion": 20.7
          },
          {
            "range": 510,
            "elevation": 1213,
            "tof": 18.7,
            "dElevPer100m": 18.9,
            "peakAlt": 430,
            "angleImpact": 73,
            "dispersion": 21.7
          },
          {
            "range": 610,
            "elevation": 1142,
            "tof": 18.2,
            "dElevPer100m": 20.4,
            "peakAlt": 408,
            "angleImpact": 69,
            "dispersion": 23.6
          },
          {
            "range": 710,
            "elevation": 1060,
            "tof": 17.5,
            "dElevPer100m": 22.5,
            "peakAlt": 377,
            "angleImpact": 64,
            "dispersion": 25.6
          },
          {
            "range": 810,
            "elevation": 955,
            "tof": 16.5,
            "dElevPer100m": 25.8,
            "peakAlt": 335,
            "angleImpact": 57,
            "dispersion": 28.6
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 200,
        "maxRange": 1420,
        "muzzleVelocity": 146,
        "table": [
          {
            "range": 200,
            "elevation": 1432,
            "tof": 25,
            "dElevPer100m": 19.7,
            "peakAlt": 765,
            "angleImpact": 86,
            "dispersion": 25.6
          },
          {
            "range": 300,
            "elevation": 1397,
            "tof": 24.9,
            "dElevPer100m": 20.2,
            "peakAlt": 759,
            "angleImpact": 84,
            "dispersion": 26.6
          },
          {
            "range": 410,
            "elevation": 1362,
            "tof": 24.8,
            "dElevPer100m": 20.7,
            "peakAlt": 753,
            "angleImpact": 82,
            "dispersion": 27.6
          },
          {
            "range": 510,
            "elevation": 1326,
            "tof": 24.6,
            "dElevPer100m": 21.4,
            "peakAlt": 741,
            "angleImpact": 80,
            "dispersion": 29.6
          },
          {
            "range": 610,
            "elevation": 1288,
            "tof": 24.4,
            "dElevPer100m": 22.3,
            "peakAlt": 729,
            "angleImpact": 77,
            "dispersion": 30.5
          },
          {
            "range": 710,
            "elevation": 1249,
            "tof": 24.2,
            "dElevPer100m": 23.3,
            "peakAlt": 717,
            "angleImpact": 75,
            "dispersion": 32.5
          },
          {
            "range": 810,
            "elevation": 1208,
            "tof": 23.9,
            "dElevPer100m": 24.4,
            "peakAlt": 698,
            "angleImpact": 72,
            "dispersion": 34.5
          },
          {
            "range": 910,
            "elevation": 1163,
            "tof": 23.5,
            "dElevPer100m": 25.9,
            "peakAlt": 675,
            "angleImpact": 70,
            "dispersion": 36.5
          },
          {
            "range": 1010,
            "elevation": 1115,
            "tof": 23.1,
            "dElevPer100m": 27.7,
            "peakAlt": 653,
            "angleImpact": 67,
            "dispersion": 39.4
          },
          {
            "range": 1120,
            "elevation": 1062,
            "tof": 22.5,
            "dElevPer100m": 30,
            "peakAlt": 618,
            "angleImpact": 64,
            "dispersion": 42.4
          },
          {
            "range": 1220,
            "elevation": 999,
            "tof": 21.7,
            "dElevPer100m": 33.2,
            "peakAlt": 574,
            "angleImpact": 60,
            "dispersion": 46.3
          },
          {
            "range": 1320,
            "elevation": 917,
            "tof": 20.6,
            "dElevPer100m": 38.2,
            "peakAlt": 518,
            "angleImpact": 55,
            "dispersion": 51.2
          },
          {
            "range": 1420,
            "elevation": 765,
            "tof": 17.9,
            "dElevPer100m": 47.3,
            "peakAlt": 394,
            "angleImpact": 46,
            "dispersion": 59.1
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 300,
        "maxRange": 2030,
        "muzzleVelocity": 183,
        "table": [
          {
            "range": 300,
            "elevation": 1423,
            "tof": 29.1,
            "dElevPer100m": 24.6,
            "peakAlt": 1039,
            "angleImpact": 85,
            "dispersion": 35.5
          },
          {
            "range": 410,
            "elevation": 1398,
            "tof": 29,
            "dElevPer100m": 25.1,
            "peakAlt": 1032,
            "angleImpact": 84,
            "dispersion": 36.5
          },
          {
            "range": 510,
            "elevation": 1373,
            "tof": 28.9,
            "dElevPer100m": 25.6,
            "peakAlt": 1025,
            "angleImpact": 82,
            "dispersion": 38.4
          },
          {
            "range": 610,
            "elevation": 1347,
            "tof": 28.8,
            "dElevPer100m": 26.2,
            "peakAlt": 1018,
            "angleImpact": 81,
            "dispersion": 39.4
          },
          {
            "range": 710,
            "elevation": 1320,
            "tof": 28.6,
            "dElevPer100m": 26.9,
            "peakAlt": 1004,
            "angleImpact": 79,
            "dispersion": 41.4
          },
          {
            "range": 810,
            "elevation": 1292,
            "tof": 28.5,
            "dElevPer100m": 27.7,
            "peakAlt": 997,
            "angleImpact": 78,
            "dispersion": 43.3
          },
          {
            "range": 910,
            "elevation": 1261,
            "tof": 28.3,
            "dElevPer100m": 28.7,
            "peakAlt": 983,
            "angleImpact": 76,
            "dispersion": 45.3
          },
          {
            "range": 1010,
            "elevation": 1227,
            "tof": 28.1,
            "dElevPer100m": 29.8,
            "peakAlt": 968,
            "angleImpact": 74,
            "dispersion": 47.3
          },
          {
            "range": 1120,
            "elevation": 1193,
            "tof": 27.8,
            "dElevPer100m": 31.1,
            "peakAlt": 948,
            "angleImpact": 72,
            "dispersion": 50.2
          },
          {
            "range": 1220,
            "elevation": 1157,
            "tof": 27.5,
            "dElevPer100m": 32.7,
            "peakAlt": 928,
            "angleImpact": 69,
            "dispersion": 53.2
          },
          {
            "range": 1320,
            "elevation": 1119,
            "tof": 27.1,
            "dElevPer100m": 34.6,
            "peakAlt": 900,
            "angleImpact": 67,
            "dispersion": 56.2
          },
          {
            "range": 1420,
            "elevation": 1079,
            "tof": 26.6,
            "dElevPer100m": 36.8,
            "peakAlt": 867,
            "angleImpact": 65,
            "dispersion": 60.1
          },
          {
            "range": 1520,
            "elevation": 1037,
            "tof": 26,
            "dElevPer100m": 39.6,
            "peakAlt": 828,
            "angleImpact": 62,
            "dispersion": 64
          },
          {
            "range": 1620,
            "elevation": 993,
            "tof": 25.3,
            "dElevPer100m": 43,
            "peakAlt": 784,
            "angleImpact": 60,
            "dispersion": 69
          },
          {
            "range": 1730,
            "elevation": 944,
            "tof": 24.5,
            "dElevPer100m": 47.2,
            "peakAlt": 735,
            "angleImpact": 57,
            "dispersion": 74.9
          },
          {
            "range": 1830,
            "elevation": 888,
            "tof": 23.5,
            "dElevPer100m": 52.8,
            "peakAlt": 675,
            "angleImpact": 53,
            "dispersion": 81.8
          },
          {
            "range": 1930,
            "elevation": 818,
            "tof": 22.2,
            "dElevPer100m": 61.1,
            "peakAlt": 602,
            "angleImpact": 49,
            "dispersion": 90.6
          },
          {
            "range": 2030,
            "elevation": 760,
            "tof": 20.3,
            "dElevPer100m": 72.9,
            "peakAlt": 502,
            "angleImpact": 46,
            "dispersion": 102.5
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Rings (Charge 4)",
        "minRange": 410,
        "maxRange": 2940,
        "muzzleVelocity": 222,
        "table": [
          {
            "range": 410,
            "elevation": 1415,
            "tof": 34.3,
            "dElevPer100m": 30.5,
            "peakAlt": 1438,
            "angleImpact": 85,
            "dispersion": 44.3
          },
          {
            "range": 610,
            "elevation": 1378,
            "tof": 34,
            "dElevPer100m": 31.5,
            "peakAlt": 1413,
            "angleImpact": 83,
            "dispersion": 47.3
          },
          {
            "range": 810,
            "elevation": 1338,
            "tof": 33.5,
            "dElevPer100m": 32.7,
            "peakAlt": 1379,
            "angleImpact": 80,
            "dispersion": 51.2
          },
          {
            "range": 1010,
            "elevation": 1295,
            "tof": 33,
            "dElevPer100m": 34.3,
            "peakAlt": 1339,
            "angleImpact": 78,
            "dispersion": 55.2
          },
          {
            "range": 1220,
            "elevation": 1250,
            "tof": 32.4,
            "dElevPer100m": 36.3,
            "peakAlt": 1290,
            "angleImpact": 75,
            "dispersion": 60.1
          },
          {
            "range": 1420,
            "elevation": 1202,
            "tof": 31.7,
            "dElevPer100m": 38.6,
            "peakAlt": 1234,
            "angleImpact": 72,
            "dispersion": 66
          },
          {
            "range": 1620,
            "elevation": 1152,
            "tof": 30.9,
            "dElevPer100m": 41.6,
            "peakAlt": 1172,
            "angleImpact": 69,
            "dispersion": 72.9
          },
          {
            "range": 1830,
            "elevation": 1098,
            "tof": 30,
            "dElevPer100m": 45.3,
            "peakAlt": 1105,
            "angleImpact": 66,
            "dispersion": 80.8
          },
          {
            "range": 2030,
            "elevation": 1040,
            "tof": 29,
            "dElevPer100m": 50,
            "peakAlt": 1032,
            "angleImpact": 62,
            "dispersion": 89.7
          },
          {
            "range": 2230,
            "elevation": 978,
            "tof": 27.8,
            "dElevPer100m": 56.2,
            "peakAlt": 948,
            "angleImpact": 59,
            "dispersion": 100.5
          },
          {
            "range": 2440,
            "elevation": 910,
            "tof": 26.4,
            "dElevPer100m": 64.2,
            "peakAlt": 855,
            "angleImpact": 55,
            "dispersion": 113.3
          },
          {
            "range": 2640,
            "elevation": 834,
            "tof": 24.7,
            "dElevPer100m": 75.4,
            "peakAlt": 747,
            "angleImpact": 50,
            "dispersion": 130
          },
          {
            "range": 2840,
            "elevation": 785,
            "tof": 23.3,
            "dElevPer100m": 88.7,
            "peakAlt": 664,
            "angleImpact": 47,
            "dispersion": 147.8
          },
          {
            "range": 2940,
            "elevation": 750,
            "tof": 22.2,
            "dElevPer100m": 100.5,
            "peakAlt": 602,
            "angleImpact": 45,
            "dispersion": 162.6
          }
        ]
      }
    ]
  },
  {
    "id": "M819_SMOKE",
    "name": "M819 White Smoke",
    "code": "M819",
    "category": "SMOKE",
    "weightKg": 4.85,
    "description": "Red Phosphorus / White screening smoke projectile generating dense multi-spectral visual concealment.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 40,
        "maxRange": 420,
        "muzzleVelocity": 62,
        "table": [
          {
            "range": 40,
            "elevation": 1456,
            "tof": 13.7,
            "dElevPer100m": 14.3,
            "peakAlt": 231,
            "angleImpact": 88,
            "dispersion": 15.5
          },
          {
            "range": 80,
            "elevation": 1411,
            "tof": 13.7,
            "dElevPer100m": 14.6,
            "peakAlt": 231,
            "angleImpact": 85,
            "dispersion": 15.5
          },
          {
            "range": 130,
            "elevation": 1365,
            "tof": 13.6,
            "dElevPer100m": 14.9,
            "peakAlt": 228,
            "angleImpact": 82,
            "dispersion": 16.7
          },
          {
            "range": 170,
            "elevation": 1319,
            "tof": 13.5,
            "dElevPer100m": 15.4,
            "peakAlt": 224,
            "angleImpact": 79,
            "dispersion": 16.7
          },
          {
            "range": 210,
            "elevation": 1269,
            "tof": 13.4,
            "dElevPer100m": 16,
            "peakAlt": 218,
            "angleImpact": 76,
            "dispersion": 17.9
          },
          {
            "range": 250,
            "elevation": 1218,
            "tof": 13.2,
            "dElevPer100m": 16.7,
            "peakAlt": 213,
            "angleImpact": 73,
            "dispersion": 17.9
          },
          {
            "range": 290,
            "elevation": 1160,
            "tof": 12.9,
            "dElevPer100m": 17.7,
            "peakAlt": 204,
            "angleImpact": 70,
            "dispersion": 19.1
          },
          {
            "range": 330,
            "elevation": 1097,
            "tof": 12.5,
            "dElevPer100m": 19,
            "peakAlt": 193,
            "angleImpact": 66,
            "dispersion": 20.3
          },
          {
            "range": 380,
            "elevation": 1025,
            "tof": 12.1,
            "dElevPer100m": 20.9,
            "peakAlt": 179,
            "angleImpact": 61,
            "dispersion": 21.5
          },
          {
            "range": 420,
            "elevation": 927,
            "tof": 11.3,
            "dElevPer100m": 24.4,
            "peakAlt": 157,
            "angleImpact": 55,
            "dispersion": 22.7
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 80,
        "maxRange": 670,
        "muzzleVelocity": 96,
        "table": [
          {
            "range": 80,
            "elevation": 1446,
            "tof": 17.8,
            "dElevPer100m": 19.1,
            "peakAlt": 390,
            "angleImpact": 87,
            "dispersion": 21.5
          },
          {
            "range": 170,
            "elevation": 1392,
            "tof": 17.7,
            "dElevPer100m": 19.7,
            "peakAlt": 386,
            "angleImpact": 84,
            "dispersion": 22.7
          },
          {
            "range": 250,
            "elevation": 1336,
            "tof": 17.6,
            "dElevPer100m": 20.5,
            "peakAlt": 378,
            "angleImpact": 80,
            "dispersion": 23.9
          },
          {
            "range": 330,
            "elevation": 1276,
            "tof": 17.3,
            "dElevPer100m": 21.6,
            "peakAlt": 367,
            "angleImpact": 77,
            "dispersion": 25.1
          },
          {
            "range": 420,
            "elevation": 1213,
            "tof": 17,
            "dElevPer100m": 22.9,
            "peakAlt": 355,
            "angleImpact": 73,
            "dispersion": 26.3
          },
          {
            "range": 500,
            "elevation": 1142,
            "tof": 16.6,
            "dElevPer100m": 24.7,
            "peakAlt": 337,
            "angleImpact": 69,
            "dispersion": 28.7
          },
          {
            "range": 590,
            "elevation": 1060,
            "tof": 15.9,
            "dElevPer100m": 27.2,
            "peakAlt": 311,
            "angleImpact": 64,
            "dispersion": 31.1
          },
          {
            "range": 670,
            "elevation": 955,
            "tof": 15,
            "dElevPer100m": 31.3,
            "peakAlt": 276,
            "angleImpact": 57,
            "dispersion": 34.6
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 170,
        "maxRange": 1170,
        "muzzleVelocity": 133,
        "table": [
          {
            "range": 170,
            "elevation": 1432,
            "tof": 22.7,
            "dElevPer100m": 23.9,
            "peakAlt": 631,
            "angleImpact": 86,
            "dispersion": 31.1
          },
          {
            "range": 250,
            "elevation": 1397,
            "tof": 22.6,
            "dElevPer100m": 24.5,
            "peakAlt": 626,
            "angleImpact": 84,
            "dispersion": 32.3
          },
          {
            "range": 330,
            "elevation": 1362,
            "tof": 22.5,
            "dElevPer100m": 25.1,
            "peakAlt": 621,
            "angleImpact": 82,
            "dispersion": 33.4
          },
          {
            "range": 420,
            "elevation": 1326,
            "tof": 22.3,
            "dElevPer100m": 25.9,
            "peakAlt": 611,
            "angleImpact": 80,
            "dispersion": 35.8
          },
          {
            "range": 500,
            "elevation": 1288,
            "tof": 22.1,
            "dElevPer100m": 27,
            "peakAlt": 601,
            "angleImpact": 77,
            "dispersion": 37
          },
          {
            "range": 590,
            "elevation": 1249,
            "tof": 22,
            "dElevPer100m": 28.2,
            "peakAlt": 591,
            "angleImpact": 75,
            "dispersion": 39.4
          },
          {
            "range": 670,
            "elevation": 1208,
            "tof": 21.7,
            "dElevPer100m": 29.6,
            "peakAlt": 576,
            "angleImpact": 72,
            "dispersion": 41.8
          },
          {
            "range": 750,
            "elevation": 1163,
            "tof": 21.3,
            "dElevPer100m": 31.4,
            "peakAlt": 557,
            "angleImpact": 70,
            "dispersion": 44.2
          },
          {
            "range": 840,
            "elevation": 1115,
            "tof": 21,
            "dElevPer100m": 33.6,
            "peakAlt": 538,
            "angleImpact": 67,
            "dispersion": 47.8
          },
          {
            "range": 920,
            "elevation": 1062,
            "tof": 20.4,
            "dElevPer100m": 36.4,
            "peakAlt": 510,
            "angleImpact": 64,
            "dispersion": 51.4
          },
          {
            "range": 1000,
            "elevation": 999,
            "tof": 19.7,
            "dElevPer100m": 40.3,
            "peakAlt": 474,
            "angleImpact": 60,
            "dispersion": 56.1
          },
          {
            "range": 1090,
            "elevation": 917,
            "tof": 18.7,
            "dElevPer100m": 46.3,
            "peakAlt": 427,
            "angleImpact": 55,
            "dispersion": 62.1
          },
          {
            "range": 1170,
            "elevation": 765,
            "tof": 16.3,
            "dElevPer100m": 57.3,
            "peakAlt": 325,
            "angleImpact": 46,
            "dispersion": 71.7
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 250,
        "maxRange": 1670,
        "muzzleVelocity": 167,
        "table": [
          {
            "range": 250,
            "elevation": 1423,
            "tof": 26.4,
            "dElevPer100m": 29.9,
            "peakAlt": 857,
            "angleImpact": 85,
            "dispersion": 43
          },
          {
            "range": 330,
            "elevation": 1398,
            "tof": 26.4,
            "dElevPer100m": 30.5,
            "peakAlt": 851,
            "angleImpact": 84,
            "dispersion": 44.2
          },
          {
            "range": 420,
            "elevation": 1373,
            "tof": 26.3,
            "dElevPer100m": 31.1,
            "peakAlt": 845,
            "angleImpact": 82,
            "dispersion": 46.6
          },
          {
            "range": 500,
            "elevation": 1347,
            "tof": 26.2,
            "dElevPer100m": 31.8,
            "peakAlt": 840,
            "angleImpact": 81,
            "dispersion": 47.8
          },
          {
            "range": 590,
            "elevation": 1320,
            "tof": 26,
            "dElevPer100m": 32.6,
            "peakAlt": 828,
            "angleImpact": 79,
            "dispersion": 50.2
          },
          {
            "range": 670,
            "elevation": 1292,
            "tof": 25.9,
            "dElevPer100m": 33.6,
            "peakAlt": 822,
            "angleImpact": 78,
            "dispersion": 52.6
          },
          {
            "range": 750,
            "elevation": 1261,
            "tof": 25.7,
            "dElevPer100m": 34.8,
            "peakAlt": 810,
            "angleImpact": 76,
            "dispersion": 55
          },
          {
            "range": 840,
            "elevation": 1227,
            "tof": 25.5,
            "dElevPer100m": 36.1,
            "peakAlt": 799,
            "angleImpact": 74,
            "dispersion": 57.3
          },
          {
            "range": 920,
            "elevation": 1193,
            "tof": 25.3,
            "dElevPer100m": 37.7,
            "peakAlt": 782,
            "angleImpact": 72,
            "dispersion": 60.9
          },
          {
            "range": 1000,
            "elevation": 1157,
            "tof": 25,
            "dElevPer100m": 39.7,
            "peakAlt": 765,
            "angleImpact": 69,
            "dispersion": 64.5
          },
          {
            "range": 1090,
            "elevation": 1119,
            "tof": 24.6,
            "dElevPer100m": 41.9,
            "peakAlt": 743,
            "angleImpact": 67,
            "dispersion": 68.1
          },
          {
            "range": 1170,
            "elevation": 1079,
            "tof": 24.2,
            "dElevPer100m": 44.7,
            "peakAlt": 715,
            "angleImpact": 65,
            "dispersion": 72.9
          },
          {
            "range": 1260,
            "elevation": 1037,
            "tof": 23.6,
            "dElevPer100m": 48,
            "peakAlt": 683,
            "angleImpact": 62,
            "dispersion": 77.6
          },
          {
            "range": 1340,
            "elevation": 993,
            "tof": 23,
            "dElevPer100m": 52.1,
            "peakAlt": 646,
            "angleImpact": 60,
            "dispersion": 83.6
          },
          {
            "range": 1420,
            "elevation": 944,
            "tof": 22.2,
            "dElevPer100m": 57.2,
            "peakAlt": 606,
            "angleImpact": 57,
            "dispersion": 90.8
          },
          {
            "range": 1510,
            "elevation": 888,
            "tof": 21.3,
            "dElevPer100m": 64,
            "peakAlt": 557,
            "angleImpact": 53,
            "dispersion": 99.2
          },
          {
            "range": 1590,
            "elevation": 818,
            "tof": 20.1,
            "dElevPer100m": 74.1,
            "peakAlt": 496,
            "angleImpact": 49,
            "dispersion": 109.9
          },
          {
            "range": 1670,
            "elevation": 760,
            "tof": 18.4,
            "dElevPer100m": 88.4,
            "peakAlt": 414,
            "angleImpact": 46,
            "dispersion": 124.2
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Rings (Charge 4)",
        "minRange": 330,
        "maxRange": 2430,
        "muzzleVelocity": 201,
        "table": [
          {
            "range": 330,
            "elevation": 1415,
            "tof": 31.1,
            "dElevPer100m": 37,
            "peakAlt": 1186,
            "angleImpact": 85,
            "dispersion": 53.8
          },
          {
            "range": 500,
            "elevation": 1378,
            "tof": 30.8,
            "dElevPer100m": 38.2,
            "peakAlt": 1165,
            "angleImpact": 83,
            "dispersion": 57.3
          },
          {
            "range": 670,
            "elevation": 1338,
            "tof": 30.5,
            "dElevPer100m": 39.7,
            "peakAlt": 1138,
            "angleImpact": 80,
            "dispersion": 62.1
          },
          {
            "range": 840,
            "elevation": 1295,
            "tof": 30,
            "dElevPer100m": 41.6,
            "peakAlt": 1104,
            "angleImpact": 78,
            "dispersion": 66.9
          },
          {
            "range": 1000,
            "elevation": 1250,
            "tof": 29.5,
            "dElevPer100m": 44,
            "peakAlt": 1064,
            "angleImpact": 75,
            "dispersion": 72.9
          },
          {
            "range": 1170,
            "elevation": 1202,
            "tof": 28.8,
            "dElevPer100m": 46.8,
            "peakAlt": 1018,
            "angleImpact": 72,
            "dispersion": 80
          },
          {
            "range": 1340,
            "elevation": 1152,
            "tof": 28.1,
            "dElevPer100m": 50.4,
            "peakAlt": 967,
            "angleImpact": 69,
            "dispersion": 88.4
          },
          {
            "range": 1510,
            "elevation": 1098,
            "tof": 27.3,
            "dElevPer100m": 55,
            "peakAlt": 912,
            "angleImpact": 66,
            "dispersion": 98
          },
          {
            "range": 1670,
            "elevation": 1040,
            "tof": 26.4,
            "dElevPer100m": 60.7,
            "peakAlt": 851,
            "angleImpact": 62,
            "dispersion": 108.7
          },
          {
            "range": 1840,
            "elevation": 978,
            "tof": 25.3,
            "dElevPer100m": 68.1,
            "peakAlt": 782,
            "angleImpact": 59,
            "dispersion": 121.8
          },
          {
            "range": 2010,
            "elevation": 910,
            "tof": 24,
            "dElevPer100m": 77.9,
            "peakAlt": 705,
            "angleImpact": 55,
            "dispersion": 137.4
          },
          {
            "range": 2180,
            "elevation": 834,
            "tof": 22.4,
            "dElevPer100m": 91.4,
            "peakAlt": 616,
            "angleImpact": 50,
            "dispersion": 157.7
          },
          {
            "range": 2340,
            "elevation": 785,
            "tof": 21.1,
            "dElevPer100m": 107.5,
            "peakAlt": 547,
            "angleImpact": 47,
            "dispersion": 179.2
          },
          {
            "range": 2430,
            "elevation": 750,
            "tof": 20.1,
            "dElevPer100m": 121.8,
            "peakAlt": 496,
            "angleImpact": 45,
            "dispersion": 197.1
          }
        ]
      }
    ]
  },
  {
    "id": "M879_TRAINING",
    "name": "M879 Full-Range Practice",
    "code": "M879",
    "category": "TRAINING",
    "weightKg": 4.26,
    "description": "Full-range practice shell with inert filler and pyrotechnic spotting charge for live-fire calibration.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 50,
        "maxRange": 480,
        "muzzleVelocity": 66,
        "table": [
          {
            "range": 50,
            "elevation": 1456,
            "tof": 14.6,
            "dElevPer100m": 12.6,
            "peakAlt": 263,
            "angleImpact": 88,
            "dispersion": 13.6
          },
          {
            "range": 100,
            "elevation": 1411,
            "tof": 14.6,
            "dElevPer100m": 12.8,
            "peakAlt": 263,
            "angleImpact": 85,
            "dispersion": 13.6
          },
          {
            "range": 140,
            "elevation": 1365,
            "tof": 14.5,
            "dElevPer100m": 13.1,
            "peakAlt": 259,
            "angleImpact": 82,
            "dispersion": 14.7
          },
          {
            "range": 190,
            "elevation": 1319,
            "tof": 14.4,
            "dElevPer100m": 13.5,
            "peakAlt": 255,
            "angleImpact": 79,
            "dispersion": 14.7
          },
          {
            "range": 240,
            "elevation": 1269,
            "tof": 14.3,
            "dElevPer100m": 14.1,
            "peakAlt": 249,
            "angleImpact": 76,
            "dispersion": 15.7
          },
          {
            "range": 290,
            "elevation": 1218,
            "tof": 14.1,
            "dElevPer100m": 14.7,
            "peakAlt": 242,
            "angleImpact": 73,
            "dispersion": 15.7
          },
          {
            "range": 330,
            "elevation": 1160,
            "tof": 13.8,
            "dElevPer100m": 15.5,
            "peakAlt": 233,
            "angleImpact": 70,
            "dispersion": 16.8
          },
          {
            "range": 380,
            "elevation": 1097,
            "tof": 13.4,
            "dElevPer100m": 16.7,
            "peakAlt": 219,
            "angleImpact": 66,
            "dispersion": 17.8
          },
          {
            "range": 430,
            "elevation": 1025,
            "tof": 12.9,
            "dElevPer100m": 18.4,
            "peakAlt": 204,
            "angleImpact": 61,
            "dispersion": 18.9
          },
          {
            "range": 480,
            "elevation": 927,
            "tof": 12.1,
            "dElevPer100m": 21.4,
            "peakAlt": 179,
            "angleImpact": 55,
            "dispersion": 19.9
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 100,
        "maxRange": 760,
        "muzzleVelocity": 103,
        "table": [
          {
            "range": 100,
            "elevation": 1446,
            "tof": 19,
            "dElevPer100m": 16.8,
            "peakAlt": 444,
            "angleImpact": 87,
            "dispersion": 18.9
          },
          {
            "range": 190,
            "elevation": 1392,
            "tof": 18.9,
            "dElevPer100m": 17.3,
            "peakAlt": 439,
            "angleImpact": 84,
            "dispersion": 19.9
          },
          {
            "range": 290,
            "elevation": 1336,
            "tof": 18.7,
            "dElevPer100m": 18,
            "peakAlt": 431,
            "angleImpact": 80,
            "dispersion": 21
          },
          {
            "range": 380,
            "elevation": 1276,
            "tof": 18.5,
            "dElevPer100m": 19,
            "peakAlt": 417,
            "angleImpact": 77,
            "dispersion": 22
          },
          {
            "range": 480,
            "elevation": 1213,
            "tof": 18.2,
            "dElevPer100m": 20.1,
            "peakAlt": 404,
            "angleImpact": 73,
            "dispersion": 23.1
          },
          {
            "range": 570,
            "elevation": 1142,
            "tof": 17.7,
            "dElevPer100m": 21.7,
            "peakAlt": 383,
            "angleImpact": 69,
            "dispersion": 25.2
          },
          {
            "range": 670,
            "elevation": 1060,
            "tof": 17,
            "dElevPer100m": 23.9,
            "peakAlt": 354,
            "angleImpact": 64,
            "dispersion": 27.3
          },
          {
            "range": 760,
            "elevation": 955,
            "tof": 16,
            "dElevPer100m": 27.5,
            "peakAlt": 315,
            "angleImpact": 57,
            "dispersion": 30.4
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 190,
        "maxRange": 1330,
        "muzzleVelocity": 142,
        "table": [
          {
            "range": 190,
            "elevation": 1432,
            "tof": 24.2,
            "dElevPer100m": 21,
            "peakAlt": 719,
            "angleImpact": 86,
            "dispersion": 27.3
          },
          {
            "range": 290,
            "elevation": 1397,
            "tof": 24.1,
            "dElevPer100m": 21.5,
            "peakAlt": 713,
            "angleImpact": 84,
            "dispersion": 28.3
          },
          {
            "range": 380,
            "elevation": 1362,
            "tof": 24,
            "dElevPer100m": 22,
            "peakAlt": 707,
            "angleImpact": 82,
            "dispersion": 29.4
          },
          {
            "range": 480,
            "elevation": 1326,
            "tof": 23.8,
            "dElevPer100m": 22.8,
            "peakAlt": 696,
            "angleImpact": 80,
            "dispersion": 31.5
          },
          {
            "range": 570,
            "elevation": 1288,
            "tof": 23.6,
            "dElevPer100m": 23.7,
            "peakAlt": 684,
            "angleImpact": 77,
            "dispersion": 32.5
          },
          {
            "range": 670,
            "elevation": 1249,
            "tof": 23.4,
            "dElevPer100m": 24.8,
            "peakAlt": 673,
            "angleImpact": 75,
            "dispersion": 34.6
          },
          {
            "range": 760,
            "elevation": 1208,
            "tof": 23.1,
            "dElevPer100m": 26,
            "peakAlt": 656,
            "angleImpact": 72,
            "dispersion": 36.7
          },
          {
            "range": 860,
            "elevation": 1163,
            "tof": 22.7,
            "dElevPer100m": 27.6,
            "peakAlt": 634,
            "angleImpact": 70,
            "dispersion": 38.8
          },
          {
            "range": 950,
            "elevation": 1115,
            "tof": 22.4,
            "dElevPer100m": 29.5,
            "peakAlt": 613,
            "angleImpact": 67,
            "dispersion": 42
          },
          {
            "range": 1050,
            "elevation": 1062,
            "tof": 21.8,
            "dElevPer100m": 32,
            "peakAlt": 580,
            "angleImpact": 64,
            "dispersion": 45.1
          },
          {
            "range": 1140,
            "elevation": 999,
            "tof": 21,
            "dElevPer100m": 35.4,
            "peakAlt": 539,
            "angleImpact": 60,
            "dispersion": 49.3
          },
          {
            "range": 1240,
            "elevation": 917,
            "tof": 19.9,
            "dElevPer100m": 40.7,
            "peakAlt": 486,
            "angleImpact": 55,
            "dispersion": 54.6
          },
          {
            "range": 1330,
            "elevation": 765,
            "tof": 17.4,
            "dElevPer100m": 50.4,
            "peakAlt": 370,
            "angleImpact": 46,
            "dispersion": 63
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 290,
        "maxRange": 1910,
        "muzzleVelocity": 178,
        "table": [
          {
            "range": 290,
            "elevation": 1423,
            "tof": 28.2,
            "dElevPer100m": 26.2,
            "peakAlt": 976,
            "angleImpact": 85,
            "dispersion": 37.8
          },
          {
            "range": 380,
            "elevation": 1398,
            "tof": 28.1,
            "dElevPer100m": 26.8,
            "peakAlt": 969,
            "angleImpact": 84,
            "dispersion": 38.8
          },
          {
            "range": 480,
            "elevation": 1373,
            "tof": 28,
            "dElevPer100m": 27.3,
            "peakAlt": 963,
            "angleImpact": 82,
            "dispersion": 40.9
          },
          {
            "range": 570,
            "elevation": 1347,
            "tof": 27.9,
            "dElevPer100m": 27.9,
            "peakAlt": 956,
            "angleImpact": 81,
            "dispersion": 42
          },
          {
            "range": 670,
            "elevation": 1320,
            "tof": 27.7,
            "dElevPer100m": 28.6,
            "peakAlt": 943,
            "angleImpact": 79,
            "dispersion": 44.1
          },
          {
            "range": 760,
            "elevation": 1292,
            "tof": 27.6,
            "dElevPer100m": 29.5,
            "peakAlt": 936,
            "angleImpact": 78,
            "dispersion": 46.2
          },
          {
            "range": 860,
            "elevation": 1261,
            "tof": 27.4,
            "dElevPer100m": 30.5,
            "peakAlt": 923,
            "angleImpact": 76,
            "dispersion": 48.3
          },
          {
            "range": 950,
            "elevation": 1227,
            "tof": 27.2,
            "dElevPer100m": 31.7,
            "peakAlt": 909,
            "angleImpact": 74,
            "dispersion": 50.4
          },
          {
            "range": 1050,
            "elevation": 1193,
            "tof": 26.9,
            "dElevPer100m": 33.2,
            "peakAlt": 890,
            "angleImpact": 72,
            "dispersion": 53.5
          },
          {
            "range": 1140,
            "elevation": 1157,
            "tof": 26.7,
            "dElevPer100m": 34.8,
            "peakAlt": 871,
            "angleImpact": 69,
            "dispersion": 56.7
          },
          {
            "range": 1240,
            "elevation": 1119,
            "tof": 26.3,
            "dElevPer100m": 36.8,
            "peakAlt": 845,
            "angleImpact": 67,
            "dispersion": 59.8
          },
          {
            "range": 1330,
            "elevation": 1079,
            "tof": 25.8,
            "dElevPer100m": 39.2,
            "peakAlt": 814,
            "angleImpact": 65,
            "dispersion": 64
          },
          {
            "range": 1430,
            "elevation": 1037,
            "tof": 25.2,
            "dElevPer100m": 42.2,
            "peakAlt": 778,
            "angleImpact": 62,
            "dispersion": 68.2
          },
          {
            "range": 1520,
            "elevation": 993,
            "tof": 24.5,
            "dElevPer100m": 45.7,
            "peakAlt": 736,
            "angleImpact": 60,
            "dispersion": 73.4
          },
          {
            "range": 1620,
            "elevation": 944,
            "tof": 23.7,
            "dElevPer100m": 50.3,
            "peakAlt": 690,
            "angleImpact": 57,
            "dispersion": 79.7
          },
          {
            "range": 1720,
            "elevation": 888,
            "tof": 22.7,
            "dElevPer100m": 56.2,
            "peakAlt": 634,
            "angleImpact": 53,
            "dispersion": 87.1
          },
          {
            "range": 1810,
            "elevation": 818,
            "tof": 21.5,
            "dElevPer100m": 65.1,
            "peakAlt": 565,
            "angleImpact": 49,
            "dispersion": 96.5
          },
          {
            "range": 1910,
            "elevation": 760,
            "tof": 19.6,
            "dElevPer100m": 77.6,
            "peakAlt": 472,
            "angleImpact": 46,
            "dispersion": 109.1
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Rings (Charge 4)",
        "minRange": 380,
        "maxRange": 2760,
        "muzzleVelocity": 215,
        "table": [
          {
            "range": 380,
            "elevation": 1415,
            "tof": 33.2,
            "dElevPer100m": 32.5,
            "peakAlt": 1350,
            "angleImpact": 85,
            "dispersion": 47.2
          },
          {
            "range": 570,
            "elevation": 1378,
            "tof": 32.9,
            "dElevPer100m": 33.6,
            "peakAlt": 1327,
            "angleImpact": 83,
            "dispersion": 50.4
          },
          {
            "range": 760,
            "elevation": 1338,
            "tof": 32.5,
            "dElevPer100m": 34.8,
            "peakAlt": 1295,
            "angleImpact": 80,
            "dispersion": 54.6
          },
          {
            "range": 950,
            "elevation": 1295,
            "tof": 32,
            "dElevPer100m": 36.5,
            "peakAlt": 1257,
            "angleImpact": 78,
            "dispersion": 58.8
          },
          {
            "range": 1140,
            "elevation": 1250,
            "tof": 31.4,
            "dElevPer100m": 38.6,
            "peakAlt": 1211,
            "angleImpact": 75,
            "dispersion": 64
          },
          {
            "range": 1330,
            "elevation": 1202,
            "tof": 30.8,
            "dElevPer100m": 41.1,
            "peakAlt": 1159,
            "angleImpact": 72,
            "dispersion": 70.3
          },
          {
            "range": 1520,
            "elevation": 1152,
            "tof": 30,
            "dElevPer100m": 44.3,
            "peakAlt": 1101,
            "angleImpact": 69,
            "dispersion": 77.6
          },
          {
            "range": 1720,
            "elevation": 1098,
            "tof": 29.1,
            "dElevPer100m": 48.3,
            "peakAlt": 1038,
            "angleImpact": 66,
            "dispersion": 86
          },
          {
            "range": 1910,
            "elevation": 1040,
            "tof": 28.1,
            "dElevPer100m": 53.3,
            "peakAlt": 969,
            "angleImpact": 62,
            "dispersion": 95.5
          },
          {
            "range": 2100,
            "elevation": 978,
            "tof": 26.9,
            "dElevPer100m": 59.8,
            "peakAlt": 890,
            "angleImpact": 59,
            "dispersion": 107
          },
          {
            "range": 2290,
            "elevation": 910,
            "tof": 25.6,
            "dElevPer100m": 68.4,
            "peakAlt": 802,
            "angleImpact": 55,
            "dispersion": 120.7
          },
          {
            "range": 2480,
            "elevation": 834,
            "tof": 23.9,
            "dElevPer100m": 80.3,
            "peakAlt": 701,
            "angleImpact": 50,
            "dispersion": 138.5
          },
          {
            "range": 2670,
            "elevation": 785,
            "tof": 22.6,
            "dElevPer100m": 94.4,
            "peakAlt": 623,
            "angleImpact": 47,
            "dispersion": 157.4
          },
          {
            "range": 2760,
            "elevation": 750,
            "tof": 21.5,
            "dElevPer100m": 107,
            "peakAlt": 565,
            "angleImpact": 45,
            "dispersion": 173.1
          }
        ]
      }
    ]
  }
];

export const PODNOS_AMMUNITION: AmmoConfig[] = [
  {
    "id": "O832DU_HE",
    "name": "O-832DU HE-FRAG",
    "code": "O-832DU",
    "category": "HE",
    "weightKg": 3.1,
    "description": "Cast-iron fragmentation shell with M-6 point-detonating fuze producing wide lethal splinters.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 50,
        "maxRange": 500,
        "muzzleVelocity": 70,
        "table": [
          {
            "range": 50,
            "elevation": 1456,
            "tof": 15,
            "dElevPer100m": 11.8,
            "peakAlt": 276,
            "angleImpact": 88,
            "dispersion": 13
          },
          {
            "range": 100,
            "elevation": 1411,
            "tof": 15,
            "dElevPer100m": 12,
            "peakAlt": 276,
            "angleImpact": 85,
            "dispersion": 13
          },
          {
            "range": 150,
            "elevation": 1365,
            "tof": 14.9,
            "dElevPer100m": 12.4,
            "peakAlt": 272,
            "angleImpact": 82,
            "dispersion": 14
          },
          {
            "range": 200,
            "elevation": 1319,
            "tof": 14.8,
            "dElevPer100m": 12.8,
            "peakAlt": 268,
            "angleImpact": 79,
            "dispersion": 14
          },
          {
            "range": 250,
            "elevation": 1269,
            "tof": 14.6,
            "dElevPer100m": 13.3,
            "peakAlt": 261,
            "angleImpact": 76,
            "dispersion": 15
          },
          {
            "range": 300,
            "elevation": 1218,
            "tof": 14.4,
            "dElevPer100m": 13.9,
            "peakAlt": 254,
            "angleImpact": 73,
            "dispersion": 15
          },
          {
            "range": 350,
            "elevation": 1160,
            "tof": 14.1,
            "dElevPer100m": 14.7,
            "peakAlt": 244,
            "angleImpact": 70,
            "dispersion": 16
          },
          {
            "range": 400,
            "elevation": 1097,
            "tof": 13.7,
            "dElevPer100m": 15.8,
            "peakAlt": 230,
            "angleImpact": 66,
            "dispersion": 17
          },
          {
            "range": 450,
            "elevation": 1025,
            "tof": 13.2,
            "dElevPer100m": 17.4,
            "peakAlt": 214,
            "angleImpact": 61,
            "dispersion": 18
          },
          {
            "range": 500,
            "elevation": 927,
            "tof": 12.4,
            "dElevPer100m": 20.2,
            "peakAlt": 188,
            "angleImpact": 55,
            "dispersion": 19
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 100,
        "maxRange": 800,
        "muzzleVelocity": 110,
        "table": [
          {
            "range": 100,
            "elevation": 1446,
            "tof": 19.5,
            "dElevPer100m": 15.8,
            "peakAlt": 466,
            "angleImpact": 87,
            "dispersion": 18
          },
          {
            "range": 200,
            "elevation": 1392,
            "tof": 19.4,
            "dElevPer100m": 16.3,
            "peakAlt": 461,
            "angleImpact": 84,
            "dispersion": 19
          },
          {
            "range": 300,
            "elevation": 1336,
            "tof": 19.2,
            "dElevPer100m": 17,
            "peakAlt": 452,
            "angleImpact": 80,
            "dispersion": 20
          },
          {
            "range": 400,
            "elevation": 1276,
            "tof": 18.9,
            "dElevPer100m": 17.9,
            "peakAlt": 438,
            "angleImpact": 77,
            "dispersion": 21
          },
          {
            "range": 500,
            "elevation": 1213,
            "tof": 18.6,
            "dElevPer100m": 19,
            "peakAlt": 424,
            "angleImpact": 73,
            "dispersion": 22
          },
          {
            "range": 600,
            "elevation": 1142,
            "tof": 18.1,
            "dElevPer100m": 20.5,
            "peakAlt": 402,
            "angleImpact": 69,
            "dispersion": 24
          },
          {
            "range": 700,
            "elevation": 1060,
            "tof": 17.4,
            "dElevPer100m": 22.5,
            "peakAlt": 371,
            "angleImpact": 64,
            "dispersion": 26
          },
          {
            "range": 800,
            "elevation": 955,
            "tof": 16.4,
            "dElevPer100m": 25.8,
            "peakAlt": 330,
            "angleImpact": 57,
            "dispersion": 29
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 200,
        "maxRange": 1400,
        "muzzleVelocity": 150,
        "table": [
          {
            "range": 200,
            "elevation": 1432,
            "tof": 24.8,
            "dElevPer100m": 19.8,
            "peakAlt": 754,
            "angleImpact": 86,
            "dispersion": 26
          },
          {
            "range": 300,
            "elevation": 1397,
            "tof": 24.7,
            "dElevPer100m": 20.3,
            "peakAlt": 748,
            "angleImpact": 84,
            "dispersion": 27
          },
          {
            "range": 400,
            "elevation": 1362,
            "tof": 24.6,
            "dElevPer100m": 20.8,
            "peakAlt": 742,
            "angleImpact": 82,
            "dispersion": 28
          },
          {
            "range": 500,
            "elevation": 1326,
            "tof": 24.4,
            "dElevPer100m": 21.5,
            "peakAlt": 730,
            "angleImpact": 80,
            "dispersion": 30
          },
          {
            "range": 600,
            "elevation": 1288,
            "tof": 24.2,
            "dElevPer100m": 22.4,
            "peakAlt": 718,
            "angleImpact": 77,
            "dispersion": 31
          },
          {
            "range": 700,
            "elevation": 1249,
            "tof": 24,
            "dElevPer100m": 23.4,
            "peakAlt": 706,
            "angleImpact": 75,
            "dispersion": 33
          },
          {
            "range": 800,
            "elevation": 1208,
            "tof": 23.7,
            "dElevPer100m": 24.6,
            "peakAlt": 688,
            "angleImpact": 72,
            "dispersion": 35
          },
          {
            "range": 900,
            "elevation": 1163,
            "tof": 23.3,
            "dElevPer100m": 26.1,
            "peakAlt": 665,
            "angleImpact": 70,
            "dispersion": 37
          },
          {
            "range": 1000,
            "elevation": 1115,
            "tof": 22.9,
            "dElevPer100m": 27.9,
            "peakAlt": 643,
            "angleImpact": 67,
            "dispersion": 40
          },
          {
            "range": 1100,
            "elevation": 1062,
            "tof": 22.3,
            "dElevPer100m": 30.2,
            "peakAlt": 609,
            "angleImpact": 64,
            "dispersion": 43
          },
          {
            "range": 1200,
            "elevation": 999,
            "tof": 21.5,
            "dElevPer100m": 33.4,
            "peakAlt": 566,
            "angleImpact": 60,
            "dispersion": 47
          },
          {
            "range": 1300,
            "elevation": 917,
            "tof": 20.4,
            "dElevPer100m": 38.4,
            "peakAlt": 510,
            "angleImpact": 55,
            "dispersion": 52
          },
          {
            "range": 1400,
            "elevation": 765,
            "tof": 17.8,
            "dElevPer100m": 47.5,
            "peakAlt": 388,
            "angleImpact": 46,
            "dispersion": 60
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 300,
        "maxRange": 1800,
        "muzzleVelocity": 185,
        "table": [
          {
            "range": 300,
            "elevation": 1423,
            "tof": 28.9,
            "dElevPer100m": 24.8,
            "peakAlt": 1024,
            "angleImpact": 85,
            "dispersion": 36
          },
          {
            "range": 400,
            "elevation": 1398,
            "tof": 28.8,
            "dElevPer100m": 25.3,
            "peakAlt": 1017,
            "angleImpact": 84,
            "dispersion": 37
          },
          {
            "range": 500,
            "elevation": 1373,
            "tof": 28.7,
            "dElevPer100m": 25.8,
            "peakAlt": 1010,
            "angleImpact": 82,
            "dispersion": 39
          },
          {
            "range": 600,
            "elevation": 1347,
            "tof": 28.6,
            "dElevPer100m": 26.4,
            "peakAlt": 1003,
            "angleImpact": 81,
            "dispersion": 40
          },
          {
            "range": 700,
            "elevation": 1320,
            "tof": 28.4,
            "dElevPer100m": 27.1,
            "peakAlt": 989,
            "angleImpact": 79,
            "dispersion": 42
          },
          {
            "range": 800,
            "elevation": 1292,
            "tof": 28.3,
            "dElevPer100m": 28.1,
            "peakAlt": 982,
            "angleImpact": 78,
            "dispersion": 44
          },
          {
            "range": 900,
            "elevation": 1261,
            "tof": 28.1,
            "dElevPer100m": 29.9,
            "peakAlt": 968,
            "angleImpact": 76,
            "dispersion": 46
          },
          {
            "range": 1000,
            "elevation": 1227,
            "tof": 27.9,
            "dElevPer100m": 30,
            "peakAlt": 954,
            "angleImpact": 74,
            "dispersion": 48
          },
          {
            "range": 1100,
            "elevation": 1193,
            "tof": 27.6,
            "dElevPer100m": 31.4,
            "peakAlt": 934,
            "angleImpact": 72,
            "dispersion": 51
          },
          {
            "range": 1200,
            "elevation": 1157,
            "tof": 27.3,
            "dElevPer100m": 33,
            "peakAlt": 914,
            "angleImpact": 69,
            "dispersion": 54
          },
          {
            "range": 1300,
            "elevation": 1119,
            "tof": 26.9,
            "dElevPer100m": 34.9,
            "peakAlt": 887,
            "angleImpact": 67,
            "dispersion": 57
          },
          {
            "range": 1400,
            "elevation": 1079,
            "tof": 26.4,
            "dElevPer100m": 37.1,
            "peakAlt": 854,
            "angleImpact": 65,
            "dispersion": 61
          },
          {
            "range": 1500,
            "elevation": 1037,
            "tof": 25.8,
            "dElevPer100m": 39.9,
            "peakAlt": 816,
            "angleImpact": 62,
            "dispersion": 65
          },
          {
            "range": 1600,
            "elevation": 993,
            "tof": 25.1,
            "dElevPer100m": 43.3,
            "peakAlt": 772,
            "angleImpact": 60,
            "dispersion": 70
          },
          {
            "range": 1700,
            "elevation": 944,
            "tof": 24.3,
            "dElevPer100m": 47.5,
            "peakAlt": 724,
            "angleImpact": 57,
            "dispersion": 76
          },
          {
            "range": 1800,
            "elevation": 840,
            "tof": 22,
            "dElevPer100m": 57,
            "peakAlt": 593,
            "angleImpact": 50,
            "dispersion": 85
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Long Range (Charge 4)",
        "minRange": 400,
        "maxRange": 2300,
        "muzzleVelocity": 215,
        "table": [
          {
            "range": 400,
            "elevation": 1410,
            "tof": 33.2,
            "dElevPer100m": 30.8,
            "peakAlt": 1350,
            "angleImpact": 85,
            "dispersion": 45
          },
          {
            "range": 600,
            "elevation": 1373,
            "tof": 32.9,
            "dElevPer100m": 31.8,
            "peakAlt": 1326,
            "angleImpact": 82,
            "dispersion": 48
          },
          {
            "range": 800,
            "elevation": 1332,
            "tof": 32.5,
            "dElevPer100m": 33,
            "peakAlt": 1294,
            "angleImpact": 80,
            "dispersion": 52
          },
          {
            "range": 1000,
            "elevation": 1288,
            "tof": 32,
            "dElevPer100m": 34.6,
            "peakAlt": 1255,
            "angleImpact": 77,
            "dispersion": 56
          },
          {
            "range": 1200,
            "elevation": 1242,
            "tof": 31.4,
            "dElevPer100m": 36.5,
            "peakAlt": 1208,
            "angleImpact": 75,
            "dispersion": 61
          },
          {
            "range": 1400,
            "elevation": 1192,
            "tof": 30.7,
            "dElevPer100m": 38.9,
            "peakAlt": 1155,
            "angleImpact": 72,
            "dispersion": 67
          },
          {
            "range": 1600,
            "elevation": 1140,
            "tof": 29.9,
            "dElevPer100m": 41.8,
            "peakAlt": 1096,
            "angleImpact": 68,
            "dispersion": 74
          },
          {
            "range": 1800,
            "elevation": 1084,
            "tof": 28.9,
            "dElevPer100m": 45.5,
            "peakAlt": 1024,
            "angleImpact": 65,
            "dispersion": 82
          },
          {
            "range": 2000,
            "elevation": 1022,
            "tof": 27.8,
            "dElevPer100m": 50.2,
            "peakAlt": 948,
            "angleImpact": 61,
            "dispersion": 91
          },
          {
            "range": 2200,
            "elevation": 948,
            "tof": 26.2,
            "dElevPer100m": 57.5,
            "peakAlt": 842,
            "angleImpact": 57,
            "dispersion": 102
          },
          {
            "range": 2300,
            "elevation": 750,
            "tof": 23.5,
            "dElevPer100m": 72,
            "peakAlt": 676,
            "angleImpact": 45,
            "dispersion": 118
          }
        ]
      }
    ]
  },
  {
    "id": "S832S_ILLUM",
    "name": "S-832S Illumination",
    "code": "S-832S",
    "category": "ILLUM",
    "weightKg": 3.51,
    "description": "Illumination canister with pyrotechnic flare cartridge and time fuze for night tactical visibility.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 40,
        "maxRange": 440,
        "muzzleVelocity": 66,
        "table": [
          {
            "range": 40,
            "elevation": 1456,
            "tof": 14.1,
            "dElevPer100m": 13.4,
            "peakAlt": 244,
            "angleImpact": 88,
            "dispersion": 14.7
          },
          {
            "range": 90,
            "elevation": 1411,
            "tof": 14.1,
            "dElevPer100m": 13.6,
            "peakAlt": 244,
            "angleImpact": 85,
            "dispersion": 14.7
          },
          {
            "range": 130,
            "elevation": 1365,
            "tof": 14,
            "dElevPer100m": 14,
            "peakAlt": 240,
            "angleImpact": 82,
            "dispersion": 15.9
          },
          {
            "range": 180,
            "elevation": 1319,
            "tof": 13.9,
            "dElevPer100m": 14.5,
            "peakAlt": 237,
            "angleImpact": 79,
            "dispersion": 15.9
          },
          {
            "range": 220,
            "elevation": 1269,
            "tof": 13.7,
            "dElevPer100m": 15.1,
            "peakAlt": 231,
            "angleImpact": 76,
            "dispersion": 17
          },
          {
            "range": 260,
            "elevation": 1218,
            "tof": 13.5,
            "dElevPer100m": 15.7,
            "peakAlt": 224,
            "angleImpact": 73,
            "dispersion": 17
          },
          {
            "range": 310,
            "elevation": 1160,
            "tof": 13.3,
            "dElevPer100m": 16.6,
            "peakAlt": 215,
            "angleImpact": 70,
            "dispersion": 18.1
          },
          {
            "range": 350,
            "elevation": 1097,
            "tof": 12.9,
            "dElevPer100m": 17.9,
            "peakAlt": 203,
            "angleImpact": 66,
            "dispersion": 19.2
          },
          {
            "range": 400,
            "elevation": 1025,
            "tof": 12.4,
            "dElevPer100m": 19.7,
            "peakAlt": 189,
            "angleImpact": 61,
            "dispersion": 20.4
          },
          {
            "range": 440,
            "elevation": 927,
            "tof": 11.7,
            "dElevPer100m": 22.9,
            "peakAlt": 166,
            "angleImpact": 55,
            "dispersion": 21.5
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 90,
        "maxRange": 710,
        "muzzleVelocity": 103,
        "table": [
          {
            "range": 90,
            "elevation": 1446,
            "tof": 18.3,
            "dElevPer100m": 17.9,
            "peakAlt": 412,
            "angleImpact": 87,
            "dispersion": 20.4
          },
          {
            "range": 180,
            "elevation": 1392,
            "tof": 18.2,
            "dElevPer100m": 18.5,
            "peakAlt": 407,
            "angleImpact": 84,
            "dispersion": 21.5
          },
          {
            "range": 260,
            "elevation": 1336,
            "tof": 18,
            "dElevPer100m": 19.2,
            "peakAlt": 399,
            "angleImpact": 80,
            "dispersion": 22.6
          },
          {
            "range": 350,
            "elevation": 1276,
            "tof": 17.8,
            "dElevPer100m": 20.3,
            "peakAlt": 387,
            "angleImpact": 77,
            "dispersion": 23.8
          },
          {
            "range": 440,
            "elevation": 1213,
            "tof": 17.5,
            "dElevPer100m": 21.5,
            "peakAlt": 374,
            "angleImpact": 73,
            "dispersion": 24.9
          },
          {
            "range": 530,
            "elevation": 1142,
            "tof": 17,
            "dElevPer100m": 23.2,
            "peakAlt": 355,
            "angleImpact": 69,
            "dispersion": 27.2
          },
          {
            "range": 620,
            "elevation": 1060,
            "tof": 16.4,
            "dElevPer100m": 25.5,
            "peakAlt": 328,
            "angleImpact": 64,
            "dispersion": 29.4
          },
          {
            "range": 710,
            "elevation": 955,
            "tof": 15.4,
            "dElevPer100m": 29.2,
            "peakAlt": 291,
            "angleImpact": 57,
            "dispersion": 32.8
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 180,
        "maxRange": 1240,
        "muzzleVelocity": 141,
        "table": [
          {
            "range": 180,
            "elevation": 1432,
            "tof": 23.3,
            "dElevPer100m": 22.4,
            "peakAlt": 666,
            "angleImpact": 86,
            "dispersion": 29.4
          },
          {
            "range": 260,
            "elevation": 1397,
            "tof": 23.2,
            "dElevPer100m": 23,
            "peakAlt": 661,
            "angleImpact": 84,
            "dispersion": 30.6
          },
          {
            "range": 350,
            "elevation": 1362,
            "tof": 23.1,
            "dElevPer100m": 23.6,
            "peakAlt": 655,
            "angleImpact": 82,
            "dispersion": 31.7
          },
          {
            "range": 440,
            "elevation": 1326,
            "tof": 22.9,
            "dElevPer100m": 24.3,
            "peakAlt": 645,
            "angleImpact": 80,
            "dispersion": 34
          },
          {
            "range": 530,
            "elevation": 1288,
            "tof": 22.7,
            "dElevPer100m": 25.4,
            "peakAlt": 634,
            "angleImpact": 77,
            "dispersion": 35.1
          },
          {
            "range": 620,
            "elevation": 1249,
            "tof": 22.6,
            "dElevPer100m": 26.5,
            "peakAlt": 624,
            "angleImpact": 75,
            "dispersion": 37.4
          },
          {
            "range": 710,
            "elevation": 1208,
            "tof": 22.3,
            "dElevPer100m": 27.9,
            "peakAlt": 608,
            "angleImpact": 72,
            "dispersion": 39.6
          },
          {
            "range": 790,
            "elevation": 1163,
            "tof": 21.9,
            "dElevPer100m": 29.6,
            "peakAlt": 587,
            "angleImpact": 70,
            "dispersion": 41.9
          },
          {
            "range": 880,
            "elevation": 1115,
            "tof": 21.5,
            "dElevPer100m": 31.6,
            "peakAlt": 568,
            "angleImpact": 67,
            "dispersion": 45.3
          },
          {
            "range": 970,
            "elevation": 1062,
            "tof": 21,
            "dElevPer100m": 34.2,
            "peakAlt": 538,
            "angleImpact": 64,
            "dispersion": 48.7
          },
          {
            "range": 1060,
            "elevation": 999,
            "tof": 20.2,
            "dElevPer100m": 37.8,
            "peakAlt": 500,
            "angleImpact": 60,
            "dispersion": 53.2
          },
          {
            "range": 1150,
            "elevation": 917,
            "tof": 19.2,
            "dElevPer100m": 43.5,
            "peakAlt": 450,
            "angleImpact": 55,
            "dispersion": 58.9
          },
          {
            "range": 1240,
            "elevation": 765,
            "tof": 16.7,
            "dElevPer100m": 53.8,
            "peakAlt": 343,
            "angleImpact": 46,
            "dispersion": 67.9
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 260,
        "maxRange": 1590,
        "muzzleVelocity": 174,
        "table": [
          {
            "range": 260,
            "elevation": 1423,
            "tof": 27.2,
            "dElevPer100m": 28.1,
            "peakAlt": 904,
            "angleImpact": 85,
            "dispersion": 40.8
          },
          {
            "range": 350,
            "elevation": 1398,
            "tof": 27.1,
            "dElevPer100m": 28.6,
            "peakAlt": 898,
            "angleImpact": 84,
            "dispersion": 41.9
          },
          {
            "range": 440,
            "elevation": 1373,
            "tof": 27,
            "dElevPer100m": 29.2,
            "peakAlt": 892,
            "angleImpact": 82,
            "dispersion": 44.2
          },
          {
            "range": 530,
            "elevation": 1347,
            "tof": 26.9,
            "dElevPer100m": 29.9,
            "peakAlt": 886,
            "angleImpact": 81,
            "dispersion": 45.3
          },
          {
            "range": 620,
            "elevation": 1320,
            "tof": 26.7,
            "dElevPer100m": 30.7,
            "peakAlt": 873,
            "angleImpact": 79,
            "dispersion": 47.6
          },
          {
            "range": 710,
            "elevation": 1292,
            "tof": 26.6,
            "dElevPer100m": 31.8,
            "peakAlt": 867,
            "angleImpact": 78,
            "dispersion": 49.8
          },
          {
            "range": 790,
            "elevation": 1261,
            "tof": 26.4,
            "dElevPer100m": 33.9,
            "peakAlt": 855,
            "angleImpact": 76,
            "dispersion": 52.1
          },
          {
            "range": 880,
            "elevation": 1227,
            "tof": 26.2,
            "dElevPer100m": 34,
            "peakAlt": 843,
            "angleImpact": 74,
            "dispersion": 54.3
          },
          {
            "range": 970,
            "elevation": 1193,
            "tof": 25.9,
            "dElevPer100m": 35.6,
            "peakAlt": 825,
            "angleImpact": 72,
            "dispersion": 57.7
          },
          {
            "range": 1060,
            "elevation": 1157,
            "tof": 25.7,
            "dElevPer100m": 37.4,
            "peakAlt": 807,
            "angleImpact": 69,
            "dispersion": 61.1
          },
          {
            "range": 1150,
            "elevation": 1119,
            "tof": 25.3,
            "dElevPer100m": 39.5,
            "peakAlt": 783,
            "angleImpact": 67,
            "dispersion": 64.5
          },
          {
            "range": 1240,
            "elevation": 1079,
            "tof": 24.8,
            "dElevPer100m": 42,
            "peakAlt": 754,
            "angleImpact": 65,
            "dispersion": 69.1
          },
          {
            "range": 1320,
            "elevation": 1037,
            "tof": 24.2,
            "dElevPer100m": 45.2,
            "peakAlt": 721,
            "angleImpact": 62,
            "dispersion": 73.6
          },
          {
            "range": 1410,
            "elevation": 993,
            "tof": 23.6,
            "dElevPer100m": 49,
            "peakAlt": 682,
            "angleImpact": 60,
            "dispersion": 79.3
          },
          {
            "range": 1500,
            "elevation": 944,
            "tof": 22.8,
            "dElevPer100m": 53.8,
            "peakAlt": 639,
            "angleImpact": 57,
            "dispersion": 86.1
          },
          {
            "range": 1590,
            "elevation": 840,
            "tof": 20.7,
            "dElevPer100m": 64.5,
            "peakAlt": 524,
            "angleImpact": 50,
            "dispersion": 96.2
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Long Range (Charge 4)",
        "minRange": 350,
        "maxRange": 2030,
        "muzzleVelocity": 202,
        "table": [
          {
            "range": 350,
            "elevation": 1410,
            "tof": 31.2,
            "dElevPer100m": 34.9,
            "peakAlt": 1192,
            "angleImpact": 85,
            "dispersion": 51
          },
          {
            "range": 530,
            "elevation": 1373,
            "tof": 30.9,
            "dElevPer100m": 36,
            "peakAlt": 1171,
            "angleImpact": 82,
            "dispersion": 54.3
          },
          {
            "range": 710,
            "elevation": 1332,
            "tof": 30.5,
            "dElevPer100m": 37.4,
            "peakAlt": 1143,
            "angleImpact": 80,
            "dispersion": 58.9
          },
          {
            "range": 880,
            "elevation": 1288,
            "tof": 30.1,
            "dElevPer100m": 39.2,
            "peakAlt": 1108,
            "angleImpact": 77,
            "dispersion": 63.4
          },
          {
            "range": 1060,
            "elevation": 1242,
            "tof": 29.5,
            "dElevPer100m": 41.3,
            "peakAlt": 1067,
            "angleImpact": 75,
            "dispersion": 69.1
          },
          {
            "range": 1240,
            "elevation": 1192,
            "tof": 28.9,
            "dElevPer100m": 44,
            "peakAlt": 1020,
            "angleImpact": 72,
            "dispersion": 75.9
          },
          {
            "range": 1410,
            "elevation": 1140,
            "tof": 28.1,
            "dElevPer100m": 47.3,
            "peakAlt": 968,
            "angleImpact": 68,
            "dispersion": 83.8
          },
          {
            "range": 1590,
            "elevation": 1084,
            "tof": 27.2,
            "dElevPer100m": 51.5,
            "peakAlt": 904,
            "angleImpact": 65,
            "dispersion": 92.8
          },
          {
            "range": 1770,
            "elevation": 1022,
            "tof": 26.1,
            "dElevPer100m": 56.8,
            "peakAlt": 837,
            "angleImpact": 61,
            "dispersion": 103
          },
          {
            "range": 1940,
            "elevation": 948,
            "tof": 24.6,
            "dElevPer100m": 65.1,
            "peakAlt": 744,
            "angleImpact": 57,
            "dispersion": 115.5
          },
          {
            "range": 2030,
            "elevation": 750,
            "tof": 22.1,
            "dElevPer100m": 81.5,
            "peakAlt": 597,
            "angleImpact": 45,
            "dispersion": 133.6
          }
        ]
      }
    ]
  },
  {
    "id": "D832DU_SMOKE",
    "name": "D-832DU Smoke",
    "code": "D-832DU",
    "category": "SMOKE",
    "weightKg": 3.48,
    "description": "White phosphorus aerosol smoke shell for target marking and thermal screening.",
    "charges": [
      {
        "charge": 0,
        "name": "0 Rings (Charge 0)",
        "minRange": 40,
        "maxRange": 450,
        "muzzleVelocity": 66,
        "table": [
          {
            "range": 40,
            "elevation": 1456,
            "tof": 14.2,
            "dElevPer100m": 13.2,
            "peakAlt": 246,
            "angleImpact": 88,
            "dispersion": 14.6
          },
          {
            "range": 90,
            "elevation": 1411,
            "tof": 14.2,
            "dElevPer100m": 13.5,
            "peakAlt": 246,
            "angleImpact": 85,
            "dispersion": 14.6
          },
          {
            "range": 130,
            "elevation": 1365,
            "tof": 14.1,
            "dElevPer100m": 13.9,
            "peakAlt": 242,
            "angleImpact": 82,
            "dispersion": 15.7
          },
          {
            "range": 180,
            "elevation": 1319,
            "tof": 14,
            "dElevPer100m": 14.4,
            "peakAlt": 239,
            "angleImpact": 79,
            "dispersion": 15.7
          },
          {
            "range": 220,
            "elevation": 1269,
            "tof": 13.8,
            "dElevPer100m": 14.9,
            "peakAlt": 233,
            "angleImpact": 76,
            "dispersion": 16.8
          },
          {
            "range": 270,
            "elevation": 1218,
            "tof": 13.6,
            "dElevPer100m": 15.6,
            "peakAlt": 226,
            "angleImpact": 73,
            "dispersion": 16.8
          },
          {
            "range": 310,
            "elevation": 1160,
            "tof": 13.3,
            "dElevPer100m": 16.5,
            "peakAlt": 217,
            "angleImpact": 70,
            "dispersion": 18
          },
          {
            "range": 360,
            "elevation": 1097,
            "tof": 12.9,
            "dElevPer100m": 17.7,
            "peakAlt": 205,
            "angleImpact": 66,
            "dispersion": 19.1
          },
          {
            "range": 400,
            "elevation": 1025,
            "tof": 12.5,
            "dElevPer100m": 19.5,
            "peakAlt": 191,
            "angleImpact": 61,
            "dispersion": 20.2
          },
          {
            "range": 450,
            "elevation": 927,
            "tof": 11.7,
            "dElevPer100m": 22.7,
            "peakAlt": 167,
            "angleImpact": 55,
            "dispersion": 21.3
          }
        ]
      },
      {
        "charge": 1,
        "name": "1 Ring (Charge 1)",
        "minRange": 90,
        "maxRange": 710,
        "muzzleVelocity": 104,
        "table": [
          {
            "range": 90,
            "elevation": 1446,
            "tof": 18.4,
            "dElevPer100m": 17.7,
            "peakAlt": 415,
            "angleImpact": 87,
            "dispersion": 20.2
          },
          {
            "range": 180,
            "elevation": 1392,
            "tof": 18.3,
            "dElevPer100m": 18.3,
            "peakAlt": 411,
            "angleImpact": 84,
            "dispersion": 21.3
          },
          {
            "range": 270,
            "elevation": 1336,
            "tof": 18.1,
            "dElevPer100m": 19.1,
            "peakAlt": 403,
            "angleImpact": 80,
            "dispersion": 22.5
          },
          {
            "range": 360,
            "elevation": 1276,
            "tof": 17.8,
            "dElevPer100m": 20.1,
            "peakAlt": 390,
            "angleImpact": 77,
            "dispersion": 23.6
          },
          {
            "range": 450,
            "elevation": 1213,
            "tof": 17.6,
            "dElevPer100m": 21.3,
            "peakAlt": 378,
            "angleImpact": 73,
            "dispersion": 24.7
          },
          {
            "range": 530,
            "elevation": 1142,
            "tof": 17.1,
            "dElevPer100m": 23,
            "peakAlt": 358,
            "angleImpact": 69,
            "dispersion": 26.9
          },
          {
            "range": 620,
            "elevation": 1060,
            "tof": 16.4,
            "dElevPer100m": 25.3,
            "peakAlt": 330,
            "angleImpact": 64,
            "dispersion": 29.2
          },
          {
            "range": 710,
            "elevation": 955,
            "tof": 15.5,
            "dElevPer100m": 29,
            "peakAlt": 294,
            "angleImpact": 57,
            "dispersion": 32.6
          }
        ]
      },
      {
        "charge": 2,
        "name": "2 Rings (Charge 2)",
        "minRange": 180,
        "maxRange": 1250,
        "muzzleVelocity": 142,
        "table": [
          {
            "range": 180,
            "elevation": 1432,
            "tof": 23.4,
            "dElevPer100m": 22.2,
            "peakAlt": 672,
            "angleImpact": 86,
            "dispersion": 29.2
          },
          {
            "range": 270,
            "elevation": 1397,
            "tof": 23.3,
            "dElevPer100m": 22.8,
            "peakAlt": 666,
            "angleImpact": 84,
            "dispersion": 30.3
          },
          {
            "range": 360,
            "elevation": 1362,
            "tof": 23.2,
            "dElevPer100m": 23.3,
            "peakAlt": 661,
            "angleImpact": 82,
            "dispersion": 31.4
          },
          {
            "range": 450,
            "elevation": 1326,
            "tof": 23,
            "dElevPer100m": 24.1,
            "peakAlt": 650,
            "angleImpact": 80,
            "dispersion": 33.7
          },
          {
            "range": 530,
            "elevation": 1288,
            "tof": 22.8,
            "dElevPer100m": 25.1,
            "peakAlt": 640,
            "angleImpact": 77,
            "dispersion": 34.8
          },
          {
            "range": 620,
            "elevation": 1249,
            "tof": 22.7,
            "dElevPer100m": 26.3,
            "peakAlt": 629,
            "angleImpact": 75,
            "dispersion": 37
          },
          {
            "range": 710,
            "elevation": 1208,
            "tof": 22.4,
            "dElevPer100m": 27.6,
            "peakAlt": 613,
            "angleImpact": 72,
            "dispersion": 39.3
          },
          {
            "range": 800,
            "elevation": 1163,
            "tof": 22,
            "dElevPer100m": 29.3,
            "peakAlt": 592,
            "angleImpact": 70,
            "dispersion": 41.5
          },
          {
            "range": 890,
            "elevation": 1115,
            "tof": 21.6,
            "dElevPer100m": 31.3,
            "peakAlt": 573,
            "angleImpact": 67,
            "dispersion": 44.9
          },
          {
            "range": 980,
            "elevation": 1062,
            "tof": 21,
            "dElevPer100m": 33.9,
            "peakAlt": 543,
            "angleImpact": 64,
            "dispersion": 48.3
          },
          {
            "range": 1070,
            "elevation": 999,
            "tof": 20.3,
            "dElevPer100m": 37.5,
            "peakAlt": 504,
            "angleImpact": 60,
            "dispersion": 52.8
          },
          {
            "range": 1160,
            "elevation": 917,
            "tof": 19.3,
            "dElevPer100m": 43.1,
            "peakAlt": 454,
            "angleImpact": 55,
            "dispersion": 58.4
          },
          {
            "range": 1250,
            "elevation": 765,
            "tof": 16.8,
            "dElevPer100m": 53.3,
            "peakAlt": 346,
            "angleImpact": 46,
            "dispersion": 67.4
          }
        ]
      },
      {
        "charge": 3,
        "name": "3 Rings (Charge 3)",
        "minRange": 270,
        "maxRange": 1600,
        "muzzleVelocity": 175,
        "table": [
          {
            "range": 270,
            "elevation": 1423,
            "tof": 27.3,
            "dElevPer100m": 27.8,
            "peakAlt": 912,
            "angleImpact": 85,
            "dispersion": 40.4
          },
          {
            "range": 360,
            "elevation": 1398,
            "tof": 27.2,
            "dElevPer100m": 28.4,
            "peakAlt": 906,
            "angleImpact": 84,
            "dispersion": 41.5
          },
          {
            "range": 450,
            "elevation": 1373,
            "tof": 27.1,
            "dElevPer100m": 29,
            "peakAlt": 900,
            "angleImpact": 82,
            "dispersion": 43.8
          },
          {
            "range": 530,
            "elevation": 1347,
            "tof": 27,
            "dElevPer100m": 29.6,
            "peakAlt": 893,
            "angleImpact": 81,
            "dispersion": 44.9
          },
          {
            "range": 620,
            "elevation": 1320,
            "tof": 26.8,
            "dElevPer100m": 30.4,
            "peakAlt": 881,
            "angleImpact": 79,
            "dispersion": 47.1
          },
          {
            "range": 710,
            "elevation": 1292,
            "tof": 26.7,
            "dElevPer100m": 31.5,
            "peakAlt": 875,
            "angleImpact": 78,
            "dispersion": 49.4
          },
          {
            "range": 800,
            "elevation": 1261,
            "tof": 26.5,
            "dElevPer100m": 33.6,
            "peakAlt": 862,
            "angleImpact": 76,
            "dispersion": 51.6
          },
          {
            "range": 890,
            "elevation": 1227,
            "tof": 26.3,
            "dElevPer100m": 33.7,
            "peakAlt": 850,
            "angleImpact": 74,
            "dispersion": 53.9
          },
          {
            "range": 980,
            "elevation": 1193,
            "tof": 26,
            "dElevPer100m": 35.2,
            "peakAlt": 832,
            "angleImpact": 72,
            "dispersion": 57.3
          },
          {
            "range": 1070,
            "elevation": 1157,
            "tof": 25.8,
            "dElevPer100m": 37,
            "peakAlt": 814,
            "angleImpact": 69,
            "dispersion": 60.6
          },
          {
            "range": 1160,
            "elevation": 1119,
            "tof": 25.4,
            "dElevPer100m": 39.2,
            "peakAlt": 790,
            "angleImpact": 67,
            "dispersion": 64
          },
          {
            "range": 1250,
            "elevation": 1079,
            "tof": 24.9,
            "dElevPer100m": 41.6,
            "peakAlt": 761,
            "angleImpact": 65,
            "dispersion": 68.5
          },
          {
            "range": 1340,
            "elevation": 1037,
            "tof": 24.4,
            "dElevPer100m": 44.8,
            "peakAlt": 727,
            "angleImpact": 62,
            "dispersion": 73
          },
          {
            "range": 1430,
            "elevation": 993,
            "tof": 23.7,
            "dElevPer100m": 48.6,
            "peakAlt": 688,
            "angleImpact": 60,
            "dispersion": 78.6
          },
          {
            "range": 1510,
            "elevation": 944,
            "tof": 22.9,
            "dElevPer100m": 53.3,
            "peakAlt": 645,
            "angleImpact": 57,
            "dispersion": 85.3
          },
          {
            "range": 1600,
            "elevation": 840,
            "tof": 20.8,
            "dElevPer100m": 64,
            "peakAlt": 528,
            "angleImpact": 50,
            "dispersion": 95.4
          }
        ]
      },
      {
        "charge": 4,
        "name": "4 Long Range (Charge 4)",
        "minRange": 360,
        "maxRange": 2050,
        "muzzleVelocity": 203,
        "table": [
          {
            "range": 360,
            "elevation": 1410,
            "tof": 31.3,
            "dElevPer100m": 34.6,
            "peakAlt": 1203,
            "angleImpact": 85,
            "dispersion": 50.5
          },
          {
            "range": 530,
            "elevation": 1373,
            "tof": 31.1,
            "dElevPer100m": 35.7,
            "peakAlt": 1181,
            "angleImpact": 82,
            "dispersion": 53.9
          },
          {
            "range": 710,
            "elevation": 1332,
            "tof": 30.7,
            "dElevPer100m": 37,
            "peakAlt": 1153,
            "angleImpact": 80,
            "dispersion": 58.4
          },
          {
            "range": 890,
            "elevation": 1288,
            "tof": 30.2,
            "dElevPer100m": 38.8,
            "peakAlt": 1118,
            "angleImpact": 77,
            "dispersion": 62.9
          },
          {
            "range": 1070,
            "elevation": 1242,
            "tof": 29.6,
            "dElevPer100m": 41,
            "peakAlt": 1076,
            "angleImpact": 75,
            "dispersion": 68.5
          },
          {
            "range": 1250,
            "elevation": 1192,
            "tof": 29,
            "dElevPer100m": 43.7,
            "peakAlt": 1029,
            "angleImpact": 72,
            "dispersion": 75.2
          },
          {
            "range": 1430,
            "elevation": 1140,
            "tof": 28.2,
            "dElevPer100m": 46.9,
            "peakAlt": 976,
            "angleImpact": 68,
            "dispersion": 83.1
          },
          {
            "range": 1600,
            "elevation": 1084,
            "tof": 27.3,
            "dElevPer100m": 51.1,
            "peakAlt": 912,
            "angleImpact": 65,
            "dispersion": 92.1
          },
          {
            "range": 1780,
            "elevation": 1022,
            "tof": 26.2,
            "dElevPer100m": 56.4,
            "peakAlt": 844,
            "angleImpact": 61,
            "dispersion": 102.2
          },
          {
            "range": 1960,
            "elevation": 948,
            "tof": 24.7,
            "dElevPer100m": 64.5,
            "peakAlt": 750,
            "angleImpact": 57,
            "dispersion": 114.5
          },
          {
            "range": 2050,
            "elevation": 750,
            "tof": 22.2,
            "dElevPer100m": 80.8,
            "peakAlt": 602,
            "angleImpact": 45,
            "dispersion": 132.5
          }
        ]
      }
    ]
  }
];

export const SPG9_AMMUNITION: AmmoConfig[] = [
  {
    "id": "PG9V_HEAT",
    "name": "PG-9V HEAT",
    "code": "PG-9V",
    "category": "HE",
    "weightKg": 4.39,
    "description": "Rocket-assisted fin-stabilized shaped charge HEAT projectile penetrating 400mm RHA.",
    "charges": [
      {
        "charge": 0,
        "name": "Direct Heat",
        "minRange": 100,
        "maxRange": 1300,
        "muzzleVelocity": 435,
        "table": [
          {
            "range": 200,
            "elevation": 6,
            "tof": 0.35,
            "dElevPer100m": 2
          },
          {
            "range": 400,
            "elevation": 15,
            "tof": 0.72,
            "dElevPer100m": 2.5
          },
          {
            "range": 600,
            "elevation": 28,
            "tof": 1.15,
            "dElevPer100m": 3.2
          },
          {
            "range": 800,
            "elevation": 46,
            "tof": 1.62,
            "dElevPer100m": 4.1
          },
          {
            "range": 1000,
            "elevation": 70,
            "tof": 2.15,
            "dElevPer100m": 5.3
          },
          {
            "range": 1200,
            "elevation": 102,
            "tof": 2.76,
            "dElevPer100m": 6.8
          },
          {
            "range": 1300,
            "elevation": 120,
            "tof": 3.1,
            "dElevPer100m": 7.8
          }
        ]
      }
    ]
  },
  {
    "id": "OG9V_HE",
    "name": "OG-9V HE-FRAG",
    "code": "OG-9V",
    "category": "HE",
    "weightKg": 5.35,
    "description": "Anti-personnel high explosive fragmentation shell for direct fortification bombardment.",
    "charges": [
      {
        "charge": 0,
        "name": "Direct Frag",
        "minRange": 100,
        "maxRange": 1000,
        "muzzleVelocity": 316,
        "table": [
          {
            "range": 160,
            "elevation": 6,
            "tof": 0.3,
            "dElevPer100m": 2.4
          },
          {
            "range": 330,
            "elevation": 15,
            "tof": 0.7,
            "dElevPer100m": 3
          },
          {
            "range": 490,
            "elevation": 28,
            "tof": 1,
            "dElevPer100m": 3.9
          },
          {
            "range": 660,
            "elevation": 46,
            "tof": 1.5,
            "dElevPer100m": 5
          },
          {
            "range": 820,
            "elevation": 70,
            "tof": 1.9,
            "dElevPer100m": 6.5
          },
          {
            "range": 980,
            "elevation": 102,
            "tof": 2.5,
            "dElevPer100m": 8.3
          },
          {
            "range": 1070,
            "elevation": 120,
            "tof": 2.8,
            "dElevPer100m": 9.5
          }
        ]
      }
    ]
  }
];

export const WEAPONS: WeaponConfig[] = [
  {
    id: 'm252_81mm',
    name: 'M252 81mm Mortar',
    faction: 'US Army',
    caliber: '81mm M821 HE',
    milSystem: 'NATO',
    milsPerCircle: 6400,
    minElevation: 800, // 45.0° (800 mils)
    maxElevation: 1515, // 85.2° (1515 mils)
    description: 'American standard smoothbore battalion mortar. High-trajectory indirect fire from 50m to 2,900m using 0 to 4 propellant charge rings and M67 sight unit.',
    charges: [
  {
    "charge": 0,
    "name": "0 Rings (Charge 0)",
    "minRange": 50,
    "maxRange": 500,
    "muzzleVelocity": 68,
    "table": [
      {
        "range": 50,
        "elevation": 1456,
        "tof": 15,
        "dElevPer100m": 12,
        "peakAlt": 276,
        "angleImpact": 88,
        "dispersion": 13
      },
      {
        "range": 100,
        "elevation": 1411,
        "tof": 15,
        "dElevPer100m": 12.2,
        "peakAlt": 276,
        "angleImpact": 85,
        "dispersion": 13
      },
      {
        "range": 150,
        "elevation": 1365,
        "tof": 14.9,
        "dElevPer100m": 12.5,
        "peakAlt": 272,
        "angleImpact": 82,
        "dispersion": 14
      },
      {
        "range": 200,
        "elevation": 1319,
        "tof": 14.8,
        "dElevPer100m": 12.9,
        "peakAlt": 268,
        "angleImpact": 79,
        "dispersion": 14
      },
      {
        "range": 250,
        "elevation": 1269,
        "tof": 14.6,
        "dElevPer100m": 13.4,
        "peakAlt": 261,
        "angleImpact": 76,
        "dispersion": 15
      },
      {
        "range": 300,
        "elevation": 1218,
        "tof": 14.4,
        "dElevPer100m": 14,
        "peakAlt": 254,
        "angleImpact": 73,
        "dispersion": 15
      },
      {
        "range": 350,
        "elevation": 1160,
        "tof": 14.1,
        "dElevPer100m": 14.8,
        "peakAlt": 244,
        "angleImpact": 70,
        "dispersion": 16
      },
      {
        "range": 400,
        "elevation": 1097,
        "tof": 13.7,
        "dElevPer100m": 15.9,
        "peakAlt": 230,
        "angleImpact": 66,
        "dispersion": 17
      },
      {
        "range": 450,
        "elevation": 1025,
        "tof": 13.2,
        "dElevPer100m": 17.5,
        "peakAlt": 214,
        "angleImpact": 61,
        "dispersion": 18
      },
      {
        "range": 500,
        "elevation": 927,
        "tof": 12.4,
        "dElevPer100m": 20.4,
        "peakAlt": 188,
        "angleImpact": 55,
        "dispersion": 19
      }
    ]
  },
  {
    "charge": 1,
    "name": "1 Ring (Charge 1)",
    "minRange": 100,
    "maxRange": 800,
    "muzzleVelocity": 105,
    "table": [
      {
        "range": 100,
        "elevation": 1446,
        "tof": 19.5,
        "dElevPer100m": 16,
        "peakAlt": 466,
        "angleImpact": 87,
        "dispersion": 18
      },
      {
        "range": 200,
        "elevation": 1392,
        "tof": 19.4,
        "dElevPer100m": 16.5,
        "peakAlt": 461,
        "angleImpact": 84,
        "dispersion": 19
      },
      {
        "range": 300,
        "elevation": 1336,
        "tof": 19.2,
        "dElevPer100m": 17.2,
        "peakAlt": 452,
        "angleImpact": 80,
        "dispersion": 20
      },
      {
        "range": 400,
        "elevation": 1276,
        "tof": 18.9,
        "dElevPer100m": 18.1,
        "peakAlt": 438,
        "angleImpact": 77,
        "dispersion": 21
      },
      {
        "range": 500,
        "elevation": 1213,
        "tof": 18.6,
        "dElevPer100m": 19.2,
        "peakAlt": 424,
        "angleImpact": 73,
        "dispersion": 22
      },
      {
        "range": 600,
        "elevation": 1142,
        "tof": 18.1,
        "dElevPer100m": 20.7,
        "peakAlt": 402,
        "angleImpact": 69,
        "dispersion": 24
      },
      {
        "range": 700,
        "elevation": 1060,
        "tof": 17.4,
        "dElevPer100m": 22.8,
        "peakAlt": 371,
        "angleImpact": 64,
        "dispersion": 26
      },
      {
        "range": 800,
        "elevation": 955,
        "tof": 16.4,
        "dElevPer100m": 26.2,
        "peakAlt": 330,
        "angleImpact": 57,
        "dispersion": 29
      }
    ]
  },
  {
    "charge": 2,
    "name": "2 Rings (Charge 2)",
    "minRange": 200,
    "maxRange": 1400,
    "muzzleVelocity": 145,
    "table": [
      {
        "range": 200,
        "elevation": 1432,
        "tof": 24.8,
        "dElevPer100m": 20,
        "peakAlt": 754,
        "angleImpact": 86,
        "dispersion": 26
      },
      {
        "range": 300,
        "elevation": 1397,
        "tof": 24.7,
        "dElevPer100m": 20.5,
        "peakAlt": 748,
        "angleImpact": 84,
        "dispersion": 27
      },
      {
        "range": 400,
        "elevation": 1362,
        "tof": 24.6,
        "dElevPer100m": 21,
        "peakAlt": 742,
        "angleImpact": 82,
        "dispersion": 28
      },
      {
        "range": 500,
        "elevation": 1326,
        "tof": 24.4,
        "dElevPer100m": 21.7,
        "peakAlt": 730,
        "angleImpact": 80,
        "dispersion": 30
      },
      {
        "range": 600,
        "elevation": 1288,
        "tof": 24.2,
        "dElevPer100m": 22.6,
        "peakAlt": 718,
        "angleImpact": 77,
        "dispersion": 31
      },
      {
        "range": 700,
        "elevation": 1249,
        "tof": 24,
        "dElevPer100m": 23.6,
        "peakAlt": 706,
        "angleImpact": 75,
        "dispersion": 33
      },
      {
        "range": 800,
        "elevation": 1208,
        "tof": 23.7,
        "dElevPer100m": 24.8,
        "peakAlt": 688,
        "angleImpact": 72,
        "dispersion": 35
      },
      {
        "range": 900,
        "elevation": 1163,
        "tof": 23.3,
        "dElevPer100m": 26.3,
        "peakAlt": 665,
        "angleImpact": 70,
        "dispersion": 37
      },
      {
        "range": 1000,
        "elevation": 1115,
        "tof": 22.9,
        "dElevPer100m": 28.1,
        "peakAlt": 643,
        "angleImpact": 67,
        "dispersion": 40
      },
      {
        "range": 1100,
        "elevation": 1062,
        "tof": 22.3,
        "dElevPer100m": 30.5,
        "peakAlt": 609,
        "angleImpact": 64,
        "dispersion": 43
      },
      {
        "range": 1200,
        "elevation": 999,
        "tof": 21.5,
        "dElevPer100m": 33.7,
        "peakAlt": 566,
        "angleImpact": 60,
        "dispersion": 47
      },
      {
        "range": 1300,
        "elevation": 917,
        "tof": 20.4,
        "dElevPer100m": 38.8,
        "peakAlt": 510,
        "angleImpact": 55,
        "dispersion": 52
      },
      {
        "range": 1400,
        "elevation": 765,
        "tof": 17.8,
        "dElevPer100m": 48,
        "peakAlt": 388,
        "angleImpact": 46,
        "dispersion": 60
      }
    ]
  },
  {
    "charge": 3,
    "name": "3 Rings (Charge 3)",
    "minRange": 300,
    "maxRange": 2000,
    "muzzleVelocity": 182,
    "table": [
      {
        "range": 300,
        "elevation": 1423,
        "tof": 28.9,
        "dElevPer100m": 25,
        "peakAlt": 1024,
        "angleImpact": 85,
        "dispersion": 36
      },
      {
        "range": 400,
        "elevation": 1398,
        "tof": 28.8,
        "dElevPer100m": 25.5,
        "peakAlt": 1017,
        "angleImpact": 84,
        "dispersion": 37
      },
      {
        "range": 500,
        "elevation": 1373,
        "tof": 28.7,
        "dElevPer100m": 26,
        "peakAlt": 1010,
        "angleImpact": 82,
        "dispersion": 39
      },
      {
        "range": 600,
        "elevation": 1347,
        "tof": 28.6,
        "dElevPer100m": 26.6,
        "peakAlt": 1003,
        "angleImpact": 81,
        "dispersion": 40
      },
      {
        "range": 700,
        "elevation": 1320,
        "tof": 28.4,
        "dElevPer100m": 27.3,
        "peakAlt": 989,
        "angleImpact": 79,
        "dispersion": 42
      },
      {
        "range": 800,
        "elevation": 1292,
        "tof": 28.3,
        "dElevPer100m": 28.1,
        "peakAlt": 982,
        "angleImpact": 78,
        "dispersion": 44
      },
      {
        "range": 900,
        "elevation": 1261,
        "tof": 28.1,
        "dElevPer100m": 29.1,
        "peakAlt": 968,
        "angleImpact": 76,
        "dispersion": 46
      },
      {
        "range": 1000,
        "elevation": 1227,
        "tof": 27.9,
        "dElevPer100m": 30.2,
        "peakAlt": 954,
        "angleImpact": 74,
        "dispersion": 48
      },
      {
        "range": 1100,
        "elevation": 1193,
        "tof": 27.6,
        "dElevPer100m": 31.6,
        "peakAlt": 934,
        "angleImpact": 72,
        "dispersion": 51
      },
      {
        "range": 1200,
        "elevation": 1157,
        "tof": 27.3,
        "dElevPer100m": 33.2,
        "peakAlt": 914,
        "angleImpact": 69,
        "dispersion": 54
      },
      {
        "range": 1300,
        "elevation": 1119,
        "tof": 26.9,
        "dElevPer100m": 35.1,
        "peakAlt": 887,
        "angleImpact": 67,
        "dispersion": 57
      },
      {
        "range": 1400,
        "elevation": 1079,
        "tof": 26.4,
        "dElevPer100m": 37.4,
        "peakAlt": 854,
        "angleImpact": 65,
        "dispersion": 61
      },
      {
        "range": 1500,
        "elevation": 1037,
        "tof": 25.8,
        "dElevPer100m": 40.2,
        "peakAlt": 816,
        "angleImpact": 62,
        "dispersion": 65
      },
      {
        "range": 1600,
        "elevation": 993,
        "tof": 25.1,
        "dElevPer100m": 43.6,
        "peakAlt": 772,
        "angleImpact": 60,
        "dispersion": 70
      },
      {
        "range": 1700,
        "elevation": 944,
        "tof": 24.3,
        "dElevPer100m": 47.9,
        "peakAlt": 724,
        "angleImpact": 57,
        "dispersion": 76
      },
      {
        "range": 1800,
        "elevation": 888,
        "tof": 23.3,
        "dElevPer100m": 53.6,
        "peakAlt": 665,
        "angleImpact": 53,
        "dispersion": 83
      },
      {
        "range": 1900,
        "elevation": 818,
        "tof": 22,
        "dElevPer100m": 62,
        "peakAlt": 593,
        "angleImpact": 49,
        "dispersion": 92
      },
      {
        "range": 2000,
        "elevation": 760,
        "tof": 20.1,
        "dElevPer100m": 74,
        "peakAlt": 495,
        "angleImpact": 46,
        "dispersion": 104
      }
    ]
  },
  {
    "charge": 4,
    "name": "4 Rings (Charge 4)",
    "minRange": 400,
    "maxRange": 2900,
    "muzzleVelocity": 220,
    "table": [
      {
        "range": 400,
        "elevation": 1415,
        "tof": 34,
        "dElevPer100m": 31,
        "peakAlt": 1417,
        "angleImpact": 85,
        "dispersion": 45
      },
      {
        "range": 600,
        "elevation": 1378,
        "tof": 33.7,
        "dElevPer100m": 32,
        "peakAlt": 1392,
        "angleImpact": 83,
        "dispersion": 48
      },
      {
        "range": 800,
        "elevation": 1338,
        "tof": 33.3,
        "dElevPer100m": 33.2,
        "peakAlt": 1359,
        "angleImpact": 80,
        "dispersion": 52
      },
      {
        "range": 1000,
        "elevation": 1295,
        "tof": 32.8,
        "dElevPer100m": 34.8,
        "peakAlt": 1319,
        "angleImpact": 78,
        "dispersion": 56
      },
      {
        "range": 1200,
        "elevation": 1250,
        "tof": 32.2,
        "dElevPer100m": 36.8,
        "peakAlt": 1271,
        "angleImpact": 75,
        "dispersion": 61
      },
      {
        "range": 1400,
        "elevation": 1202,
        "tof": 31.5,
        "dElevPer100m": 39.2,
        "peakAlt": 1216,
        "angleImpact": 72,
        "dispersion": 67
      },
      {
        "range": 1600,
        "elevation": 1152,
        "tof": 30.7,
        "dElevPer100m": 42.2,
        "peakAlt": 1155,
        "angleImpact": 69,
        "dispersion": 74
      },
      {
        "range": 1800,
        "elevation": 1098,
        "tof": 29.8,
        "dElevPer100m": 46,
        "peakAlt": 1089,
        "angleImpact": 66,
        "dispersion": 82
      },
      {
        "range": 2000,
        "elevation": 1040,
        "tof": 28.8,
        "dElevPer100m": 50.8,
        "peakAlt": 1017,
        "angleImpact": 62,
        "dispersion": 91
      },
      {
        "range": 2200,
        "elevation": 978,
        "tof": 27.6,
        "dElevPer100m": 57,
        "peakAlt": 934,
        "angleImpact": 59,
        "dispersion": 102
      },
      {
        "range": 2400,
        "elevation": 910,
        "tof": 26.2,
        "dElevPer100m": 65.2,
        "peakAlt": 842,
        "angleImpact": 55,
        "dispersion": 115
      },
      {
        "range": 2600,
        "elevation": 834,
        "tof": 24.5,
        "dElevPer100m": 76.5,
        "peakAlt": 736,
        "angleImpact": 50,
        "dispersion": 132
      },
      {
        "range": 2800,
        "elevation": 785,
        "tof": 23.1,
        "dElevPer100m": 90,
        "peakAlt": 654,
        "angleImpact": 47,
        "dispersion": 150
      },
      {
        "range": 2900,
        "elevation": 750,
        "tof": 22,
        "dElevPer100m": 102,
        "peakAlt": 593,
        "angleImpact": 45,
        "dispersion": 165
      }
    ]
  }
],
    ammunition: M252_AMMUNITION,
  },
  {
    id: '2b14_82mm',
    name: '2B14 Podnos 82mm Mortar',
    faction: 'Soviet Army',
    caliber: '82mm O-832DU HE',
    milSystem: 'SOVIET',
    milsPerCircle: 6000,
    minElevation: 748, // 44.9° (07-48)
    maxElevation: 1415, // 84.9° (14-15)
    description: 'Soviet/Russian light battalion mortar. High trajectory fire from 50m to 2,300m using 0 to 4 additional ring charges and 60-00 Warsaw Pact sight graduations.',
    charges: [
  {
    "charge": 0,
    "name": "0 Rings (Charge 0)",
    "minRange": 50,
    "maxRange": 500,
    "muzzleVelocity": 70,
    "table": [
      {
        "range": 50,
        "elevation": 1456,
        "tof": 15,
        "dElevPer100m": 11.8,
        "peakAlt": 276,
        "angleImpact": 88,
        "dispersion": 13
      },
      {
        "range": 100,
        "elevation": 1411,
        "tof": 15,
        "dElevPer100m": 12,
        "peakAlt": 276,
        "angleImpact": 85,
        "dispersion": 13
      },
      {
        "range": 150,
        "elevation": 1365,
        "tof": 14.9,
        "dElevPer100m": 12.4,
        "peakAlt": 272,
        "angleImpact": 82,
        "dispersion": 14
      },
      {
        "range": 200,
        "elevation": 1319,
        "tof": 14.8,
        "dElevPer100m": 12.8,
        "peakAlt": 268,
        "angleImpact": 79,
        "dispersion": 14
      },
      {
        "range": 250,
        "elevation": 1269,
        "tof": 14.6,
        "dElevPer100m": 13.3,
        "peakAlt": 261,
        "angleImpact": 76,
        "dispersion": 15
      },
      {
        "range": 300,
        "elevation": 1218,
        "tof": 14.4,
        "dElevPer100m": 13.9,
        "peakAlt": 254,
        "angleImpact": 73,
        "dispersion": 15
      },
      {
        "range": 350,
        "elevation": 1160,
        "tof": 14.1,
        "dElevPer100m": 14.7,
        "peakAlt": 244,
        "angleImpact": 70,
        "dispersion": 16
      },
      {
        "range": 400,
        "elevation": 1097,
        "tof": 13.7,
        "dElevPer100m": 15.8,
        "peakAlt": 230,
        "angleImpact": 66,
        "dispersion": 17
      },
      {
        "range": 450,
        "elevation": 1025,
        "tof": 13.2,
        "dElevPer100m": 17.4,
        "peakAlt": 214,
        "angleImpact": 61,
        "dispersion": 18
      },
      {
        "range": 500,
        "elevation": 927,
        "tof": 12.4,
        "dElevPer100m": 20.2,
        "peakAlt": 188,
        "angleImpact": 55,
        "dispersion": 19
      }
    ]
  },
  {
    "charge": 1,
    "name": "1 Ring (Charge 1)",
    "minRange": 100,
    "maxRange": 800,
    "muzzleVelocity": 110,
    "table": [
      {
        "range": 100,
        "elevation": 1446,
        "tof": 19.5,
        "dElevPer100m": 15.8,
        "peakAlt": 466,
        "angleImpact": 87,
        "dispersion": 18
      },
      {
        "range": 200,
        "elevation": 1392,
        "tof": 19.4,
        "dElevPer100m": 16.3,
        "peakAlt": 461,
        "angleImpact": 84,
        "dispersion": 19
      },
      {
        "range": 300,
        "elevation": 1336,
        "tof": 19.2,
        "dElevPer100m": 17,
        "peakAlt": 452,
        "angleImpact": 80,
        "dispersion": 20
      },
      {
        "range": 400,
        "elevation": 1276,
        "tof": 18.9,
        "dElevPer100m": 17.9,
        "peakAlt": 438,
        "angleImpact": 77,
        "dispersion": 21
      },
      {
        "range": 500,
        "elevation": 1213,
        "tof": 18.6,
        "dElevPer100m": 19,
        "peakAlt": 424,
        "angleImpact": 73,
        "dispersion": 22
      },
      {
        "range": 600,
        "elevation": 1142,
        "tof": 18.1,
        "dElevPer100m": 20.5,
        "peakAlt": 402,
        "angleImpact": 69,
        "dispersion": 24
      },
      {
        "range": 700,
        "elevation": 1060,
        "tof": 17.4,
        "dElevPer100m": 22.5,
        "peakAlt": 371,
        "angleImpact": 64,
        "dispersion": 26
      },
      {
        "range": 800,
        "elevation": 955,
        "tof": 16.4,
        "dElevPer100m": 25.8,
        "peakAlt": 330,
        "angleImpact": 57,
        "dispersion": 29
      }
    ]
  },
  {
    "charge": 2,
    "name": "2 Rings (Charge 2)",
    "minRange": 200,
    "maxRange": 1400,
    "muzzleVelocity": 150,
    "table": [
      {
        "range": 200,
        "elevation": 1432,
        "tof": 24.8,
        "dElevPer100m": 19.8,
        "peakAlt": 754,
        "angleImpact": 86,
        "dispersion": 26
      },
      {
        "range": 300,
        "elevation": 1397,
        "tof": 24.7,
        "dElevPer100m": 20.3,
        "peakAlt": 748,
        "angleImpact": 84,
        "dispersion": 27
      },
      {
        "range": 400,
        "elevation": 1362,
        "tof": 24.6,
        "dElevPer100m": 20.8,
        "peakAlt": 742,
        "angleImpact": 82,
        "dispersion": 28
      },
      {
        "range": 500,
        "elevation": 1326,
        "tof": 24.4,
        "dElevPer100m": 21.5,
        "peakAlt": 730,
        "angleImpact": 80,
        "dispersion": 30
      },
      {
        "range": 600,
        "elevation": 1288,
        "tof": 24.2,
        "dElevPer100m": 22.4,
        "peakAlt": 718,
        "angleImpact": 77,
        "dispersion": 31
      },
      {
        "range": 700,
        "elevation": 1249,
        "tof": 24,
        "dElevPer100m": 23.4,
        "peakAlt": 706,
        "angleImpact": 75,
        "dispersion": 33
      },
      {
        "range": 800,
        "elevation": 1208,
        "tof": 23.7,
        "dElevPer100m": 24.6,
        "peakAlt": 688,
        "angleImpact": 72,
        "dispersion": 35
      },
      {
        "range": 900,
        "elevation": 1163,
        "tof": 23.3,
        "dElevPer100m": 26.1,
        "peakAlt": 665,
        "angleImpact": 70,
        "dispersion": 37
      },
      {
        "range": 1000,
        "elevation": 1115,
        "tof": 22.9,
        "dElevPer100m": 27.9,
        "peakAlt": 643,
        "angleImpact": 67,
        "dispersion": 40
      },
      {
        "range": 1100,
        "elevation": 1062,
        "tof": 22.3,
        "dElevPer100m": 30.2,
        "peakAlt": 609,
        "angleImpact": 64,
        "dispersion": 43
      },
      {
        "range": 1200,
        "elevation": 999,
        "tof": 21.5,
        "dElevPer100m": 33.4,
        "peakAlt": 566,
        "angleImpact": 60,
        "dispersion": 47
      },
      {
        "range": 1300,
        "elevation": 917,
        "tof": 20.4,
        "dElevPer100m": 38.4,
        "peakAlt": 510,
        "angleImpact": 55,
        "dispersion": 52
      },
      {
        "range": 1400,
        "elevation": 765,
        "tof": 17.8,
        "dElevPer100m": 47.5,
        "peakAlt": 388,
        "angleImpact": 46,
        "dispersion": 60
      }
    ]
  },
  {
    "charge": 3,
    "name": "3 Rings (Charge 3)",
    "minRange": 300,
    "maxRange": 1800,
    "muzzleVelocity": 185,
    "table": [
      {
        "range": 300,
        "elevation": 1423,
        "tof": 28.9,
        "dElevPer100m": 24.8,
        "peakAlt": 1024,
        "angleImpact": 85,
        "dispersion": 36
      },
      {
        "range": 400,
        "elevation": 1398,
        "tof": 28.8,
        "dElevPer100m": 25.3,
        "peakAlt": 1017,
        "angleImpact": 84,
        "dispersion": 37
      },
      {
        "range": 500,
        "elevation": 1373,
        "tof": 28.7,
        "dElevPer100m": 25.8,
        "peakAlt": 1010,
        "angleImpact": 82,
        "dispersion": 39
      },
      {
        "range": 600,
        "elevation": 1347,
        "tof": 28.6,
        "dElevPer100m": 26.4,
        "peakAlt": 1003,
        "angleImpact": 81,
        "dispersion": 40
      },
      {
        "range": 700,
        "elevation": 1320,
        "tof": 28.4,
        "dElevPer100m": 27.1,
        "peakAlt": 989,
        "angleImpact": 79,
        "dispersion": 42
      },
      {
        "range": 800,
        "elevation": 1292,
        "tof": 28.3,
        "dElevPer100m": 28.1,
        "peakAlt": 982,
        "angleImpact": 78,
        "dispersion": 44
      },
      {
        "range": 900,
        "elevation": 1261,
        "tof": 28.1,
        "dElevPer100m": 29.9,
        "peakAlt": 968,
        "angleImpact": 76,
        "dispersion": 46
      },
      {
        "range": 1000,
        "elevation": 1227,
        "tof": 27.9,
        "dElevPer100m": 30,
        "peakAlt": 954,
        "angleImpact": 74,
        "dispersion": 48
      },
      {
        "range": 1100,
        "elevation": 1193,
        "tof": 27.6,
        "dElevPer100m": 31.4,
        "peakAlt": 934,
        "angleImpact": 72,
        "dispersion": 51
      },
      {
        "range": 1200,
        "elevation": 1157,
        "tof": 27.3,
        "dElevPer100m": 33,
        "peakAlt": 914,
        "angleImpact": 69,
        "dispersion": 54
      },
      {
        "range": 1300,
        "elevation": 1119,
        "tof": 26.9,
        "dElevPer100m": 34.9,
        "peakAlt": 887,
        "angleImpact": 67,
        "dispersion": 57
      },
      {
        "range": 1400,
        "elevation": 1079,
        "tof": 26.4,
        "dElevPer100m": 37.1,
        "peakAlt": 854,
        "angleImpact": 65,
        "dispersion": 61
      },
      {
        "range": 1500,
        "elevation": 1037,
        "tof": 25.8,
        "dElevPer100m": 39.9,
        "peakAlt": 816,
        "angleImpact": 62,
        "dispersion": 65
      },
      {
        "range": 1600,
        "elevation": 993,
        "tof": 25.1,
        "dElevPer100m": 43.3,
        "peakAlt": 772,
        "angleImpact": 60,
        "dispersion": 70
      },
      {
        "range": 1700,
        "elevation": 944,
        "tof": 24.3,
        "dElevPer100m": 47.5,
        "peakAlt": 724,
        "angleImpact": 57,
        "dispersion": 76
      },
      {
        "range": 1800,
        "elevation": 840,
        "tof": 22,
        "dElevPer100m": 57,
        "peakAlt": 593,
        "angleImpact": 50,
        "dispersion": 85
      }
    ]
  },
  {
    "charge": 4,
    "name": "4 Long Range (Charge 4)",
    "minRange": 400,
    "maxRange": 2300,
    "muzzleVelocity": 215,
    "table": [
      {
        "range": 400,
        "elevation": 1410,
        "tof": 33.2,
        "dElevPer100m": 30.8,
        "peakAlt": 1350,
        "angleImpact": 85,
        "dispersion": 45
      },
      {
        "range": 600,
        "elevation": 1373,
        "tof": 32.9,
        "dElevPer100m": 31.8,
        "peakAlt": 1326,
        "angleImpact": 82,
        "dispersion": 48
      },
      {
        "range": 800,
        "elevation": 1332,
        "tof": 32.5,
        "dElevPer100m": 33,
        "peakAlt": 1294,
        "angleImpact": 80,
        "dispersion": 52
      },
      {
        "range": 1000,
        "elevation": 1288,
        "tof": 32,
        "dElevPer100m": 34.6,
        "peakAlt": 1255,
        "angleImpact": 77,
        "dispersion": 56
      },
      {
        "range": 1200,
        "elevation": 1242,
        "tof": 31.4,
        "dElevPer100m": 36.5,
        "peakAlt": 1208,
        "angleImpact": 75,
        "dispersion": 61
      },
      {
        "range": 1400,
        "elevation": 1192,
        "tof": 30.7,
        "dElevPer100m": 38.9,
        "peakAlt": 1155,
        "angleImpact": 72,
        "dispersion": 67
      },
      {
        "range": 1600,
        "elevation": 1140,
        "tof": 29.9,
        "dElevPer100m": 41.8,
        "peakAlt": 1096,
        "angleImpact": 68,
        "dispersion": 74
      },
      {
        "range": 1800,
        "elevation": 1084,
        "tof": 28.9,
        "dElevPer100m": 45.5,
        "peakAlt": 1024,
        "angleImpact": 65,
        "dispersion": 82
      },
      {
        "range": 2000,
        "elevation": 1022,
        "tof": 27.8,
        "dElevPer100m": 50.2,
        "peakAlt": 948,
        "angleImpact": 61,
        "dispersion": 91
      },
      {
        "range": 2200,
        "elevation": 948,
        "tof": 26.2,
        "dElevPer100m": 57.5,
        "peakAlt": 842,
        "angleImpact": 57,
        "dispersion": 102
      },
      {
        "range": 2300,
        "elevation": 750,
        "tof": 23.5,
        "dElevPer100m": 72,
        "peakAlt": 676,
        "angleImpact": 45,
        "dispersion": 118
      }
    ]
  }
],
    ammunition: PODNOS_AMMUNITION,
  },
  {
    id: 'spg9_73mm',
    name: 'SPG-9 Kopye 73mm Recoilless Rifle',
    faction: 'Soviet Army',
    caliber: '73mm PG-9V / OG-9V',
    milSystem: 'SOVIET',
    milsPerCircle: 6000,
    minElevation: 0,
    maxElevation: 400,
    description: 'Smoothbore tripod recoilless gun. High muzzle velocity direct fire against armor & fortified positions up to 1,300m.',
    charges: [
      {
        charge: 0,
        name: 'Direct Heat',
        minRange: 100,
        maxRange: 1300,
        muzzleVelocity: 435,
        table: SPG9_PG9V_HEAT_CHARGE_0,
      },
    ],
    ammunition: SPG9_AMMUNITION,
  },
];

/**
 * Universal ballistic solution entry point (routes to precision calculator engine)
 */
export function calculateFiringSolution(
  weapon: WeaponConfig,
  gunPos: { x: number; z: number; alt: number },
  targetPos: { x: number; z: number; alt: number },
  preferredCharge?: number,
  ammoId?: string
): BallisticSolution {
  return solveMortarFireMission({
    weapon,
    gunPos,
    targetPos,
    preferredCharge,
    ammoId,
  });
}

export function formatGridCoord(x: number, z: number, digits: 6 | 8 = 6): string {
  const padLen = digits / 2;
  const factor = digits === 6 ? 100 : 10;

  const easting = Math.floor(x / factor);
  const northing = Math.floor(z / factor);

  const eastStr = String(easting).padStart(padLen, '0').slice(-padLen);
  const northStr = String(northing).padStart(padLen, '0').slice(-padLen);

  return `${eastStr} ${northStr}`;
}
