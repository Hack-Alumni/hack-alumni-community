import { Colors } from '@ui/colors';
import { type PropsWithChildren } from 'react';

import { cx, Text } from '@hack-alumni/ui';
export type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className, ...rest }: CardProps) => {
  return (
    <div
      style={{ borderColor: Colors.Grey200 }}
      className={cx('flex flex-col gap-4 rounded-2xl border p-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.Description = function Description({ children }: PropsWithChildren) {
  return <p style={{ color: Colors.Grey500 }}>{children}</p>;
};

Card.Header = function Header({ children }: PropsWithChildren) {
  return <header className="flex justify-between gap-4">{children}</header>;
};

Card.Title = function Title({ children }: PropsWithChildren) {
  return (
    <Text className="-mb-2" variant="lg" weight="500">
      {children}
    </Text>
  );
};
