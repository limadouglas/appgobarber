import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Container, Header, HeaderTitle, BackButton, UserAvatar, Content, ProviderListContainer, ProviderList, ProviderContainer, ProviderAvatar, ProviderName, Calendar, Title, OpenDatePickerButton, OpenDatePickerButtonText, Schedule, Section, SectionTitle, SectionContent, Hour, HourText, CreateAppointmentButton, CreateAppointmentButtonText} from './styles';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Alert, Platform } from 'react-native';
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
  const { goBack, navigate } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
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

  const handleSelectHour = useCallback((hour: number)=>{
    setSelectedHour(hour)
  },[])

  const handleCreateAppointment = useCallback(async()=>{
    try{
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date
      })
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch(err){
      Alert.alert('Erro ao criar agendamento', 'Ocorreu um erro ao tentar criar o agendamento, tente novamente.')
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])

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
      day: selectedDate.getDate(),
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear()
    }}).then(response => {
      setSelectedHour(0)
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
      <Content>
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

        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {
                morningAvailability.map(({hourFormatted, hour, available}) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => handleSelectHour(hour)}
                    >
                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                  </Hour>
                ))
              }
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {
                afternoonAvailability.map(({hourFormatted, hour, available}) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => handleSelectHour(hour)}
                    >
                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                  </Hour>
                ))
              }
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointments;
