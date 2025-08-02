import { Slot } from '@radix-ui/react-slot';
import { useNavigation } from '@remix-run/react';
import React, { type PropsWithChildren } from 'react';
import { match } from 'ts-pattern';

import { Spinner } from './spinner';
import { Colors } from '../colors';
import { type ClassName, cx } from '../utils/cx';

type ButtonProps = Pick<
  React.HTMLProps<HTMLButtonElement>,
  'children' | 'disabled' | 'name' | 'onClick' | 'type' | 'value'
> & {
  color?: 'error' | 'primary' | 'success';
  fill?: boolean;
  size?: 'md' | 'sm';
  submitting?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  children,
  color = 'primary',
  disabled,
  fill,
  size,
  submitting,
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  const backgroundColor =
    variant === 'primary' ? Colors.CoreOrange100 : 'transparent';
  const textColor = variant === 'secondary' ? Colors.White : Colors.White;
  const borderColor = Colors.CoreOrange100;

  return (
    <button
      className={getButtonCn({ fill, size })}
      style={{ backgroundColor, color: textColor, borderColor }}
      disabled={!!disabled || !!submitting}
      type={type as any}
      {...rest}
    >
      {children}
      {submitting && <Spinner color={color} />}
    </button>
  );
};

type ButtonSlotProps = Pick<
  ButtonProps,
  'children' | 'fill' | 'size' | 'variant'
> & {
  className?: ClassName;
};

Button.Slot = function ButtonSlot({
  children,
  className,
  fill,
  size,
  variant = 'primary',
}: ButtonSlotProps) {
  const backgroundColor =
    variant === 'primary' ? Colors.CoreOrange100 : 'transparent';
  const textColor = variant === 'secondary' ? Colors.White : Colors.White;
  const borderColor = Colors.CoreOrange100;

  return (
    <Slot
      className={cx(getButtonCn({ fill, size }), className)}
      style={{ backgroundColor, color: textColor, borderColor }}
    >
      {children}
    </Slot>
  );
};

Button.Submit = function SubmitButton(
  props: Omit<ButtonProps, 'submitting' | 'type'>
) {
  const { formMethod, state } = useNavigation();

  return (
    <Button
      submitting={state === 'submitting' && !!formMethod}
      type="submit"
      {...props}
    />
  );
};

function getButtonCn({
  fill = false,
  size = 'md',
}: Pick<ButtonProps, 'fill' | 'size'>) {
  return cx(
    'flex items-center justify-center gap-2 rounded-full border border-solid',
    'transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-50',
    fill ? 'w-full' : 'w-max',
    size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-2'
  );
}

// Button Group

type ButtonGroupProps = PropsWithChildren<{
  fill?: boolean;
  flexDirection?: 'row-reverse';
  spacing?: 'between' | 'center';
}>;

Button.Group = function ButtonGroup({
  children,
  fill = false,
  flexDirection,
  spacing,
}: ButtonGroupProps) {
  return (
    <div
      className={cx(
        'flex items-center gap-2',
        fill && '[>*]:flex-1 w-full',
        flexDirection === 'row-reverse' && 'flex-row-reverse',
        match(spacing)
          .with('between', () => 'justify-between')
          .with('center', () => 'justify-center')
          .with(undefined, () => 'ml-auto')
          .exhaustive()
      )}
      data-flex-direction={flexDirection}
      data-spacing={spacing}
    >
      {children}
    </div>
  );
};
