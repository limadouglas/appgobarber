import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Container, Header, HeaderTitle, BackButton, UserAvatar, ProviderListContainer, ProviderList, ProviderContainer, ProviderAvatar, ProviderName, Calendar, Title, OpenDatePickerButton, OpenDatePickerButtonText} from './styles';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native';

interface RouteParams{
  providerId: string;
}

export interface Provider{
  id: string;
  name: string;
  url_avatar: string;
}

const CreateAppointments: React.FC = ()=> {

  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const navigateBack = useCallback(() => {goBack()}, [goBack])
  const handleToggleDatePicker = useCallback(() => setShowDatePicker((state)=>!state),[])

  const handleSelectProvider = useCallback((providerId)=>{
    setSelectedProvider(providerId)
  }, [setSelectedProvider])

  const handleDateChange = useCallback((event: any, date: Date | undefined)=>{

    (Platform.OS == 'android') && setShowDatePicker(false)
    date && setSelectedDate(date);

  },[])

  useEffect(() => {
    api.get('providers').then(response=>{
      setProviders(response.data);
    })
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591"/>
        </BackButton>
        <HeaderTitle>Cabeleireiro</HeaderTitle>
        <UserAvatar source={{ uri: user.url_avatar }} />
      </Header>
      <ProviderListContainer>
        <ProviderList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider)=>provider.id}
          renderItem={({item: provider}) => (
            <ProviderContainer selected={selectedProvider === provider.id} onPress={()=>handleSelectProvider(provider.id)}>
              <ProviderAvatar source={{uri:provider.url_avatar}} />
              <ProviderName selected={selectedProvider === provider.id}>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProviderListContainer>
        <Calendar>
        <Title>Escolha a Data</Title>
        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
        </OpenDatePickerButton>
        { showDatePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            value={selectedDate}
            />
        )}
      </Calendar>
    </Container>
  )
}

export default CreateAppointments;
