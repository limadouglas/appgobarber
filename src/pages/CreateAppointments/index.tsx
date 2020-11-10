import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import { Container, Header, HeaderTitle, BackButton, UserAvatar } from './styles';

interface RouteParams{
  providerId: string;
}

const CreateAppointments: React.FC = ()=> {

  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const { providerId } = route.params as RouteParams;

  const navigateBack = useCallback(() => {goBack()}, [goBack])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="" size={24} color="#999591"/>
        </BackButton>
        <HeaderTitle>Cabeleireiro</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
    </Container>
  )
}

export default CreateAppointments;
