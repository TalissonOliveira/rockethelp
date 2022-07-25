import { ReactNode } from 'react'
import { Box, HStack, Text, useTheme, VStack } from 'native-base'
import { IconProps } from 'phosphor-react-native'

type CardDetailsProps = {
  title: string
  description?: string
  footer?: string
  icon: React.ElementType<IconProps>
  children?: ReactNode
}

export function CardDetails({
  title,
  description,
  footer = null,
  icon: Icon,
  children
}: CardDetailsProps) {
  const { colors } = useTheme()

  return (
    <VStack bg="gray.600" p={5} mt={5} rounded="sm">
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text color="gray.300" fontSize="sm" textTransform="uppercase" ml={2}>
          {title}
        </Text>
      </HStack>

      {
        !!description && (
          <Text color="gray.100" fontSize="md">
            {description}
          </Text>
        )
      }

      { children }

      {
        !!footer && (
          <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
            <Text color="gray.300" fontSize="sm" mt={3}>
              {footer}
            </Text>
          </Box>
        )
      }
    </VStack>
  )
}