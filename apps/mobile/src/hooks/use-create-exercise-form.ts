import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

export type CreateExerciseFormValues = {
  name: string;
  description: string | undefined;
  category: string;
  primaryMuscleId: number;
  imageUrl:
    | string
    | ImagePicker.ImagePickerResult
    | { uri: string }
    | undefined;
};

export const useCreateExerciseForm = () => {
  return useForm<CreateExerciseFormValues>({
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
      primaryMuscleId: undefined,
      imageUrl: undefined,
    },
  });
};
