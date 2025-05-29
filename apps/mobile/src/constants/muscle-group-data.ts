export const parentMuscleGroupIds = [1, 2, 3];
export const backMuscleGroupIds = [6, 7, 8, 9];
export const legMuscleGroupIds = [14, 15, 17, 18];
export const chestMuscleGroupIds = [4];
export const shouldersMuscleGroupIds = [5];
export const absMuscleGroupIds = [13];
export const bicepsMuscleGroupIds = [10];
export const tricepsMuscleGroupIds = [11];
export const forearmsMuscleGroupIds = [12];
export const glutesMuscleGroupIds = [16];
export const calvesMuscleGroupIds = [19];

export const muscleGroupData = [
  // parent
  {
    id: 1,
    name: "upper body",
    name_vn: "Thân trên",
    slug: "upper-body",
    parentId: null,
  },
  {
    id: 2,
    name: "lower body",
    name_vn: "Thân dưới",
    slug: "lower-body",
    parentId: null,
  },
  {
    id: 3,
    name: "other",
    name_vn: "Khác",
    slug: "other",
    parentId: null,
  },
  // upper body
  {
    id: 4,
    name: "Chest",
    name_vn: "Ngực",
    slug: "chest",
    parentId: 1,
  },
  {
    id: 5,
    name: "shoulders",
    name_vn: "Vai",
    slug: "shoulders",
    parentId: 1,
  },
  {
    id: 6,
    name: "traps",
    name_vn: "Trụ",
    slug: "traps",
    parentId: 1,
  },
  {
    id: 7,
    name: "lats",
    name_vn: "Lát",
    slug: "lats",
    parentId: 1,
  },
  {
    id: 8,
    name: "middle back",
    name_vn: "Lưng giữa",
    slug: "middle-back",
    parentId: 1,
  },
  {
    id: 9,
    name: "lower back",
    name_vn: "Lưng dưới",
    slug: "lower-back",
    parentId: 1,
  },
  {
    id: 10,
    name: "biceps",
    name_vn: "Bắp tay trước",
    slug: "biceps",
    parentId: 1,
  },
  {
    id: 11,
    name: "triceps",
    name_vn: "Bắp tay sau",
    slug: "triceps",
    parentId: 1,
  },
  {
    id: 12,
    name: "forearms",
    name_vn: "Cẳng tay",
    slug: "forearms",
    parentId: 1,
  },
  {
    id: 13,
    name: "abs",
    name_vn: "Bụng",
    slug: "abs",
    parentId: 1,
  },
  // lower body
  {
    id: 14,
    name: "quadriceps",
    name_vn: "Bắp chân",
    slug: "quadriceps",
    parentId: 2,
  },
  {
    id: 15,
    name: "hamstrings",
    name_vn: "Bắp đùi",
    slug: "hamstrings",
    parentId: 2,
  },
  {
    id: 16,
    name: "glutes",
    name_vn: "Bắp mông",
    slug: "glutes",
    parentId: 2,
  },
  {
    id: 17,
    name: "abductors",
    name_vn: "Bắp hang",
    slug: "abductors",
    parentId: 2,
  },
  {
    id: 18,
    name: "adductors",
    name_vn: "Bắp mông giữa",
    slug: "adductors",
    parentId: 2,
  },
  {
    id: 19,
    name: "calves",
    name_vn: "Bắp chuối",
    slug: "calves",
    parentId: 2,
  },
  // other
  {
    id: 20,
    name: "cardio",
    name_vn: "Sức bền",
    slug: "cardio",
    parentId: 3,
  },
];
