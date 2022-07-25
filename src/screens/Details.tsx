import { Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base'
import { CircleWavyCheck, Clipboard, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO'
import { dateFormat } from '../utils/firestoreDateFormat'
import { CardDetails } from '../components/CardDetails'
import { OrderProps } from '../components/Order'
import { Loading } from '../components/Loading'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import firestore from '@react-native-firebase/firestore'

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
}

export function Details() {
  const { colors } = useTheme()
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [isLoading, setIsLoading] = useState(true)
  const [solution, setSolution] = useState('')
  const route = useRoute()
  const { orderId } = route.params as RouteParams

  const navigation = useNavigation()

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Informe a solução para finalizar a solicitação.')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação finalizada.')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        Alert.alert('Solicitação', 'Não foi possível finalizar a solicitação.')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const { patrimony, description, status, solution, created_at, closed_at } = doc.data()

        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        })

        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box bg="gray.600" px={6}>
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'Finalizado' : 'Em andamento'}
        </Text>

      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          icon={DesktopTower}
          description={`Patrimônio ${order.patrimony}`}
        />

        <CardDetails
          title="Descrição do problema"
          icon={ClipboardText}
          description={order.description}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' && (
              <Input
                placeholder="Descrição da solução"
                onChangeText={setSolution}
                textAlignVertical="top"
                multiline
                h={48}
            />
            )
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' && (
          <Button
            title="Finalizar"
            m={5}
            isLoading={isLoading}
            onPress={handleOrderClose}
          />
        )
      }
    </VStack>
  )
}