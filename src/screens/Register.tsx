import { Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { VStack } from 'native-base'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'

import firestore from "@react-native-firebase/firestore";

export function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [patrimony, setPatrimony] = useState('')
  const [description, setDescription] = useState('')

  const navigation = useNavigation()

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Nova solicitação', 'Preencha todos os campos.')
    }

    setIsLoading(true)

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then((res) => {
        Alert.alert('Solicitação', 'Solicitação registrada com sucesso.')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
        return Alert.alert('Nova solicitação', 'Não foi possível registrar a solicitação.')
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />
      <Input
        placeholder="Número do patrimônio"
        keyboardType={'numeric'}
        mt={4}
        onChangeText={setPatrimony}
      />

      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button
        mt={5}
        title="Cadastrar"
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  )
}