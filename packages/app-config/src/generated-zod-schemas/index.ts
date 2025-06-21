import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt','gender','age','avatar']);

export const MuscleGroupScalarFieldEnumSchema = z.enum(['id','parentId','image','isActive']);

export const MuscleGroupTranslationScalarFieldEnumSchema = z.enum(['muscleGroupId','language','name','normalizedName','slug']);

export const ExerciseScalarFieldEnumSchema = z.enum(['id','notes','category','createdById','images','createdAt','updatedAt','isPublic','isActive','muscleGroupId']);

export const ExerciseMuscleGroupScalarFieldEnumSchema = z.enum(['exerciseId','muscleGroupId','isPrimary']);

export const ExerciseTranslationScalarFieldEnumSchema = z.enum(['exerciseId','language','name','normalizedName','description','slug']);

export const WorkoutPlanScalarFieldEnumSchema = z.enum(['id','cover_image','level','isPublic','isPremium','isFeatured','isSingle','goal','createdById','createdAt','updatedAt','isActive']);

export const WorkoutTemplateScalarFieldEnumSchema = z.enum(['id','order','workoutPlanId','createdAt','updatedAt','isActive']);

export const WorkoutTemplateTranslationScalarFieldEnumSchema = z.enum(['workoutTemplateId','language','name','normalizedName','slug']);

export const TemplateExerciseScalarFieldEnumSchema = z.enum(['id','workoutTemplateId','exerciseId','order']);

export const TemplateSetsScalarFieldEnumSchema = z.enum(['id','templateExerciseId','restTime','isWarmup','isDropSet','isUntilFailure','setNumber']);

export const WorkoutPlanTranslationScalarFieldEnumSchema = z.enum(['workoutPlanId','language','name','normalizedName','description','slug']);

export const WorkoutSessionScalarFieldEnumSchema = z.enum(['id','userId','status','notes','startedAt','completedAt','duration','workoutPlanId','workoutTemplateId','wasModified','modificationsSaved','createdAt','updatedAt']);

export const SessionExerciseScalarFieldEnumSchema = z.enum(['id','sessionId','exerciseId','order','notes','exerciseNameSnapshot']);

export const PerformedSetScalarFieldEnumSchema = z.enum(['id','sessionExerciseId','setNumber','reps','weight','duration','distance','restTime','isCompleted','isWarmup','isDropSet','isFailure','performedAt','userId']);

export const SessionScalarFieldEnumSchema = z.enum(['id','expiresAt','token','createdAt','updatedAt','ipAddress','userAgent','userId']);

export const AccountScalarFieldEnumSchema = z.enum(['id','accountId','providerId','userId','accessToken','refreshToken','idToken','accessTokenExpiresAt','refreshTokenExpiresAt','scope','password','createdAt','updatedAt']);

export const VerificationScalarFieldEnumSchema = z.enum(['id','identifier','value','expiresAt','createdAt','updatedAt']);

export const BodyMeasurementTypeScalarFieldEnumSchema = z.enum(['id','category','name','unit','description','isActive','createdAt','updatedAt']);

export const BodyMeasurementTypeTranslationScalarFieldEnumSchema = z.enum(['bodyMeasurementTypeId','language','name','description']);

export const BodyMeasurementScalarFieldEnumSchema = z.enum(['id','userId','measurementTypeId','value','notes','date','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const LanguageSchema = z.enum(['vi','en']);

export type LanguageType = `${z.infer<typeof LanguageSchema>}`

export const ExerciseCategorySchema = z.enum(['WEIGHT','FREE_WEIGHT','CARDIO']);

export type ExerciseCategoryType = `${z.infer<typeof ExerciseCategorySchema>}`

export const WorkoutPlanLevelSchema = z.enum(['BEGINNER','INTERMEDIATE','ADVANCED']);

export type WorkoutPlanLevelType = `${z.infer<typeof WorkoutPlanLevelSchema>}`

export const WorkoutPlanGoalSchema = z.enum(['STRENGTH','ENDURANCE','BALANCE','FLEXIBILITY','LOOSE_WEIGHT']);

export type WorkoutPlanGoalType = `${z.infer<typeof WorkoutPlanGoalSchema>}`

export const WorkoutSessionStatusSchema = z.enum(['PLANNED','IN_PROGRESS','COMPLETED','CANCELLED']);

export type WorkoutSessionStatusType = `${z.infer<typeof WorkoutSessionStatusSchema>}`

export const BodyMeasurementCategorySchema = z.enum(['COMPOSITION','MUSCLE','FAT','WATER','BONE','VISCERAL','METABOLIC','OTHER']);

export type BodyMeasurementCategoryType = `${z.infer<typeof BodyMeasurementCategorySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  gender: z.string().nullable(),
  age: z.number().int().nullable(),
  avatar: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// MUSCLE GROUP SCHEMA
/////////////////////////////////////////

export const MuscleGroupSchema = z.object({
  id: z.number().int(),
  parentId: z.number().int().nullable(),
  image: z.string(),
  isActive: z.boolean(),
})

export type MuscleGroup = z.infer<typeof MuscleGroupSchema>

/////////////////////////////////////////
// MUSCLE GROUP TRANSLATION SCHEMA
/////////////////////////////////////////

export const MuscleGroupTranslationSchema = z.object({
  language: LanguageSchema,
  muscleGroupId: z.number().int(),
  name: z.string(),
  normalizedName: z.string().nullable(),
  slug: z.string(),
})

export type MuscleGroupTranslation = z.infer<typeof MuscleGroupTranslationSchema>

/////////////////////////////////////////
// EXERCISE SCHEMA
/////////////////////////////////////////

export const ExerciseSchema = z.object({
  category: ExerciseCategorySchema,
  id: z.string().uuid(),
  notes: z.string().nullable(),
  createdById: z.string(),
  images: z.string().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  muscleGroupId: z.number().int().nullable(),
})

export type Exercise = z.infer<typeof ExerciseSchema>

/////////////////////////////////////////
// EXERCISE MUSCLE GROUP SCHEMA
/////////////////////////////////////////

export const ExerciseMuscleGroupSchema = z.object({
  exerciseId: z.string(),
  muscleGroupId: z.number().int(),
  isPrimary: z.boolean(),
})

export type ExerciseMuscleGroup = z.infer<typeof ExerciseMuscleGroupSchema>

/////////////////////////////////////////
// EXERCISE TRANSLATION SCHEMA
/////////////////////////////////////////

export const ExerciseTranslationSchema = z.object({
  language: LanguageSchema,
  exerciseId: z.string(),
  name: z.string(),
  normalizedName: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
})

export type ExerciseTranslation = z.infer<typeof ExerciseTranslationSchema>

/////////////////////////////////////////
// WORKOUT PLAN SCHEMA
/////////////////////////////////////////

export const WorkoutPlanSchema = z.object({
  level: WorkoutPlanLevelSchema.nullable(),
  goal: WorkoutPlanGoalSchema.nullable(),
  id: z.string().uuid(),
  cover_image: z.string().nullable(),
  isPublic: z.boolean().nullable(),
  isPremium: z.boolean().nullable(),
  isFeatured: z.boolean().nullable(),
  isSingle: z.boolean().nullable(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isActive: z.boolean(),
})

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>

/////////////////////////////////////////
// WORKOUT TEMPLATE SCHEMA
/////////////////////////////////////////

export const WorkoutTemplateSchema = z.object({
  id: z.string().uuid(),
  order: z.number().int(),
  workoutPlanId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isActive: z.boolean(),
})

export type WorkoutTemplate = z.infer<typeof WorkoutTemplateSchema>

/////////////////////////////////////////
// WORKOUT TEMPLATE TRANSLATION SCHEMA
/////////////////////////////////////////

export const WorkoutTemplateTranslationSchema = z.object({
  language: LanguageSchema,
  workoutTemplateId: z.string(),
  name: z.string(),
  normalizedName: z.string().nullable(),
  slug: z.string(),
})

export type WorkoutTemplateTranslation = z.infer<typeof WorkoutTemplateTranslationSchema>

/////////////////////////////////////////
// TEMPLATE EXERCISE SCHEMA
/////////////////////////////////////////

export const TemplateExerciseSchema = z.object({
  id: z.string().uuid(),
  workoutTemplateId: z.string(),
  exerciseId: z.string(),
  order: z.number().int(),
})

export type TemplateExercise = z.infer<typeof TemplateExerciseSchema>

/////////////////////////////////////////
// TEMPLATE SETS SCHEMA
/////////////////////////////////////////

export const TemplateSetsSchema = z.object({
  id: z.string().uuid(),
  templateExerciseId: z.string(),
  restTime: z.number().int().nullable(),
  isWarmup: z.boolean(),
  isDropSet: z.boolean(),
  isUntilFailure: z.boolean(),
  setNumber: z.number().int(),
})

export type TemplateSets = z.infer<typeof TemplateSetsSchema>

/////////////////////////////////////////
// WORKOUT PLAN TRANSLATION SCHEMA
/////////////////////////////////////////

export const WorkoutPlanTranslationSchema = z.object({
  language: LanguageSchema,
  workoutPlanId: z.string(),
  name: z.string(),
  normalizedName: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
})

export type WorkoutPlanTranslation = z.infer<typeof WorkoutPlanTranslationSchema>

/////////////////////////////////////////
// WORKOUT SESSION SCHEMA
/////////////////////////////////////////

export const WorkoutSessionSchema = z.object({
  status: WorkoutSessionStatusSchema,
  id: z.string().uuid(),
  userId: z.string(),
  notes: z.string().nullable(),
  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
  duration: z.number().int().nullable(),
  workoutPlanId: z.string(),
  workoutTemplateId: z.string(),
  wasModified: z.boolean(),
  modificationsSaved: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>

/////////////////////////////////////////
// SESSION EXERCISE SCHEMA
/////////////////////////////////////////

export const SessionExerciseSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string(),
  exerciseId: z.string(),
  order: z.number().int(),
  notes: z.string().nullable(),
  exerciseNameSnapshot: z.string(),
})

export type SessionExercise = z.infer<typeof SessionExerciseSchema>

/////////////////////////////////////////
// PERFORMED SET SCHEMA
/////////////////////////////////////////

export const PerformedSetSchema = z.object({
  id: z.string().uuid(),
  sessionExerciseId: z.string(),
  setNumber: z.number().int(),
  reps: z.number().int().nullable(),
  weight: z.number().nullable(),
  duration: z.number().int().nullable(),
  distance: z.number().nullable(),
  restTime: z.number().int().nullable(),
  isCompleted: z.boolean(),
  isWarmup: z.boolean(),
  isDropSet: z.boolean(),
  isFailure: z.boolean(),
  performedAt: z.coerce.date(),
  userId: z.string(),
})

export type PerformedSet = z.infer<typeof PerformedSetSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable(),
  scope: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// BODY MEASUREMENT TYPE SCHEMA
/////////////////////////////////////////

export const BodyMeasurementTypeSchema = z.object({
  category: BodyMeasurementCategorySchema,
  id: z.number().int(),
  name: z.string(),
  unit: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BodyMeasurementType = z.infer<typeof BodyMeasurementTypeSchema>

/////////////////////////////////////////
// BODY MEASUREMENT TYPE TRANSLATION SCHEMA
/////////////////////////////////////////

export const BodyMeasurementTypeTranslationSchema = z.object({
  language: LanguageSchema,
  bodyMeasurementTypeId: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
})

export type BodyMeasurementTypeTranslation = z.infer<typeof BodyMeasurementTypeTranslationSchema>

/////////////////////////////////////////
// BODY MEASUREMENT SCHEMA
/////////////////////////////////////////

export const BodyMeasurementSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  measurementTypeId: z.number().int(),
  value: z.number(),
  notes: z.string().nullable(),
  date: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BodyMeasurement = z.infer<typeof BodyMeasurementSchema>
