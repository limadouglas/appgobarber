import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import{Container,
   Header,
   HeaderTitle,
   UserName,
   ProfileButton,
   UserAvatar,
   ProviderList,
   ProviderListTitle,
   ProviderContainer,
   ProviderAvatar,
   ProviderInfo,
   ProviderName,
   ProviderMetaText,
   ProviderMeta } from './styles';
import Icon from 'react-native-vector-icons/Feather';

export interface Provider{
  id: string;
  name: string;
  url_avatar: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { signOut, user } = useAuth();
  const {navigate} = useNavigation();

  useEffect(() => {
    api.get('/providers').then(response => {
      console.log(`providers`,response.data)
      setProviders(response.data);
    }).catch(err=> console.log(`error`,err))
  }, [])

  const navigateToProfile = useCallback(() => {
      navigate('Profile');
    },
    [navigate],
  )

  const navigateToCreateAppointments = useCallback(
    (providerId: string) => {
      navigate('CreateAppointments', {providerId})
    }, [navigate],
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem Vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{uri: user.url_avatar}}/>
        </ProfileButton>
      </Header>

      <ProviderList
        ListHeaderComponent={<ProviderListTitle>Cabeleireiros</ProviderListTitle>}
        data={providers}
        keyExtractor={provider => provider.id}
        renderItem={({item: provider}) => (
          <ProviderContainer onPress={()=>{navigateToCreateAppointments(provider.id)}}>
            <ProviderAvatar source={{uri: provider.url_avatar}} />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000"/>
                <ProviderMetaText>Segunda às sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000"/>
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
