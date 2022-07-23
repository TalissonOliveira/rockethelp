import { Button, IButtonProps, Text, useTheme } from 'native-base'

type FilterProps = IButtonProps & {
  title: string
  isActive?: boolean
  type: 'open' | 'closed'
}

export function Filter({ title, isActive = false, type, ...rest }: FilterProps) {
  const { colors } = useTheme()
  const colorType = type === 'open' ? colors.secondary[700] : colors.green[300 ]

  return (
    <Button
      {...rest}
      flex={1}
      variant="outline"
      bgColor="gray.600"
      borderWidth={1}
      borderColor={isActive ? colorType : 'gray.600'}
      size="sm"
    >
      <Text
        color={isActive ? colorType : 'gray.300'}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  )
}