import { useState } from 'react'
import { Alert } from 'react-native'
import { Heading, Icon, useTheme, VStack } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import auth from '@react-native-firebase/auth'

import Logo from '../assets/logo_primary.svg'

export function SignIn() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe o e-mail e senha.')
    }

    setIsLoading(true)

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        setIsLoading(false)

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'Formato de e-mail inválido.')
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        return Alert.alert('Entrar', 'Não foi possível acessar.')
      })
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acessa sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={<Icon as={
          <Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        secureTextEntry
        InputLeftElement={<Icon as={
          <Key color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setPassword}
      />

      <Button
        title="Entrar" w={"full"}
        isLoading={isLoading}
        onPress={handleSignIn}
      />
    </VStack>
  )
}