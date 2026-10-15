import { BallisticSolution, WeaponConfig, BallisticDataPoint } from '../types';
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

export const WEAPONS: WeaponConfig[] = [
  {
    id: 'm252_81mm',
    name: 'M252 81mm Mortar',
    faction: 'US Army',
    caliber: '81mm M821 HE',
    milSystem: 'NATO',
    milsPerCircle: 6400,
    minElevation: 800, // 45.0°
    maxElevation: 1511, // 85.0°
    description: 'American standard smoothbore battalion mortar. High-trajectory indirect fire from 50m to 2,900m using 0 to 4 propellant charge rings and M67 sight unit.',
    charges: [
      {
        charge: 0,
        name: '0 Rings (Charge 0)',
        minRange: 50,
        maxRange: 500,
        muzzleVelocity: 68,
        table: M252_M821_HE_CHARGE_0,
      },
      {
        charge: 1,
        name: '1 Ring (Charge 1)',
        minRange: 100,
        maxRange: 800,
        muzzleVelocity: 105,
        table: M252_M821_HE_CHARGE_1,
      },
      {
        charge: 2,
        name: '2 Rings (Charge 2)',
        minRange: 200,
        maxRange: 1400,
        muzzleVelocity: 145,
        table: M252_M821_HE_CHARGE_2,
      },
      {
        charge: 3,
        name: '3 Rings (Charge 3)',
        minRange: 300,
        maxRange: 2000,
        muzzleVelocity: 182,
        table: M252_M821_HE_CHARGE_3,
      },
      {
        charge: 4,
        name: '4 Rings (Charge 4)',
        minRange: 400,
        maxRange: 2900,
        muzzleVelocity: 220,
        table: M252_M821_HE_CHARGE_4,
      },
    ],
  },
  {
    id: '2b14_82mm',
    name: '2B14 Podnos 82mm Mortar',
    faction: 'Soviet Army',
    caliber: '82mm O-832DU HE',
    milSystem: 'SOVIET',
    milsPerCircle: 6000,
    minElevation: 750, // 45.0° (07-50)
    maxElevation: 1417, // 85.0° (14-17)
    description: 'Soviet/Russian light battalion mortar. High trajectory fire from 50m to 2,300m using 0 to 4 additional ring charges and 60-00 Warsaw Pact sight graduations.',
    charges: [
      {
        charge: 0,
        name: '0 Rings (Charge 0)',
        minRange: 50,
        maxRange: 500,
        muzzleVelocity: 70,
        table: PODNOS_O832DU_HE_CHARGE_0,
      },
      {
        charge: 1,
        name: '1 Ring (Charge 1)',
        minRange: 100,
        maxRange: 800,
        muzzleVelocity: 110,
        table: PODNOS_O832DU_HE_CHARGE_1,
      },
      {
        charge: 2,
        name: '2 Rings (Charge 2)',
        minRange: 200,
        maxRange: 1400,
        muzzleVelocity: 150,
        table: PODNOS_O832DU_HE_CHARGE_2,
      },
      {
        charge: 3,
        name: '3 Rings (Charge 3)',
        minRange: 300,
        maxRange: 1800,
        muzzleVelocity: 185,
        table: PODNOS_O832DU_HE_CHARGE_3,
      },
      {
        charge: 4,
        name: '4 Long Range (Charge 4)',
        minRange: 400,
        maxRange: 2300,
        muzzleVelocity: 215,
        table: PODNOS_O832DU_HE_CHARGE_4,
      },
    ],
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
  },
];

/**
 * Universal ballistic solution entry point (routes to precision calculator engine)
 */
export function calculateFiringSolution(
  weapon: WeaponConfig,
  gunPos: { x: number; z: number; alt: number },
  targetPos: { x: number; z: number; alt: number },
  preferredCharge?: number
): BallisticSolution {
  return solveMortarFireMission({
    weapon,
    gunPos,
    targetPos,
    preferredCharge,
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
