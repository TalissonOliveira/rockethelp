import { Button as NativeBaseButton, Heading, IButtonProps } from 'native-base';

type ButtonProps = IButtonProps & {
  title: string
}

export function Button({ title, ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      {...rest}
      bg={"green.700"}
      h={14}
      fontSize="sm"
      rounded="sm"
      _pressed={{
        bg: "green.500"
      }}

    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
}