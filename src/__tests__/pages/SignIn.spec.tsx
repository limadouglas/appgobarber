import React from 'react';
import { render } from "@testing-library/react-native";
import SingInPage from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  }
})

describe('SignIn Page', () => {
  it('Should contains email/password inputs', () => {
    const { getByPlaceholderText } = render(<SingInPage/>);
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();

  })
})
