import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Container, Header, HeaderTitle, BackButton, UserAvatar, ProviderListContainer, ProviderList, ProviderContainer, ProviderAvatar, ProviderName, Calendar, Title, OpenDatePickerButton, OpenDatePickerButtonText} from './styles';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native';
import { format } from 'date-fns';

interface RouteParams{
  providerId: string;
}

export interface Provider{
  id: string;
  name: string;
  url_avatar: string;
}
export interface AvailabilityItem{
  hour: number;
  available: boolean;
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
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);


  const navigateBack = useCallback(() => {goBack()}, [goBack])
  const handleToggleDatePicker = useCallback(() => setShowDatePicker((state)=>!state),[])

  const handleSelectProvider = useCallback((providerId)=>{
    setSelectedProvider(providerId)
  }, [setSelectedProvider])

  const handleDateChange = useCallback((event: any, date: Date | undefined)=>{
    (Platform.OS == 'android') && setShowDatePicker(false)
    date && setSelectedDate(date);
  },[])

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
        .map(({hour, available}) => ({
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00')
          }
        ))
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
        .map(({hour, available}) => ({
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00')
          }
        ))
  }, [availability]);

  useEffect(() => {
    api.get('providers').then(response=>{
      setProviders(response.data);
    })
  }, [])

  useEffect(() => {
    api.get(`/providers/${selectedProvider}/day-availability`,
    {params:{
      day: selectedDate.getDay(),
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getDate()
    }}).then(response => {
      setAvailability(response.data)
    })
  }, [selectedDate, selectedProvider])

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
      {morningAvailability.map(({hourFormatted}) => (<Title key={hourFormatted}>{hourFormatted}</Title>))}
      {afternoonAvailability.map(({hourFormatted}) => (<Title key={hourFormatted}>{hourFormatted}</Title>))}
    </Container>
  )
}

export default CreateAppointments;
