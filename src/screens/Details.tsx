import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { HStack, ScrollView, Text, useTheme, VStack } from 'native-base'
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native'
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
      <Header title="Solicitação" />

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
          footer={order.when}
        />

        <CardDetails
          title="Descrição do problema"
          icon={Clipboard}
          description={order.description}
        />

        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          <Input
            placeholder="Descrição da solução"
            onChangeText={setSolution}
            textAlignVertical="top"
            multiline
            h={24}
          />
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' && (
          <Button title="Finalizar" m={5} />
        )
      }
    </VStack>
  )
}