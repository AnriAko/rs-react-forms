import { describe, it, expect } from 'vitest';
import {
  addForm,
  setCountries,
  formReducer,
  FormState,
  FormData,
} from '~/redux/form-slice';
import { COUNTRIES } from '~/components/forms-config';

describe('formSlice', () => {
  const initialState: FormState = {
    forms: [],
    countries: COUNTRIES,
  };

  const dummyFile = new File(['dummy content'], 'picture.png', {
    type: 'image/png',
  });

  it('should return the initial state', () => {
    expect(formReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle addForm action', () => {
    const newForm: FormData = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      password: 'Aa1@bc',
      confirmPassword: 'Aa1@bc',
      gender: 'Male',
      country: 'USA',
      terms: true,
      picture: dummyFile,
    };

    const state = formReducer(initialState, addForm(newForm));
    expect(state.forms).toHaveLength(1);
    expect(state.forms[0]).toEqual(newForm);
  });

  it('should handle multiple addForm actions', () => {
    const form1: FormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'Aa1@bc',
      confirmPassword: 'Aa1@bc',
      gender: 'Male',
      country: 'USA',
      terms: true,
      picture: dummyFile,
    };
    const form2: FormData = {
      name: 'Jane',
      age: 28,
      email: 'jane@example.com',
      password: 'Bb2@cd',
      confirmPassword: 'Bb2@cd',
      gender: 'Female',
      country: 'Germany',
      terms: true,
      picture: dummyFile,
    };

    let state = formReducer(initialState, addForm(form1));
    state = formReducer(state, addForm(form2));

    expect(state.forms).toHaveLength(2);
    expect(state.forms[1]).toEqual(form2);
  });

  it('should handle setCountries action', () => {
    const newCountries = ['Italy', 'Spain', 'France'];
    const state = formReducer(initialState, setCountries(newCountries));
    expect(state.countries).toEqual(newCountries);
  });

  it('should not mutate state directly', () => {
    const newForm: FormData = {
      name: 'Alice',
      age: 22,
      email: 'alice@example.com',
      password: 'Cc3@de',
      confirmPassword: 'Cc3@de',
      gender: 'Female',
      country: 'France',
      terms: true,
      picture: dummyFile,
    };

    const stateBefore = { ...initialState, forms: [...initialState.forms] };
    const stateAfter = formReducer(stateBefore, addForm(newForm));

    expect(stateAfter).not.toBe(stateBefore);
    expect(stateAfter.forms).not.toBe(stateBefore.forms);
  });
});
