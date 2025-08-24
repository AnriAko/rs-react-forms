import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { signupSchema } from '~/components/controlled-form/controlled-schema';
import { COUNTRIES } from '~/components/forms-config';

export type FormData = z.infer<typeof signupSchema> & {
  pictureBase64?: string;
};

export type FormState = {
  forms: FormData[];
  countries: string[];
};

const initialState: FormState = {
  forms: [],
  countries: COUNTRIES,
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormData>) => {
      state.forms.push(action.payload);
    },
    setCountries: (state, action: PayloadAction<string[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { addForm, setCountries } = formSlice.actions;

export const formReducer = formSlice.reducer;
